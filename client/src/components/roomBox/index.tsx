import React, { useContext } from "react";
import { Box, Typography, Avatar, Badge } from "@mui/material";
import { Context } from "../../App";
import { observer } from "mobx-react-lite";
import moment from "moment";
const RoomBox = observer(
  ({
    roomId,
    name,
    text,
    date,
    avatar,
    numberOfUnreadMessages,
  }: {
    roomId: string;
    name: string;
    text: string;
    date: Date;
    avatar: string;
    numberOfUnreadMessages?: number;
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
        onClick={() => {
          store.setCurrentRoomId(roomId);
        }}
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            cursor: "pointer",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "80%",
            height: "4.5rem",
            flexDirection: "row",
            overflow: "hidden",
            breakWord: "break-all",
            margin: "0",
          }}
        >
          <Avatar
            sx={{
              margin: "0.5rem",
              height: "3rem",
              width: "3rem",
            }}
            src={avatar}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
            <Typography sx={{ color: "gray" }}>{text}</Typography>
            <Typography sx={{ color: "gray" }}>{time}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "20%",
            height: "4.5rem",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "10%",
          }}
        >
          {numberOfUnreadMessages && numberOfUnreadMessages > 0 ? (
            <Badge
              badgeContent={numberOfUnreadMessages}
              color="secondary"
              sx={{ alignSelf: "flex-end" }}
            />
          ) : null}
        </Box>
      </Box>
    );
  }
);

export default RoomBox;
