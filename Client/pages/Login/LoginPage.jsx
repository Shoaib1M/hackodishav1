import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/AuthContext.jsx';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = isRegistering ? 'signup' : 'login';

        try {
            const requestBody = isRegistering
                ? { username, email, password }
                : { email, password };

            const response = await fetch(`http://localhost:5000/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                if (isRegistering) {
                    alert('Registration successful! Please log in.');
                    setIsRegistering(false);
                    setUsername('');
                } else {
                    login(data);
                    navigate('/');
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <div className="login-form-card">
                    <h2>{isRegistering ? 'Register' : 'Log In'}</h2>
                    <form onSubmit={handleAuth}>
                        {isRegistering && (
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            {isRegistering ? 'Register' : 'Log In'}
                        </button>
                    </form>
                    <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: 'pointer', marginTop: '1rem' }}>
                        {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;