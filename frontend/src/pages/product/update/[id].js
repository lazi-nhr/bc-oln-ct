"use client";

import React, { useState, useEffect } from "react";
import AppBar from "../../../components/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  Layout,
  PageWrapper,
  MainContent,
  ColumnSection,
  Title,
  RegisterContainer,
} from "../../../components/Layout";
import { ethers } from "ethers";
import { PRODUCT_STATUS, NUMERIC_STATUS } from "../../../data/dummyProducts";
import AdminAbi from "../../../contracts/adminAbi.json";
import TrackAbi from "../../../contracts/trackingAbi.json";
import {
  ADMIN_CONTRACT_ADDRESS,
  TRACKING_CONTRACT_ADDRESS,
} from "../../../hooks/constants";

const formatUPI = (upi) => `#${upi}`;

const ProductUpdate = ({ productId }) => {
  const [status, setStatus] = useState("");
  const [product, setProduct] = useState(null); // To store product fetched from blockchain
  const [stops, setStops] = useState([]); // To store stops related to the product

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdate = async () => {
    try {
      // Connect to MetaMask
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Connect to the Track contract
      const trackContract = new ethers.Contract(
        TRACKING_CONTRACT_ADDRESS, // Address of Track contract
        TrackAbi, // ABI for Track contract
        signer
      );

      // Adding a stop for the product with updated status (simulate the current time and location)
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      const latitude = 40712776; // Example latitude
      const longitude = -74005974; // Example longitude

      const tx = await trackContract.addStop(
        currentTime,
        productId,
        status,
        latitude,
        longitude
      );
      await tx.wait(); // Wait for transaction to be mined

      alert("Product status and tracking updated successfully!");
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Failed to update product status.");
    }
  };

  const fetchProduct = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const adminContract = new ethers.Contract(
        ADMIN_CONTRACT_ADDRESS,
        AdminAbi,
        signer
      );

      const productData = await adminContract.getProduct(productId);
      setProduct({
        name: productData.name,
        upi: productData.upi.toString(),
        status: productData.status.toString(),
      });

      setStatus(productData.status.toString());

      // Fetch the stops for this product from the Track contract
      const trackContract = new ethers.Contract(
        TRACKING_CONTRACT_ADDRESS,
        TrackAbi,
        signer
      );

      const productStops = await trackContract.getStops(productId);
      setStops(productStops); // Set the stops array with the retrieved stops
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to fetch product data.");
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (!product) {
    // Return constant dummy data for testing
    return (
      <Layout>
        <AppBar />
        <PageWrapper>
          <Container maxWidth="1200px">
            <MainContent>
              <ColumnSection>
                <Title variant="h2">Update Status</Title>
                <div
                  style={{
                    color: "white",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  UPI: 420
                  <br />
                  Product Name: Banana
                  <br />
                  Status: {PRODUCT_STATUS.NEW}
                </div>
                <div
                  style={{
                    color: "white",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <h3>Tracking Information</h3>
                  <p>No tracking information available.</p>
                </div>
                <RegisterContainer>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="status-selector-label">Status</InputLabel>
                    <Select
                      labelId="status-selector-label"
                      id="status-selector"
                      value={status}
                      label="Status"
                      onChange={handleSelect}
                    >
                      {Object.entries(PRODUCT_STATUS).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    sx={{
                      gap: 1,
                      padding: "8px 24px",
                      textTransform: "none",
                      fontSize: "1rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Update
                  </Button>
                </RegisterContainer>
              </ColumnSection>
            </MainContent>
          </Container>
        </PageWrapper>
      </Layout>
    );
  }

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <ColumnSection>
              <Title variant="h2">Update Status</Title>
              <div
                style={{
                  color: "white",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                UPI: {formatUPI(product.upi)}
                <br />
                Product Name: {product.name}
                <br />
                Status:{" "}
                {PRODUCT_STATUS[NUMERIC_STATUS[product.status]] || "Unknown"}
              </div>
              <div
                style={{
                  color: "white",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <h3>Tracking Information</h3>
                {stops.length > 0 ? (
                  stops.map((stop, index) => (
                    <div key={index}>
                      <p>{`Time: ${new Date(
                        stop.time * 1000
                      ).toLocaleString()} - Latitude: ${
                        stop.latitude
                      }, Longitude: ${stop.longitude} - Status: ${
                        PRODUCT_STATUS[NUMERIC_STATUS[stop.status]] || "Unknown"
                      }`}</p>
                    </div>
                  ))
                ) : (
                  <p>No tracking information available.</p>
                )}
              </div>
              <RegisterContainer>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel id="status-selector-label">Status</InputLabel>
                  <Select
                    labelId="status-selector-label"
                    id="status-selector"
                    value={status}
                    label="Status"
                    onChange={handleSelect}
                  >
                    {Object.entries(PRODUCT_STATUS).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{
                    gap: 1,
                    padding: "8px 24px",
                    textTransform: "none",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Update
                </Button>
              </RegisterContainer>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default ProductUpdate;
