# RetailPro - Smart Sales & Inventory Management System

**RetailPro** is a modern, full-stack Point of Sale (POS) and Inventory Management application designed for retail businesses. It provides a seamless experience for tracking sales, managing stock, and analyzing performance in real-time.

Built with performance and aesthetics in mind, it features a responsive glassmorphism UI that works perfectly across desktops, tablets, and mobile devices.

---

## 🚀 Key Features

*   **📊 Interactive Dashboard**: Real-time overview of daily revenue, total sales, low stock alerts, and growth statistics. Includes beautiful weekly/monthly sales charts.
*   **🛒 Point of Sale (POS)**: Fast and intuitive billing interface. Cashiers can search products, manage a cart, and complete orders instantly.
*   **📦 Inventory Management**: Comprehensive CRUD operations for products. Track stock levels, suppliers, and pricing.
*   **📱 Mobile Optimized**: Fully responsive design. The interface adapts to mobile screens with a native-app feel (e.g., card views for inventory, collapsible drawers).
*   **🔐 Role-Based Access Control**:
    *   **Admin/Owner**: Full access to Dashboard, Sales Reports, and Inventory.
    *   **Cashier**: Restricted access optimized for billing and basic product lookup.
*   **⚡ Real-time Updates**: Instant reflection of stock changes and sales data.
*   **🎨 Premium UI/UX**: Dark mode by default with elegant gradients, glass effects, and smooth animations.

---

## 🛠️ Tech Stack

### Client (Frontend)
*   **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
*   **Language**: TypeScript / JavaScript
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Charts**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **State Management**: React Context API
*   **Routing**: React Router DOM

### Server (Backend)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database Integration**: [Supabase](https://supabase.com/) (PostgreSQL)

### Database
*   **Platform**: Supabase (PostgreSQL)
*   **Features**: Relational Data, Authentication, Row Level Security.

---

## ⚙️ Usage & Installation

### Prerequisites
*   Node.js (v16 or higher)
*   npm (v7 or higher)
*   A Supabase account (for database)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/retailpro.git
cd retailpro
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3000
```

Start the backend server:
```bash
npm start
# or for development with auto-restart
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🗄️ Database Setup
1.  Go to your Supabase SQL Editor.
2.  Run the contents of `server/database/schema.sql` to create the necessary tables (`products`, `sales`, `sale_items`, etc.).
3.  (Optional) Run `npm run seed` inside the `server` folder to populate the database with initial demo data.

---

## 📱 Mobile Support
RetailPro is built to be used on the go.
*   **Inventory**: Automatically switches from a table view to a card-based list view on mobile.
*   **POS**: Optimized layout with foldable carts and touch-friendly buttons.
*   **Navigation**: Slide-out drawer navigation for smaller screens.

---

## 👥 Default Demo Credentials
(If using the provided seed data)

*   **Admin**: `admin@retailpro.com` / `password`
*   **Cashier**: `cashier@retailpro.com` / `password`

---

## 📄 License
This project is licensed under the ISC License.
