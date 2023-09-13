import { Box, Typography } from "@mui/material";
import { message } from "../../../types";

interface MessageBubbleProps {
  message: message;
  isMine: boolean;
}

const MessageBubble = ({ message, isMine }: MessageBubbleProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMine ? "flex-end" : "flex-start",
        width: "100%",
        margin: "0.5rem 0",
      }}
    >
      {message?.user?.name && (
        <Typography
          variant="caption"
          sx={{ alignSelf: isMine ? "flex-end" : "flex-start" }}
        >
          {message.user.name}
        </Typography>
      )}
      <Box
        sx={{
          backgroundColor: isMine ? "#a8daee" : "#FFFFFF",
          borderRadius: "1rem",
          padding: "0.5rem 1rem",
          maxWidth: "80%",
        }}
      >
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: isMine ? "#000000" : "#333333",
          }}
        >
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
