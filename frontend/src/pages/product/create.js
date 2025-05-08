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
import { PRODUCT_STATUS, normalizeStatus } from "../../hooks/constants.js";
import { setProduct, addStop } from "../../hooks/setWeb3.js";

export const ProductCreation = () => {
  const [status, setStatus] = useState("");
  const [productName, setProductName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleCreate = async () => {
    if (!productName || !status) {
      console.error("Product name or status is missing.");
      return;
    }

    // Get current timestamp/date
    const currentTimestamp = Math.floor(Date.now() / 1000);
    setTimestamp(currentTimestamp);

    // Get current coordinates
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatitude(latitude);
        setLongitude(longitude);
      }
    );

    // Call the setProduct function to register the product
    try {
      const upi = await setProduct(productName);
      addStop(timestamp, upi, status, latitude, longitude);
    }
    catch (error) {
      console.error("Error creating product:", error);
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
