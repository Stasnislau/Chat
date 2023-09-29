import React, { useState, useContext, useRef, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Button,
  styled,
} from "@mui/material";
import { Send, Mic } from "@mui/icons-material";
import { Context } from "../../../App";
import moment from "moment";
import useMicFrequency from "../../../hooks/useMicFrequency";
interface ChatTextFieldProps {
  onSend: (text: string, room: string) => void;
  onRecord: (recording: Blob, text: string) => void;
}

const ChatTextField = ({ onSend, onRecord }: ChatTextFieldProps) => {
  const [isRecording, setIsRecording] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const store = useContext(Context);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [recordedText, setRecordedText] = useState<string>("");
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
    const recordText = () => {
      if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.start();
        recognition.onresult = (event: any) => {
          if (isRecording) {
            const speechResult = event.results[0][0].transcript;
            setRecordedText(speechResult);
          }
          else {
            recognition.stop();
          }
        }
        recognition.onspeechend = () => {
          recognition.stop();
        }
        recognition.onerror = (event: any) => {
          console.log(event.error);
        }
      } else {
        return
      }
    }
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
        };
        currentRecorder.onstop = async () => {
          const blob = new Blob(chunks, { 'type': currentRecorder.mimeType });
          const metadata = {
            type: "audio/webm",
            duration: timer,
          };
          const blobWithMetadata = new Blob([blob, JSON.stringify(metadata)]);
          blobWithMetadata.arrayBuffer().then((buffer) => {
            setAudioBlob(blobWithMetadata);
            chunks = [];
          })
        }
        currentRecorder.start();
        recordText();
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
    if (audioBlob) {
      onRecord(audioBlob, recordedText);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setTimer((timer) => timer + 50);
      }, 50);
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
      {
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
                {moment.utc(timer).format("mm:ss")}
              </Typography>

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
                <Send />
              </IconButton>
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
      }
    </Box >
  );
};

export default ChatTextField;
