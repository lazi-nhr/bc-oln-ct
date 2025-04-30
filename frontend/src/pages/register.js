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

export const Register = () => {
  const [role, setRole] = useState('');

  const handleSelect = (event) => {
    setRole(event.target.value);
  };

  const handleRegister = (value) => {
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
              <Title variant="h2">Please register to continue</Title>
              <RegisterContainer>
                <TextField
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel id="role-selector">Role</InputLabel>
                  <Select
                    labelId="role-selector-label"
                    id="role-selector"
                    value={role}
                    label="Role"
                    onChange={handleSelect}
                  >
                    <MenuItem value={10}>Producer</MenuItem>
                    <MenuItem value={20}>Shipper</MenuItem>
                    <MenuItem value={30}>Seller</MenuItem>
                    <MenuItem value={40}>Buyer</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  sx={{
                    gap: 1,
                    padding: '8px 24px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Register
                </Button>
              </RegisterContainer>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Register;
