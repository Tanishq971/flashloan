import { create } from "zustand";
import type { clientWalletState } from "../types";
import { type SessionKey } from "@/lib/utils2";
import { type WsStatus } from "@/lib/websocket";
import type { NitroliteClient } from "@erc7824/nitrolite";



export const useClientStore = create<clientWalletState>((set) => {
  return {
    client: null,
    setClient: (client) => set({client}),
    address: null,
    isConnected: false,
    setAddress: (address: string) => set({ address}),
    setIsConnected: (isConnected: boolean) => set({isConnected}),
    sessionKey: null,
    setSessionKey: (sessionKey : SessionKey)=>set({sessionKey}),
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated : boolean) => set({isAuthenticated}),
    isAuthAttempted: false,
    setIsAuthAttempted: (isAuthAttempted : boolean) => set({isAuthAttempted}),
    sessionExpireTimestamp:"",
    setSessionExpireTimestamp:(sessionExpireTimestamp : string) =>set({sessionExpireTimestamp}),
    wsStatus: "Disconnected",
    setWsStatus: (wsStatus : WsStatus) => set({wsStatus}),
    nitroliteClient: null,
    setNitroliteClient: (nitroliteClient : NitroliteClient) => set({nitroliteClient})
  };
});
