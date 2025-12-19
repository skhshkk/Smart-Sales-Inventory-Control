import express from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/reportController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/sales', authMiddleware, requireRole(['admin', 'manager']), getSalesReport);

export default router;
