const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    let { email, password } = req.body;

    // Trimming and lowercasing email for mobile users
    email = email ? email.trim().toLowerCase() : '';

    console.log(`Login attempt for: ${email}`);

    try {
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            const isMatch = await user.matchPassword(password);
            console.log(`Password match: ${isMatch}`);

            if (isMatch) {
                return res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                });
            }
        } else {
            console.log(`User not found: ${email}`);
        }

        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    let { name, email, password } = req.body;
    email = email ? email.trim().toLowerCase() : '';

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user with Google
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    console.log('Google Login attempt with token length:', tokenId ? tokenId.length : 0);

    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error('CRITICAL: GOOGLE_CLIENT_ID is not defined in environment variables');
        return res.status(500).json({ message: 'Server configuration error: Google Client ID missing' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { name, email, sub, aud } = payload;

        console.log(`Token verification success for: ${email}`);
        console.log(`Audience check: Token(${aud}) vs Server(${process.env.GOOGLE_CLIENT_ID})`);

        if (aud !== process.env.GOOGLE_CLIENT_ID) {
            console.error('AUDIENCE MISMATCH: Token was not issued for this client ID');
            return res.status(401).json({ message: 'Token audience mismatch' });
        }

        const normalizedEmail = email ? email.trim().toLowerCase() : '';
        console.log(`Google Auth Success for: ${normalizedEmail}`);

        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email: normalizedEmail,
                googleId: sub,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Auth Error Details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        // Send the SPECIFIC error message back to help the user debug on mobile
        res.status(401).json({
            message: 'Google authentication failed',
            detail: error.message,
            suggestion: 'Please check your Google account settings or clear browser cache.'
        });
    }
};

module.exports = { authUser, registerUser, googleLogin };
