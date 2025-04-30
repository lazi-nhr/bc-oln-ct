import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '../components/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Search from '../components/Search';
import { Layout, PageWrapper, MainContent, ColumnSection, SearchContainer, ProductsContainer, ProductCard, Title, Separator } from '../components/Layout';

export const Home = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState(null);

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/product/${searchValue}`);
    }
  };

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // You can now use accounts[0] in your app (e.g., set state)
        setEthereumAddress(accounts[0]);
        // accounts[0] is the user's wallet address
        console.log('Connected account:', ethereumAddress);
        // direct to overview page
        navigate('/overview');

      } catch (error) {
        console.error('User rejected the request');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <Search />

            <Separator />

            <ColumnSection>
              <Title variant="h2">Access Management</Title>
              <Button
                variant="contained"
                onClick={handleConnect}
                startIcon={
                  <img
                    src="/metamask.svg"
                    alt="MetaMask"
                    style={{ width: '24px', height: '24px' }}
                  />
                }
                sx={{
                  gap: 1,
                  padding: '8px 24px',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                Connect
              </Button>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Home;
