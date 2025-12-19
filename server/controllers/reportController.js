import { supabase } from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Prepare date ranges
        const today = new Date();
        today.setHours(0,0,0,0);

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 6);
        lastWeek.setHours(0,0,0,0);

        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        lastYear.setDate(1);
        lastYear.setHours(0,0,0,0);

        // Run ALL queries in parallel for faster response
        const [
            todaySalesResult,
            totalCountResult,
            lowStockResult,
            weeklySalesResult,
            monthlySalesResult
        ] = await Promise.all([
            supabase.from('sales').select('total_amount').gte('created_at', today.toISOString()),
            supabase.from('sales').select('*', { count: 'exact', head: true }),
            supabase.from('products').select('*').lt('stock', 10).limit(5),
            supabase.from('sales').select('created_at, total_amount').gte('created_at', lastWeek.toISOString()),
            supabase.from('sales').select('created_at, total_amount').gte('created_at', lastYear.toISOString())
        ]);

        // Today's Revenue
        if (todaySalesResult.error) throw todaySalesResult.error;
        const todaySales = todaySalesResult.data;
        const todayRevenue = todaySales.reduce((acc, sale) => acc + (sale.total_amount || 0), 0);
        const todayCount = todaySales.length;

        // Total Count
        const totalSalesCount = totalCountResult.count || 0;

        // Low Stock
        const lowStockItems = lowStockResult.data || [];

        // Weekly Sales
        if (weeklySalesResult.error) throw weeklySalesResult.error;
        const weeklySales = weeklySalesResult.data;

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyStats = [];
        
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            weeklyStats.push({ name: dayName, date: d.toISOString().split('T')[0], sales: 0 });
        }
        weeklyStats.reverse();

        weeklySales.forEach(sale => {
            const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
            const dayStat = weeklyStats.find(s => s.date === saleDate);
            if (dayStat) {
                dayStat.sales += (sale.total_amount || 0);
            }
        });

        // Monthly Sales
        if (monthlySalesResult.error) throw monthlySalesResult.error;
        const monthlySales = monthlySalesResult.data;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyStats = [];

        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = months[d.getMonth()];
            const year = d.getFullYear();
            const key = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            monthlyStats.push({ name: monthName, key, sales: 0 });
        }
        monthlyStats.reverse();

        monthlySales.forEach(sale => {
            const d = new Date(sale.created_at);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthStat = monthlyStats.find(s => s.key === key);
            if (monthStat) {
                monthStat.sales += (sale.total_amount || 0);
            }
        });

        // Calculate MoM Growth
        let growth = 0;
        if (monthlyStats.length >= 2) {
            const currentMonth = monthlyStats[monthlyStats.length - 1].sales;
            const previousMonth = monthlyStats[monthlyStats.length - 2].sales;
            
            if (previousMonth === 0) {
                growth = currentMonth > 0 ? 100 : 0;
            } else {
                growth = ((currentMonth - previousMonth) / previousMonth) * 100;
            }
        }

        res.json({
            todayRevenue,
            todaySalesCount: todayCount,
            totalSalesCount,
            lowStockItems,
            weeklyStats,
            monthlyStats,
            growth: growth.toFixed(1)
        });

    } catch (err) {
        console.error('Dashboard Stats Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getSalesReport = async (req, res) => {
    // Basic aggregation
    // Real implementation would use complex SQL or Supabase aggregation
    // For now returning last 30 days summary
    res.json({ message: "Sales report data endpoint" });
};
