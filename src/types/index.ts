import type { SessionKey } from "@/lib/utils2";
import {
  type WalletClient,
} from "viem";
import { type WsStatus } from "@/lib/websocket";
import type { NitroliteClient } from "@erc7824/nitrolite";



export interface clientWalletState{
     client: WalletClient | null;
     setClient: (client: WalletClient)=>void;
     address: string | null;
     isConnected: boolean;
     setAddress: (address: string) => void;
     setIsConnected: (isConnected: boolean) =>void;
     sessionKey: SessionKey | null;
     setSessionKey: (sessionKey : SessionKey) =>void;
     isAuthenticated: boolean;
     setIsAuthenticated: (isAuthenticated : boolean) =>void;
     isAuthAttempted: boolean;
     setIsAuthAttempted: (isAuthAttempted: boolean)=>void;
     sessionExpireTimestamp: string;
     setSessionExpireTimestamp: (sessionExpireTimestamp: string)=> void;
     wsStatus : WsStatus;
     setWsStatus : (wsStatus : WsStatus) =>void;
     nitroliteClient:NitroliteClient | null;
     setNitroliteClient : (nitroliteClient: NitroliteClient) => void;
}

export type Hex = `0x${string}`