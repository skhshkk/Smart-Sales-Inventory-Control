import express from 'express';
import { getDemoDashboard } from '../controllers/demoController.js';

const router = express.Router();

router.get('/dashboard', getDemoDashboard);

export default router;
