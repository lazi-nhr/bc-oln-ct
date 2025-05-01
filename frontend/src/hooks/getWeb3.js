import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import adminAbi from '../contracts/adminAbi.json';
import trackingAbi from '../contracts/trackingAbi.json';
import { useEthereumAddress } from '../contexts/EthereumAddressContext';

const INFURA_URL = 'https://sepolia.infura.io/v3/63703b3efd0948c2adf595d101b8d981';
const ADMIN_CONTRACT_ADDRESS = '0xeA1923C66a2fBD7E72744a2C523DFd70E28Dc865';
const TRACKING_CONTRACT_ADDRESS = '0x897Bf9Ed6e7F560a27440E064bF1cd5780692D88';
const DEFAULT_ADDRESS = '0xA5f11536E55f1D77b8033F56C42C5c7aEE1DA9EB';

const getWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [trackingContract, setTrackingContract] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setEthereumAddress } = useEthereumAddress();

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
    if (!isInitialized) {
      throw new Error('getWeb3 not initialized');
    }

    try {
      // Get both product details and tracking history in parallel
      const [user] = await Promise.all([
        adminContract.methods.getUser(userAddress).call()
      ]);
      return { user };
    } catch (error) {
      console.error('Error fetching user (', userAddress, '):', error);
      throw error;
    }
  }, [adminContract, isInitialized]);

  // Get product details and tracking history for a specific UPI
  const getProduct = useCallback(async (upi) => {
    if (!isInitialized) {
      throw new Error('getWeb3 not initialized');
    }

    try {
      // Get both product details and tracking history in parallel
      const [product, trackingHistory] = await Promise.all([
        adminContract.methods.getProduct(upi).call(),
        trackingContract.methods.getStops(upi).call()
      ]);
      return { product, trackingHistory };
    } catch (error) {
      console.error('Error fetching product (', upi, '):', error);
      throw error;
    }
  }, [adminContract, trackingContract, isInitialized]);

  // Get all products from a specific user
  const getProducts = useCallback(async (userAddress) => {
    if (!isInitialized) {
      userAddress = DEFAULT_ADDRESS;
    }

    try {
      if (!userAddress || typeof userAddress !== 'string') {
        throw new Error('Invalid user address');
      }

      // Ensure the address is properly formatted
      const checksumAddress = web3.utils.toChecksumAddress(userAddress);
      setEthereumAddress(checksumAddress);
      
      // Get all products from a user
      const products = await trackingContract.methods.getProducts(checksumAddress).call();
      return products;
    } catch (error) {
      console.error('Error fetching products (', userAddress, ') :', error);
      throw error;
    }
  }, [adminContract, isInitialized, web3, setEthereumAddress]);

  return {
    isInitialized,
    getProduct,
    getUser,
    getProducts
  };
};

export default getWeb3;
