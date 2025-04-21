const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Register a new user
router.get('/register', register);

// Login user
router.get('/login', login);

module.exports = router;