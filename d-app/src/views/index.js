import React from 'react';
import AppBar from '../components/AppBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Layout = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
});

const PageWrapper = styled(Box)({
  position: 'absolute',
  top: '70px',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const MainContent = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',
});

const Section = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  width: '100%',
});

const SearchContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  width: '100%',
  alignItems: 'center',
});

const Title = styled(Typography)({
  fontSize: '1.5rem',
  color: 'white',
  marginBottom: '16px',
  textAlign: 'center',
});

const Separator = styled(Box)({
  width: 1,
  backgroundColor: '#ffffff80',
  alignSelf: 'stretch',
  height: 200,
  margin: '0 20px',
});

export const Home = () => {
  const handleSearch = (value) => {
    console.log('Searching for:', value);
    // Add your search logic here
  };

  const handleConnect = () => {
    console.log('Connecting wallet...');
    // Add your connect logic here
  };

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <Section>
              <Title variant="h2">Search for Product</Title>
              <SearchContainer>
                <TextField
                  id="outlined-basic"
                  label="Unique Product Identifier"
                  variant="outlined"
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    gap: 1,
                    padding: '8px 24px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Search
                </Button>
              </SearchContainer>
            </Section>

            <Separator />

            <Section>
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
            </Section>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Home;
