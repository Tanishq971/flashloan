"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useClientStore } from "@/store/clientStore";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type LendFormData = {
  wallet: string;
  chain: string;
  amount: number;
  duration: number;
  interest: number;
  collateral: number;
};

const chains = [
  { value: "ethereum", name: "Ethereum", symbol: "Eth" },
  { value: "polygon", name: "Polygon", symbol: "Pol" },
  { value: "avalanche", name: "Avalanche", symbol: "Avax" },
  { value: "arbitrum", name: "Arbitrum", symbol: "Arb" },
];

const titles = [
  "Create Lend Request",
  "Start Earning Interest",
  "Secure Your Funds",
  "Lend with Confidence",
];

const LendButton = () => {
  const { address } = useClientStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  const { register, handleSubmit, reset, setValue } = useForm<LendFormData>({
    defaultValues: {
      wallet: "",
      chain: "ethereum",
      amount: 0,
      duration: 30,
      interest: 5,
      collateral: 50,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (address) setValue("wallet", address);
  }, [address, setValue]);

  const onSubmit = async (data: LendFormData) => {
    setLoading(true);
    const payload = {
      lenderAddress: data.wallet,
      amount: Number(data.amount),
      tokenSymbol: data.chain,
      interest: Number(data.interest),
      settlementDuration: Number(data.duration),
      minCollateral: Number(data.collateral),
    };
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/proposals/create`,
        payload
      );
      console.log(res);
      setOpen(false);

      reset({
        wallet: address || "",
        chain: "ethereum",
        amount: 0.5,
        duration: 30,
        interest: 5,
        collateral: 50,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="px-6 py-3 min-w-[200px] font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={titles[currentTitleIndex]}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.5 }}
              className="block"
            >
              {titles[currentTitleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-lg border border-gray-200 max-w-3xl w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-900">
            Create Lend Request
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4">
            Provide the details below to create a lending proposal.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wallet Address
            </label>
            <input
              {...register("wallet", { required: true })}
              placeholder="0x..."
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Chain
            </label>
            <select
              {...register("chain", { required: true })}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {chains.map((chain) => (
                <option key={chain.value} value={chain.symbol}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              {...register("amount", { required: true, min: 0 })}
              placeholder="Enter amount"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (in days)
            </label>
            <input
              type="number"
              {...register("duration", { required: true, min: 1 })}
              placeholder="e.g. 30"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="any"
              {...register("interest", { required: true, min: 0 })}
              placeholder="e.g. 5"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Collateral */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Collateral
            </label>
            <input
              type="number"
              {...register("collateral", { required: true, min: 0 })}
              placeholder="Enter collateral amount"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "✅ Submit Lend Request"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LendButton;
