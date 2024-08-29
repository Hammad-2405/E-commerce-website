const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, username, password, role } = req.body;

    try {
        const user = await User.create({ name, email, username, password, role });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ user, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login };