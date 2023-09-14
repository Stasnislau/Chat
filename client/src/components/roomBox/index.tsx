import React, { useContext } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Context } from "../../App";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { format } from "path";
const RoomBox = observer(
  ({
    roomId,
    name,
    text,
    date,
    avatar,
  }: {
    roomId: string;
    name: string;
    text: string;
    date: Date;
    avatar: string;
  }) => {
    const store = useContext(Context);
    const time = moment(date).calendar(null, {
      sameDay: "[Today] LT",
      lastDay: "[Yesterday]",
      lastWeek: "dddd",
      sameElse: "DD/MM/YYYY",
    });

    return (
      <Box
        sx={{
          width: "100%",
          height: "fit-content",
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          cursor: "pointer",
          boxSizing: "border-box",
          backgroundColor:
            store.state.currentRoomId === roomId ? "#f5f5f5" : "#FFFFFF",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        onClick={() => {
          store.setCurrentRoomId(roomId);
        }}
      >
        <Avatar src={avatar} sx={{ height: "3rem", width: "3rem" }} />
        <Box sx={{ marginLeft: "1rem" }}>
          <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
          <Typography sx={{ color: "text.secondary" }}>{text}</Typography>
        </Box>
        <Box sx={{ marginLeft: "auto" }}>
          <Typography sx={{ color: "text.secondary" }}>{time}</Typography>
        </Box>
      </Box>
    );
  }
);

export default RoomBox;
