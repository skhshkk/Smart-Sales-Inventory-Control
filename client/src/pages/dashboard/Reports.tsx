import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Sale } from '@/types';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Reports() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
        const res = await api.get('/sales');
        setSales(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Sales Reports</h1>
        <p className="text-muted-foreground">View transaction history and invoices.</p>
      </div>

      <Card className="border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        <th className="p-4 pl-6">Date</th>
                        <th className="p-4">Invoice ID</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Cashier</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading Sales...</td></tr> : 
                     sales.map((sale: any) => (
                        <tr key={sale.id} className="hover:bg-white/[0.04] transition-colors group">
                            <td className="p-4 pl-6 text-foreground text-sm">
                                {new Date(sale.created_at).toLocaleDateString()} <span className="text-muted-foreground ml-1 text-xs">{new Date(sale.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </td>
                            <td className="p-4 font-mono text-xs text-accent bg-accent/10 rounded-md w-fit px-2 py-1 mx-4 my-2 block w-max border border-accent/20">
                                #{sale.id.slice(0,8)}
                            </td>
                            <td className="p-4 text-muted-foreground text-sm max-w-[300px] truncate">
                                {sale.sale_items?.length} items <span className="opacity-50 mx-1">|</span> {sale.sale_items?.map((i: any) => i.products?.name).join(', ')}
                            </td>
                            <td className="p-4 font-bold text-foreground">₹{sale.total_amount?.toLocaleString()}</td>
                            <td className="p-4 text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] uppercase font-bold text-foreground">
                                    {(sale.users?.email || 'U')[0]}
                                </span>
                                {sale.users?.email || 'N/A'}
                            </td>
                        </tr>
                    ))}
                    {!loading && sales.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
                                <FileText size={48} className="mb-4 opacity-20" />
                                No sales key recorded yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
}
