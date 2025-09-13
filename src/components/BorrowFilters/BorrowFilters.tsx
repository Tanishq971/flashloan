import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BorrowFilters: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tokens = ["ETH", "BTC", "USDT", "DAI"];

  return (
    <div className="my-3 mx-2 flex items-center justify-between px-8 py-4 bg-white border border-gray-200 shadow-sm rounded-md">
      {/* Tokens */}
      <div className="flex gap-2 flex-wrap">
        {tokens.map((token) => (
          <span
            key={token}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
              selectedToken === token
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => {
              setSelectedToken(token);
              setIsDialogOpen(true);
            }}
          >
            {token}
          </span>
        ))}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-40 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Animated Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-300 bg-opacity-90/20 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg w-80 p-6"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-lg font-semibold mb-2">
                Filter by {selectedToken}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You are applying a filter for <b>{selectedToken}</b>. Only loans
                with this token will be shown.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BorrowFilters;
