import { Box, Typography } from "@mui/material";
import { Context } from "../../../App";
import { observer } from "mobx-react-lite";
import { useContext, useState, useEffect } from "react";
import InfoComponent from "../infoComponent";
import MessagingZone from "../messagingZone";
import { API_URL } from "../../../constants";
import { room } from "../../../types";

const ChatArea = observer(() => {
  const store = useContext(Context);
  const [room, setRoom] = useState<room>();
  const [shouldUpdateRoom, setShouldUpdateRoom] = useState<boolean>(false);
  const fetchRoom = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(
        `${API_URL}/room/getById/${store.state.currentRoomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ callingId: store.state.userId }),
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
  }, [store.state.currentRoomId, store.state.userId]);
  useEffect(() => {
    if (shouldUpdateRoom) {
      fetchRoom();
      setShouldUpdateRoom(false);
    }
  }, [shouldUpdateRoom]);
  const [avatars, setAvatars] = useState<
    {
      id: string;
      avatar: string;
    }[]
  >([]);

  const fetchAvatars = async () => {
    try {
      store.setIsLoading(true);
      const response = await fetch(
        `${API_URL}/user/getAvatars/${store.state.currentRoomId}`,
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
      setAvatars(data);
    } catch (error: any) {
      store.displayError(error.message);
    } finally {
      store.setIsLoading(false);
    }
  };
  useEffect(() => {
    if (store.state.currentRoomId !== "") {
      fetchAvatars();
    }
  }, [store.state.currentRoomId]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flexGrow: 1,
        height: 0,
      }}
    >
      {store.state.currentRoomId === "" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flexGrow: 1,
            height: 0,
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
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid grey",
            boxSizing: "border-box",
            flexGrow: 1,
            height: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "10.5%",
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
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              <InfoComponent room={room} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              flexGrow: 1,
              height: 0,
            }}
          >
            <MessagingZone
              avatars={avatars}
              setShouldUpdateRoom={setShouldUpdateRoom}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default ChatArea;
