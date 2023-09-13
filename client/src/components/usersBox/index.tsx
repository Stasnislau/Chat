import React, { useContext, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Context } from "../../App";
import { observer } from "mobx-react-lite";
import { API_URL } from "../../constants";

const UserBox = observer(
  ({
    userId,
    name,
    avatar,
  }: {
    userId: string;
    name: string;
    avatar: string;
  }) => {
    const store = useContext(Context);
    const checkIfRoomExists = async () => {
      try {
        store.setIsBeingSubmitted(true);
        const response = await fetch(`${API_URL}/room/checkRoom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: [userId, store.state.userId],
          }),
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        return data as boolean;
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        store.setIsBeingSubmitted(false);
      }
    };

    const handleUserClick = async () => {
      if (await checkIfRoomExists()) {
        store.stopSearching();
        // store.setCurrentRoomId(userId); TODO: find the room id and set it
        return;
      }
      try {
        store.setIsBeingSubmitted(true);
        const response = await fetch(`${API_URL}/room/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: [userId, store.state.userId],
          }),
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        store.stopSearching();
        store.setCurrentRoomId(data.id);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        store.setIsBeingSubmitted(false);
      }
    };
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
          backgroundColor: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        onClick={handleUserClick}
      >
        <Avatar src={avatar} sx={{ height: "3rem", width: "3rem" }} />
        <Box sx={{ marginLeft: "1rem" }}>
          <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
        </Box>
      </Box>
    );
  }
);

export default UserBox;
