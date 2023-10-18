import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  Skeleton,
  TextField,
  IconButton,
} from "@mui/material";
import { API_URL } from "../../../constants/index.ts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../App.tsx";
import { AccountBox, AlternateEmail } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import EditingModal from "../editingModal/index.tsx";

interface UserInfoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const UserInfoModal = observer(
  ({ isModalOpen, setIsModalOpen }: UserInfoModalProps) => {
    const store = useContext(Context);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [nickname, setNickname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditingEnabled, setIsEditingEnabled] = useState(false);
    const [chosenField, setChosenField] = useState("");
    const [newName, setNewName] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const getUserInfo = async () => {
      try {
        setIsLoading(true);
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
        setName(data.name);
        setAvatar(data.avatar);
        setNickname(data.nickname);
        setShouldUpdate(false);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const updateUser = async () => {
      try {
        store.setIsBeingSubmitted(true);

        const response = await fetch(`${API_URL}/user/update/${store.state.userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            avatar: newAvatar,
          }),
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setShouldUpdate(true);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        store.setIsBeingSubmitted(false);
      }
    };
    useEffect(() => {
      if (newName !== "" || newAvatar !== "") {
        updateUser();
      }
    }, [newName, newAvatar]);

    useEffect(() => {
      if (store.state.userId !== "") getUserInfo();
    }, [store.state.userId, shouldUpdate]);

    return (
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Roboto",
        }}
        disableAutoFocus
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            width: "25%",
            height: "55%",
            borderRadius: "1rem",
            boxShadow: 24,
            padding: "1%",
            display: "flex",
            flexDirection: "column",
            borderBox: "box-sizing",
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              height: "10%",
            }}
          >
            <Typography fontSize={24}>Info</Typography>
          </Box>
          <Box
            height="50%"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isLoading ? (
                <Skeleton variant="circular" width="8rem" height="8rem" />
              ) : (
                <IconButton
                  onClick={() => {
                    setIsEditingEnabled(true);
                    setChosenField("avatar");
                  }}
                >
                  <Avatar src={avatar} sx={{ height: "8rem", width: "8rem" }} />
                </IconButton>
              )}
            </Box>
            <Divider
              sx={{
                width: "100%",
                height: "1px",
              }}
            />
          </Box>
          <Box
            sx={{
              height: "30%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "50%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e9e9e9",
                  },
                }}
                onClick={() => {
                  setIsEditingEnabled(true);
                  setChosenField("name");
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 0.5rem 0 0.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <AccountBox />
                    Name:
                  </Typography>
                  {isLoading ? (
                    <Skeleton variant="text" />
                  ) : (
                    <Typography
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {name}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "50%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e9e9e9",
                  },
                }}
                onClick={() => {
                  setIsEditingEnabled(true);
                  setChosenField("nickname");
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 0.5rem 0 0.5rem",
                  }}
                >
                  <Typography
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <AlternateEmail /> Nickname:
                  </Typography>
                  {isLoading ? (
                    <Skeleton variant="text" />
                  ) : (
                    <Typography>{nickname}</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          {isEditingEnabled && (
            <EditingModal
              open={isEditingEnabled}
              onClose={() => {
                setIsEditingEnabled(false);
                setChosenField("");
              }}
              chosenField={chosenField}
              onChange={(value: string) => {
                {
                  chosenField === "name"
                    ? setNewName(value)
                    : setNewAvatar(value);
                }
                setIsEditingEnabled(false);
              }}
            />
          )}
        </Box>
      </Modal>
    );
  }
);

export default UserInfoModal;
