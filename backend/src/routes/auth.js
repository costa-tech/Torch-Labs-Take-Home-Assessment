const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

// POST /api/auth/login — Sign in with email/password via Firebase REST API
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Use Firebase Auth REST API to sign in
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      const message =
        data.error.message === 'EMAIL_NOT_FOUND' || data.error.message === 'INVALID_PASSWORD' || data.error.message === 'INVALID_LOGIN_CREDENTIALS'
          ? 'Invalid email or password'
          : data.error.message;
      return res.status(401).json({ error: message });
    }

    res.json({
      token: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
      user: {
        uid: data.localId,
        email: data.email,
        displayName: data.displayName || data.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me — Get current user info from token
router.get('/me', async (req, res) => {
  try {
    const { auth } = require('../config/firebase');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
