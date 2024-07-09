import React, { useState } from 'react';
import { getCookie } from '../utils/cookies';
import { Link } from 'react-router-dom';

const MusicUploader = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [genre, setGenre] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleArtistChange = (e) => {
        setArtist(e.target.value);
    };

    const handleGenreChange = (e) => {
        setGenre(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('genre', genre);
        formData.append('upfile', file);
        
        try {
            const response = await fetch('http://localhost:3001/api/audio/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'authorization': `${getCookie('jwt')}`
                }
            });
            
            if (response.ok) {
                setMessage('File uploaded successfully');
            } else {
                setMessage('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <div>
            <h2>Upload Music</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" value={title} onChange={handleTitleChange} />
                </div>
                <div>
                    <label htmlFor="artist">Artist:</label>
                    <input type="text" id="artist" value={artist} onChange={handleArtistChange} />
                </div>
                <div>
                    <label htmlFor="genre">Genre:</label>
                    <input type="text" id="genre" value={genre} onChange={handleGenreChange} />
                </div>
                <div>
                    <label htmlFor="file">Choose a file:</label>
                    <input type="file" id="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Upload</button>
                <Link to="/music">
                    <button>Search Songs</button>
                </Link>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default MusicUploader;
