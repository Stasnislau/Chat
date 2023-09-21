import React, { useState, useContext, useRef } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Send, Mic } from "@mui/icons-material";
import { Context } from "../../../App";
import Recorder from "recorder-js";

interface ChatTextFieldProps {
  onSend: (text: string, room: string) => void;
  onRecord: (recording: Blob) => void;
}

const ChatTextField = ({ onSend, onRecord }: ChatTextFieldProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const store = useContext(Context);
  const recorderRef = useRef<Recorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message, store.state.currentRoomId);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleRecord = async () => {
    if (!isRecording) {
      const audioContext = new AudioContext();
      const recorder = new Recorder(
        audioContext
      );
      try {
        recorder.start();
        setIsRecording(true);
        recorderRef.current = recorder;
      } catch (error) {
        console.error(error);
      }
    } else {
      const recorder = recorderRef.current;

      if (recorder) {
        recorder.stop(
        ).then(({ blob, buffer }) => {
          setAudioBlob(blob);
          onRecord(blob);
        });

        const formData = new FormData();
        if (audioBlob) {
          formData.append("audio", audioBlob, "recording.wav");
        }

        const response = await fetch("/upload-audio", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log("Audio file uploaded successfully");
        } else {
          console.error("Error uploading audio file");
        }

        setIsRecording(false);
        recorderRef.current = null;
      }
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <TextField
        fullWidth
        maxRows={4}
        multiline
        value={message}
        sx={{
          "& .MuiInputBase-root": {
            backgroundColor: "primary.main",
          },
        }}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSend}>
                <Send />
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={
                () => {
                  setIsRecording(!isRecording);
                }
              }>
                <Mic />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatTextField;
