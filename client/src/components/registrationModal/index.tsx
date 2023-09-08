import React, { useState } from "react";
import { Modal, Button, Box, Typography } from "@mui/material";
import { API_URL } from "../../constants";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../App";
import { StyledTextField } from "../Styled/index.tsx";
interface RegistrationModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}
const RegistrationModal = observer(
  ({ isModalOpen, setIsModalOpen }: RegistrationModalProps) => {
    const store = useContext(Context);
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
      name: "",
      nickname: "",
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
          }),
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
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
      // if (name && nickname) { // TODO: uncomment this when the other parts are done
      //   await createUser();
      // }
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
          height: "100%",
          width: "100%",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            height: "70%",
            width: "40%",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffff",
            boxShadow: "1rm rgba(0,0,0,0.75)",
            borderRadius: "1rem",
            padding: "2rem",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              position: "relative",
              height: "fit-content",
              fontFamily: "Roboto",
              color: "#8446b7",
            }}
          >
            <Box
              sx={{
                position: "relative",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: "700",
                }}
              >
                Registration
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "2rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
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
              backgroundColor: "secondary.main",
              flex: 1,
              borderRadius: "1rem",
              fontFamily: "Roboto",
              color: "#FFFF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
                padding: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                    marginLeft: "0.5rem",
                  }}
                >
                  It will be displayed in the chat
                </Typography>
                <StyledTextField
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  marginLeft: "0.5rem",
                }}
              >
                Unique nickname for finding you in the chat
              </Typography>
              <StyledTextField
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </Box>
            <Button
              sx={{
                color: "white",
                borderRadius: "1rem",
                width: "fit-content",
                alignSelf: "center",
                padding: "1rem",
                marginTop: "1rem",
              }}
              onClick={onSubmit}
            >
              Create
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "1rem",
              transform: "transition all 0.5s ease-in-out",
            }}
          >
            {fieldErrors.name || fieldErrors.nickname ? (
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "400",
                  color: "red",
                }}
              >
                {fieldErrors.name || fieldErrors.nickname}
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Modal>
    );
  }
);

export default RegistrationModal;
