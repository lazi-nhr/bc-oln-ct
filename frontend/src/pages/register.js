"use client";

import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  Layout,
  PageWrapper,
  MainContent,
  ColumnSection,
  Title,
  RegisterContainer,
} from "../components/Layout";
import { ethers } from "ethers";
import AdminAbi from "../contracts/adminAbi.json";
import { ADMIN_CONTRACT_ADDRESS } from "../hooks/constants.js";

export const Register = () => {
  const [role, setRole] = useState(""); // For storing the role
  const [username, setUsername] = useState(""); // For storing the username

  const roleOptions = [
    { value: 1, label: "Producer" },
    { value: 2, label: "Retailer" },
    { value: 3, label: "Shipper" },
    { value: 4, label: "Customer" },
  ];

  // Handle the role selection change
  const handleSelect = (event) => {
    setRole(event.target.value);
  };

  // Handle the registration logic
  const handleRegister = async () => {
    if (!username || !role) {
      alert("Please enter a username and select a role.");
      return;
    }

    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert("Please install MetaMask to register.");
      return;
    }

    try {
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Initialize the provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create the contract instance
      const adminContract = new ethers.Contract(
        ADMIN_CONTRACT_ADDRESS,
        AdminAbi,
        signer
      );

      // Call the contract function to register the user
      const tx = await adminContract.setUser(username, role);
      await tx.wait(); // Wait for the transaction to be mined

      // Success message
      alert("Registration successful!");
    } catch (error) {
      // Error handling
      console.error("Registration failed:", error);
      alert("Registration failed: " + (error.data?.message || error.message));
    }
  };

  return (
    <Layout>
      <AppBar />
      <PageWrapper>
        <Container maxWidth="1200px">
          <MainContent>
            <ColumnSection>
              <Title variant="h2">Please register to continue</Title>
              <RegisterContainer>
                <TextField
                  id="outlined-basic"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="role-selector-label">Role</InputLabel>
                  <Select
                    labelId="role-selector-label"
                    id="role-selector"
                    value={role}
                    label="Role"
                    onChange={handleSelect}
                  >
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  sx={{
                    gap: 1,
                    padding: "8px 24px",
                    textTransform: "none",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  Register
                </Button>
              </RegisterContainer>
            </ColumnSection>
          </MainContent>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Register;
