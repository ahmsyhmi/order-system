const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// const createTables = async () => {
//     const createUsersTable = `
//         CREATE TABLE IF NOT EXISTS users (
//             uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//             name VARCHAR(100) NOT NULL,
//             email VARCHAR(100) UNIQUE NOT NULL,
//             phone VARCHAR(15) NOT NULL,
//             password VARCHAR(255) NOT NULL
//         );
//     `;
//     const createCakesTable = `
//         CREATE TABLE IF NOT EXISTS cakes (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(100) NOT NULL
//         );
//     `;
//     const createSizesTable = `
//         CREATE TABLE IF NOT EXISTS sizes (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(50) NOT NULL
//         );
//     `;
//     const createFlavorsTable = `
//         CREATE TABLE IF NOT EXISTS flavors (
//             id SERIAL PRIMARY KEY,
//             name VARCHAR(50) NOT NULL
//         );
//     `;
//     const createOrdersTable = `
//         CREATE TABLE IF NOT EXISTS orders (
//             id SERIAL PRIMARY KEY,
//             user_id UUID REFERENCES users(uuid) ON DELETE CASCADE,
//             size VARCHAR(50),
//             flavor VARCHAR(50),
//             status VARCHAR(20) DEFAULT 'pending'
//         );
//     `;

//     try {
//         await client.query(createUsersTable);
//         await client.query(createCakesTable);
//         await client.query(createSizesTable);
//         await client.query(createFlavorsTable);
//         await client.query(createOrdersTable);
//         console.log("Tables created or already exist.");
//     } catch (error) {
//         console.error("Error creating tables: ", error);
//     }
// };

// createTables();

module.exports = client;