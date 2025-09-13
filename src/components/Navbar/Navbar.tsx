import { useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, LogOut } from "lucide-react";
import { useClientStore } from "../../store/clientStore";
import { NavLink } from "react-router-dom";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
  createEIP712AuthMessageSigner,
  parseAnyRPCResponse,
  RPCMethod,
  type AuthChallengeResponse,
  type AuthRequestParams,
} from "@erc7824/nitrolite";
import {
  generateSessionKey,
  getStoredSessionKey,
  storeSessionKey,
  removeSessionKey,
  storeJWT,
  removeJWT,
} from "../../lib/utils2";
import { webSocketService } from "../../lib/websocket";
import { type Hex } from "../../types/index";
import {
  AUTH_SCOPE,
  APP_NAME,
  SESSION_DURATION,
  getAuthDomain,
} from "@/lib/utils";

const Navbar = () => {
  const {
    address,
    client,
    setAddress,
    sessionKey,
    setSessionKey,
    wsStatus,
    setWsStatus,
    setIsConnected,
    setClient,
    isAuthAttempted,
    isAuthenticated,
    setIsAuthAttempted,
    setSessionExpireTimestamp,
    sessionExpireTimestamp,
    setIsAuthenticated,
  } = useClientStore();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const tempClient = createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });

    const [address] = await tempClient.requestAddresses();

    const walletClient = createWalletClient({
      account: address,
      chain: mainnet,
      transport: custom(window.ethereum),
    });

    setClient(walletClient);

    setAddress(address!);
    if (address) setIsConnected(true);
  };

  useEffect(() => {
    const existingSessionKey = getStoredSessionKey();
    if (existingSessionKey) {
      setSessionKey(existingSessionKey);
    } else {
      const newSessionKey = generateSessionKey();
      storeSessionKey(newSessionKey);
      setSessionKey(newSessionKey);
    }

    webSocketService.addStatusListener(setWsStatus);
    webSocketService.connect();

    return () => {
      webSocketService.removeStatusListener(setWsStatus);
    };
  }, []);

  useEffect(() => {
    if (
      address &&
      sessionKey &&
      wsStatus === "Connected" &&
      !isAuthenticated &&
      !isAuthAttempted
    ) {
      setIsAuthAttempted(true);

     
      const expireTimestamp = String(
        Math.floor(Date.now() / 1000) + SESSION_DURATION
      );
      setSessionExpireTimestamp(expireTimestamp);

      const authParams: AuthRequestParams = {
        address: address as `0x${string}`,
        session_key: sessionKey.address,
        app_name: APP_NAME,
        expire: expireTimestamp,
        scope: AUTH_SCOPE,
        application: address as Hex, //idk why same address in both application and address
        allowances: [],
      };

      createAuthRequestMessage(authParams).then((payload) => {
        webSocketService.send(payload);
      });
    }
  }, [address, sessionKey, wsStatus, isAuthenticated, isAuthAttempted]);
  
  useEffect(() => {
    const handleMessage = async (data:"any") => {
      const response = parseAnyRPCResponse(JSON.stringify(data));

      // Handle auth challenge
      if (
        response.method === RPCMethod.AuthChallenge &&
        client &&
        sessionKey &&
        address &&
        sessionExpireTimestamp
      ) {
        const challengeResponse = response as AuthChallengeResponse;

        const authParams = {
          scope: AUTH_SCOPE,
          application: client.account?.address as `0x${string}`,
          participant: sessionKey.address as `0x${string}`,
          expire: sessionExpireTimestamp,
          allowances: [],
        };

        const eip712Signer = createEIP712AuthMessageSigner(
          client,
          authParams,
          getAuthDomain()
        );

        try {
          const authVerifyPayload = await createAuthVerifyMessage(
            eip712Signer,
            challengeResponse
          );
          webSocketService.send(authVerifyPayload);
        } catch (error) {
          alert("Signature rejected. Please try again.");
          console.error(error);
          setIsAuthAttempted(false);
        }
      }

      // Handle auth success
      if (
        response.method === RPCMethod.AuthVerify &&
        response.params?.success
      ) {
        setIsAuthenticated(true);
        if (response.params.jwtToken) storeJWT(response.params.jwtToken);
      }

      // Handle errors
      if (response.method === RPCMethod.Error) {
        removeJWT();
        // Clear session key on auth failure to regenerate next time
        removeSessionKey();
        alert(`Authentication failed: ${response.params.error}`);
        setIsAuthAttempted(false);
      }
    };

    webSocketService.addMessageListener(handleMessage);
    return () => webSocketService.removeMessageListener(handleMessage);
  }, [client, sessionKey, sessionExpireTimestamp, address]);

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  const truncateAddress = (addr: string) =>
    addr.slice(0, 6) + "..." + addr.slice(-4);

  useEffect(() => {
    const existingSessionKey = getStoredSessionKey();
    if (existingSessionKey) {
      setSessionKey(existingSessionKey);
    } else {
      const newSessionKey = generateSessionKey();
      storeSessionKey(newSessionKey);
      setSessionKey(newSessionKey);
    }

    webSocketService.addStatusListener(setWsStatus);
    webSocketService.connect();

    return () => {
      webSocketService.removeStatusListener(setWsStatus);
    };
  },[]);

  return(
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex items-center justify-between px-8 py-4 
                 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
    >
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-lg text-gray-800 tracking-tight">
          FlashLoan
        </span>
      </div>

      <div className="flex gap-8 text-gray-600 font-medium">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 font-semibold"
              : "hover:text-indigo-500 transition-colors"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/borrow"
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 font-semibold"
              : "hover:text-indigo-500 transition-colors"
          }
        >
          Borrow
        </NavLink>
        <NavLink
          to="/lend"
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 font-semibold"
              : "hover:text-indigo-500 transition-colors"
          }
        >
          Lend
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-gray-100 font-mono text-sm text-gray-700">
          {wsStatus === "Connecting" && "Connecting..."}
          {wsStatus === "Connected" && "Connected"}
          {wsStatus === "Disconnected" && "Disconnected"}
        </div>
        <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-gray-100 font-mono text-sm text-gray-700">
          {isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </div>

        <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-gray-100 font-mono text-sm text-gray-700">
          {address ? truncateAddress(address) : "Not Connected"}
        </div>

        {address ? (
          <motion.button
            onClick={disconnectWallet}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full 
                       bg-gray-800 text-white font-medium shadow-sm 
                       hover:bg-gray-700 transition"
          >
            <LogOut size={18} />
            Disconnect
          </motion.button>
        ) : (
          <motion.button
            onClick={connectWallet}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full 
                       bg-indigo-600 text-white font-medium shadow-sm 
                       hover:bg-indigo-500 transition"
          >
            <Wallet size={18} />
            Connect Wallet
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
