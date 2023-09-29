import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { message } from "../../../types";
import moment from "moment";
import AudioPlayer from "../audioPlayer";
import { useState } from "react";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

interface MessageBubbleProps {
  message: message;
  isMine: boolean;
  avatars: {
    id: string;
    avatar: string;
  }[];
}

const MessageBubble = ({ message, isMine, avatars }: MessageBubbleProps) => {
  const avatar = avatars.find((avatar) => avatar.id === message.userId)?.avatar;
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const time = moment(message.dateSent).format("HH:mm");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMine ? "row-reverse" : "row",
        alignItems: "flex-start",
        margin: "0.5rem 0",
        width: "100%",
        wordBreak: "break-word",
      }}
      component="div"
      className="message-bubble"
    >
      <Avatar
        src={avatar}
        alt={message?.user?.name}
        sx={{
          marginLeft: isMine ? "0.5rem" : "0.25rem",
          marginRight: isMine ? "0.25rem" : "0.5rem",
        }}
      />
      <Box
        sx={{
          backgroundColor: isMine ? "#a8daee" : "#FFFFFF",
          borderRadius: "1rem",
          padding: "0.5rem 1rem",
          maxWidth: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {message?.user?.name}
        </Typography>
        {message?.audioUrl ? <Box
          sx={
            {
              display: "flex",
              flexDirection: isMine ? "row-reverse" : "row",
            }
          }
        >
          <IconButton sx={{
            marginLeft: isMine ? "0.5rem" : "0.25rem",
            marginRight: isMine ? "0.25rem" : "0.5rem",
            display: message.audioUrl ? "flex" : "none",
          }} onClick={() => setIsConverted(!isConverted)}>
            <TextSnippetIcon />
          </IconButton>
          {isConverted ? <Typography
            sx={{
              marginLeft: isMine ? "0.5rem" : "0.25rem",
              marginRight: isMine ? "0.25rem" : "0.5rem",
            }}
          >{convertedText}</Typography> :
            <AudioPlayer audioUrl={message.audioUrl} />}
        </Box> :
          <Typography variant="body1">{message.text}</Typography>}
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {time}
        </Typography>
      </Box>

    </Box>
  );
};

export default MessageBubble;
