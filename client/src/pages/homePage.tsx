import { useState, useEffect, useContext } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { MenuOpen, Message, AccountCircle } from "@mui/icons-material";
import InfoComponent from "../components/chatMessagingZone/infoComponent";
import { Context } from "../App";
import MessengingZone from "../components/chatMessagingZone/messagingZone";
import RoomBox from "../components/roomBox";
import { extendedRoom, user } from "../types";
import { API_URL } from "../constants";
import SearchBar from "../components/searchField";
import { observer } from "mobx-react-lite";
import UserBox from "../components/usersBox";

const HomePage = observer(() => {
  const store = useContext(Context);
  const [isRoomsPanelOpen, setIsRoomsPanelOpen] = useState<boolean>(true);
  const [rooms, setRooms] = useState<extendedRoom[]>([]);
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
  const [searchResults, setSearchResults] = useState<user[]>([]);
  const fetchUsers = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(
        `${API_URL}/user/searchByNickname/${store.state.searchText}`,
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
      setSearchResults(data);
    } catch (error: any) {
      store.displayError(error.message);
    } finally {
      store.setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      store.state.searchText !== "" &&
      store.state.searchText.length > 2 &&
      store.state.isSearching
    ) {
      fetchUsers();
    }
  }, [store.state.searchText, store.state.isSearching]);

  useEffect(() => {
    if (store.state.userId !== "") {
      fetchRooms();
    }
  }, [store.state.userId, store.state.currentRoomId]);
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
          boxSizing: "border-box",
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
            boxSizing: "border-box",
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
              !store.state.isSearching &&
              rooms.map(
                (room) =>
                  room && (
                    <RoomBox
                      key={room.id}
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
            {searchResults.length > 0 &&
              store.state.isSearching &&
              searchResults.map(
                (user) =>
                  user && (
                    <UserBox
                      key={user.id}
                      userId={user.id}
                      name={user.nickname}
                      avatar={user.avatar}
                    />
                  )
              )}

            <Divider sx={{ width: "100%" }} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: isRoomsPanelOpen ? "68%" : "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {store.state.currentRoomId === "" ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid grey",
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
                resize: "none",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem" }}>
                Select a room to start chatting
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid grey",
                boxSizing: "border-box",
                resize: "none",
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
                  boxSizing: "border-box",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                  }}
                >
                  <InfoComponent userId={store.state.userId} />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "88.3%",
                }}
              >
                <MessengingZone />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default HomePage;
