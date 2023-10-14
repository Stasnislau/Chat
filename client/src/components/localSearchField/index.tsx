import { Box, TextField, styled, } from '@mui/material';
import { Search } from '@mui/icons-material';

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        display: "flex",
        position: "relative",
        width: "100%",
        flexGrow: 1,
    },
    "& .MuiOutlinedInput-input": {
        display: "flex",
        flexGrow: 1,
        boxSizing: "border-box",
        padding: "0 0 0 0.5rem",
        width: "100%",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        border: "1px solid black",
        width: "100%",
    },
});

const LocalSearchField = ({ searchText, setSearchText }:
    { searchText: string, setSearchText: (value: string) => void }) => {

    return (
        <Box width="100%" position="relative" display="flex">
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    padding: "0 5%",
                    boxSizing: "border-box",
                    alignItems: "center",
                }}
            >
                <StyledTextField
                    type="text"
                    color="secondary"
                    placeholder="Search.."
                    sx={{ width: "100%", height: "100%", boxSizing: "border-box" }}
                    value={searchText}
                    onChange={(event) => {
                        setSearchText(event.target.value);
                    }}
                    InputProps={{
                        startAdornment: <Search />,
                    }}
                />
            </Box>
        </Box>
    );


}

export default LocalSearchField;