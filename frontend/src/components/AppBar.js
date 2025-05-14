import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import useWeb3 from '../hooks/useWeb3';
import { truncateAddress } from '../hooks/constants';

const pagesInitialized = ['Overview', 'Register', 'product/create', 'product/1', 'product/update/1'];
const pagesNotInitialized = ['Overview', 'Register', 'product/create', 'product/1', 'product/update/1'];

function ResponsiveAppBar() {
    const { account } = useWeb3();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const isConnected = account !== null;
    
    const pagesArray = isConnected ? pagesInitialized : pagesNotInitialized;

    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 2,
                            minWidth: { xs: '120px', md: '160px' }
                        }}
                    >
                        <Link href="/" style={{ cursor: 'pointer' }}>
                            <img
                                src="/logo.png" 
                                alt="logo"
                                style={{
                                    height: '32px',
                                    width: 'auto',
                                    display: 'block'
                                }}
                            />
                        </Link>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                        >
                        <MenuIcon sx={{ color: "white"}} />
                        </IconButton>
                        <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' }
                        }}
                        >
                        {pagesArray.map((page) => (
                            <Link key={page} href={`/${page.toLowerCase()}`} passHref>
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" sx={{color: 'black', textDecoration: 'none' }}>   
                                    {page}
                                </Typography>
                                </MenuItem>
                            </Link>
                        ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pagesArray.map((page) => (
                            <Link key={page} href={`/${page.toLowerCase()}`} passHref>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                            </Link>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton sx={{ p: 0 }}>
                            <Typography sx={{ color: 'white' }}>{truncateAddress(account)}</Typography>
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;