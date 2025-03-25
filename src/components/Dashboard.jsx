import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom"; 
import Header from "./Header";

function Dashboard() {
  const navigate = useNavigate();


  const handleCreateNewFacility = () => {
    navigate("/facilities/create"); 
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Facilities
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateNewFacility}
            >
              Create New Facility
            </Button>
          </Box>

          <Outlet />
        </Container>
      </Box>

      {/* Footer*/}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="body1">
          Solar Facility Monitoring System 
        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;