import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const { cart, addToCart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
        const res = await api.get('/products', { params: { search } });
        setProducts(res.data);
    } catch (err) {
        console.error(err);
    }
  };

  const handleCheckout = async () => {
      if (cart.length === 0) return;
      setProcessing(true);
      try {
          const payload = {
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: total,
            userId: null 
          };

          await api.post('/sales', payload);
          setSuccess(true);
          
          setTimeout(() => {
              clearCart();
              setSuccess(false);
              fetchProducts(); 
          }, 2000);

      } catch (err: any) {
          console.error(err);
          const errorMessage = err.response?.data?.error || err.message;
          alert(`Checkout failed: ${errorMessage}`);
      } finally {
          setProcessing(false);
      }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-6 animate-fade-in">
      {/* Product Grid Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6 shrink-0">
            <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Point of Sale</h1>
            <div className="relative w-72">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input 
                    type="text" 
                    placeholder="Search products..." 
                    className="pl-10 bg-white/[0.05] border-white/10 text-foreground placeholder:text-muted-foreground/50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white/[0.02] border border-white/10 rounded-xl p-6 shadow-inner scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <p>No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {products.map(product => (
                        <div key={product.id} 
                             className="border border-white/10 rounded-xl p-4 flex flex-col hover:border-accent hover:bg-white/[0.04] cursor-pointer transition-all duration-200 bg-white/[0.02] group"
                             onClick={() => addToCart(product)}
                        >
                            <div className="w-full h-32 mb-4 bg-black/20 rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                                        <ShoppingBag size={24} />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="mt-4 flex items-end justify-between">
                                <span className="font-bold text-lg text-foreground">₹{Number(product.price).toLocaleString('en-IN')}</span>
                                <div className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${product.stock > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {product.stock} Left
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-white/[0.02] border border-white/10 flex flex-col h-full rounded-xl overflow-hidden shrink-0 shadow-xl backdrop-blur-sm">
        <div className="p-5 border-b border-white/5 bg-white/[0.01]">
            <h2 className="font-bold text-lg flex items-center gap-2 text-foreground">
                <ShoppingCart size={20} className="text-accent" /> Current Sale
            </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center">
                        <ShoppingCart size={32} className="opacity-20" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium mb-1">Cart is empty</p>
                        <p className="text-xs opacity-60">Scan or click products to add</p>
                    </div>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex-1 min-w-0 mr-3">
                            <div className="font-medium text-sm text-foreground line-clamp-1 mb-1">{item.name}</div>
                            <div className="text-muted-foreground text-xs">₹{item.price} each</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-white/[0.02] rounded-lg p-0.5 border border-white/5">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                    <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                    <Plus size={12} />
                                </button>
                            </div>
                            <div className="font-bold text-sm w-16 text-right text-foreground">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="p-5 border-t border-white/5 bg-white/[0.01] space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total Amount</span>
                <span className="font-bold text-2xl text-accent">₹{total.toLocaleString('en-IN')}</span>
            </div>
            
            <Button 
                className={`w-full h-12 text-lg font-bold shadow-lg transition-all active:scale-[0.98] ${success ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                onClick={handleCheckout} 
                disabled={cart.length === 0 || processing || success}
            >
                {success ? 'Sale Completed!' : (processing ? 'Processing...' : 'Complete Sale')}
            </Button>
        </div>
      </div>
    </div>
  );
}
