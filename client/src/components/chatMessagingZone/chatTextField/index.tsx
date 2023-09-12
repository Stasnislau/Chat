import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import { Send, Mic } from "@mui/icons-material";

interface ChatTextFieldProps {
  onSend: (message: string) => void;
}

const ChatTextField = ({ onSend }: ChatTextFieldProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "0 5%px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <TextField
        fullWidth
        multiline
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSend}>
                <Send />
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <Mic />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatTextField;
