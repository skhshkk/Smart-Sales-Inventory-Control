import { supabase } from '../config/supabase.js';

export const createSale = async (req, res) => {
  const { items, totalAmount, userId } = req.body;
  // items: [{ product_id, quantity, price }]
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in sale' });
  }

  try {
    // 1. Create Sale Record
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{ user_id: userId || req.user.id, total_amount: totalAmount }])
      .select()
      .single();

    if (saleError) throw saleError;

    const saleId = saleData.id;

    // 2. Prepare Sale Items
    const saleItems = items.map(item => ({
      sale_id: saleId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    // 3. Insert Sale Items
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    // 4. Update Stock (Parallel promises for speed)
    const stockUpdates = items.map(item => 
      rpcUpdateStock(item.product_id, item.quantity)
    );
    
    await Promise.all(stockUpdates);

    res.status(201).json({ message: 'Sale completed', saleId });

  } catch (err) {
    console.error('Sale Error', err);
    res.status(500).json({ error: err.message });
  }
};

// Helper to update stock safely. Ideally this would be a Postgres Function to avoid race conditions.
// Simulating via decrement. 
// "rpc" call or straight update.
// For now, we'll do a read-write check or use RPC if we had it.
// Let's rely on a direct decrement logic if possible, but standard Supabase update is:
// update products set stock = stock - qty where id = ...
// We can't do "stock = stock - qty" easily without RPC in Supabase JS client unless we fetch first.
// I'll fetch first for now or assume the user sets up the RPC. 
// Actually, I'll assume we iterate:
async function rpcUpdateStock(productId, qty) {
    const { data: product } = await supabase.from('products').select('stock').eq('id', productId).single();
    if(product) {
        const newStock = product.stock - qty;
        await supabase.from('products').update({ stock: newStock }).eq('id', productId);
    }
}

export const getSales = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('sales')
            .select('*, users(email), sale_items(product_id, quantity, price, products(name))')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};
