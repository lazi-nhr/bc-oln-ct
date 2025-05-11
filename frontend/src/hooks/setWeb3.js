import { useState, useCallback, useEffect } from "react";
import Web3 from "web3";
import adminAbi from "../contracts/adminAbi.json";
import trackingAbi from "../contracts/trackingAbi.json";
import {
  INFURA_URL,
  ADMIN_CONTRACT_ADDRESS,
  TRACKING_CONTRACT_ADDRESS,
} from "./constants.js";

// ✅ 这是一个自定义 Hook，尽管文件名是 setWeb3，但它遵循 useXXX 的规则
const useSetWeb3 = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [web3, setWeb3Instance] = useState(null);
  const [adminContract, setAdminContract] = useState(null);
  const [trackingContract, setTrackingContract] = useState(null);
  const [error, setError] = useState(null);

  const initializeWeb3 = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "Please install MetaMask to initialize web3. [setWeb3.js]"
        );
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3Instance = new Web3(window.ethereum);
      setWeb3Instance(web3Instance);

      const adminC = new web3Instance.eth.Contract(
        adminAbi,
        ADMIN_CONTRACT_ADDRESS
      );
      setAdminContract(adminC);

      const trackingC = new web3Instance.eth.Contract(
        trackingAbi,
        TRACKING_CONTRACT_ADDRESS
      );
      setTrackingContract(trackingC);

      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error("Failed to initialize Web3 [setWeb3.js]:", err);
      setError(err.message);
      setIsInitialized(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      initializeWeb3();
    }
  }, [isInitialized, initializeWeb3]);

  const setUser = useCallback(
    async (username, role) => {
      if (!isInitialized) await initializeWeb3();
      if (!web3 || !adminContract) {
        throw new Error("Web3 or contract not initialized. [setWeb3.js]");
      }

      const accounts = await web3.eth.getAccounts();
      if (!accounts?.length) {
        throw new Error(
          "No account found. Please connect your wallet. [setWeb3.js]"
        );
      }

      try {
        const result = await adminContract.methods
          .setUser(username, role)
          .send({
            from: accounts[0],
            gas: 200000,
          });

        console.log("User registered successfully [setWeb3.js]:", result);
        return result;
      } catch (err) {
        console.error("Error registering user [setWeb3.js]:", err);
        throw err;
      }
    },
    [web3, adminContract, isInitialized, initializeWeb3]
  );

  const setProduct = useCallback(
    async (productName) => {
      if (!isInitialized) await initializeWeb3();
      if (!web3 || !adminContract) {
        throw new Error("Web3 or contract not initialized. [setWeb3.js]");
      }

      const accounts = await web3.eth.getAccounts();
      if (!accounts?.length) {
        throw new Error(
          "No account found. Please connect your wallet. [setWeb3.js]"
        );
      }

      try {
        const result = await adminContract.methods
          .setProduct(productName)
          .send({
            from: accounts[0],
            gas: 200000,
          });

        console.log("Product registered successfully [setWeb3.js]:", result);
        return result;
      } catch (err) {
        console.error("Error registering product [setWeb3.js]:", err);
        throw err;
      }
    },
    [web3, adminContract, isInitialized, initializeWeb3]
  );

  const addStop = useCallback(
    async (timestamp, upi, status, latitude, longitude) => {
      if (!isInitialized) await initializeWeb3();
      if (!web3 || !trackingContract) {
        throw new Error("Web3 or contract not initialized. [setWeb3.js]");
      }

      const accounts = await web3.eth.getAccounts();
      if (!accounts?.length) {
        throw new Error(
          "No account found. Please connect your wallet. [setWeb3.js]"
        );
      }

      const formattedLatitude = Math.round(latitude * 1e6);
      const formattedLongitude = Math.round(longitude * 1e6);

      try {
        const result = await trackingContract.methods
          .addStop(
            timestamp,
            upi,
            status,
            formattedLatitude,
            formattedLongitude
          )
          .send({ from: accounts[0], gas: 200000 });

        console.log("Stop added successfully [setWeb3.js]:", result);
        return result;
      } catch (err) {
        console.error("Error adding stop [setWeb3.js]:", err);
        throw err;
      }
    },
    [web3, trackingContract, isInitialized, initializeWeb3]
  );

  return {
    web3,
    isInitialized,
    error,
    setUser,
    setProduct,
    addStop,
    initializeWeb3,
  };
};

export default useSetWeb3;
