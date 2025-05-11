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
import useSetWeb3 from "../../hooks/setWeb3.js";
import { useRouter } from "next/router";

export const ProductCreation = () => {
  const router = useRouter();
  const [productName, setProductName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const { setProduct } = useSetWeb3();

  const handleCreate = async () => {
    if (!productName) {
      console.error("Product name is missing.");
      return;
    }

    // Call the setProduct function to register the product
    try {
      const upi = await setProduct(productName);
      router.push(`/product/${upi}`);
    } catch (error) {
      alert(`Error creating product: ${error.message}`);
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
