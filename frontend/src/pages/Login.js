import React, { useState, useEffect } from 'react';
import api from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post(`/api/users/login`, credentials);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password';
            const detail = err.response?.data?.detail ? ` (${err.response.data.detail})` : '';
            setError(msg + detail);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError('');
            console.log('Mobile Debug: Credential Response received', Object.keys(credentialResponse));
            const { credential } = credentialResponse;

            if (!credential) {
                console.error('Mobile Debug: No credential found in response!');
                setError('Google authentication failed: No token received.');
                return;
            }

            console.log('Mobile Debug: Google Token acquired (length):', credential.length);

            const res = await api.post(`/api/users/google-login`, {
                tokenId: credential,
            });

            console.log('Mobile Debug: Google Login Server Success:', res.data.email);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            console.error('Mobile Debug: Google Login Catch Error', err);
            const msg = err.response?.data?.message || 'Google Login Failed';
            const detail = err.response?.data?.detail ? `\nDetail: ${err.response.data.detail}` : '';
            const suggestion = err.response?.data?.suggestion ? `\nHint: ${err.response.data.suggestion}` : '';
            setError(msg + detail + suggestion);
        }
    };

    const handleError = () => {
        setError('Google Sign In was unsuccessful. Try again later');
    };

    return (
        <div className="login-container">
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>

            <div className="login-card">
                <h1>Analytics Pro</h1>
                <p>Sign in to unlock business insights</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleError}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        width="300"
                        text="continue_with_google"
                        ux_mode="redirect"
                    />
                </div>

                <div className="redirect-link" style={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Don't have an account?
                    <span
                        style={{ color: '#ff00cc', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
