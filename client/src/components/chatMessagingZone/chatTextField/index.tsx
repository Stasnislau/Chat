import React, { useState, useContext, useRef, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Button,
  styled,
  Icon,
} from "@mui/material";
import { Send, Mic } from "@mui/icons-material";
import { Context } from "../../../App";
import moment from "moment";
import useMicFrequency from "../../../hooks/useMicFrequency";
import AudioPlayer from "../audioPlayer";
interface ChatTextFieldProps {
  onSend: (text: string, room: string) => void;
  onRecord: (recording: Blob) => void;
}

const ChatTextField = ({ onSend, onRecord }: ChatTextFieldProps) => {
  const [isRecording, setIsRecording] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const store = useContext(Context);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message, store.state.currentRoomId);
      setMessage("");
    }
  };
  const frequency = useMicFrequency({ isEnabled: Boolean(isRecording) });
  const CustomBox = ({ volume, ...rest }
    : { volume: number } & React.ComponentProps<typeof Box>
  ) => {
    return <Box {...rest} />;
  };
  const StyledBox = styled(CustomBox)`
  & {
    position: absolute;
    border: 2px solid red; 
    border-radius: 50%;
    opacity: 0.5;
    overflow: hidden;
    background-color: #DC143C;
    width: calc(40px + ${({ volume }) => Math.sqrt(volume) * 1}px);
    height: calc(40px + ${({ volume }) => Math.sqrt(volume) * 1}px);
    top: calc(50%-${({ volume }) => volume}px);
    left: calc(50%-${({ volume }) => volume}px);
  }
`;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };
  useEffect(() => {
    const func = async () => {
      if (isRecording === null) return;
      if (isRecording) {
        setAudioBlob(null);
        setTimer(0);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        let chunks: Blob[] = [];

        if (!stream) {
          store.displayError("Cannot access microphone");
        }
        const currentRecorder = new window.MediaRecorder(stream);

        setRecorder(currentRecorder);
        currentRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        }
        currentRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          blob.arrayBuffer().then((buffer) => {
            console.log("novi buffer", buffer);
            setAudioBlob(blob);
            chunks = [];
          })
        }
        currentRecorder.start();
      } else if (!isRecording) {
        const currentRecorder = recorder;
        if (currentRecorder) {
          currentRecorder.stop();
          currentRecorder.stream.getTracks().forEach((track) => track.stop());
          setRecorder(null);
          setIsRecording(null);
        }
      }
    };
    func();
  }
    , [isRecording]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true });
  }
    , []);
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {!audioBlob ? (
        isRecording ?
          (<Box sx={{
            position: "relative",
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            border: "1px solid black",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
            height: "100%",

          }}>
            <Box sx={{
              height: "100%",
              boxSizing: "border-box",
            }}
            >
              <IconButton
                sx={
                  {
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "red",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }
                }
                onClick={
                  () => {
                    setIsRecording(false);
                  }
                }
              >
                <StyledBox
                  volume={frequency}
                  sx={
                    {
                      pointerEvents: "none",
                      width: "100%",
                      position: "absolute",
                      height: "100%",
                    }
                  }
                />
                <Mic />
              </IconButton>
            </Box>
            <Box sx={{
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
            }}>
              <Button
                onClick={() => {
                  recorder?.pause();
                  setIsRecording(null);
                  setAudioBlob(null);
                }}
                sx={{
                  color: "red",

                }}
              >
                Stop
              </Button>
            </Box>
            <Box
              sx={{
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",

              }}
            >
              <Typography sx={{
                marginRight: "10px",
                marginLeft: "10px",
              }}>
                {moment.utc(timer * 1000).format("mm:ss")}
              </Typography>

            </Box>
          </Box>)
          : (
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
                        if (isRecording === null)
                          setIsRecording(true);
                      }
                    }
                    >
                      <Mic />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />)
      )
        : (
          <Box sx={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            border: "1px solid black",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "primary.main",
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
                    if (isRecording === null)
                      setIsRecording(true);
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
              <AudioPlayer audioBlob={audioBlob} />
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
                // TODO: send audio blob to server

              }}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        )}
    </Box >
  );
};

export default ChatTextField;
