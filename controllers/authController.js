const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const usr = require('../models/User');

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  try {
      const existingUser = await usr.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      if (emailRegex.test(email)) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const uuid = uuidv4();
        if (password.length < 8) {
          return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        
        await usr.create(uuid, name, email, phone, passwordHash);
        res.status(201).json({ message: 'User registered : ' , email });
        console.log('Account Registered : ', email , 'Date :' , new Date().toLocaleString());
      
      } else {
        res.status(500).json({ error: 'Invalid Email Format' });
      }   
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request: ', req.body.email, 'Date :' , new Date().toLocaleString());
  const user = await usr.findByEmail(email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    console.log('Invalid credentials for email: ', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
  console.log('Account login : ', email , 'Date :' , new Date().toLocaleString());
};

module.exports = { register, login };