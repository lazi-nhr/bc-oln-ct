import React, { use, useState } from "react";
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
import {
  PRODUCT_STATUS,
  formatUPI,
  getStatusColor,
} from "../../../hooks/constants.js";

import { addStop } from "../../../hooks/useSetWeb3.js";
import { getProduct } from "../../../hooks/getWeb3.js";

export const ProductUpdate = () => {
  const [status, setStatus] = useState("");
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  // Get product information from the blockchain
  useEffect(() => {
    // Fetch product information from the blockchain
    // For now, we are using a dummy product
    const fetchProduct = async () => {
      try {
        // Try to get the product from the blockchain using the [id] in the URL
        const product = await getProduct(parseInt(id));
        setProduct(product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdate = (value) => {
    if (!status) {
      console.error("Status is missing.");
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
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setLatitude(latitude);
      setLongitude(longitude);
    });

    // Call the setProduct function to register the product
    try {
      addStop(timestamp, upi, status, latitude, longitude);
    } catch (error) {
      console.error("Error adding tracking stop:", error);
    }
  };

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
