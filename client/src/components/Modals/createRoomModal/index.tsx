import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useEffect, useState, useContext, useRef } from "react";
import { Context } from "../../../App";
import LocalSearchField from "../localSearchField";
import { user } from "../../../types";

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

    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState<user[]>([]);
    const store = useContext(Context);
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
            height: "60%",
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
          {/* Two levels: upper with the LocalSearchBar which search for people and a part for actually choosing whether we want 1 person in our chat or more.  */}
          <Box sx={
            {
              display: "flex",
              height: "60%",
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Roboto",
            }
          }>
            <Box sx={
              {
                display: "flex",
                height: "30%",
                width: "100%",
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
            <Box sx={
              {
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Roboto",
                flexGrow: 1,
                border: "1px solid black",
              }
            }
            >
              {/* TODO: Add the list of people that we can choose from. */}

            </Box>
          </Box>
        </Box>
      </Modal >
    )
  }
}

export default CreateRoomModal;