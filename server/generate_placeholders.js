
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDir = path.join(__dirname, '../client/public/products');

// Ensure directory exists
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Function to generate an SVG with random color
function generateSVG(name) {
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#c084fc', '#f472b6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const date = new Date().toISOString();
    
    // Simple SVG with colored background and centered text
    return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${name}</text>
  <!-- Generated: ${date} -->
</svg>`;
}

export const products = [
  // Laptops
  { filename: 'macbook-pro.svg', name: 'MacBook Pro 14"' },
  { filename: 'dell-xps.svg', name: 'Dell XPS 13' },
  { filename: 'thinkpad-x1.svg', name: 'ThinkPad X1' },
  
  // Peripherals
  { filename: 'mx-master.svg', name: 'MX Master 3S' },
  { filename: 'keychron-k2.svg', name: 'Keychron K2' },
  { filename: 'magic-mouse.svg', name: 'Magic Mouse' },
  { filename: 'razer-deathadder.svg', name: 'Razer DeathAdder' },
  
  // Monitors
  { filename: 'lg-ultragear.svg', name: 'LG UltraGear' },
  { filename: 'dell-ultrasharp.svg', name: 'Dell UltraSharp' },
  { filename: 'samsung-odyssey.svg', name: 'Samsung Odyssey' },

  // Audio
  { filename: 'sony-xm5.svg', name: 'Sony XM5' },
  { filename: 'airpods-pro.svg', name: 'AirPods Pro' },
  { filename: 'jbl-flip.svg', name: 'JBL Flip 6' },

  // Accessories
  { filename: 'anker-hub.svg', name: 'Anker Hub' },
  { filename: 'samsung-ssd.svg', name: 'Samsung T7' },
  { filename: 'webcam-c920.svg', name: 'Webcam C920' },
  { filename: 'laptop-stand.svg', name: 'Laptop Stand' },
  { filename: 'thunderbolt-cable.svg', name: 'Thunderbolt 4' },
  
  // Smart Home
  { filename: 'nest-mini.svg', name: 'Nest Mini' },
  { filename: 'hue-bulb.svg', name: 'Hue Bulb' }
];

console.log('Generating placeholder images...');
products.forEach(p => {
    const filePath = path.join(productsDir, p.filename);
    fs.writeFileSync(filePath, generateSVG(p.name));
    console.log(`Created ${p.filename}`);
});

console.log('Done!');
