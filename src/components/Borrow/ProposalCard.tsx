"use client";

import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/lib/utils";

type LendingProposal = {
  id: string;
  lenderId: string;
  amount: number;
  tokenSymbol: string;
  interest: number;
  settlementDuration: number;
  minCollateral: number;
};

type ProposalCardProps = {
  proposal: LendingProposal;
  borrowerAddress: string; // connected wallet
};

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, borrowerAddress }) => {
  const handleBorrowRequest = async () => {
    try {
        
      const response = await axios.post(`${BACKEND_URL}/api/requests/${proposal.id}`, {
        borrowerAddress,
        proposedAmount: proposal.amount,         
        proposedInterest: proposal.interest,     
        proposedCollateral: proposal.minCollateral, 
        proposedDuration: proposal.settlementDuration,
      });

      toast.success("Borrow request sent!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send borrow request");
    }
  };

  return (
    <div className="flex flex-col p-6 rounded-2xl shadow-lg bg-gradient-to-br from-gray-900/5 to-white border border-gray-200 w-80 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Lending Proposal</h2>

      <div className="flex flex-col gap-2 text-gray-700 text-sm">
        <p>
          <span className="font-semibold text-gray-900">Amount:</span> {proposal.amount} {proposal.tokenSymbol}
        </p>
        <p>
          <span className="font-semibold text-gray-900">Interest:</span> {proposal.interest}%
        </p>
        <p>
          <span className="font-semibold text-gray-900">Duration:</span> {proposal.settlementDuration} days
        </p>
        <p>
          <span className="font-semibold text-gray-900">Min Collateral:</span> {proposal.minCollateral} {proposal.tokenSymbol}
        </p>
        <p className="truncate">
          <span className="font-semibold text-gray-900">Lender ID:</span> {proposal.lenderId}
        </p>
      </div>

      <button
        onClick={handleBorrowRequest}
        className="mt-6 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-colors duration-200"
      >
        Request to Borrow
      </button>
    </div>
  );
};

export default ProposalCard;
