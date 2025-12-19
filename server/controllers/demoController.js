import { supabase } from '../config/supabase.js';

export const getDemoDashboard = async (req, res) => {
    try {
        // Return dummy or real data for the public page
        // We reuse similar logic to reportController but no auth required
        // and strictly read only.
        
        const { count } = await supabase.from('sales').select('*', { count: 'exact', head: true });
        
        res.json({
            demoMode: true,
            totalRevenue: 125000, // Fake data for impact or real
            totalSales: count || 450,
            topProducts: [
                { name: 'Wireless Mouse', sales: 120 },
                { name: 'Monitor 24"', sales: 45 }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
