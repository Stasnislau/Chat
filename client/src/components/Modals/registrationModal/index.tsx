import React, { useState } from "react";
import { Modal, Button, Box, Typography } from "@mui/material";
import { API_URL } from "../../../constants/index.ts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../App.tsx";
import { StyledTextField } from "../../Styled/index.tsx";
import UploadZone from "../../dropZone/uploadZone/index.tsx";

interface RegistrationModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const RegistrationModal = observer(
  ({ isModalOpen, setIsModalOpen }: RegistrationModalProps) => {
    const store = useContext(Context);
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
      name: "",
      nickname: "",
      avatar: "",
    });

    const createUser = async () => {
      try {
        store.setIsBeingSubmitted(true);

        const response = await fetch(`${API_URL}/user/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            nickname,
            avatar,
          }),
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        localStorage.setItem("userId", data.id);
      } catch (error: any) {
        store.displayError(error.message);
      } finally {
        store.setIsBeingSubmitted(false);
      }
    };

    const onSubmit = async () => {
      if (!name) {
        setFieldErrors({
          ...fieldErrors,
          name: "Name is required",
        });
        return;
      }
      if (!nickname) {
        setFieldErrors({
          ...fieldErrors,
          nickname: "Nickname is required",
        });
        return;
      }
      if (!avatar) {
        setFieldErrors({
          ...fieldErrors,
          avatar: "Picture is required",
        });
        return;
      }

      if (name && nickname && avatar) {
        await createUser();
      }
      setIsModalOpen(false);
    };

    return (
      <Modal
        open={isModalOpen}
        onClose={() => {
          store.displayError("You need to register to proceed to the chat");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        disableAutoFocus
      >
        <Box sx={{
          width: {
            mobile: "90%",
            tablet: "70%",
            laptop: "50%",
            desktop: "45%",
          },
          height: {
            mobile: "80%",
            tablet: "80%",
            laptop: "75%",
            desktop: "75%",
          },
          borderRadius: "1rem",
          backgroundColor: "primary.main",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.5)",
          p: 4,
        }}>
          <Box
            sx={{
              display: "flex",
              width: 1,
              flexDirection: "column",
              position: "relative",
              height: "fit-content",
              fontFamily: "Roboto",
            }}
          >
            <Box
              sx={{
                position: "relative",
                flexDirection: "column",
                alignItems: "center",
                display: "flex",
              }}
            >
              <Typography sx={
                {
                  fontSize: {
                    mobile: "1.2rem",
                    tablet: "1.5rem",
                    laptop: "2rem",
                    desktop: "2.2rem",
                  },
                  fontWeight: "600",
                }
              }
              >Registration</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Roboto",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    mobile: "0.9rem",
                    tablet: "1.0rem",
                    laptop: "1.2rem",
                    desktop: "1.5rem",
                  }
                }}
              >
                To proceed to the chat please create your name and nickname
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              flexGrow: 1,
              borderRadius: "1rem",
              fontFamily: "Roboto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Roboto",
                width: 1,
                marginTop: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    mobile: "0.8rem",
                    tablet: "1rem",
                    laptop: "1.1rem",
                    desktop: "1.2rem",
                  },
                  fontFamily: "Roboto",
                }}
              >
                Name will be displayed in the chat
              </Typography>
              <StyledTextField
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setFieldErrors({
                    ...fieldErrors,
                    name: "",
                  });
                  setName(e.target.value);
                }}
              />
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Roboto",
              width: 1,
              marginTop: 2,

            }}>

              <Typography
                sx={{
                  fontSize: {
                    mobile: "0.8rem",
                    tablet: "1rem",
                    laptop: "1.1rem",
                    desktop: "1.2rem",
                  },
                  fontFamily: "Roboto",
                }}
              >
                Unique nickname for finding you in the chat
              </Typography>
              <StyledTextField
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => {
                  setFieldErrors({
                    ...fieldErrors,
                    nickname: "",
                  });
                  setNickname(e.target.value);
                }}
              />
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Roboto",
              width: 1,
              marginTop: 2,
              flexGrow: 1,
            }}>

              <UploadZone
                onChange={(file) => {
                  setFieldErrors({
                    ...fieldErrors,
                    avatar: "",
                  });
                  setAvatar(file);
                }}
              />
            </Box>
            <Box sx={
              {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 1,
                marginTop: 2,
              }
            }>
              <Button sx={
                {
                  width: "fit-content",
                }
              } color="secondary" onClick={onSubmit}>Create</Button>
            </Box>
          </Box>
          <Box
            sx={{
              flexDirection: "column",
              alignItems: "center",
              transform: "transition all 0.5s ease-in-out",
              display: fieldErrors.name || fieldErrors.nickname || fieldErrors.avatar ? "flex" : "none",
              color: "error.main",
            }}
          >
            {fieldErrors.name || fieldErrors.nickname || fieldErrors.avatar ? (
              <Typography>
                {fieldErrors.name || fieldErrors.nickname || fieldErrors.avatar}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Modal >
    );
  }
);

export default RegistrationModal;
