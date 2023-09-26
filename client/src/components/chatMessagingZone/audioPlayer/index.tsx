import { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import "./index.scss";

const AudioPlayer = ({
    audioBlob
}:
    {
        audioBlob: Blob
    }) => {
    // state
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    // references
    const audioPlayer = useRef<HTMLAudioElement>(null);
    const progressBar = useRef<HTMLInputElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        console.log(audioPlayer?.current);
        if (audioPlayer && audioPlayer.current && audioPlayer.current?.readyState > 0) {
            const audio = audioPlayer.current;
            if (audio) {
                const seconds = Math.floor(audio.duration);
                console.log(seconds)
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
            changePlayerCurrentTime();
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    };

    const changeRange = () => {
        const audio = audioPlayer.current;
        if (audio && progressBar.current) {
            audio.currentTime = Number(progressBar.current.value);
            changePlayerCurrentTime();
        }
    };

    const changePlayerCurrentTime = () => {
        if (progressBar.current) {
            progressBar.current.style.setProperty('--seek-before-width', `${Number(progressBar.current.value) / duration * 100}%`);
            setCurrentTime(Number(progressBar.current.value));
        }
    };

    const backThirty = () => {
        if (progressBar.current) {
            progressBar.current.value = (Number(progressBar.current.value) - 30).toString();
            changeRange();
        }
    };

    const forwardThirty = () => {
        if (progressBar.current) {
            progressBar.current.value = (Number(progressBar.current.value) + 30).toString();
            changeRange();
        }
    };


    return (
        <div className="audio-player">
            <audio ref={audioPlayer} src={URL.createObjectURL(audioBlob)} preload="metadata"></audio>
            <IconButton onClick={togglePlayPause} className="play-pause">
                {isPlaying ? <Pause /> : <PlayArrow className="play" />}
            </IconButton>

            <div className="current-time">{calculateTime(currentTime)}</div>

            <div>
                <input type="range" className="progress-bar" defaultValue="0" ref={progressBar} onChange={changeRange} />
            </div>

            <div className="duration">{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
        </div>
    );
};

export default AudioPlayer;