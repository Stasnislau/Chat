import React from "react";
import { Box } from "@mui/material";
const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        right: "5%",
        bottom: "5%",
        borderRadius: "10px",
        zIndex: 15600,
      }}
    >
      <span className="spinner-loader"></span>
    </Box>
  );
};

export default LoadingSpinner;
