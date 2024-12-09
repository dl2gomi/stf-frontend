import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, JsonRpcProvider, getAddress, formatUnits } from 'ethers';
import TokenABI from '@/contracts/stftoken.abi.json';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

export const useToken = () => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  useEffect(() => {
    const loadContract = async () => {
      const provider = walletProvider
        ? new BrowserProvider(walletProvider)
        : new JsonRpcProvider(process.env.NEXT_PUBLIC_DEFAULT_RPC_URL);
      const readonlyContract = new Contract(process.env.NEXT_PUBLIC_STFTOKEN_ADDRESS, TokenABI, provider);
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

  const getVault = async () => {
    if (!contract) return;

    try {
      // Get balance and decimals
      const vaultAddress = await contract.vault();

      return vaultAddress;
    } catch (error) {
      console.error('Error getting vault address:', error);
      throw error;
    }
  };

  const setVault = async (address) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.setVault(address);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error setting Vault address:');
      console.error(error);
      throw error;
    }
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

  return { signer, contract, getBalance, getVault, setVault, getOwner, getTotalSupply, getDecimals };
};
