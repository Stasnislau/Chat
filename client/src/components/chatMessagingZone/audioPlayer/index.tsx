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

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const audio = audioPlayer.current;
    if (audio) {
      const prevValue = isPlaying;
      setIsPlaying(!prevValue);
      if (!prevValue) {
        audio.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audio.pause();
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  const whilePlaying = () => {
    if (audioPlayer && audioPlayer.current) {
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  useEffect(() => {
    if (audioPlayer && audioPlayer.current) {
      audioPlayer.current.addEventListener('ended', () => {
        setIsPlaying(false);
        if (audioPlayer && audioPlayer.current) {
          return;
        }
        if (audioPlayer.current === null) return;
        audioPlayer.current.currentTime = 0;
        cancelAnimationFrame(animationRef.current);
      });
    }
  }, [audioPlayer?.current?.addEventListener]);

  useEffect(() => {
    const audio = audioPlayer.current;
    if (audio) {
      const handleCanPlayThrough = () => {
        audio.play();
        audio.pause();
        setDuration(audio.duration);
      };
      audio.addEventListener("canplaythrough", handleCanPlayThrough);
      return () => {
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
        cancelAnimationFrame(animationRef.current);
      };
    }
  }, [audioPlayer?.current?.addEventListener]);

  return (
    <Box sx={
      {
        alignItems: "center",
        display: "flex",
        width: "100%",
        maWidth: "300px",
      }
    }>
      <audio ref={audioPlayer} preload="auto">
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

      }>{calculateTime(Number(audioPlayer.current?.currentTime))}</Typography>
      <Slider
        aria-label="time-indicator"
        size="small"
        value={audioPlayer.current?.currentTime || 0}
        min={0}
        step={(audioPlayer.current?.duration ? audioPlayer.current?.duration / 100 : 0)}
        max={audioPlayer.current?.duration || 0}
        onChange={(_, value) => {
          console.log("Value: ", value)
          if (audioPlayer && audioPlayer.current) {
            audioPlayer.current.currentTime = Number(value);
          }
        }}
        sx={{
          color: 'red',
          width: {
            mobile: '50px',
            tablet: '200px',
            laptop: '300px',
            desktop: '400px',
          },
          height: 4,
          '& .MuiSlider-thumb': {
            width: 8,
            height: 8,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&:before': {
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
            },
            '&.Mui-active': {
              width: 20,
              height: 20,
            },
          },
          '& .MuiSlider-rail': {
            opacity: 0.28,
          },
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