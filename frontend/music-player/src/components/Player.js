import React, { useState, useEffect } from 'react';
import { getCookie } from '../utils/cookies';

const Player = ({id}) => {
    const [audioSrc, setAudioSrc] = useState('');
    const [error, setError] = useState(null);

    const handleLoadAudio = async () => {
        setError(null);
        setAudioSrc(''); 
        try {
            console.log(id);
            const jwt = getCookie('jwt');
            const response = await fetch(`http://localhost:3001/api/audio/stream/${id}`, {
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

    useEffect(() => {
        handleLoadAudio();
    }, []);

    return (
        <div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <audio src={audioSrc} controls />
        </div>
    );
};

export default Player;
