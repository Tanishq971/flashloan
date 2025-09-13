<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
``` -->
///////////////////
import { useState, useEffect } from "react";
import {
  createWalletClient,
  custom,
  type Address,
  type WalletClient,
} from "viem";
import { mainnet } from "viem/chains";
import { PostList } from "./components/PostList/PostList";
import { posts } from "./posts";
import { webSocketService, type WsStatus } from "./lib/websocket";
import "./App.css";
export function App() {
//   const [account, setAccount] = useState<Address | null>(null);
//   const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
//   const [wsStatus, setWsStatus] = useState<WsStatus>("Disconnected");


  useEffect(() => {

    const client = createWalletClient({
      chain: mainnet,
      transport: custom(window.ethereum),
    });
    
    console.log("client initiated" , client);;
  });

  const formatAddress = (address: Address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Nexus</h1>
          <p className="tagline">
            Decentralized insights for the next generation of builders
          </p>
        </div>
        <div className="header-controls">
          <div className={`ws-status ${wsStatus.toLowerCase()}`}>
            <span className="status-dot"></span> {wsStatus}
          </div>
          <div className="wallet-connector">
            {account ? (
              <div className="wallet-info">
                Connected: {formatAddress(account)}
              </div>
            ) : (
              <button onClick={connectWallet} className="connect-button">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <PostList posts={posts} isWalletConnected={!!account} />
      </main>
    </div>
  );
}

export default App;





//error in window.ethereum

// interface EthereumProvider {
//   isMetaMask?: boolean;
//   request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
//   on?: (event: string, handler: (...args: any[]) => void) => void;
// 

// declare global {
//   interface Window {
//     ethereum?: EthereumProvider;
//   }
// }
