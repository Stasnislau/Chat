import { Box, Typography, Avatar } from "@mui/material";
import { observer } from "mobx-react-lite";
const UserBoxBadged = observer(
    ({
        name,
        avatar,
        isChosen,
        handleUserClick,

    }: {
        name: string;
        avatar: string;
        isChosen: boolean;
        handleUserClick: () => void;
    }) => {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "fit-content",
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    cursor: "pointer",
                    boxSizing: "border-box",
                    backgroundColor: "#FFFFFF",
                    "&:hover": {
                        backgroundColor: "#f5f5f5",
                    },
                }}
                onClick={() => handleUserClick()}
            >
                <Avatar src={avatar} sx={{
                    height: "3rem", width: "3rem",
                    outline: isChosen ? "3px solid green" : "none"
                }} />
                <Box sx={{ marginLeft: "1rem" }}>
                    <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
                </Box>
            </Box>
        );
    }
);

export default UserBoxBadged;
