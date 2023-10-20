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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [size, setSize] = React.useState(0);

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
    useEffect(() => {
      if (containerRef.current) {
        setSize(Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight));
      }
    }, [containerRef, containerRef.current, window.innerHeight, window.innerWidth]);
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
            width: {
              mobile: 0.7,
              tablet: 0.5,
              laptop: 0.3,
              desktop: 0.3,
            },
            height: {
              mobile: "55%",
              tablet: "45%",
              laptop: "40%",
              desktop: "40%",
            },
            borderRadius: "1rem",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            border: "none",
            p: 2,
          }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            minHeight: 0,
          }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Typography fontSize={24}>Info</Typography>
            </Box>
            <Box
              ref={containerRef}
              sx={{
                width: 1,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  width: 1,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isLoading ? (
                  <Skeleton variant="circular" sx={
                    {
                      width: size - 1,
                      height: size - 1,
                    }
                  } />
                ) : (
                  <IconButton
                    onClick={() => {
                      setIsEditingEnabled(true);
                      setChosenField("avatar");
                    }}
                  >
                    <Avatar src={avatar} sx={{
                      width: size - 1.5,
                      height: size - 1.5,
                    }} />
                  </IconButton>
                )}
              </Box>
              <Divider
                sx={{
                  width: 1,
                  height: "1px",
                }}
              />
            </Box>
            <Box
              sx={{
                width: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: {
                  mobile: "25%",
                  tablet: "25%",
                  laptop: "35%",
                  desktop: "35%",
                }
              }}
            >
              <Box
                sx={{
                  width: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: 1,
                    flexGrow: 0.5,
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
                      width: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "Roboto",
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        lineHeight: 3,
                        gap: 1,
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
                    width: 1,
                    flexGrow: 0.5,
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
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "Roboto",
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        lineHeight: 3,
                        gap: 1,
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
        </Box>
      </Modal>
    );
  }
);

export default UserInfoModal;
