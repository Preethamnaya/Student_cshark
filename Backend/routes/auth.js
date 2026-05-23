const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_me_in_production';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
// Verify Google Token and Login/Register Student
router.post('/google', async (req, res) => {
  try {
    const { token, access_token } = req.body;
    let email, name, googleId;

    if (access_token) {
      // Verify via Google UserInfo API (for useGoogleLogin custom button flow)
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info from Google');
      }
      const payload = await response.json();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
    } else if (token) {
      // Verify via verifyIdToken (for standard GoogleLogin button flow)
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      googleId = payload.sub;
    } else {
      return res.status(400).json({ message: 'Missing token or access_token' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new student, status is 'pending' by default
      user = new User({
        name,
        email,
        googleId,
        role: 'student',
        status: 'pending'
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
});

// POST /api/auth/mock-student
// Mock Student Login for local development and testing without Google OAuth
router.post('/mock-student', async (req, res) => {
  try {
    const { email, name } = req.body;
    const studentEmail = email || 'student@nie.edu.in';
    const studentName = name || 'John Doe';
    const googleId = 'mock_google_id_' + Math.random().toString(36).substring(2, 11);

    let user = await User.findOne({ email: studentEmail });

    if (!user) {
      // Create new student, status is 'pending' by default
      user = new User({
        name: studentName,
        email: studentEmail,
        googleId,
        role: 'student',
        status: 'pending'
      });
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role, status: user.status },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Mock Student Login Failed' });
  }
});

// POST /api/auth/admin
// Hardcoded Admin Login
router.post('/admin', async (req, res) => {
  const { email, password } = req.body;

  // To be replaced with actual credentials provided by the user
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Generate JWT for admin
    const jwtToken = jwt.sign(
      { role: 'admin', status: 'approved' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    return res.json({ token: jwtToken, user: { role: 'admin', name: 'Administrator' } });
  }

  return res.status(401).json({ message: 'Invalid Admin Credentials' });
});

module.exports = router;
