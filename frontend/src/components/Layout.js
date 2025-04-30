import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export const Layout = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  });
  
export const PageWrapper = styled(Box)({
    position: 'absolute',
    top: '70px',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  
export const MainContent = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '40px',
    height: '100%',
  });
  
export const ColumnSection = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  });
  
export const SearchContainer = styled(Box)({
    display: 'flex',
    gap: '16px',
    width: '100%',
    alignItems: 'center',
    marginBottom: '24px',
  });
  
export const ProductsContainer = styled(Paper)({
    width: '100%',
    maxHeight: '150px',
    overflow: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '16px',
    borderRadius: '8px',
  });
  
export const ProductCard = styled(Card)({
    marginBottom: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
    },
    '& .MuiCardContent-root': {
      padding: '8px 16px',
      '&:last-child': {
        paddingBottom: '8px',
      }
    }
  });
  
export const Title = styled(Typography)({
    fontSize: '1.5rem',
    color: 'white',
    marginBottom: '16px',
    textAlign: 'center',
  });
  
export const Separator = styled(Box)({
    width: 1,
    backgroundColor: '#ffffff80',
    alignSelf: 'stretch',
    height: 200,
    margin: '0 20px',
  });

export const RegisterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  alignItems: 'stretch',
});
  