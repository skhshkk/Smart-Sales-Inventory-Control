export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    supplier: string;
    low_stock_threshold: number;
    image_url?: string;
}

export interface Sale {
    id: string;
    total_amount: number;
    created_at: string;
    sale_items: SaleItem[];
}

export interface SaleItem {
    product_id: string;
    quantity: number;
    price: number;
    product: Product;
}
