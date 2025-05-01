import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Search from '../components/Search';
import { Layout, PageWrapper, MainContent, ColumnSection, ProductsContainer, ProductCard, Title, Separator } from '../components/Layout';
import { formatUPI, getStatusColor, getStatusString } from '../data/dummyProducts';
import getWeb3 from '../hooks/getWeb3';
import useWeb3 from '../hooks/useWeb3';
import { useRouter } from 'next/router';

export const Overview = () => {
  const router = useRouter();
  const { getProducts, getProduct, isInitialized } = getWeb3();
  const { account } = useWeb3();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleProductClick = (product) => {
    router.push(`/product/${product.upi}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (!account) {
        setError('Please connect your wallet to view your products.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // First get all product UPIs for the user
        const productUPIs = await getProducts(account);
        
        // Then fetch detailed information for each product
        const productDetailsPromises = productUPIs.map(async (upi) => {
          try {
            const { product, trackingHistory } = await getProduct(upi);
            
            // Get the last status from tracking history
            let status = 'New'; // Default status
            if (trackingHistory && Array.isArray(trackingHistory) && trackingHistory.length > 0) {
              const lastTrackingEntry = trackingHistory[trackingHistory.length - 1];
              
              // Convert BigInt to Number for status
              const numericStatus = typeof lastTrackingEntry.status === 'bigint' 
                ? Number(lastTrackingEntry.status)
                : lastTrackingEntry.status;
            
              status = getStatusString(numericStatus);
            }

            return {
              ...product,
              upi,
              trackingHistory,
              status
            };
          } catch (error) {
            console.error(`Failed to fetch details for product ${upi}:`, error);
            return {
              upi,
              name: 'Failed to load',
              status: 'error',
              error: true
            };
          }
        });

        const productDetails = await Promise.all(productDetailsPromises);
        setProducts(productDetails);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        if (error.message.includes('Invalid user address')) {
          setError('Invalid wallet address. Please make sure your wallet is properly connected.');
        } else {
          setError('Failed to fetch products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isInitialized) {
      fetchProducts();
    }
  }, [isInitialized, getProducts, getProduct, account]);

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <Search />

            <Separator />

            <ColumnSection>
              <Title variant="h2">Your Products</Title>
              {error && (
                <Typography color="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Typography>
              )}
              {loading ? (
                <Typography>Loading your products...</Typography>
              ) : (
                <ProductsContainer>
                  {products.map((product, index) => {
                    return (
                      <ProductCard 
                        key={`product-${product.upi || index}`}
                        onClick={() => handleProductClick(product)}
                        variant="outlined"
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" component="div" color="white">
                            {formatUPI(product.upi || index)}: {product.name || 'Unnamed Product'}
                          </Typography>
                          <Typography 
                            sx={{ 
                              ml: 'auto',
                              color: getStatusColor(product.status),
                              fontSize: '0.875rem',
                              backgroundColor: 'rgba(0, 0, 0, 0.2)',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            {product.status || 'Unknown Status'}
                          </Typography>
                        </CardContent>
                      </ProductCard>
                    );
                  })}
                </ProductsContainer>
              )}
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Overview;
