import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '../components/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Search from '../components/Search';
import { Layout, PageWrapper, MainContent, ColumnSection, Title, Separator } from '../components/Layout';
import { getUser } from "../hooks/getWeb3.js";

export const Home = () => {
  const router = useRouter();
  const [ethereumAddress, setEthereumAddress] = useState(null);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // You can now use accounts[0] in your app (e.g., set state)
        setEthereumAddress(accounts[0]);
        // accounts[0] is the user's wallet address
        console.log('Connected account:', ethereumAddress);
        
        // Call the getUser function to check if the user is registered
        const user = await getUser(ethereumAddress);
        console.log('User:', user);

        // Check if the user is registered
        if (user.role === 0) {
          console.log('User is not registered');
          // Direct to register page
          router.push('/register');
        } else {
          console.log('User is registered');
          // Direct to overview page
          router.push('/overview');
        }

      } catch (error) {
        console.error('User rejected the request');
      }
    } else {
      console.error('Please install MetaMask!');
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
