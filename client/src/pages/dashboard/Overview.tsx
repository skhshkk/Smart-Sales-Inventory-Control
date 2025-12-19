import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
        const res = await api.get('/reports/dashboard');
        setStats(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading Dashboard...</div>;

  const chartData = viewMode === 'weekly' 
      ? (stats?.weeklyStats || []) 
      : (stats?.monthlyStats || []);
  
  if (chartData.length === 0) {
      if (viewMode === 'weekly') {
          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          days.forEach(d => chartData.push({ name: d, sales: 0 }));
      } else {
          // Fallback empty year
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          months.forEach(m => chartData.push({ name: m, sales: 0 }));
      }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:bg-white/[0.04] transition-colors">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                        <h3 className="text-2xl font-bold mt-2 text-foreground">₹{stats?.todayRevenue?.toLocaleString() || 0}</h3>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
                        <IndianRupee size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="hover:bg-white/[0.04] transition-colors">
             <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                        <h3 className="text-2xl font-bold mt-2 text-foreground">{stats?.totalSalesCount || 0}</h3>
                    </div>
                     <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                        <ShoppingBag size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="hover:bg-white/[0.04] transition-colors">
             <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                        <h3 className="text-2xl font-bold mt-2 text-foreground">{stats?.lowStockItems?.length || 0}</h3>
                    </div>
                     <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 border border-orange-500/20">
                        <AlertTriangle size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="hover:bg-white/[0.04] transition-colors">
             <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Growth (MoM)</p>
                        <h3 className={`text-2xl font-bold mt-2 ${Number(stats?.growth) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(stats?.growth) > 0 ? '+' : ''}{stats?.growth || 0}%
                        </h3>
                    </div>
                     <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                        <TrendingUp size={20} />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-foreground">{viewMode === 'weekly' ? 'Weekly' : 'Monthly'} Sales Overview</h3>
                    <select 
                        className="border border-white/10 rounded-md p-2 text-sm bg-white/[0.05] text-foreground outline-none focus:ring-1 focus:ring-accent"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value as 'weekly' | 'monthly')}
                    >
                        <option value="weekly" className="bg-gray-900">Last 7 Days</option>
                        <option value="monthly" className="bg-gray-900">Last 12 Months</option>
                    </select>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#5E6AD2" stopOpacity={1}/>
                                    <stop offset="100%" stopColor="#4e5ac0" stopOpacity={0.6}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#E2E2E2', fontSize: 12, fontWeight: 'bold'}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                width={80}
                                tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact', compactDisplay: 'short' }).format(value)}`} 
                                tick={{fill: '#E2E2E2', fontSize: 12, fontWeight: 'bold'}}
                            />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#0A0A0C', 
                                    borderRadius: '8px', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                    color: '#EDEDEF'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            />
                            <Bar 
                                dataKey="sales" 
                                fill="url(#barGradient)" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                                animationDuration={1000}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>

          {/* Low Stock Adjustments or Top Products */}
          <Card>
              <CardHeader>
                  <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {stats?.lowStockItems?.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                              <ShoppingBag className="mb-2 opacity-50" />
                              Inventory is healthy.
                          </div>
                      ) : (
                          stats?.lowStockItems?.map((product: Product) => (
                               <div key={product.id} className="flex items-center justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10 group hover:border-red-500/20 transition-colors">
                                    <div>
                                        <p className="font-medium text-red-200">{product.name}</p>
                                        <p className="text-xs text-red-400">Only {product.stock} left</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">Order</Button>
                               </div>
                          ))
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
