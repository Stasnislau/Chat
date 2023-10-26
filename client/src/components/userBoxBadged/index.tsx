import { Box, Typography, Avatar } from "@mui/material";
import { observer } from "mobx-react-lite";
const UserBoxBadged = observer(
    ({
        userId,
        name,
        avatar,
        isChosen,
        handleUserClick,

    }: {
        userId: string;
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
                onClick={() => handleUserClick(userId)}
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
