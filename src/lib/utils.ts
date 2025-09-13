import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const AUTH_SCOPE = "your-app.com";
export const APP_NAME = "Your App Name";
export const SESSION_DURATION = 3600; // 1 hour

export const getAuthDomain = () => ({
  name: "Your App Name",
});