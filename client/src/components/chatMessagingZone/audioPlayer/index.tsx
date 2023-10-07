import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';


const AudioPlayer = ({
  audioUrl: audioUrl,
}:
  {
    audioUrl: string;
  }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current?.duration) {
      setCurrentTime(audioPlayer.current.currentTime);
      setDuration(audioPlayer.current.duration);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(whilePlaying, 50);
      return () => clearInterval(intervalId);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);


  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = newValue as number;
      setCurrentTime(newValue as number);
    }
  };

  useEffect(() => {
    audioPlayer.current?.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    return () => {
      audioPlayer.current?.removeEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    };
  }, []);



  return (
    <Box sx={
      {
        alignItems: "center",
        display: "flex",
        width: "100%",
        maWidth: "300px",
      }
    }>
      <audio ref={audioPlayer} preload="auto" onTimeUpdate={
        () => {
          setCurrentTime(prev => audioPlayer?.current?.currentTime ?? prev);
        }
      }>
        <source src={audioUrl} />
      </audio>
      <IconButton onClick={togglePlayPause}>
        {isPlaying ? <Pause /> : <PlayArrow className="play" />}
      </IconButton>

      <Typography sx={
        {
          fontSize: '16px',
          marginRight: '10px',
        }

      }>{calculateTime(currentTime)}</Typography>
      <Slider
        aria-label="time-indicator"
        size="small"
        value={currentTime}
        min={0}
        max={duration}
        onChange={handleSliderChange}
        sx={{
          color: 'secondary.main',
          width: {
            mobile: '50px',
            tablet: '200px',
            laptop: '300px',
            desktop: '400px',
          },
          height: 4,

        }}
      />
      <Typography sx={
        {
          fontSize: '16px',
          marginLeft: '10px',
        }
      }>{(duration && !isNaN(duration)) && calculateTime(duration)}</Typography>

    </Box >
  );
};

export default AudioPlayer;