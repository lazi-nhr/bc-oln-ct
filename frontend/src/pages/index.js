import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '../components/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Search from '../components/Search';
import { Layout, PageWrapper, MainContent, ColumnSection, Title, Separator } from '../components/Layout';
import getWeb3 from "../hooks/getWeb3.js";
import Loading from '../components/Loading';

export const Home = () => {
  const router = useRouter();
  const { getUser } = getWeb3();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        // Set loading state to true
        setLoading(true);

        // Request account access if needed
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Call the getUser function to check if the user is registered
        const user = await getUser(accounts[0]);
        console.log('Username:', user.username);
        console.log('Role:', user.role);

        // Check if the user is registered
        if (Number(user.role) === 0) {
          console.log('User is not registered');
          // Direct to register page
          router.push('/register');
        } else {
          console.log('User is registered');
          // Direct to overview page
          router.push('/overview');
        }

      } catch (error) {
        console.error('User rejected the request:', error);
      } finally {
        // Set loading state to false
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask on a compatible browser (Google Chrome or Mozilla Firefox).');
    }
  };

  if (loading) {
    return (
      <Layout>
        <AppBar />
        <Loading />
      </Layout>
    );
  }

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
