import React, { useState } from "react";
import { getCookie } from "../utils/cookies";

const MusicSearcher = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const searchQuery = async () => {
        const jwt = getCookie('jwt');

        try {
            const response = await fetch(`http://localhost:3001/api/audio/query?search=${searchTerm}`, {
                headers: {
                    'authorization': `${jwt}`
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setSearchResults(data);
        } catch (e) {
            console.error('Error fetching search results:', e);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchQuery();
    };

    return (
        <div>
            <h1>Music Searcher</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search for music"
                />
                <button type="submit">Search</button>
            </form>
            <div>
                <h2>Results:</h2>
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}> ID: {result.song_id}, Title: {result.title}</li>
                        
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MusicSearcher;
