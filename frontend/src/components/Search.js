import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ColumnSection, SearchContainer, Title } from '../components/Layout';

export const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      router.push(`/product/${searchValue}`);
    }
  };

  return (
    <ColumnSection>
        <Title variant="h2">Search for Product</Title>
        <SearchContainer>
        <TextField
            id="outlined-basic"
            label="Unique Product Identifier"
            variant="outlined"
            fullWidth
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
            }}
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
    </ColumnSection>
  );
};

export default Search;
