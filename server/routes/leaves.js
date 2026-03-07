const express = require('express');
const { body, validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/leaves — Employee applies for leave
router.post(
    '/',
    auth,
    requireRole('employee'),
    [
        body('leaveType')
            .isIn(['Annual Leave', 'Sick Leave', 'Personal Leave'])
            .withMessage('Invalid leave type'),
        body('startDate').isISO8601().withMessage('Valid start date is required'),
        body('endDate').isISO8601().withMessage('Valid end date is required'),
        body('reason').trim().notEmpty().withMessage('Reason is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { leaveType, startDate, endDate, reason } = req.body;

            // Validate date range
            if (new Date(startDate) > new Date(endDate)) {
                return res.status(400).json({ message: 'Start date must be before end date' });
            }

            if (new Date(startDate) < new Date().setHours(0, 0, 0, 0)) {
                return res.status(400).json({ message: 'Start date cannot be in the past' });
            }

            const leave = new Leave({
                employee: req.user.id,
                leaveType,
                startDate,
                endDate,
                reason,
            });

            await leave.save();
            await leave.populate('employee', 'name email');

            res.status(201).json({ message: 'Leave request submitted', leave });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

// GET /api/leaves — Employee sees own, Employer sees all
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'employee') {
            query.employee = req.user.id;
        }

        const leaves = await Leave.find(query)
            .populate('employee', 'name email')
            .sort({ createdAt: -1 });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PATCH /api/leaves/:id — Employer approves or rejects
router.patch(
    '/:id',
    auth,
    requireRole('employer'),
    [body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected')],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const leave = await Leave.findById(req.params.id);
            if (!leave) {
                return res.status(404).json({ message: 'Leave request not found' });
            }

            if (leave.status !== 'Pending') {
                return res.status(400).json({ message: 'This request has already been processed' });
            }

            leave.status = req.body.status;
            await leave.save();
            await leave.populate('employee', 'name email');

            res.json({ message: `Leave request ${req.body.status.toLowerCase()}`, leave });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

module.exports = router;
