import { useState, useEffect, useCallback } from 'react';
import { useEthereumAddress } from '../contexts/EthereumAddressContext';
import Web3 from 'web3';
import adminAbi from '../contracts/adminAbi.json';
import trackingAbi from '../contracts/trackingAbi.json';
import { ADMIN_CONTRACT_ADDRESS, TRACKING_CONTRACT_ADDRESS } from './constants';

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [trackingContract, setTrackingContract] = useState(null);
  const [products, setProducts] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setEthereumAddress } = useEthereumAddress();

  useEffect(() => {
    const initializeWeb3 = async () => {
      // Check if MetaMask is installed (e.g. Safari or Chrome without extension are not supported)
      if (typeof window === 'undefined' || !window.ethereum) {
        console.error('Please install MetaMask or use a different Browser! [useWeb3.js]');
        return;
      }

      try {
        // Initialize Web3
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Request account access using the modern method
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts'
        });

        if (!accounts || accounts.length === 0) {
          console.error('No accounts found. Please connect your wallet. [useWeb3.js]');
        }

        const currentAccount = accounts[0];
        setAccount(currentAccount);
        setEthereumAddress(currentAccount);

        // Load the admin contract
        const adminContract = new web3Instance.eth.Contract(adminAbi, ADMIN_CONTRACT_ADDRESS);
        setAdminContract(adminContract);

        // Load the tracking contract
        const trackingContract = new web3Instance.eth.Contract(trackingAbi, TRACKING_CONTRACT_ADDRESS);
        setTrackingContract(trackingContract);

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Web3 [useWeb3.js]:', error);
        setIsInitialized(false);
      }
    };

    initializeWeb3();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setEthereumAddress(accounts[0]);
          
          // Reload products for new account if contract is available
          if (adminContract) {
            try {
              const products = await trackingContract.methods.getProducts(accounts[0]).call();
              setProducts(products);
            } catch (error) {
              console.error('Error reloading products: [useWeb3.js]', error);
            }
          }
        } else {
          setAccount(null);
          setProducts(null);
          setIsInitialized(false);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const getProduct = useCallback(async (upi) => {
    if (!isInitialized) {
      throw new Error('Web3 not fully initialized. Please ensure MetaMask is connected.');
    }

    try {
      const product = await adminContract.methods.getProduct(upi).call();
      const trackingHistory = await trackingContract.methods.getStops(upi).call();
      console.log('product data:', product);
      console.log('tracking history:', trackingHistory);
      return { product, trackingHistory };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }, [adminContract, trackingContract, isInitialized]);

  const getProducts = useCallback(async () => {
    if (!isInitialized) {
      throw new Error('Web3 not fully initialized. Please ensure MetaMask is connected.');
    }

    try {
      return await trackingContract.methods.getProducts(account).call();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }, [adminContract, account, isInitialized]);

  return { 
    web3, 
    account, 
    adminContract, 
    trackingContract, 
    products, 
    getProduct,
    getProducts,
    isInitialized
  };
};

export default useWeb3;
