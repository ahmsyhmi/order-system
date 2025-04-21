const express = require('express');
const {
    getAllCakes,
    getCakeById,
    createCake,
    updateCake,
    deleteCake,
} = require('../controllers/cakeController');

const router = express.Router();

// Middleware to restrict access to localhost
const restrictToLocalhost = (req, res, next) => {
    const allowedHosts = ['localhost', '127.0.0.1'];
    if (allowedHosts.includes(req.hostname)) {
        return next();
    }
    return res.status(403).json({ message: 'Access forbidden' });
};

// Apply the middleware to all routes in this router
router.use(restrictToLocalhost);

// Define routes
router.get('/', getAllCakes); // Get all cakes
router.get('/:id', getCakeById); // Get a single cake by ID
router.post('/', createCake); // Create a new cake
router.put('/:id', updateCake); // Update a cake by ID
router.delete('/:id', deleteCake); // Delete a cake by ID

module.exports = router;