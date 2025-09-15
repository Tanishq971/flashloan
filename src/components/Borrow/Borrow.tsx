"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProposalCard from "./ProposalCard"; // make sure path is correct

type LendingProposal = {
  id: string;
  lenderId: string;
  amount: number;
  tokenSymbol: string;
  interest: number;
  settlementDuration: number;
  minCollateral: number;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const BorrowPage: React.FC = () => {
  const [proposals, setProposals] = useState<LendingProposal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch proposals on first render
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/proposals/getAll`); 
        setProposals(response.data);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-6">
        <div className="flex-1 p-6 rounded-2xl shadow bg-white flex flex-col gap-4">
          <h2 className="text-gray-600 font-medium text-xl mb-4">Requests</h2>

          {loading && <p className="text-gray-500">Loading proposals...</p>}

          {!loading && proposals.length === 0 && (
            <p className="text-gray-500">No proposals available.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                borrowerAddress={"0x123..."} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowPage;
