// Product types
export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  specifications: Record<string, string>;
  price: number;
  sale_price: number | null;
  images: string[];
  in_stock: boolean;
  stock_quantity: number;
  season: "summer" | "winter" | "all";
  is_featured: boolean;
  is_new: boolean;
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order types
export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_method: string;
  delivery_address: string | null;
  items: OrderItem[];
  total_amount: number;
  status: "new" | "processing" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Review types
export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  content: string | null;
  images: string[];
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Favorite types
export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  notify_on_sale: boolean;
  created_at: string;
  product?: Product;
}

// Compare types
export interface CompareItem {
  productId: string;
  product: Product;
}
