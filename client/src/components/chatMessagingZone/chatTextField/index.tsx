import React, { useState, useContext } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  TextareaAutosize,
} from "@mui/material";
import { Send, Mic } from "@mui/icons-material";
import { Context } from "../../../App";

interface ChatTextFieldProps {
  onSend: (text: string, room: string) => void;
}

const ChatTextField = ({ onSend }: ChatTextFieldProps) => {
  const [message, setMessage] = useState("");
  const store = useContext(Context);
  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message, store.state.currentRoomId);
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
        boxSizing: "border-box",
      }}
    >
      <TextField
        fullWidth
        maxRows={4}
        multiline
        value={message}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "primary.main",
          },
        }}
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
