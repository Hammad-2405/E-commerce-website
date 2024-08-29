const User = require('../models/User');
const jwt = require('jsonwebtoken');

const checkStore = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
    
        if (!user || !user.seller || !user.seller.store) {
          return res.status(404).json({ hasStore: false });
        }
    
        res.json({ hasStore: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

const addStore = async (req, res) => {
  try {
    const { name, owner } = req.body;

    if (!name || !owner) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the seller by username (owner)
    const seller = await User.findOne({ username: owner });

    if (!seller || seller.role !== 'seller') {
      return res.status(400).json({ error: 'User not found or not a seller' });
    }

    // Initialize the seller field if it doesn't exist
    if (!seller.seller) {
      seller.seller = {};
    }

    // Check if the seller already has a store
    if (seller.seller.store) {
      return res.status(400).json({ error: 'Seller already has a store' });
    }

    // Create the store
    const store = {
      name,
      owner: seller._id,
      products: [],
    };

    // Assign the store to the seller's schema
    seller.seller.store = store;

    // Save the updated seller
    await seller.save();

    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {checkStore, addStore};