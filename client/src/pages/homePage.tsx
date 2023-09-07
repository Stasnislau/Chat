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
  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleSendMessage(message);
  };
  return <Box>Hello world</Box>;
};

export default HomePage;
