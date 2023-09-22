import React, { useState, useContext, useRef, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Send, Mic } from "@mui/icons-material";
import { Context } from "../../../App";
import RecordRTC from "recordrtc";
interface ChatTextFieldProps {
  onSend: (text: string, room: string) => void;
  onRecord: (recording: Blob) => void;
}

const ChatTextField = ({ onSend, onRecord }: ChatTextFieldProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const store = useContext(Context);
  const [recorder, setRecorder] = useState<RecordRTC | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
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
    if (isRecording) {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const options = {
        type: 'audio' as "audio" | "video" | "canvas" | "gif" | undefined,
        mimeType: "audio/webm" as "audio/webm" | "audio/webm;codecs=pcm" | "video/mp4" | "video/webm" | "video/webm;codecs=vp9" | "video/webm;codecs=vp8" | "video/webm;codecs=h264" | "video/x-matroska;codecs=avc1" | "video/mpeg" | "audio/wav" | "audio/ogg" | undefined,
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1 as 1 | 2,
      };

      const newRecorder = new RecordRTC(stream, options);
      newRecorder.startRecording();

      setIsRecording(true);
      setRecorder(newRecorder);
    } else {
      // Stop recording and send the audio file to the server
      const currentRecorder = recorder;

      if (currentRecorder) {
        currentRecorder.stopRecording(() => {
          setAudioBlob(currentRecorder.getBlob());
        });

        setRecorder(null);
      }
    }
  };
  
  useEffect(() => {
    handleRecord();
  }
    , [isRecording]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {!audioBlob ?
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
        : (
          <Box sx={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            border: "1px solid black",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Box sx={{
              height: "100%",
              boxSizing: "border-box",

            }}>

              <IconButton
                sx={
                  {
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }
                }
                onClick={
                  () => {
                    setIsRecording(!isRecording);
                  }
                }>
                <Mic />
              </IconButton>
            </Box>
            <Box sx={{
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
            }}>
              <audio controls src={URL.createObjectURL(audioBlob)} />
            </Box>
            <Box
              sx={{
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",

              }}
            >
              <IconButton onClick={() => {
                setAudioBlob(null);
              }}>
                <Send />
              </IconButton>
            </Box>

          </Box>
        )}
    </Box>
  );
};

export default ChatTextField;
