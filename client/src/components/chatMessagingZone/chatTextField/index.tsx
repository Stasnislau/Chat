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
  const [volume, setVolume] = useState(0);
  const [timer, setTimer] = useState<number>(0);
  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message, store.state.currentRoomId);
      setMessage("");
    }
  };
  const CustomIconButton = ({ volume, ...rest }
    : { volume: number } & React.ComponentProps<typeof IconButton>
  ) => {
    return <IconButton {...rest} />;
  };
  const CircleIconButton = styled(CustomIconButton)`
  background-color: red;
  position: relative;
  &:hover{
    background-color: red;
  }
  &::before {
    content: "";
    position: absolute;
    border: 2px solid red; /* Change the border color as desired */
    border-radius: 50%;
    opacity: 0.5;
    overflow: hidden;
    background-color: #DC143C;
    width: calc(40px + ${({ volume }) => Math.sqrt(volume)}px);
    height: calc(40px + ${({ volume }) => Math.sqrt(volume)}px);
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

        if (!stream) {
          store.displayError("Cannot access microphone");
        }
        const currentRecorder = new window.MediaRecorder(stream);

        let blobData: Blob | null = null;
        setRecorder(currentRecorder);
        currentRecorder.ondataavailable = (event) => {
          blobData = event.data;
        }
        currentRecorder.onstop = () => {
          if (blobData) {
            setAudioBlob(blobData);
          }

        }
        currentRecorder.start();
        const updateVolume = () => {
          const currentRecorder = recorder;
          if (currentRecorder) {
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaStreamSource(currentRecorder.stream);
            const analyser = audioContext.createAnalyser();

            audioSource.connect(analyser);
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const update = () => {
              analyser.getByteFrequencyData(dataArray);
              const sum = dataArray.reduce((a, b) => a + b, 0);
              const average = sum / dataArray.length;
              setVolume(average);
              requestAnimationFrame(update);
            };

            update();
          }
        };

        updateVolume();
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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {!audioBlob ? (
        isRecording ?
          (<Box sx={{
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
            }}
            >

              <CircleIconButton
                volume={volume}
                sx={
                  {
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }
                }
                onClick={
                  () => {
                    setIsRecording(false);
                  }
                }
              >
                <Mic />
              </CircleIconButton>
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
