import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, JsonRpcProvider, getAddress, formatUnits } from 'ethers';
import ERC20ABI from '@/contracts/erc20.abi.json';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

export const useERC20 = (address) => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  useEffect(() => {
    const loadContract = async () => {
      const provider = walletProvider
        ? new BrowserProvider(walletProvider)
        : new JsonRpcProvider(process.env.NEXT_PUBLIC_DEFAULT_RPC_URL);
      const readonlyContract = new Contract(address, ERC20ABI, provider);
      setContract(readonlyContract);

      if (isConnected && walletProvider) {
        const signer = await provider.getSigner();
        const tokenContract = readonlyContract.connect(signer);
        setSigner(signer);
        setContract(tokenContract);
      }
    };

    if (window.ethereum) loadContract();
  }, [isConnected, walletProvider, window.ethereum]);

  const getBalance = async (address) => {
    if (!contract) return;

    try {
      // Get balance
      const rawBalance = await contract.balanceOf(address);

      return rawBalance;
    } catch (error) {
      console.error('Error fetching token balance:', error);
      throw error;
    }
  };

  const getOwner = async () => {
    if (!contract) return;

    return await contract.owner();
  };

  const getTotalSupply = async () => {
    if (!contract) return;

    try {
      // Get balance and decimals
      const totalSupply = await contract.totalSupply();

      return totalSupply;
    } catch (error) {
      console.error('Error getting total supply:', error);
      throw error;
    }
  };

  const getDecimals = async () => {
    if (!contract) return;

    try {
      // Get balance and decimals
      const decimal = await contract.decimals();

      return decimal;
    } catch (error) {
      console.error('Error getting decimal:', error);
      throw error;
    }
  };

  const approve = async (address, amount) => {
    try {
      console.log(`Approving USDT for address: ${address}`);
      const tx = await contract.approve(address, amount);
      console.log('Transaction submitted. Waiting for confirmation...');
      await tx.wait(); // Wait for the transaction to be mined
      console.log('Transaction confirmed:', tx.hash);
    } catch (error) {
      console.error('Error approving USDT:', error);
      throw error;
    }
  };

  return { signer, contract, getBalance, getOwner, getTotalSupply, getDecimals, approve };
};
