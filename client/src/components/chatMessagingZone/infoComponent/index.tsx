import { Box, Avatar, IconButton, Typography, Skeleton } from "@mui/material";
import { API_URL } from "../../../constants";
import { useContext, useState, useEffect } from "react";
import { Context } from "../../../App";
import { room } from "../../../types";
import { Call, VideoCall } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

const InfoComponent = observer(() => {
  const store = useContext(Context);
  const [room, setRoom] = useState<room>();
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
    if (store.state.userId !== "" && store.state.userId !== "") {
      fetchRoom();
    }
  }, [store.state.currentRoomId, store.state.userId]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {store.state.isLoading ? (
          <Skeleton variant="circular" width={50} height={50} />
        ) : (
          <Avatar
            sx={{
              width: "50px",
              height: "50px",
            }}
            src={room?.avatar}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}
        >
          {store.state.isLoading ? (
            <Skeleton variant="text" width={100} height={20} />
          ) : (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {room?.name}
            </Typography>
          )}
          {store.state.isLoading ? (
            <Skeleton variant="text" width={100} height={20} />
          ) : (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "light",
              }}
            >
              Online
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{
            width: "40px",
            height: "40px",
            marginRight: "10px",
          }}
        >
          <Call
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </IconButton>
        <IconButton
          sx={{
            width: "40px",
            height: "40px",
          }}
        >
          <VideoCall
            sx={{
              width: "100%",
              height: "100%",
            }}
          />
        </IconButton>
      </Box>
    </Box>
  );
});

export default InfoComponent;
