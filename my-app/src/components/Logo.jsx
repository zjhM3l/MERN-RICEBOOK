import { Box, Typography, Button, useTheme } from "@mui/material";
import React from "react";

export const Logo = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      flex={2}
      position="relative"
      width="100%"
      // height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Button
            sx={{
              background: isDarkMode ? "#90CAF9" : "#1976D2",
              color: isDarkMode ? "black" : "white",
              fontWeight: "bold",
              textTransform: "none",
              padding: "3px 5px",
              borderRadius: "5px",
              mr: 0.5,
              fontSize: "1.9rem", // 设置字体大小
            }}
          >
            JZ's RICE
          </Button>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontSize: "1.9rem", // 设置字体大小
            }}
          >
            BOOK
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            textAlign: "left",
          }}
        >
          Welcome to RICE BOOK Blog, the best platform to share and discover
          amazing content.
        </Typography>
      </Box>
    </Box>
  );
};
