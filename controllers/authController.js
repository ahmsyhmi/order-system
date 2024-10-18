const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const usr = require('../models/User');

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
      // Generate salt
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Generate UUID
      const uuid = uuidv4();

      await usr.create(uuid, name, email, phone, passwordHash);
      res.status(201).json({ message: 'User registered' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // Find user and verify password
  const user = await usr.findByEmail(email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { register, login };