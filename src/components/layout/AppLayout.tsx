import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, ShoppingCart, Package, BarChart3, LogOut, Store } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
  const { signOut, role } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/dashboard/inventory', icon: Package },
    { label: 'POS', path: '/dashboard/pos', icon: ShoppingCart },
    { label: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
  ];

  return (
    <PageLayout className="flex flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.01] backdrop-blur-2xl shrink-0 z-20 flex flex-col transition-all duration-300">
        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(94,106,210,0.15)] group-hover:shadow-[0_0_20px_rgba(94,106,210,0.3)] transition-all duration-300">
                 <Store size={20} className="text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                  <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">RetailPro</h1>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold ml-0.5">Role: {role}</p>
              </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path; 
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white/[0.03] text-white shadow-inner border border-white/5' 
                    : 'text-muted-foreground hover:bg-white/[0.02] hover:text-white border border-transparent hover:border-white/5'
                }`}
              >
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-[0_0_10px_#5E6AD2]" />
                )}
                <Icon 
                    size={20} 
                    className={`transition-all duration-300 ${
                        isActive 
                        ? 'text-accent drop-shadow-[0_0_8px_rgba(94,106,210,0.5)] scale-110' 
                        : 'text-muted-foreground group-hover:text-white group-hover:scale-105'
                    }`} 
                />
                <span className={`font-medium text-sm tracking-wide ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-300`}>
                    {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="w-full justify-start text-muted-foreground hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 gap-3 group px-4"
          >
            <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
            <span className="group-hover:text-red-200">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="p-8 max-w-7xl mx-auto">
             <Outlet />
        </div>
      </main>
    </PageLayout>
  );
}
