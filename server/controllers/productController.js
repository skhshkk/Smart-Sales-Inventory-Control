import { supabase } from '../config/supabase.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = supabase.from('products').select('*');

    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, supplier, low_stock_threshold, image_url } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, category, price, stock, supplier, low_stock_threshold, image_url }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, supplier, low_stock_threshold, image_url } = req.body;
    
    // Validate numbers
    if (isNaN(price) || isNaN(stock)) {
        return res.status(400).json({ error: 'Price and Stock must be numbers' });
    }

    const updates = { 
        name, 
        category, 
        price: Number(price), 
        stock: Number(stock), 
        supplier, 
        low_stock_threshold: Number(low_stock_threshold || 5), 
        image_url 
    };

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
        console.error('Supabase update error:', error);
        throw error;
    }
    if (data.length === 0) return res.status(404).json({ error: 'Product not found' });
    
    res.json(data[0]);
  } catch (err) {
    console.error('Update product exception:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
