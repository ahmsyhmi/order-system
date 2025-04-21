const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
});

client.on('error', (err) => console.log('Redis Client Error:', err));

(async () => {
    try {
        await client.connect();
        console.log('Redis connected');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

module.exports = client;