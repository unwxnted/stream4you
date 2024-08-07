import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie } from '../utils/cookies';

const SignUp = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(()=> {
        if(getCookie("jwt")) window.location.href="http://localhost:3000/music";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:3001/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });
            if (!response.ok) throw new Error('Failed to sign up');
            const data = await response.json();
            document.cookie = `jwt=${data.jwt}; path=/;`;
            setMessage('Signup successful!');
            console.log('Response:', data);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Signup failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <div>
                <p>Do you already have an account? <Link to="/signin">Sign in</Link></p>
                
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignUp;
