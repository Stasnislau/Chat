import React from 'react';
import { Box, TextField, styled, } from '@mui/material';
import { Search } from '@mui/icons-material';


const LocalSearchField = ({ searchText, setSearchText }:
    { searchText: string, setSearchText: (value: string) => void }) => {
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
                    sx={{ width: "100%", height: "50%", boxSizing: "border-box" }}
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
            />
        </Box>
    );


}

export default LocalSearchField;