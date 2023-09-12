import React, { useState, useEffect, useContext } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import io, { Socket } from "socket.io-client";
import { MenuOpen, Message, AccountCircle } from "@mui/icons-material";
import InfoComponent from "../components/chatMessagingZone/infoComponent";
import { Context } from "../App";
import MessengingZone from "../components/chatMessagingZone/messagingZone";
import RoomBox from "../components/roomBox";
import { extendedRoom } from "../types";
import { API_URL } from "../constants";
import SearchBar from "../components/searchField";

const HomePage = () => {
  const store = useContext(Context);
  const [socket, setSocket] = useState<Socket>();
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [isRoomsPanelOpen, setIsRoomsPanelOpen] = useState<boolean>(true);
  const [rooms, setRooms] = useState<extendedRoom[]>([]);
  // const
  const handleSendMessage = (value: any) => {
    socket?.emit("message", value);
  };
  const messageListener = (message: string) => {
    setMessageHistory([...messageHistory, message]);
  };
  const fetchRooms = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(
        `${API_URL}/room/getByUserId/${store.state.userId}`,
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
      setRooms(data);
    } catch (error: any) {
      store.displayError(error.message);
    } finally {
      store.setIsLoading(false);
    }
  };
  useEffect(() => {
    if (store.state.userId !== "") {
      fetchRooms();
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
        height: "100%",
        flexBox: "1",
        border: "1px solid white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "8%",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid grey",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <IconButton onClick={() => setIsRoomsPanelOpen(!isRoomsPanelOpen)}>
            <MenuOpen
              sx={{
                height: "100%",
              }}
            />
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <IconButton>
              <Message />
            </IconButton>
            <IconButton>
              <AccountCircle />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "92%",
        }}
      >
        <Box
          sx={{
            flexDirection: "column",
            width: "32%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid grey",
            display: isRoomsPanelOpen ? "flex" : "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "10.5%",
              backgroundColor: "#FFFFFF",
            }}
          >
            <SearchBar onSearch={() => {}} onAdd={() => {}} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "89.5%",
              resize: "vertical",
              overflowY: "scroll",
              boxSizing: "border-box",
            }}
          >
            {rooms.length > 0 &&
              rooms.map(
                (room) =>
                  room && (
                    <RoomBox
                      key={room.id.toString()}
                      roomId={room.id}
                      name={room.name}
                      text={
                        room.messages.length > 0 ? room.messages[0].text : ""
                      }
                      date={
                        room.messages.length > 0
                          ? room.messages[0].dateSent
                          : new Date()
                      }
                      avatar={room.avatar}
                    />
                  )
              )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: isRoomsPanelOpen ? "68%" : "100%",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid grey",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "11.7%",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid grey",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <InfoComponent userId={store.state.userId} />
              </Typography>
            </Box>
            <MessengingZone />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
