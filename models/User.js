const client = require('../config/db');

const User = {
    create: async (uuid, name, email, phone_number, passwordHash) => {
        const query = 'INSERT INTO users (uuid, name, email, phone, password) VALUES ($1, $2, $3, $4, $5)';
        return client.query(query, [uuid, name, email, phone_number, passwordHash]);
    },
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);
        return result.rows[0];
    },
};

module.exports = User;