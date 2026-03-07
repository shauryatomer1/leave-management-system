const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/signup
router.post(
    '/signup',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').isIn(['employee', 'employer']).withMessage('Role must be employee or employer'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { name, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            // Create user
            const user = new User({ name, email, password, role });
            await user.save();

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'Account created successfully',
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: { id: user._id, name: user.name, email: user.email, role: user.role },
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

module.exports = router;
