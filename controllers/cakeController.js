const redisClient = require('../config/redis'); // Import Redis client
const pool = require('../config/db');

// Get all cakes
exports.getAllCakes = async (req, res) => {
    try {
        // Check if the data is cached in Redis
        const cachedCakes = await redisClient.get('cakes');
        if (cachedCakes) {
            console.log('Cache hit');
            return res.status(200).json(JSON.parse(cachedCakes));
        }

        // Fetch from PostgreSQL if not cached
        const result = await pool.query('SELECT * FROM cakes');
        const cakes = result.rows;

        // Cache the data in Redis
        await redisClient.set('cakes', JSON.stringify(cakes), { EX: 3600 }); // Cache for 1 hour

        res.status(200).json(cakes);
    } catch (error) {
        console.error('Error fetching cakes:', error);
        res.status(500).json({ message: 'Error fetching cakes', error });
    }
};

// Get a single cake by ID
exports.getCakeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Check if the specific cake is cached
        const cachedCake = await redisClient.get(`cake:${id}`);
        if (cachedCake) {
            console.log('Cache hit for cake ID:', id);
            return res.status(200).json(JSON.parse(cachedCake));
        }

        // Fetch from PostgreSQL if not cached
        const result = await pool.query('SELECT * FROM cakes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        const cake = result.rows[0];

        // Cache the specific cake in Redis
        await redisClient.set(`cake:${id}`, JSON.stringify(cake), { EX: 3600 });

        res.status(200).json(cake);
    } catch (error) {
        console.error('Error fetching cake:', error);
        res.status(500).json({ message: 'Error fetching cake', error });
    }
};

// Create a new cake
exports.createCake = async (req, res) => {
    try {
        const { name, description, price, category, available, stock } = req.body;
        const result = await pool.query(
            'INSERT INTO cakes (name, description, price, category, available, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, category, available, stock]
        );

        // Clear the cache for all cakes
        await redisClient.del('cakes');

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating cake:', error);
        res.status(500).json({ message: 'Error creating cake', error });
    }
};

// Update a cake by ID
exports.updateCake = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, available, stock } = req.body;

        const result = await pool.query(
            'UPDATE cakes SET name = $1, description = $2, price = $3, category = $4, available = $5, stock = $6 WHERE id = $7 RETURNING *',
            [name, description, price, category, available, stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        const updatedCake = result.rows[0];

        // Clear the cache for all cakes and the specific cake
        await redisClient.del('cakes');
        await redisClient.del(`cake:${id}`);

        res.status(200).json(updatedCake);
    } catch (error) {
        console.error('Error updating cake:', error);
        res.status(500).json({ message: 'Error updating cake', error });
    }
};

// Delete a cake by ID
exports.deleteCake = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cakes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        // Clear the cache for all cakes and the specific cake
        await redisClient.del('cakes');
        await redisClient.del(`cake:${id}`);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting cake:', error);
        res.status(500).json({ message: 'Error deleting cake', error });
    }
};