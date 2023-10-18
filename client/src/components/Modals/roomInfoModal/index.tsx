import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  Skeleton,
  AvatarGroup,
} from "@mui/material";
import { API_URL } from "../../../constants/index.ts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../App.tsx";
import {
  AccountBox,
  AlternateEmail,
  People,
  PersonAdd,
} from "@mui/icons-material";
import UsersListModal from "../usersListModal/index.tsx";
import AddUsersModal from "../addUsersModal/index.tsx";

interface UserInfoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  roomId: string;
}

const UserInfoModal = observer(
  ({ isModalOpen, setIsModalOpen, roomId }: UserInfoModalProps) => {
    const store = useContext(Context);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [nickname, setNickname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [usersInRoom, setUsersInRoom] = useState<
      {
        id: string;
        avatar: string;
      }[]
    >([]);
    const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false);
    const [size, setSize] = useState(128);
    useEffect(() => {
      if (containerRef.current) {
        setSize(Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight));
      }
    }, [containerRef.current]);

    const getRoomInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/room/getById/${roomId}`, {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callingId: store.state.userId,
          }),
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setName(data.name);
        setAvatar(data.avatar);
        if (data.userIds && data.userIds.length < 3) {
          getUser(
            data.userIds.find((id: string) => id !== store.state.userId) ||
            store.state.userId
          );
        }
        if (data.userIds && data.userIds.length >= 3) {
          getUsersInRoom();
        }
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const getUsersInRoom = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/user/getAvatars/${roomId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setUsersInRoom(data);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const getUser = async (id: string) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/user/getById/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setNickname(data.nickname);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    const createRoom = async (additionalId: string) => {
      try {
        store.setIsBeingSubmitted(true);
        const response = await fetch(`${API_URL}/room/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: [additionalId, store.state.userId],
            name: name,
            avatar: avatar,
          }),
        });
        const data = await response.json();

        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        store.setCurrentRoomId(data.id);
        setIsModalOpen(false);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        store.setIsBeingSubmitted(false);
      }
    };
    useEffect(() => {
      getRoomInfo();
    }, [roomId]);
    const [isUsersListModalOpen, setIsUsersListModalOpen] = useState(false);
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
              mobile: "70%",
              tablet: "50%",
              laptop: "30%",
              desktop: "30%",
            },
            height: "60%",
            borderRadius: "1rem",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            borderBox: "box-sizing",
            border: "none",
            p: 2,
          }}
        >
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

            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              ref={containerRef}
              sx={{
                width: "100%",
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 1,
                boxSizing: "border-box",
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
                <Avatar src={avatar} sx={{
                  width: size,
                  height: size,
                }} />
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
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "35%",
                  flexDirection: "column",
                  justifyContent: "space-between",
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
                  height: "35%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor:
                    usersInRoom && usersInRoom.length > 0 ? "pointer" : "",
                  "&:hover": {
                    backgroundColor:
                      usersInRoom && usersInRoom.length > 0
                        ? "#e9e9e9"
                        : "#FFFFFF",
                  },
                }}
                onClick={() => {
                  if (usersInRoom && usersInRoom.length > 0) {
                    setIsUsersListModalOpen(true);
                  }
                }}
              >
                {usersInRoom && usersInRoom.length > 0 ? (
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
                    {isLoading ? (
                      <Skeleton variant="text" width="30%" />
                    ) : (
                      <Typography
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <People /> Users:
                      </Typography>
                    )}
                    {isLoading ? (
                      <Skeleton variant="text" width="30%" />
                    ) : (
                      <AvatarGroup max={3}>
                        {usersInRoom.map((user) => (
                          <Avatar src={user.avatar} key={user.id} />
                        ))}
                      </AvatarGroup>
                    )}
                  </Box>
                ) : (
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
                    {isLoading ? (
                      <Skeleton variant="text" width="30%" />
                    ) : (
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
                    )}
                    {isLoading ? (
                      <Skeleton variant="text" width="30%" />
                    ) : (
                      <Typography>{nickname}</Typography>
                    )}
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  height: "30%",
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#e9e9e9",
                    },
                  }}
                  onClick={() => {
                    setIsAddUsersModalOpen(true);
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
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <PersonAdd />
                      Add users
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "10%",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Write message
            </Button>
          </Box>
          {isUsersListModalOpen && (
            <UsersListModal
              usersList={usersInRoom}
              open={isUsersListModalOpen}
              setOpen={setIsUsersListModalOpen}
              handleClick={createRoom}
            />
          )}
          {isAddUsersModalOpen && (
            <AddUsersModal
              isOpen={isAddUsersModalOpen}
              setIsOpen={setIsAddUsersModalOpen}
              onSuccess={() => {
                store.setShouldUpdateRooms(true);
                setIsModalOpen(false);
                store.setShouldUpdateCurrentRoom(true);
              }
              }
            />
          )
          }
        </Box>
      </Modal>
    );
  }
);

export default UserInfoModal;
