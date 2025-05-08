"use client";

import React, { useState, useEffect } from "react";
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
import { roleOptions } from "../hooks/constants.js";
import { setUser } from "../hooks/setWeb3.js";
import { useRouter } from "next/router";

export const Register = () => {
  const [role, setRole] = useState(""); // For storing the role
  const [username, setUsername] = useState(""); // For storing the username
  const router = useRouter();

  // Handle the role selection change
  const handleSelect = (event) => {
    setRole(event.target.value);
  };

  // Handle the registration logic
  const handleRegister = async () => {
    if (!role || !username) {
      console.error("Role or username is missing.");
      return;
    }
    // Call the setUser
    try {
      result = await setUser(username, role);
      console.log("User registered successfully:", result);
      // Direct to overview page
      router.push(`/overview`);
    }
    catch (error) {
      console.error("Failed to register user:", error);
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
