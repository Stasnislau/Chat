import { useState, useEffect, useContext, useRef } from "react";
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
import ChatArea from "../components/chatMessagingZone/chatArea";
import UserInfoModal from "../components/Modals/userInfoModal";
import { useTheme } from "@mui/material";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const HomePage = observer(() => {
  const store = useContext(Context);
  const [isRoomsPanelOpen, setIsRoomsPanelOpen] = useState<boolean>(true);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] =
    useState<boolean>(false);
  const [rooms, setRooms] = useState<extendedRoom[]>([]);
  const [user, setUser] = useState<user>();
  const [containerRef] = useAutoAnimate<HTMLDivElement>();
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
  const theme = useTheme();
  useEffect(() => {
    if (store.state.currentRoomId !== "") {
      if (theme.breakpoints.values.mobile > window.innerWidth || theme.breakpoints.values.tablet > window.innerWidth) {
        setIsRoomsPanelOpen(false);
      }
    }
  },
    [store.state.currentRoomId, theme.breakpoints]);


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
            width: isRoomsPanelOpen ? {
              mobile: "100%",
              tablet: "32%",
              laptop: "32%",
              desktop: "32%",
            } : "0%",
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
            ref={containerRef}
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
            display: isRoomsPanelOpen ? {
              mobile: "none",
              tablet: "flex",
              laptop: "flex",
              desktop: "flex",
            } : "flex",
            flexDirection: "column",
            width: "68%",
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
