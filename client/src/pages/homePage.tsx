import { useState, useEffect, useContext } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import { Context } from "../App";
import RoomBox from "../components/roomBox";
import { extendedRoom, user } from "../types";
import { API_URL } from "../constants";
import SearchField from "../components/searchField";
import { observer } from "mobx-react-lite";
import UserBox from "../components/usersBox";
import ChatArea from "../components/chatMessagingZone/chatArea";
import UserInfoModal from "../components/Modals/userInfoModal";

const HomePage = observer(() => {
  const store = useContext(Context);
  const [isRoomsPanelOpen, setIsRoomsPanelOpen] = useState<boolean>(true);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] =
    useState<boolean>(false);
  const [rooms, setRooms] = useState<extendedRoom[]>([]);
  const [user, setUser] = useState<user>();
  const fetchUser = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(
        `${API_URL}/user/getById/${store.state.userId}`,
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
      setUser(data);
    } catch (error: any) {
      store.displayError(error.message);
    } finally {
      store.setIsLoading(false);
    }
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
      fetchUser();
    }
  }, [store.state.userId]);
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
    if (store.state.userId !== "") {
      fetchRooms();
    }
  }, [
    store.state.userId,
    store.state.currentRoomId,
    store.state.shouldUpdateRooms,
  ]);

  useEffect(() => {
    if (store.state.shouldUpdateRooms) {
      fetchRooms();
      store.setShouldUpdateRooms(false);
    }
  }, [store.state.shouldUpdateRooms]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              setIsUserInfoModalOpen(true);
            }}
          >
            <Typography>
              {store.state.isLoading ? <Skeleton variant="text" /> : user?.name}
            </Typography>
            {store.state.isLoading ? (
              <Skeleton variant="circular" width={50} height={50} />
            ) : (
              <Avatar src={user?.avatar} />
            )}
            <Box />
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
            position: "relative",
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
            <SearchField />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "89.5%",
              resize: "vertical",
              overflowY: "auto",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {rooms &&
              rooms.length > 0 &&
              rooms
                .sort((a, b) => {
                  if (!a || !a.messages || a.messages.length === 0 || a.messages[0] === null) {
                    return -1;
                  }
                  if (!b || !b.messages || b.messages.length === 0 || b.messages[0] === null) {
                    return 1;
                  }
                  return (
                    new Date(b.messages[0].dateSent).getTime() -
                    new Date(a.messages[0].dateSent).getTime()
                  );
                })
                .map((room) => {
                  if (store.state.searchText !== "" && store.state.searchText.length > 0) {
                    if (
                      !room.name
                        .toLowerCase()
                        .includes(store.state.searchText.toLowerCase())
                    ) {
                      return null;
                    }
                  }
                  return (
                    <Box key={room.id}>
                      <RoomBox
                        roomId={room.id}
                        name={room.name}
                        text={
                          room && room.messages && room.messages.length > 0
                            ? room?.messages[0]?.text
                            : ""
                        }
                        date={
                          room.messages && room.messages.length > 0
                            ? room?.messages[0]?.dateSent
                            : new Date()
                        }
                        avatar={room.avatar}
                        numberOfUnreadMessages={room.numberOfUnreadMessages}
                        audio={room.messages[0]?.audioUrl ? true : false}
                      />
                      <Divider sx={{ width: "100%" }} />
                    </Box>
                  );
                })}

            <Divider sx={{ width: "100%" }} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: isRoomsPanelOpen ? "68%" : "100%",
            flexGrow: 1,
            boxSizing: "border-box",
          }}
        >
          <ChatArea />
        </Box>
      </Box>
      {isUserInfoModalOpen && (
        <UserInfoModal
          isModalOpen={isUserInfoModalOpen}
          setIsModalOpen={setIsUserInfoModalOpen}
        />
      )}
    </Box>
  );
});

export default HomePage;
