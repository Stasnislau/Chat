import { Box, Avatar, IconButton, Typography, Skeleton } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { room } from "../../../types";
import { Call, VideoCall } from "@mui/icons-material";
import { observer } from "mobx-react-lite";

const InfoComponent = observer(({ room }: { room: room | undefined }) => {
  const [isLoading, setIsLoading] = useState<boolean>(room === undefined);
  useEffect (() => {
    setIsLoading(room === undefined || !room);
  }, [room]);
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
        {isLoading ? (
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
          {isLoading ? (
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
          {isLoading ? (
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
