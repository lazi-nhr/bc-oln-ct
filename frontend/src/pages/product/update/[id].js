import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import { PRODUCT_STATUS, formatUPI, normalizeStatus, getStatusString } from "../../../hooks/constants.js";
import { Loading } from "../../../components/Loading";

import useSetWeb3 from "../../../hooks/setWeb3.js";
import getWeb3 from "../../../hooks/getWeb3.js";

export const ProductUpdate = () => {
  const router = useRouter();
  const { id } = router.query;

  const [productData, setProductData] = useState(null);
  const [status, setStatus] = useState("");

  const { addStop } = useSetWeb3();
  const { getProduct } = getWeb3();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Wait for id to be available
      
      try {
        const data = await getProduct(parseInt(id));
        setProductData(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [getProduct, id]);

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdate = async () => {
    if (!status) {
      console.error("Status is missing.");
      return;
    }

    const normalizedStatus = normalizeStatus(status);

    try {

      // Activate loading component
      setLoading(true);

      // Wait for the stop to be added
      const result = await addStop(id, normalizedStatus);
  
      // Log the result to ensure it was successful
      console.log("Stop added successfully:", result);

      // Redirect to the product page
      router.push(`/product/${id}`);
    } catch (error) {
      alert(`Error adding tracking stop: ${error.message}`);
    }
  };

  if (!productData || loading) {
    return (
      <Layout>
        <AppBar />
        <PageWrapper>
          <Container maxWidth="1200px">
            <MainContent>
              <Title variant="h4">Loading...</Title>
            </MainContent>
          </Container>
        </PageWrapper>
      </Layout>
    );
  }

  const { product, trackingHistory } = productData;

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
                Status: {trackingHistory.length > 0 
                  ? getStatusString(Number(trackingHistory[trackingHistory.length - 1].status))
                  : 'Unknown'}
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
