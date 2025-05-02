import { useState, useCallback } from 'react';
import Web3 from 'web3';
import adminAbi from '../contracts/adminAbi.json';
import { INFURA_URL, ADMIN_CONTRACT_ADDRESS, TRACKING_CONTRACT_ADDRESS } from './constants.js';

const setWeb3 = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Web3 with MetaMask
  const initializeWeb3 = useCallback(async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to register products. [setWeb3.js]');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create Web3 instance
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Initialize contract
      const contract = new web3Instance.eth.Contract(adminAbi, ADMIN_CONTRACT_ADDRESS);
      setAdminContract(contract);
      
      setIsInitialized(true);
      setError(null);
    } catch (error) {
      console.error('Failed to initialize Web3 [setWeb3.js]:', error); 
      setError(error.message);
      setIsInitialized(false);
    }
  }, []);

  // Register new product
  const setProduct = useCallback(async (productName) => {
    if (!isInitialized) {
      await initializeWeb3();
    }

    if (!web3 || !adminContract) {
      throw new Error('Web3 or contract not initialized. [setWeb3.js]');
    }

    try {
      // Get current account
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No account found. Please connect your wallet. [setWeb3.js]');
      }

      // Call the setProduct function
      const result = await adminContract.methods.setProduct(productName).send({
        from: accounts[0],
        gas: 200000 // Adjust gas limit as needed
      });

      console.log('Product registered successfully [setWeb3.js]:', result);
      return result;
    } catch (error) {
      console.error('Error registering product [setWeb3.js]:', error);
      throw error;
    }
  }, [web3, adminContract, isInitialized, initializeWeb3]);

  return {
    isInitialized,
    error,
    setProduct,
    initializeWeb3
  };
};

export default setWeb3;
