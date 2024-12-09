'use client';

import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { mainnet, defineChain } from '@reown/appkit/networks';

const projectId = process.env['NEXT_PUBLIC_REOWN_PROJECT_ID'];
if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not set');
}

const ethersAdapter = new EthersAdapter();

// Define the custom network
const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HARDHAT_RPC_URL],
      webSocket: [process.env.NEXT_PUBLIC_HARDHAT_WS_RPC_URL],
    },
  },
});

createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: [hardhat],
  defaultNetwork: hardhat,
  metadata: {
    name: 'Santistef: connect wallet',
    description: 'Connect wallet to Santistef investment platform',
    url: 'https://reown.com/appkit',
    icons: ['https://avatars.githubusercontent.com/u/179229932?s=200&v=4'],
  },
  features: {
    email: false,
    socials: false,
  },
});

const ContextProvider = ({ children }) => {
  return <>{children}</>;
};

export default ContextProvider;
