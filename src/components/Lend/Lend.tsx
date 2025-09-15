"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import LendButton from "./LendButton";
import HCard from "./HCard";
import RCard from "./RCard";
import { useClientStore } from "@/store/clientStore";
import { BACKEND_URL } from "@/lib/utils";

type ProposalHistory = {
  id: string;
  amount: number;
  status: string;
  acceptedRequestId: string | null;
};

type BorrowRequest = {
  id: string;
  borrower: { address: string };
  proposedAmount: number;
  proposedInterest: number;
  proposedCollateral: number;
  proposedDuration: number;
  status: string;
};


const LendLayout: React.FC = () => {
  const { address } = useClientStore();
  const [history, setHistory] = useState<ProposalHistory[]>([]);
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const historyRes = await axios.get(
          `${BACKEND_URL}/api/proposals/getAll`,
          {
            params: { lenderAddress: address },
          }
        );
        setHistory(historyRes.data);

        const requestsRes = await axios.get(
          `${BACKEND_URL}/api/requests/getAll`,
          {
            params: { lenderAddress: address },
          }
        );
       console.log("req res -----" , requestsRes.data)
        const allRequests: BorrowRequest[]  = requestsRes.data;
        
        console.log(allRequests)
        setRequests(allRequests);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 max-w-6xl mx-auto w-full mt-8 gap-6">
        {/* History Column */}
        <div className="w-1/4 flex flex-col gap-6">
          <div className="p-6 rounded-2xl shadow bg-white text-center font-semibold">
            <LendButton />
          </div>
          <div className="p-6 rounded-2xl shadow bg-white flex flex-col gap-2">
            <h2 className="mb-4 text-gray-600 font-medium">History</h2>

            {loading && <p className="text-gray-500">Loading...</p>}
            {!loading && history.length === 0 && (
              <p className="text-gray-500">No history found</p>
            )}
            {!loading &&
              history.map((item) => (
                <HCard
                  key={item.id}
                  poolId={item.id}
                  amount={item.amount}
                  status={item.status}
                  acceptedRequestId={item.acceptedRequestId}
                />
              ))}
          </div>
        </div>

        {/* Requests Column */}
        <div className="flex-1 rounded-2xl shadow bg-white p-6 flex flex-col gap-2">
          <h2 className="mb-4 text-gray-600 font-medium text-xl">Requests</h2>
          {loading && <p className="text-gray-500">Loading...</p>}
          {!loading && requests.length === 0 && (
            <p className="text-gray-500">No requests found</p>
          )}
          {!loading &&
            requests.map((request) => (
              <RCard key={request.id} request={request} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LendLayout;
