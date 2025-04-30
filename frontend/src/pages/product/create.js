import React, { useState } from 'react';
import AppBar from '../components/AppBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Layout, PageWrapper, MainContent, ColumnSection, Title, RegisterContainer } from '../components/Layout';

export const ProductCreation = () => {
  const [status, setStatus] = useState('');

  const handleSelect = (event) => {
    setStatus(event.target.value);
  };

  const handleCreate = (value) => {
    console.log('Searching for:', value);
    // Add your search logic here
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
                  id="outlined-basic"
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel id="status-selector">Status</InputLabel>
                  <Select
                    labelId="status-selector-label"
                    id="status-selector"
                    value={status}
                    label="Status"
                    onChange={handleSelect}
                  >
                    <MenuItem value={10}>New</MenuItem>
                    <MenuItem value={20}>Shipped</MenuItem>
                    <MenuItem value={30}>Sold</MenuItem>
                    <MenuItem value={40}>Bought</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  sx={{
                    gap: 1,
                    padding: '8px 24px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
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
