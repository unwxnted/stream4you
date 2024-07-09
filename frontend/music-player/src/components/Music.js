import React, { useState } from "react";
import { getCookie } from "../utils/cookies";
import Player from "./Player";
import { Link } from "react-router-dom";

const Music = () => {
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
            if (!response.ok) {
                if(response.status===403){
                    window.location.href='http://localhost:3000/signin'
                }
                return;
            }
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
        setSearchResults([]);
        searchQuery();
        document.getElementById("results").innerHTML="Results:";
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
                <Link to="/upload">
                    <button>Upload a Song</button>
                </Link>
                
            </form>
            <div>
                <h2 id="results"></h2>
                <ul>
                    {searchResults.map((result, index) => (
                        <li key={index}> Title: {result.title}, Artist: {result.artist}  <Player id={result.song_id}/></li> 
                        
                    ))}
                </ul>
            </div>
            
        </div>
    );
};

export default Music;
