
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import LendPage from "./components/Lend/Lend";
import BorrowPage from "./components/Borrow/Borrow";


export function App() {

  return (
    <div className="app-container w-full ">
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lend" element={<LendPage />} />
        <Route path="/borrow" element={<BorrowPage />} />
      </Routes>
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
