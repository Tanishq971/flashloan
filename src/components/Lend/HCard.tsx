"use client";

import React from "react";

type HCardProps = {
  poolId: string;
  amount: number;
  status: string;
  acceptedRequestId: string | null;
};

const HCard: React.FC<HCardProps> = ({ poolId, amount, status, acceptedRequestId }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-xl flex flex-col gap-2 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">Pool ID:</span>
        <span className="text-gray-700">{poolId}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">Amount:</span>
        <span className="text-gray-700">{amount}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">Status:</span>
        <span
          className={`px-2 py-1 rounded-full text-sm font-semibold ${
            status === "ACCEPTED"
              ? "bg-green-100 text-green-800"
              : status === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      </div>

      {acceptedRequestId && (
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Accepted Request:</span>
          <span className="text-gray-700">{acceptedRequestId}</span>
        </div>
      )}
    </div>
  );
};

export default HCard;
