import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, JsonRpcProvider, formatUnits, getAddress, parseUnits } from 'ethers';
import VaultABI from '@/contracts/stfvault.abi.json';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

export const useVault = () => {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const { isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  if (!window.ethereum) throw new Error('No wallet found');

  useEffect(() => {
    const loadContract = async () => {
      const provider = walletProvider
        ? new BrowserProvider(walletProvider)
        : new JsonRpcProvider(process.env.NEXT_PUBLIC_DEFAULT_RPC_URL);
      const readonlyContract = new Contract(process.env.NEXT_PUBLIC_STFVAULT_ADDRESS, VaultABI, provider);
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

  const getOwner = async () => {
    if (!contract) return;

    return await contract.owner();
  };

  const getTokenPrice = async () => {
    if (!contract) return;

    return await contract.tokenPrice();
  };

  const getMaxSupply = async () => {
    if (!contract) return;

    return formatUnits(await contract.maxSupply(), 6);
  };

  const getRole = async (address) => {
    if (!contract) return;

    const ownerAddress = await contract.owner();

    if (getAddress(ownerAddress) === getAddress(address)) return 'owner';
    if (await contract.isCEO(address)) return 'ceo';
    if (await contract.isOperator(address)) return 'operator';

    return 'user';
  };

  const setTokenDetails = async (maxSupply, tokenPrice) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.setTokenDetails(maxSupply, tokenPrice);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error setting token details:');
      console.error(error);
      throw error;
    }
  };

  const isStarted = async () => {
    if (!contract) return;

    return await contract.isStarted();
  };

  const startVault = async () => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.startVault();

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error starting vault:');
      console.error(error);
      throw error;
    }
  };

  const invest = async (amount) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.invest(parseUnits(amount, 6));

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error investing USDT:');
      console.log(error);
      throw error;
    }
  };

  const depositProfit = async (taxYear, amount) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.depositProfit(taxYear, parseUnits(amount, 6));

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error depositing profit USDT:');
      console.error(error);
      throw error;
    }
  };

  const uploadTaxDoc = async (taxYear, cid, amount) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.uploadTaxDocs(taxYear, cid, parseUnits(amount, 6));

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error depositing profit USDT:');
      console.error(error);
      throw error;
    }
  };

  const addCEO = async (address) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.addCEOAddress(address);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error adding CEO address:');
      console.error(error);
      throw error;
    }
  };

  const removeCEO = async (address) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.removeCEOAddress(address);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error removing CEO address:');
      console.error(error);
      throw error;
    }
  };

  const addOperator = async (address) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.addOperatorAddress(address);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error adding Operator address:');
      console.error(error);
      throw error;
    }
  };

  const removeOperator = async (address) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.removeOperatorAddress(address);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error removing Operator address:');
      console.error(error);
      throw error;
    }
  };

  const getCEOAddresses = async () => {
    if (!contract) return;

    try {
      return await contract.getCEOAddresses();
    } catch (error) {
      console.error('Error fetching ceo addresses:', error);
      throw error;
    }
  };

  const getOperatorAddresses = async () => {
    if (!contract) return;

    try {
      return await contract.getOperatorAddresses();
    } catch (error) {
      console.error('Error fetching operator addresses:', error);
      throw error;
    }
  };

  const getInvestors = async () => {
    if (!contract) return;

    try {
      return await contract.getInvestors();
    } catch (error) {
      console.error('Error fetching operator addresses:', error);
      throw error;
    }
  };

  const withdraw = async (address, amount) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to set the field
      const tx = await contract.withdrawUSDT(address, amount);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error withdrawing funds:');
      console.error(error);
      throw error;
    }
  };

  const getProfitPool = async () => {
    if (!contract) return;

    try {
      return await contract.profitPool();
    } catch (error) {
      console.error('Error fetching profit pool:', error);
      throw error;
    }
  };

  const getLastInvestedAt = async (address) => {
    if (!contract) return;

    try {
      return await contract.lastInvestedAt(address);
    } catch (error) {
      console.error('Error fetching last investment time:', error);
      throw error;
    }
  };

  const getTaxYears = async () => {
    if (!contract) return;

    try {
      return await contract.getTaxYears();
    } catch (error) {
      console.error('Error fetching tax years:', error);
      throw error;
    }
  };

  const getTaxDetail = async (year) => {
    if (!contract) return;

    try {
      return await contract.taxDocuments(year);
    } catch (error) {
      console.error('Error reading tax document information:', error);
      throw error;
    }
  };

  const getProfitClaimedAt = async (address, year) => {
    if (!contract) return;

    try {
      return await contract.profitClaimedAt(address, year);
    } catch (error) {
      console.error('Error reading claim information:', error);
      throw error;
    }
  };

  const getProfitAmount = async (address, year) => {
    if (!contract) return;

    try {
      return await contract.profitAmountClaimed(address, year);
    } catch (error) {
      console.error('Error reading claim information:', error);
      throw error;
    }
  };

  const claimProfit = async (year) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      // Send the transaction to claim
      const tx = await contract.claimProfit(year);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      console.log('Transaction successful:', receipt.transactionHash);
      return receipt;
    } catch (error) {
      console.error('Error claiming profit:');
      console.error(error);
      throw error;
    }
  };

  const listAllClaims = async (address) => {
    if (!contract) return;
    if (!isConnected) return;

    try {
      return await contract.listAllClaims(address);
    } catch (error) {
      console.error('Error listing claims:');
      console.error(error);
      throw error;
    }
  };

  return {
    signer,
    contract,
    getOwner,
    getTokenPrice,
    getRole,
    getMaxSupply,
    setTokenDetails,
    isStarted,
    startVault,
    invest,
    addCEO,
    removeCEO,
    addOperator,
    removeOperator,
    getCEOAddresses,
    getOperatorAddresses,
    withdraw,
    getProfitPool,
    getInvestors,
    getLastInvestedAt,
    getTaxDetail,
    getTaxYears,
    depositProfit,
    uploadTaxDoc,
    getProfitAmount,
    getProfitClaimedAt,
    claimProfit,
    listAllClaims,
  };
};
