import express from 'express';
import { createSale, getSales } from '../controllers/saleController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, requireRole(['admin', 'manager', 'cashier']), getSales);
router.post('/', authMiddleware, requireRole(['admin', 'manager', 'cashier']), createSale);

export default router;
