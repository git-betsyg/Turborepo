'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import {
  wagmiAdapter,
  projectId,
  siweConfig,
  metadata,
  chains,
  solanaWeb3JsAdapter,
  bitcoinAdapter
} from "@/lib/appkit";
import { State, WagmiProvider } from 'wagmi';

if (!projectId) throw new Error('Project ID is not defined');

// Create modal
createAppKit({
  adapters: [wagmiAdapter,solanaWeb3JsAdapter,bitcoinAdapter],
  networks: chains,
  projectId,
  siweConfig,
  metadata,
  features: {
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true, // default to true
  }
});

export default function AppKitProvider({
                                         children,
                                         initialState,
                                       }: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  );
}