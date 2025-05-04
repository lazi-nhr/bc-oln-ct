"use client";

import React, { useState } from "react";
import AppBar from "../../components/AppBar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
} from "../../components/Layout";
import { PRODUCT_STATUS, normalizeStatus } from "../../data/dummyProducts";

import AdminAbi from "../../contracts/adminAbi.json";
import { ethers } from "ethers";
import { ADMIN_CONTRACT_ADDRESS } from "../../hooks/constants.js";

export const ProductCreation = () => {
  const [status, setStatus] = useState("");
  const [productName, setProductName] = useState("");

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleCreate = async () => {
    try {
      // Connect to Ethereum network
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Connect to the Admin contract
      const adminContract = new ethers.Contract(
        ADMIN_CONTRACT_ADDRESS,
        AdminAbi,
        signer
      );

      // Call the setProduct function on the smart contract
      const tx = await adminContract.setProduct(productName);
      await tx.wait(); // Wait for transaction to be mined

      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product.");
    }
  };

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <ColumnSection>
              <Title variant="h2">Create a new product</Title>
              <RegisterContainer>
                <TextField
                  id="product-name"
                  label="Product Name"
                  variant="outlined"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
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
                  onClick={handleCreate}
                  sx={{
                    gap: 1,
                    padding: "8px 24px",
                    textTransform: "none",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Create
                </Button>
              </RegisterContainer>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default ProductCreation;
