import React, { useState, useEffect, useContext } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import io, { Socket } from "socket.io-client";
import { Context } from "../../../App";
import { API_URL } from "../../../constants";
import { message, room } from "../../../types";
import ChatTextField from "../chatTextField/intex";
import MessageBubble from "../messageBuble";

const MessagingZone = () => {
  const store = useContext(Context);
  const [socket, setSocket] = useState<Socket>();
  const [room, setRoom] = useState<room>();
  const messageListener = (message: message) => {
    setMessageHistory([...messageHistory, message]);
  };
  const [messageHistory, setMessageHistory] = useState<message[]>([]);
  const handleSendMessage = (text: string) => {
    const message = {
      userId: store.state.userId,
      text: text,
      roomId: store.state.currentRoomId,
    };
    socket?.emit("message", message);
  };

  const fetchRoom = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(
        `${API_URL}/room/getById/${store.state.currentRoomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message);
      }
      setRoom(data);
    } catch (error: any) {
      store.displayError(error.message);
    } finally {
      store.setIsLoading(false);
    }
  };
  useEffect(() => {
    if (store.state.userId !== "" && store.state.currentRoomId !== "") {
      fetchRoom();
    }
  }, [store.state.userId, store.state.currentRoomId]);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        padding: "0 2%",
        height: "100%",
        flexBox: "1",
        backgroundColor: "secondary.main",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "85%",
          overflowY: "scroll",
        }}
      >
        {messageHistory.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isMine={message.userId === store.state.userId}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "15%",
        }}
      >
        <ChatTextField onSend={handleSendMessage} />
      </Box>
    </Box>
  );
};

export default MessagingZone;
