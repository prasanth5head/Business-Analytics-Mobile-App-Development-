import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post(`/api/users`, {
                name,
                email,
                password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="login-container">
            {/* Background ambience */}
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>

            <div className="login-card">
                <h1>Create Account</h1>
                <p>Join Analytics Pro today</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Register</button>
                </form>

                <div className="redirect-link">
                    Already have an account?
                    <span onClick={() => navigate('/login')}>Login</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
