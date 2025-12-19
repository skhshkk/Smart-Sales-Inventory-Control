import { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Store, LogOut, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent } from '@/components/ui/card';

const demoChartData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 900 },
  { name: 'Wed', sales: 1600 },
  { name: 'Thu', sales: 1400 },
  { name: 'Fri', sales: 2100 },
  { name: 'Sat', sales: 3800 },
  { name: 'Sun', sales: 3200 },
  { name: 'Mon', sales: 2500 } // Duplicate for spacing if needed or just remove
];

export default function DemoDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/demo/dashboard').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="p-8 text-muted-foreground">Loading Demo...</div>;

  return (
    <PageLayout className="flex flex-row h-screen overflow-hidden">
      {/* Sidebar Stub for Demo */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.01] backdrop-blur-2xl shrink-0 z-20 flex flex-col">
        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(94,106,210,0.15)]">
                    <Store size={20} className="text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">RetailPro</h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold ml-0.5">Demo Mode</p>
                </div>
            </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
            <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] text-white shadow-inner border border-white/5">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-[0_0_10px_#5E6AD2]" />
                <LayoutDashboard size={20} className="text-accent drop-shadow-[0_0_8px_rgba(94,106,210,0.5)] scale-110" />
                <span className="font-medium text-sm tracking-wide translate-x-1">Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground/50 cursor-not-allowed group">
                <Package size={20} className="group-hover:text-muted-foreground transition-colors" />
                <span className="font-medium text-sm tracking-wide">Inventory <Lock size={12} className="inline ml-1 opacity-50"/></span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground/50 cursor-not-allowed group">
                <ShoppingCart size={20} className="group-hover:text-muted-foreground transition-colors" />
                <span className="font-medium text-sm tracking-wide">POS <Lock size={12} className="inline ml-1 opacity-50"/></span>
            </div>
        </nav>
        
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
             <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white transition-colors group">
                <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                <span className="group-hover:text-red-200">Exit Demo</span>
             </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="bg-orange-500/10 border-b border-orange-500/20 text-orange-200 p-2 text-center text-xs font-mono tracking-widest uppercase">
            Read-Only Preview Mode
        </div>

        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Dashboard Overview</h1>
                <p className="text-muted-foreground">Real-time business performance metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:bg-white/[0.04] transition-colors">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <h3 className="text-3xl font-bold mt-2 text-foreground">₹{stats.totalRevenue?.toLocaleString()}</h3>
                    </CardContent>
                </Card>
                <Card className="hover:bg-white/[0.04] transition-colors">
                     <CardContent className="p-6">
                        <p className="text-sm font-medium text-muted-foreground">Sales Count</p>
                        <h3 className="text-3xl font-bold mt-2 text-foreground">{stats.totalSales}</h3>
                     </CardContent>
                </Card>
                <Card className="hover:bg-white/[0.04] transition-colors">
                     <CardContent className="p-6">
                        <p className="text-sm font-medium text-muted-foreground">Top Product</p>
                        <h3 className="text-2xl font-bold mt-2 text-foreground truncate" title={stats.topProducts?.[0]?.name}>{stats.topProducts?.[0]?.name || 'N/A'}</h3>
                     </CardContent>
                </Card>
            </div>
            
            <Card className="border-white/10 bg-white/[0.02]">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-foreground">Sales Analytics (Demo)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={demoChartData}>
                                <defs>
                                    <linearGradient id="demoBarGradient" x1="0" y1="0" x2="0" y2="1">
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
                                    tickFormatter={(value) => `₹${value}`} 
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
                                    fill="url(#demoBarGradient)" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40} 
                                    animationDuration={1000}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </PageLayout>
  );
}
