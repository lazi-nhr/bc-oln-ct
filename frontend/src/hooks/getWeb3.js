import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import adminAbi from '../contracts/adminAbi.json';
import trackingAbi from '../contracts/trackingAbi.json';
import { useEthereumAddress } from '../contexts/EthereumAddressContext';
import { INFURA_URL, ADMIN_CONTRACT_ADDRESS, TRACKING_CONTRACT_ADDRESS, DEFAULT_ADDRESS } from './constants.js';

const getWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [trackingContract, setTrackingContract] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setEthereumAddress } = useEthereumAddress();
  
  // Add caches for users and products to reduce API calls
  const [userCache, setUserCache] = useState({});
  const [productCache, setProductCache] = useState({});

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        // Initialize Web3 with Infura
        const web3Instance = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
        setWeb3(web3Instance);

        // Initialize contracts
        const adminContract = new web3Instance.eth.Contract(adminAbi, ADMIN_CONTRACT_ADDRESS);
        const trackingContract = new web3Instance.eth.Contract(trackingAbi, TRACKING_CONTRACT_ADDRESS);

        setAdminContract(adminContract);
        setTrackingContract(trackingContract);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        setIsInitialized(false);
      }
    };

    initializeWeb3();
  }, []);

  // Get product details and tracking history for a specific UPI
  const getUser = useCallback(async (userAddress) => {
    try {
      // Check cache first
      if (userCache[userAddress]) {
        console.log('Using cached user data for:', userCache[userAddress]);
        return userCache[userAddress];
      }

      // If not in cache, fetch from blockchain
      const checksumAddress = web3.utils.toChecksumAddress(userAddress);
      const user = await adminContract.methods.getUser(checksumAddress).call();
      
      // Update cache
      setUserCache(prev => ({
        ...prev,
        [userAddress]: user
      }));

      return user;
    } catch (error) {
      console.error('Error fetching user (', userAddress, '):', error);
      throw error;
    }
  }, [adminContract, isInitialized, web3, userCache, setEthereumAddress]);

  const getProduct = useCallback(async (upi) => {
    if (!isInitialized) {
      throw new Error('getWeb3 not initialized');
    }

    try {
      // Check cache first
      if (productCache[upi]) {
        console.log('Using cached product data for UPI:', upi);
        return productCache[upi];
      }

      // If not in cache, fetch from blockchain
      const [product, trackingHistory] = await Promise.all([
        adminContract.methods.getProduct(upi).call(),
        trackingContract.methods.getStops(upi).call()
      ]);

      const productData = { product, trackingHistory };
      
      // Update cache
      setProductCache(prev => ({
        ...prev,
        [upi]: productData
      }));

      return productData;
    } catch (error) {
      console.error('Error fetching product (', upi, '):', error);
      throw error;
    }
  }, [adminContract, trackingContract, isInitialized, productCache]);

  const getProducts = useCallback(async (userAddress) => {
    if (!isInitialized) {
      userAddress = DEFAULT_ADDRESS;
      throw new Error('getWeb3 not initialized');
    }

    try {
      if (!userAddress || typeof userAddress !== 'string') {
        throw new Error('Invalid user address');
      }

      // Ensure the address is properly formatted
      const checksumAddress = web3.utils.toChecksumAddress(userAddress);
      
      // Get all products from a user
      const products = await trackingContract.methods.getProducts(checksumAddress).call();
      return products;
    } catch (error) {
      console.error('Error fetching products (', userAddress, ') :', error);
      throw error;
    }
  }, [adminContract, isInitialized, web3, setEthereumAddress]);

  // Add a function to clear cache if needed
  const clearCache = useCallback(() => {
    setUserCache({});
    setProductCache({});
  }, []);

  return {
    isInitialized,
    getProduct,
    getUser,
    getProducts,
    clearCache
  };
};

export default getWeb3;
