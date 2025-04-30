import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import adminAbi from '../contracts/adminAbi.json';
import trackingAbi from '../contracts/trackingAbi.json';

const INFURA_URL = 'https://sepolia.infura.io/v3/63703b3efd0948c2adf595d101b8d981';
const ADMIN_CONTRACT_ADDRESS = '0xC77cB1877Daa26B071eF3781FF155952D5b7966F';
const TRACKING_CONTRACT_ADDRESS = '0x86Bc003b6320096e0C07d2F4Ab1dFAb57E0ABa9D';

const getWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [trackingContract, setTrackingContract] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

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
      throw new Error('getWeb3 not initialized');
    }

    try {
      // Get all products from a user
      const productPromises = adminContract.methods.getProducts(userAddress).call();
      const products = await Promise.all(productPromises);
      return products;
    } catch (error) {
      console.error('Error fetching products (', userAddress, ') :', error);
      throw error;
    }
  }, [adminContract, isInitialized]);

  return {
    isInitialized,
    getProduct,
    getProducts
  };
};

export default getWeb3;
