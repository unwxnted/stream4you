import React, { useState, useRef } from 'react';
import { getCookie } from '../utils/cookies';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioSrc, setAudioSrc] = useState('');
    const [audioId, setAudioId] = useState('');
    const [error, setError] = useState(null);
    const audioRef = useRef(null);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleLoadAudio = async () => {
        setError(null);
        setAudioSrc(''); 
        try {
            const jwt = getCookie('jwt');
            const response = await fetch(`http://localhost:3001/api/audio/stream/${audioId}`, {
                headers: {
                    'authorization': `${jwt}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            
            const contentType = response.headers.get('Content-Type');
            if (!contentType.startsWith('audio/')) {
                throw new Error('Response is not an audio file');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log('Audio URL:', audioUrl);
            setAudioSrc(audioUrl);
        } catch (error) {
            console.error('Error fetching audio:', error);
            setError('Failed to load audio. Please check the audio ID and try again.');
        }
    };

    return (
        <div>
            <h1>Music Player</h1>
            <input
                type="text"
                placeholder="Enter Audio ID"
                value={audioId}
                onChange={(e) => setAudioId(e.target.value)}
            />
            <button onClick={handleLoadAudio}>Load Audio</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <audio ref={audioRef} src={audioSrc} controls />
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default MusicPlayer;
