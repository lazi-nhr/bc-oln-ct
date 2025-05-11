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
import { PRODUCT_STATUS, formatUPI } from "../../../hooks/constants.js";

import useSetWeb3 from "../../../hooks/setWeb3.js";
import getWeb3 from "../../../hooks/getWeb3.js";

export const ProductUpdate = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("");
  const [upi, setUpi] = useState(null);

  const { addStop } = useSetWeb3();
  const { getProduct } = getWeb3();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const product = await getProduct(parseInt(id));
        setProduct(product);
        setUpi(product.upi);
      } catch (error) {
        alert(`Failed to fetch product: ${error.message}`);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdate = () => {
    if (!status) {
      alert("Please select a status before updating.");
      return;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    setTimestamp(currentTimestamp);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        try {
          await addStop(currentTimestamp, upi, status, lat, lon);
          alert("Status updated successfully.");
        } catch (error) {
          alert(`Error adding tracking stop: ${error.message}`);
        }
      },
      (error) => {
        alert("Failed to get location: " + error.message);
      }
    );
  };

  if (!product) {
    return (
      <Layout>
        <AppBar />
        <PageWrapper>
          <Container maxWidth="1200px">
            <MainContent>
              <Title variant="h4">Loading product info...</Title>
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
                Status: {product.status}
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
