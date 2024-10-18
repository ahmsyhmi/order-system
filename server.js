const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const cakeRoutes = require('./routes/cakeRoutes');
const db = require('./config/db');
const client = require('./config/db');

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/cakes', cakeRoutes);

client.connect().then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.error('Error connecting to the database:', error);
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});