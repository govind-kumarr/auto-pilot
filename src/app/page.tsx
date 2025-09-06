"use client";
import Providers from "./providers";
import Home from "./components/home";
import { UserProvider } from "./user-provider";

export default function AutoPilot() {
  return (
    <Providers>
      <UserProvider>
        <Home />
      </UserProvider>
    </Providers>
  );
}
