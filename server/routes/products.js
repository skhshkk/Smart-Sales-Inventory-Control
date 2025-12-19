import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Open for reading (Logged in users or public demo if needed, but requirements say "Admin Demo" etc. so we likely need auth middleware even for reading? 
// Requirement 1: Public Demo Mode (No Login) -> Inventory List. So GET /products should make sure it works without auth if needed, or we implement separate /demo route.
// However, User Roles says "Admin - Full Access", "Manager - Inventory + Reports".
// Let's protect WRITE operations. READ operations can be public or auth'd purely based on the route.
// Requirement 1 implies there IS a public mode.
// "Accessible from landing page... Preloaded demo data... Inventory list"
// So GET /products might need to be open or we use the /api/demo endpoints for the public data?
// "Dashboard must include... Inventory management" - this implies logged in dashboard.
// Requirement 5: "Inventory Management" -> Add/Update/Delete.
// I will keep GET /products public or separate. Let's make it public for now to support the "Public Demo" easily, or use a separate /api/demo/products.
// Requirement "API STRUCTURE" lists /api/products separate from /api/demo.
// Let's allow GET /products to be public?
// Actually, for "Public Demo" it says "Read-only access... Preloaded demo data".
// Real inventory management is for the logged in users.
// I will verify token optionally or just allow public read for now as per "Public Demo Mode" which shows "Inventory list".
// But let's follow standard SaaS: API is protected, Demo gets its own read-only sandbox or just reads the same data.
// I will leave GET public for now to simplify "Public Demo Mode".
router.get('/', getProducts);

router.post('/', authMiddleware, requireRole(['admin', 'manager']), createProduct);
router.put('/:id', authMiddleware, requireRole(['admin', 'manager']), updateProduct);
// router.delete('/:id', authMiddleware, requireRole(['admin', 'manager']), deleteProduct);
// It is already restricted. I will just touch it to be sure.
router.delete('/:id', authMiddleware, requireRole(['admin', 'manager']), deleteProduct);

export default router;
