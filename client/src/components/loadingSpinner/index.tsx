import React from "react";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
const LoadingSpinner = observer(() => {
  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "50px",
        height: "50px",
        right: "5%",
        bottom: "5%",
        borderRadius: "10px",
        zIndex: 15600,
      }}
    >
      <span className="loader-spinner"></span>
    </Box>
  );
});

export default LoadingSpinner;
