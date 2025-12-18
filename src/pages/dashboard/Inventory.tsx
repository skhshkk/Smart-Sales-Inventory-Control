import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Trash, Edit, Search, ShoppingBag, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { role } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: '', price: 0, stock: 0, supplier: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search]);

  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError('');
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchProducts = async () => {
    try {
        const res = await api.get('/products', { params: { search } });
        setProducts(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        if (isEditing && formData.id) {
            await api.put(`/products/${formData.id}`, formData);
        } else {
            await api.post('/products', formData);
        }
        setIsSuccess(true);
        fetchProducts();
        
        setTimeout(() => {
            setShowForm(false);
            setFormData({ name: '', category: '', price: 0, stock: 0, supplier: '' });
            setIsEditing(false);
            setIsSuccess(false);
        }, 1500);
    } catch (err: any) {
        console.error(err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to save product';
        setError(errorMessage);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const initiateDelete = (id: string) => {
      if (role === 'cashier') {
          setError('Permission Denied: Cashiers cannot delete products.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }
      setProductToDelete(id);
      setShowDeleteConfirm(true);
      setError('');
  };

  const confirmDelete = async () => {
      if (!productToDelete) return;
      try {
          await api.delete(`/products/${productToDelete}`);
          setShowDeleteConfirm(false);
          setProductToDelete(null);
          fetchProducts();
      } catch (err: any) {
          console.error(err);
          const errorMessage = err.response?.data?.error || err.message || 'Failed to delete product';
          setError(errorMessage);
          setShowDeleteConfirm(false);
      }
  };

  const openEdit = (product: Product) => {
      if (role === 'cashier') {
          setError('Permission Denied: Cashiers cannot edit products.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }
      setFormData(product);
      setIsEditing(true);
      setShowForm(true);
  };

  const openAdd = () => {
      if (role === 'cashier') {
          setError('Permission Denied: Cashiers cannot add products.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }
      setShowForm(true);
      setIsEditing(false);
      setFormData({name:'',category:'',price:0,stock:0,supplier:''});
      setError('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Inventory</h1>
            <p className="text-muted-foreground">Manage your products and stock.</p>
        </div>
        <Button onClick={openAdd} className="shadow-[0_0_20px_rgba(94,106,210,0.3)]">
            <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input 
            type="text" 
            placeholder="Search products..." 
            className="pl-10 bg-white/[0.05] border-white/10 text-foreground placeholder:text-muted-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error Banner */}
      {error && !showForm && (
          <div className="mb-4 bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 font-bold"><X size={18} /></button>
          </div>
      )}

      {/* Product Table */}
      <Card className="border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        <th className="p-4 pl-6">Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Supplier</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">Loading inventory...</td></tr> : 
                    products.map(product => (
                        <tr key={product.id} className="hover:bg-white/[0.04] transition-colors group">
                            <td className="p-4 pl-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/[0.05] border border-white/10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <ShoppingBag size={14} className="text-muted-foreground/50" />
                                        )}
                                    </div>
                                    <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.05] text-muted-foreground border border-white/5">
                                    {product.category}
                                </span>
                            </td>
                            <td className="p-4 font-semibold text-foreground">₹{Number(product.price).toLocaleString('en-IN')}</td>
                            <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    product.stock < 10 
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    {product.stock < 10 ? 'Low Stock' : 'In Stock'}
                                </span>
                            </td>
                            <td className="p-4 text-muted-foreground text-sm">{product.supplier}</td>
                            <td className="p-4 font-medium text-foreground pl-8">
                                {product.stock}
                            </td>
                            <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => openEdit(product)} 
                                        className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
                                    >
                                        <Edit size={16} />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => initiateDelete(product.id)} 
                                        className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!loading && products.length === 0 && (
                        <tr><td colSpan={7} className="p-12 text-center text-muted-foreground">No products found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-sm border-white/10 bg-[#0A0A0C]">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-foreground">Delete Product</h3>
                    <p className="text-muted-foreground mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                    <div className="flex gap-4">
                        <Button variant="secondary" className="w-full" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                        <Button className="w-full bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-white/10 bg-[#0A0A0C] max-h-[90vh] overflow-y-auto">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-foreground">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                        <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setError(''); }} className="h-8 w-8 rounded-full">
                            <X size={18} />
                        </Button>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-md mb-4 text-sm border border-red-500/20">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase">Name</label>
                            <Input className="bg-black/20" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Category</label>
                                <Input className="bg-black/20" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Supplier</label>
                                <Input className="bg-black/20" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Price (₹)</label>
                                <Input type="number" step="0.01" className="bg-black/20" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground uppercase">Stock</label>
                                <Input type="number" className="bg-black/20" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} required />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground uppercase">Image URL</label>
                            <Input className="bg-black/20" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                        </div>
                        
                        <div className="flex gap-3 mt-6 pt-2">
                            <Button type="button" variant="secondary" className="w-full" onClick={() => { setShowForm(false); setError(''); }}>Cancel</Button>
                            <Button 
                                type="submit" 
                                className={`w-full transition-all ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                                disabled={isSuccess}
                            >
                                {isSuccess ? 'Saved successfully!' : 'Save Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
