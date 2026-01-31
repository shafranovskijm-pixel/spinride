import { Product } from "@/types/shop";

// Mock products for initial display
export const mockProducts: Product[] = [
  {
    id: "1",
    category_id: "bicycles",
    name: "Горный велосипед Stels Navigator 710",
    slug: "stels-navigator-710",
    description: "Надёжный горный велосипед для активного отдыха",
    specifications: {
      "Размер колёс": "26\"",
      "Рама": "Алюминий",
      "Скорости": "21",
      "Тормоза": "Дисковые механические"
    },
    price: 24990,
    sale_price: 21990,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 5,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.5,
    rating_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    category_id: "e-scooters",
    name: "Электросамокат Kugoo S3 Pro",
    slug: "kugoo-s3-pro",
    description: "Мощный электросамокат для города",
    specifications: {
      "Мощность": "350W",
      "Батарея": "36V 8.8Ah",
      "Запас хода": "30 км",
      "Макс. скорость": "35 км/ч"
    },
    price: 32990,
    sale_price: null,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 3,
    season: "summer",
    is_featured: true,
    is_new: true,
    rating_average: 4.8,
    rating_count: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    category_id: "bicycles",
    name: "Детский велосипед Forward Cosmo 18",
    slug: "forward-cosmo-18",
    description: "Яркий велосипед для детей 5-8 лет",
    specifications: {
      "Размер колёс": "18\"",
      "Рама": "Сталь",
      "Возраст": "5-8 лет",
      "Вес": "11 кг"
    },
    price: 12990,
    sale_price: 10990,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 8,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.9,
    rating_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    category_id: "bmx",
    name: "BMX Tech Team Mack",
    slug: "tech-team-mack-bmx",
    description: "Профессиональный BMX для трюков",
    specifications: {
      "Размер колёс": "20\"",
      "Рама": "Hi-Ten сталь",
      "Пеги": "4 шт",
      "Ротор": "Есть"
    },
    price: 18990,
    sale_price: null,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 2,
    season: "summer",
    is_featured: false,
    is_new: true,
    rating_average: 4.7,
    rating_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    category_id: "e-bikes",
    name: "Электровелосипед Eltreco XT 850",
    slug: "eltreco-xt-850",
    description: "Мощный электровелосипед для бездорожья",
    specifications: {
      "Мощность": "500W",
      "Батарея": "48V 13Ah",
      "Запас хода": "60 км",
      "Размер колёс": "26\""
    },
    price: 89990,
    sale_price: 79990,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 1,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.6,
    rating_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "6",
    category_id: "scooters",
    name: "Самокат Oxelo Town 9 EF",
    slug: "oxelo-town-9-ef",
    description: "Городской самокат с большими колёсами",
    specifications: {
      "Размер колёс": "200 мм",
      "Вес": "5.1 кг",
      "Нагрузка": "до 100 кг",
      "Амортизаторы": "Передний"
    },
    price: 8990,
    sale_price: null,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 10,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.4,
    rating_count: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "7",
    category_id: "kids",
    name: "Снегокат Ника Тимка Спорт 4-1",
    slug: "nika-timka-sport",
    description: "Детский снегокат с рулём и спинкой",
    specifications: {
      "Возраст": "от 4 лет",
      "Нагрузка": "до 100 кг",
      "Спинка": "Съёмная",
      "Тормоз": "Ножной"
    },
    price: 4990,
    sale_price: 3990,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 15,
    season: "winter",
    is_featured: true,
    is_new: false,
    rating_average: 4.8,
    rating_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "8",
    category_id: "accessories",
    name: "Велошлем STG HB8-3",
    slug: "stg-hb8-3-helmet",
    description: "Защитный шлем для велосипеда и самоката",
    specifications: {
      "Размер": "L (58-61 см)",
      "Вес": "280 г",
      "Вентиляция": "18 отверстий",
      "Регулировка": "Есть"
    },
    price: 2490,
    sale_price: null,
    images: ["/placeholder.svg"],
    in_stock: true,
    stock_quantity: 20,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.3,
    rating_count: 34,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function getSeasonalProducts(season: "summer" | "winter"): Product[] {
  return mockProducts.filter(p => p.season === season || p.season === "all");
}

export function getFeaturedProducts(): Product[] {
  return mockProducts.filter(p => p.is_featured);
}

export function getNewProducts(): Product[] {
  return mockProducts.filter(p => p.is_new);
}
