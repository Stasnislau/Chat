import { Box, Skeleton, Typography } from "@mui/material";

const UserSkeleton = () => {
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
            }}
        >
            <Skeleton variant="circular" width="3rem" height="3rem" />
            <Box sx={{
                marginLeft: 1,
                width: 1,
            }}>
                <Typography sx={{ fontWeight: "bold" }}><Skeleton variant="text" /></Typography>
            </Box>
        </Box>
    );
}

export default UserSkeleton;