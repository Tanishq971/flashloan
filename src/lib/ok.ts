import { NitroliteClient, StateUpdate } from '@erc7824/nitrolite';
import { ethers } from 'ethers';
import WebSocket from 'ws';

// Configuration
const RPC_URL = 'http://localhost:8545';  // Local Anvil blockchain
const CLEAR_NODE_URL = 'wss://localhost:3000/ws';  // Local ClearNode
const LENDER_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';  // Anvil account 0
const BORROWER_PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';  // Anvil account 1
const LOAN_AMOUNT = ethers.parseUnits('5', 18);  // $5 in 18-decimal token
const INTEREST = ethers.parseUnits('0.05', 18);  // 1% interest
const TOKEN_ADDRESS = '0x...';  // Replace with test ERC-20 address from NitroLite deployment

// Custom State Interface
interface LoanState {
  magic: string;  // 'CHANOPEN', 'CHANCLOSE', etc.
  lenderBalance: bigint;
  borrowerBalance: bigint;
  loanAmount: bigint;
  interest: bigint;
  dueTime: number;  // Unix timestamp
  status: 'requested' | 'approved' | 'repaid' | 'defaulted';
}

// Simulated Reputation Check (Placeholder for real oracle)
async function checkReputation(address: string): Promise<boolean> {
  // In production: Query on-chain history or oracle (e.g., Chainlink)
  console.log(`Checking reputation for ${address}...`);
  return true;  // Simulate good reputation
}

// WebSocket for ClearNode (Explicit Usage)
function setupClearNodeListener(client: NitroliteClient, channelId: string): WebSocket {
  const ws = new WebSocket(CLEAR_NODE_URL);
  ws.on('open', () => console.log('Connected to ClearNode:', CLEAR_NODE_URL));
  ws.on('message', async (data) => {
    console.log('Received ClearNode message:', data.toString());
    // Parse and handle state updates (SDK does this internally, shown for clarity)
    const update = JSON.parse(data.toString());
    if (update.channelId === channelId) {
      await client.receiveUpdate(channelId, update);
    }
  });
  ws.on('error', (err) => console.error('ClearNode error:', err));
  return ws;
}

// Main MVP Function
async function runFlashLoanChain() {
  // Initialize Web3 Provider and Wallets
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const lenderWallet = new ethers.Wallet(LENDER_PRIVATE_KEY, provider);
  const borrowerWallet = new ethers.Wallet(BORROWER_PRIVATE_KEY, provider);

  // Initialize NitroLite Clients
  const lenderClient = new NitroliteClient({
    rpcUrl: RPC_URL,
    clearNodeUrl: CLEAR_NODE_URL,
    privateKey: LENDER_PRIVATE_KEY,
  });

  const borrowerClient = new NitroliteClient({
    rpcUrl: RPC_URL,
    clearNodeUrl: CLEAR_NODE_URL,
    privateKey: BORROWER_PRIVATE_KEY,
  });

  console.log('Web3 wallets and NitroLite clients initialized.');

  // Step 1: Check Borrower Reputation (Web3 off-chain check)
  const hasGoodReputation = await checkReputation(borrowerWallet.address);
  if (!hasGoodReputation) {
    console.error('Borrower reputation check failed.');
    return;
  }

  // Step 2: Create State Channel
  const participants = [lenderWallet.address, borrowerWallet.address];
  const initialState: LoanState = {
    magic: 'CHANOPEN',
    lenderBalance: LOAN_AMOUNT + INTEREST,
    borrowerBalance: 0n,
    loanAmount: LOAN_AMOUNT,
    interest: INTEREST,
    dueTime: Math.floor(Date.now() / 1000) + 3600,  // 1 hour due
    status: 'requested',
  };

  const channel = await lenderClient.createChannel({
    participants,
    initialState,
  });
  console.log(`Channel created: ${channel.id}`);

  // Setup ClearNode listeners
  const lenderWs = setupClearNodeListener(lenderClient, channel.id);
  const borrowerWs = setupClearNodeListener(borrowerClient, channel.id);

  // Step 3: Fund Channel (Web3 On-Chain)
  const tokenContract = new ethers.Contract(
    TOKEN_ADDRESS,
    ['function approve(address spender, uint256 amount) public returns (bool)'],
    lenderWallet
  );
  await tokenContract.approve(channel.id, LOAN_AMOUNT + INTEREST);  // Approve token transfer
  await lenderClient.deposit(channel.id, LOAN_AMOUNT + INTEREST, { token: TOKEN_ADDRESS });
  console.log('Channel funded by lender via Web3 ERC-20 transfer.');

  // Borrower joins channel
  await borrowerClient.joinChannel(channel.id, initialState);
  console.log('Borrower joined channel via ClearNode.');

  // Step 4: Approve Loan (Off-Chain via ClearNode)
  const approvedState: LoanState = {
    ...initialState,
    lenderBalance: initialState.lenderBalance - LOAN_AMOUNT,
    borrowerBalance: LOAN_AMOUNT,
    status: 'approved',
  };
  const approvedUpdate: StateUpdate = { state: approvedState };
  const signedApprove = await lenderClient.signStateUpdate(channel.id, approvedUpdate);
  await lenderClient.sendUpdate(channel.id, signedApprove);  // Sent via ClearNode
  console.log('Loan approved off-chain via ClearNode.');

  // Borrower receives update (handled by ClearNode listener)
  // Simulate borrower polling for simplicity
  await new Promise((resolve) => setTimeout(resolve, 1000));  // Wait for ClearNode propagation
  console.log('Borrower received approval.');

  // Step 5: Repay Loan (Off-Chain via ClearNode)
  const repayAmount = LOAN_AMOUNT + INTEREST;
  const repaidState: LoanState = {
    ...approvedState,
    lenderBalance: approvedState.lenderBalance + repayAmount,
    borrowerBalance: approvedState.borrowerBalance - repayAmount,
    status: 'repaid',
  };
  const repaidUpdate: StateUpdate = { state: repaidState };
  const signedRepay = await borrowerClient.signStateUpdate(channel.id, repaidUpdate);
  await borrowerClient.sendUpdate(channel.id, signedRepay);  // Sent via ClearNode
  console.log('Loan repaid off-chain via ClearNode.');

  // Lender receives (via ClearNode listener)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Step 6: Close Channel (Web3 On-Chain)
  const finalState: LoanState = {
    ...repaidState,
    magic: 'CHANCLOSE',
  };
  const finalUpdate: StateUpdate = { state: finalState };
  const signedFinal = await lenderClient.signStateUpdate(channel.id, finalUpdate);
  await borrowerClient.signStateUpdate(channel.id, finalUpdate);  // Co-sign
  await lenderClient.closeChannel(channel.id, signedFinal);  // On-chain tx
  console.log('Channel closed and settled on-chain via Web3.');

  // Cleanup WebSocket
  lenderWs.close();
  borrowerWs.close();
}

// Run and Handle Errors
runFlashLoanChain().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});