import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import io, { Socket } from "socket.io-client";

const HomePage = () => {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [user, setUser] = useState<string>("Stranger");
  const handleSendMessage = (value: any) => {
    socket?.emit("message", value);
  };
  const messageListener = (message: string) => {
    setMessageHistory([...messageHistory, message]);
  };

  useEffect(() => {
    const socket = io("http://localhost:8001");
    setSocket(socket);
  }, [setSocket]);
  useEffect(() => {
    socket?.on("message", messageListener);
    return () => {
      socket?.off("message", messageListener);
    };
  }, [socket, messageHistory]);
  return (
    <Box>
      <Typography variant="h1">Welcome to the Chat App</Typography>
      <Typography variant="h2">Hello {user}</Typography>
      <Box>
        <Typography variant="h3">Message History</Typography>
        {messageHistory.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
      </Box>
      <Box>
        <Typography variant="h3">Send a Message</Typography>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            handleSendMessage(message);
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
