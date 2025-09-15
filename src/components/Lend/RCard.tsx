import React from "react";

type BorrowRequest = {
  id: string;
  borrower: { address: string };
  proposedAmount: number;
  proposedInterest: number;
  proposedCollateral: number;
  proposedDuration: number;
  status: string;
};

type RCardProps = {
  request: BorrowRequest;
};

const RCard: React.FC<RCardProps> = ({ request }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-gray-100 mb-2">
      <div className="flex flex-col gap-1">
      
        <p>
          <span className="font-semibold">Amount:</span> {request.proposedAmount}
        </p>
        <p>
          <span className="font-semibold">Interest:</span> {request.proposedInterest}%
        </p>
        <p>
          <span className="font-semibold">Collateral:</span> {request.proposedCollateral}
        </p>
        <p>
          <span className="font-semibold">Duration:</span> {request.proposedDuration} days
        </p>
        <p>
          <span className="font-semibold">Status:</span> {request.status}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg">A</button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg">R</button>
      </div>
    </div>
  );
};

export default RCard;
