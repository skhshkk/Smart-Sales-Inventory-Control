
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  // Laptops & Computers
  { name: 'MacBook Pro 14"', category: 'Laptops', price: 199900.00, stock: 10, supplier: 'Apple', image_url: '/products/MacBook Pro 14.jpg' },
  { name: 'Dell XPS 13', category: 'Laptops', price: 145000.00, stock: 15, supplier: 'Dell', image_url: '/products/Dell XPS 13.jpg' },
  { name: 'ThinkPad X1 Carbon', category: 'Laptops', price: 165000.00, stock: 12, supplier: 'Lenovo', image_url: '/products/ThinkPad X1 Carbon.jpg' },
  
  // Peripherals - Mice & Keyboards
  { name: 'MX Master 3S', category: 'Peripherals', price: 9999.00, stock: 50, supplier: 'Logitech', image_url: '/products/MX Master 3S.jpg' },
  { name: 'Keychron K2 Mechanical', category: 'Peripherals', price: 8500.00, stock: 40, supplier: 'Keychron', image_url: '/products/Keychron K2 Mechanical.jpg' },
  { name: 'Magic Mouse', category: 'Peripherals', price: 7500.00, stock: 35, supplier: 'Apple', image_url: '/products/Magic Mouse.jpg' },
  { name: 'Razer DeathAdder', category: 'Peripherals', price: 4500.00, stock: 45, supplier: 'Razer', image_url: '/products/Razer DeathAdder.jpg' },
  
  // Monitors
  { name: 'LG UltraGear 27"', category: 'Monitors', price: 28000.00, stock: 20, supplier: 'LG', image_url: '/products/LG UltraGear 27.jpg' },
  { name: 'Dell UltraSharp 24"', category: 'Monitors', price: 22000.00, stock: 25, supplier: 'Dell', image_url: '/products/world_DELL-Dell UltraSharp 24.jpg' },
  { name: 'Samsung Odyssey G5', category: 'Monitors', price: 32000.00, stock: 15, supplier: 'Samsung', image_url: '/products/Samsung Odyssey G5.jpg' },

  // Audio
  { name: 'Sony WH-1000XM5', category: 'Audio', price: 29990.00, stock: 30, supplier: 'Sony', image_url: '/products/Sony WH-1000XM5.jpg' },
  { name: 'AirPods Pro', category: 'Audio', price: 24900.00, stock: 40, supplier: 'Apple', image_url: '/products/AirPods Pro.jpg' },
  { name: 'JBL Flip 6', category: 'Audio', price: 9999.00, stock: 50, supplier: 'JBL', image_url: '/products/JBL Flip 6.jpg' },

  // Accessories
  { name: 'Anker USB-C Hub', category: 'Accessories', price: 4500.00, stock: 60, supplier: 'Anker', image_url: '/products/Anker USB-C Hub.jpg' },
  { name: 'Samsung T7 SSD 1TB', category: 'Storage', price: 8999.00, stock: 35, supplier: 'Samsung', image_url: '/products/Samsung T7 SSD 1TB.jpg' },
  { name: 'Logitech Webcam C920', category: 'Accessories', price: 6500.00, stock: 25, supplier: 'Logitech', image_url: '/products/Logitech Webcam C920.jpg' },
  { name: 'Laptop Stand', category: 'Accessories', price: 2500.00, stock: 80, supplier: 'Roost', image_url: '/products/Laptop Stand.jpg' },
  { name: 'Thunderbolt 4 Cable', category: 'Accessories', price: 3500.00, stock: 100, supplier: 'Belkin', image_url: '/products/Thunderbolt 4 Cable.jpg' },
  
  // Smart Home
  { name: 'Google Nest Mini', category: 'Smart Home', price: 4499.00, stock: 45, supplier: 'Google', image_url: '/products/Google Nest Mini.jpg' },
  { name: 'Philips Hue Bulb', category: 'Smart Home', price: 2500.00, stock: 60, supplier: 'Philips', image_url: '/products/Philips Hue Bulb.jpg' }
];

async function seed() {
  console.log('Clearing existing products...');
  // Delete all existing products to avoid mixing
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all

  if (deleteError) {
    console.error('Error clearing products:', deleteError);
    return;
  }

  console.log('Seeding tech products with local JPG images...');
  
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log(`Successfully seeded ${data.length} tech products.`);
  }
}

seed();
