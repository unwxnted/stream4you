import React, { useEffect, useState } from 'react';
import { getCookie } from '../utils/cookies';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkCookie = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/audio/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 400) document.cookie = "jwt=; path=/;";
            } catch (error) {
                console.log(error);
            }
            if (getCookie("jwt")) {
                window.location.href = "http://localhost:3000/music";
            }
        };

        checkCookie();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const response = await fetch('http://localhost:3001/api/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password })
            });
            if (!response.ok) throw new Error('Failed to sign in');
            const data = await response.json();
            document.cookie = `jwt=${data.jwt}; path=/;`;
            setMessage('Signin successful!');
            console.log('Response:', data);
            console.log(document.cookie);
            window.location.href="http://localhost:3000/music"
        } catch (error) {
            console.error('Error:', error);
            setMessage('Signin failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
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
                <button type="submit">Sign In</button>
            </form>
            <div>
                <p>Do not have an account? <Link to="/signup">Sign up</Link></p>
                
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignIn;
