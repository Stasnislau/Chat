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
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const progressBar = useRef<HTMLInputElement>(null);
    const animationRef = useRef<number>(0);
    useEffect(() => {
        if (audioPlayer && audioPlayer.current && audioPlayer.current?.readyState > 0) {
            const audio = audioPlayer.current;
            if (audio) {
                const seconds = Math.floor(audio.duration);
                setDuration(seconds);
                if (progressBar.current) {
                    progressBar.current.max = seconds.toString();
                }
            }
        }
    }, [audioPlayer?.current?.onloadedmetadata, audioPlayer?.current?.readyState]);

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
        const audio = audioPlayer.current;
        if (audio && progressBar.current) {
            progressBar.current.value = audio.currentTime.toString();
            setCurrentTime(audio.currentTime);
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    };

    useEffect(() => {
        const audio = audioPlayer.current;
        if (audio && progressBar.current) {
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                setCurrentTime(0);
                if (!progressBar?.current)
                    return;
                progressBar.current.value = '0';
                cancelAnimationFrame(animationRef.current);
            });
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
            <audio ref={audioPlayer} src={audioUrl} preload="metadata" />
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
                ref={progressBar}
                aria-label="time-indicator"
                size="small"
                value={currentTime}
                min={0}
                step={duration / 100}
                max={duration}
                onChange={(_, value) => {
                    console.log(value, "value")
                    setCurrentTime(value as number)
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