import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CreateRoomModal from "../Modals/createRoomModal";
import { Search } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { observer } from "mobx-react-lite";
import { Context } from "../../App";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  "& .MuiOutlinedInput-input": {
    height: "100%",
    boxSizing: "border-box",
    padding: "0 0 0 0.5rem",
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #e9e9e9",
  },
});
const SearchField = observer(() => {
  const [searchText, setSearchText] = useState("");
  const [isSearchOn, setIsSearchOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const store = useContext(Context);

  useEffect(() => {
    store.setSearchingText(searchText);
  }, [isSearchOn, searchText]);

  return (
    <Box width="100%" position="relative" display="flex">
      <Box
        sx={{
          display: "flex",
          width: "75%",
          height: "100%",
          paddingLeft: "5%",
          boxSizing: "border-box",
          alignItems: "center",
        }}
      >
        <StyledTextField
          type="text"
          placeholder="Search.."
          color="secondary"
          sx={{
            width: "100%", height: "50%", boxSizing: "border-box",
            border: "1px solid #e9e9e9",
          }}
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
          }}
          InputProps={{
            startAdornment: <Search />,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "25%",
          height: "100%",
          boxSizing: "border-box",
          alignItems: "center",
          padding: "0 7.5%",
        }}
      >
        <IconButton
          sx={{
            width: "100%",
            height: "50%",
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",
            borderRadius: "4px",
            border: "1px solid #e9e9e9",
            "&:hover": {
              backgroundColor: "#A577C8"
            },
          }}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <PostAddIcon />
        </IconButton>
      </Box>
      {isModalOpen && (
        <CreateRoomModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
        />
      )}
    </Box>
  );
});

export default SearchField;
