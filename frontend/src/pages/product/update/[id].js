import React, { useState } from "react";
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
  dummyProducts,
  PRODUCT_STATUS,
  formatUPI,
  getStatusColor,
} from "../../../data/dummyProducts.js";

// this is a dummy product. please implement the logic to get the product from the blockchain
const product = { name: "Product 1", upi: "420", status: "New" };

export const ProductUpdate = () => {
  const [status, setStatus] = useState("");

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdate = (value) => {
    console.log("Searching for:", value);
    // Add your search logic here
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
