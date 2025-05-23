import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '../../components/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { Layout, PageWrapper, MainContent, ColumnSection, Title, Separator, RegisterContainer } from '../../components/Layout';
import { formatUPI, getStatusColor, getStatusString, truncateAddress } from '../../hooks/constants.js';
import getWeb3 from '../../hooks/getWeb3';
import Loading from '../../components/Loading';

const ScrollableContainer = styled('div')(({ theme }) => ({
  color: 'white',
  position: 'relative',
  paddingLeft: '10px',
  paddingRight: '10px',
  height: '200px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#ffffff40',
    borderRadius: '4px',
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#ffffff40 transparent',
}));

// Product Details Page
export const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getProduct } = getWeb3();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Wait for id to be available
      
      try {
        const data = await getProduct(parseInt(id));
        setProductData(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    fetchProduct();
  }, [getProduct, id]);

  const handleClick = () => {
    router.push(`/product/update/${id}`);
  };

  if (!id || !productData) {
    return (
      <Layout>
        <AppBar />
        <Loading />
      </Layout>
    );
  }

  const { product, trackingHistory } = productData;

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <ColumnSection>
              <Title variant="h2">Product Details</Title>
              <div style={{ color: 'white', marginBottom: '16px', textAlign: 'center' }}>
                UPI: {formatUPI(product.upi)}<br />
                Product Name: {product.name}<br />
                Status: {trackingHistory.length > 0 
                  ? getStatusString(Number(trackingHistory[trackingHistory.length - 1].status))
                  : 'Unknown'}
              </div>
              <RegisterContainer>
                <Button
                  variant="contained"
                  onClick={handleClick}
                  sx={{
                    gap: 1,
                    padding: '8px 24px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Update Product
                </Button>
              </RegisterContainer>
            </ColumnSection>

            <Separator />

            <ColumnSection>
              <Title variant="h2">Tracking History</Title>
              <ScrollableContainer>
                {trackingHistory.slice().reverse().map((stop, index) => {
                  const statusString = getStatusString(Number(stop.status));
                  const date = new Date(Number(stop.time) * 1000);
                  const formattedDate = date.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                  const coordinates = `${Number(stop.latitude) / 1000000}°, ${Number(stop.longitude) / 1000000}°`;
                  
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        position: 'relative', 
                        marginBottom: index < trackingHistory.length - 1 ? '24px' : 0,
                        paddingBottom: '12px'
                      }}
                    >
                      <div>
                        <strong style={{ color: getStatusColor(statusString) }}>
                          {statusString.toUpperCase()} 
                        </strong>
                        {' '}
                        <span style={{ fontSize: '0.9em', color: '#888' }}>
                          ({formattedDate})
                        </span>
                        <br />
                        <i>Location: {coordinates}</i>
                        <br />
                        <span style={{ fontSize: '0.9em', color: '#888' }}>
                          {truncateAddress(stop.user)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </ScrollableContainer>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default ProductDetails; 