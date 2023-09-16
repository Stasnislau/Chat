import React, { useState } from "react";
import { Modal, Button, Box, Typography } from "@mui/material";
import { API_URL } from "../../../constants/index.ts";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../App.tsx";
import { StyledTextField } from "../../Styled/index.tsx";
import UploadZone from "../../dropZone/uploadZone/index.tsx";
import styled from "styled-components";

const StyledModal = styled(Modal)`
  height: 100%;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  height: 80%;
  width: 40%;
  outline: none;
  display: flex;
  flex-direction: column;
  background-color: #ffff;
  box-shadow: 1rm rgba(0, 0, 0, 0.75);
  border-radius: 1rem;
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const StyledTypography = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  font-family: Roboto;
`;

const StyledTextFieldWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin-top: 1%;
  @media (max-width: 768px) {
    margin-top: 0.5%;
  }
`;

const StyledUploadZoneWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  height: fit-content;
  padding: 0 1rem;
  margin-top: 2.5%;
  @media (max-width: 768px) {
    margin-top: 1%;
  }
`;

const StyledButton = styled(Button)`
  color: white;
  border-radius: 1rem;
  width: fit-content;
  align-self: center;
  align-items: flex-end;
  padding: 1rem;
  margin-top: 1%;

  @media (max-width: 768px) {
    margin-top: 0.5%;
  }
`;

const StyledErrorTypography = styled(Typography)`
  font-size: 1rem;
  font-weight: 400;
  color: red;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

interface UserInfoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const UserInfoModal = observer(
  ({ isModalOpen, setIsModalOpen }: UserInfoModalProps) => {
    const store = useContext(Context);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [fieldErrors, setFieldErrors] = useState({
      name: "",
      avatar: "",
    });

    const getUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`${API_URL}/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.status < 200 || response.status >= 300) {
          throw new Error(data.message);
        }
        setName(data.name);
        setAvatar(data.avatar);
      } catch (error: any) {
        store.displayError(error.message);
      }
    };

    const updateUser = async () => {
      try {
        store.setIsBeingSubmitted(true);

        const userId = localStorage.getItem("userId");
        const response = await fetch(`${API_URL}/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            avatar,
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
      if (!avatar) {
        setFieldErrors({
          ...fieldErrors,
          avatar: "Picture is required",
        });
        return;
      }

      if (name || avatar) {
        await updateUser();
      }
      setIsModalOpen(false);
    };

    return (
      <StyledModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledBox>
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
              <StyledTypography>User Information</StyledTypography>
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
              marginTop: "1%",
              color: "#FFFF",
            }}
          >
            <StyledTextFieldWrapper>
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
                  Name
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
            </StyledTextFieldWrapper>
            <StyledUploadZoneWrapper>
              <UploadZone
                onChange={(file) => {
                  setFieldErrors({
                    ...fieldErrors,
                    avatar: "",
                  });
                  setAvatar(file);
                }}
              />
            </StyledUploadZoneWrapper>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                flex: 1,
              }}
            >
              <StyledButton onClick={onSubmit}>Save</StyledButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "2%",
              transform: "transition all 0.5s ease-in-out",
            }}
          >
            {fieldErrors.name || fieldErrors.avatar ? (
              <StyledErrorTypography>
                {fieldErrors.name || fieldErrors.avatar}
              </StyledErrorTypography>
            ) : null}
          </Box>
        </StyledBox>
      </StyledModal>
    );
  }
);

export default UserInfoModal;