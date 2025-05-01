import { useState, useEffect, useCallback } from 'react';
import { useEthereumAddress } from '../contexts/EthereumAddressContext';
import Web3 from 'web3';
import adminAbi from '../contracts/adminAbi.json';
import trackingAbi from '../contracts/trackingAbi.json';

const SEPOLIA_CHAIN_ID = '0xaa36a7';
const SEPOLIA_RPC_URL = 'https://sepolia.infura.io/v3/63703b3efd0948c2adf595d101b8d981';

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
      if (typeof window === 'undefined' || !window.ethereum) {
        console.error('Please install MetaMask!');
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
          throw new Error('No accounts found. Please connect your wallet.');
        }

        // Check and switch to Sepolia network if needed
        const chainId = await web3Instance.eth.getChainId();
        if (chainId.toString(16) !== SEPOLIA_CHAIN_ID.substring(2)) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: SEPOLIA_CHAIN_ID }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: [SEPOLIA_RPC_URL],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                }],
              });
            } else {
              throw switchError;
            }
          }
        }
        
        const currentAccount = accounts[0];
        setAccount(currentAccount);
        setEthereumAddress(currentAccount);

        // Load the admin contract
        const adminContractAddress = '0xeA1923C66a2fBD7E72744a2C523DFd70E28Dc865';
        const adminContract = new web3Instance.eth.Contract(adminAbi, adminContractAddress);
        setAdminContract(adminContract);

        // Load the tracking contract
        const trackingContractAddress = '0x897Bf9Ed6e7F560a27440E064bF1cd5780692D88';
        const trackingContract = new web3Instance.eth.Contract(trackingAbi, trackingContractAddress);
        setTrackingContract(trackingContract);

        // Load the products only if we have an account
        try {
          const products = await trackingContract.methods.getProducts(currentAccount).call();
          setProducts(products);
        } catch (error) {
          console.error('Error loading products:', error);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        setIsInitialized(false);
        throw new Error('Web3 initialization failed. Please ensure MetaMask is connected.');
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
              console.error('Error reloading products:', error);
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
