import React, { useState, useEffect } from 'react';
import AppBar from '../components/AppBar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Search from '../components/Search';
import { Layout, PageWrapper, MainContent, ColumnSection, ProductsContainer, ProductCard, Title, Separator } from '../components/Layout';
import { formatUPI, getStatusColor } from '../data/dummyProducts';
import getWeb3 from '../hooks/getWeb3';

export const Overview = () => {
  const { getProducts, isInitialized } = getWeb3();
  const [address, setAddress] = useState('0xA5f11536E55f1D77b8033F56C42C5c7aEE1DA9EB');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts(address);
        console.log('products:', products);
        setProducts(products);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isInitialized) {
      fetchProducts();
    }
  }, [isInitialized, getProducts]);

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
              <ProductsContainer>
                {products.map((product) => (
                  <ProductCard 
                    key={product.upi}
                    onClick={() => handleProductClick(product)}
                    variant="outlined"
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" component="div" color="white">
                        {formatUPI(product.upi)}: {product.product_name}
                      </Typography>
                      <Typography 
                        sx={{ 
                          ml: 'auto',
                          color: getStatusColor(product.status),
                          fontSize: '0.875rem'
                        }}
                      >
                        {product.status}
                      </Typography>
                    </CardContent>
                  </ProductCard>
                ))}
              </ProductsContainer>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Overview;
