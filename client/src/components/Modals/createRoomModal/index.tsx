import { Box, Button, Divider, FormControl, IconButton, InputLabel, Modal, Skeleton, TextField, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { Context } from "../../../App";
import LocalSearchField from "../localSearchField";
import { user } from "../../../types";
import UserBoxBadged from "../../userBoxBadged";
import { API_URL } from "../../../constants";
import useDebounce from "../../../hooks/useDebounce";
import UploadZone from "../../dropZone/uploadZone";

interface createRoomModalProps {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
}
const CreateRoomModal = (
  {
    isOpen,
    setIsOpen,
  }: createRoomModalProps) => {
  {
    const store = useContext(Context);
    const [searchText, setSearchText] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([store.state.userId]);
    const [chosenUsers, setChosenUsers] = useState<user[]>([]);
    const [searchResults, setSearchResults] = useState<user[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatName, setChatName] = useState("");
    const [chatPicture, setChatPicture] = useState<string>();



    const fetchChosenUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/user/getUsersByIds`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ids: selectedUserIds,
            }),
          }
        );

        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setChosenUsers(data);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/user/searchByNickname/${searchText}`,
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
        setSearchResults(data);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    const callFetching = useDebounce(async () => {
      if (selectedUserIds.length > 0) {
        await fetchChosenUsers();
      }
    }, 500)
    useEffect(() => {
      callFetching();
    }, [selectedUserIds.length]);

    useEffect(() => {
      const func = async () => {
        if (
          searchText && searchText.length > 2
        ) {
          await fetchUsers();
        }
      }
      func();
    }, [searchText]);

    useEffect(() => {
      if (!searchText || searchText.length < 3) {
        setSearchResults([]);
      }
    }, [searchText]);

    return (
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Roboto",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            height: "70%",
            width: {
              mobile: "90%",
              tablet: "70%",
              laptop: "50%",
              desktop: "40%",
            },
            borderRadius: "1rem",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            borderBox: "box-sizing",
            border: "none",
            p: 4,
          }}
        >
          <Typography sx={
            {
              fontSize: 20,
            }
          } fontWeight="bold" textAlign="left" paddingBottom="1rem">
            Create chat
          </Typography>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
            width: 1,
          }}
          >
            <Box sx={
              {
                display: "flex",
                width: "100%",
                flexGrow: 1,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Roboto",
              }
            }>
              <Box sx={
                {
                  display: "flex",
                  width: "100%",
                  height: "fit-content",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Roboto",
                }
              }
              >
                <LocalSearchField
                  searchText={searchText}
                  setSearchText={setSearchText}
                  key="search"
                />
              </Box>
              {
                isLoading ?
                  (
                    <Box sx={
                      {
                        display: "flex",
                        width: 1,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        fontFamily: "Roboto",
                        flexGrow: 1,
                        borderTop: "1px solid black",
                        borderBottom: "1px solid black",
                        margin: "1rem 0 1rem 0",
                        boxSizing: "border-box",
                        overflowY: "auto",
                      }
                    }
                    >
                      <Typography sx={
                        {
                          fontSize: 20,
                          textAlign: "center",
                        }
                      } fontWeight="bold" textAlign="left" paddingBottom="1rem">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                      </Typography>
                    </Box>
                  )
                  :
                  (<Box sx={
                    {
                      display: "flex",
                      width: 1,
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      fontFamily: "Roboto",
                      flexGrow: 1,
                      borderTop: "1px solid black",
                      borderBottom: "1px solid black",
                      margin: "1rem 0 1rem 0",
                      boxSizing: "border-box",
                      overflowY: "auto",
                    }
                  }
                  >
                    {searchResults && searchResults.length > 0 && searchResults.map((user) => {
                      return (
                        <Box sx={
                          {
                            display: "flex",
                            width: 1,
                            flexDirection: "column",
                            fontFamily: "Roboto",
                            flexWrap: "wrap",
                          }
                        }>
                          <UserBoxBadged
                            userId={user.id}
                            name={user.name}
                            avatar={user.avatar}
                            isChosen={selectedUserIds.includes(user.id)}
                            handleUserClick={(id: string) => {
                              if (selectedUserIds.includes(user.id)) {
                                if (selectedUserIds.length === 1) {
                                  return;
                                }
                                setSelectedUserIds(selectedUserIds.filter((userId) => userId !== user.id));
                              } else {
                                setSelectedUserIds([...selectedUserIds, user.id]);
                              }
                            }}
                          />
                        </Box>
                      )
                    })}
                    {
                      !searchResults || searchResults.length === 0 && !searchText && chosenUsers && chosenUsers.length > 0 && !isLoading && chosenUsers.map((user) => {
                        return (
                          <Box sx={
                            {
                              display: "flex",
                              width: "100%",
                              flexDirection: "row",
                              fontFamily: "Roboto",
                              flexWrap: "wrap",
                            }
                          }>
                            <UserBoxBadged
                              userId={user.id}
                              name={user.name}
                              avatar={user.avatar}
                              isChosen={selectedUserIds.includes(user.id)}
                              handleUserClick={(id: string) => {
                                if (selectedUserIds.includes(user.id)) {
                                  if (selectedUserIds.length === 1) {
                                    return;
                                  }
                                  setSelectedUserIds(selectedUserIds.filter((userId) => userId !== user.id));
                                } else {
                                  setSelectedUserIds([...selectedUserIds, user.id]);
                                }
                              }}
                            />
                          </Box>
                        )
                      })
                    }
                  </Box>)
              }
            </Box>
            <Box sx={{
              width: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              fontFamily: "Roboto",
              marginBottom: 2,
              display: selectedUserIds && selectedUserIds.length > 2 ? "flex" : "none",
            }}
            >
              <FormControl sx={{
                width: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                fontFamily: "Roboto",
                marginBottom: 2,
                color: "black",
                "&.MuiOutlinedInput-root": {
                  "fieldset": {
                    borderColor: "black",
                  },
                  ":hover fieldset": {
                    borderColor: "black",
                  },
                  ".Mui-focused fieldset": {
                    borderColor: "black",
                  },

                },
              }}>
                <TextField
                  id="chatName"
                  aria-describedby="chatName"
                  label="Chat name"
                  color="secondary"
                  sx={{

                  }
                  }
                  onChange={(e) => {
                    setChatName(e.target.value);
                  }}
                />
              </FormControl>
              <Box sx={{
                width: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                fontFamily: "Roboto",
                display: "flex",
                alignItems: "center",
              }}>
                <UploadZone onChange={setChatPicture} />
              </Box>

            </Box>
            <Box sx={
              {
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Roboto",
              }
            }
            >
              <Button
                sx={
                  {
                    display: "flex",
                    width: "30%",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Roboto",
                    color: "black",
                    variant: "contained",
                    backgroundColor: "secondary.main",
                    boxShadow: 4,
                    "&:hover": {
                      backgroundColor: "secondary.dark",
                    },
                  }
                }
                onClick={() => {
                  setIsOpen(false);
                }
                }
              >
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    )
  }
}

export default CreateRoomModal;