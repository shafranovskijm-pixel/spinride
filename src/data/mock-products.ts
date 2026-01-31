import { Product } from "@/types/shop";

// Real products from spinride.ru
export const mockProducts: Product[] = [
  // Велосипеды
  {
    id: "1",
    category_id: "bicycles",
    name: "Велосипед OCIMA #300",
    slug: "ocima-300",
    description: "Горный велосипед с алюминиевой рамой и промышленными подшипниками",
    specifications: {
      "Размер колёс": "29\"",
      "Рама": "Алюминий",
      "Скоростей": "24",
      "Подшипники": "Промышленные"
    },
    price: 17800,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/a85a9360-a056-457c-992b-b66f659aa4c2.jpg"],
    in_stock: true,
    stock_quantity: 3,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.8,
    rating_count: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    category_id: "bicycles",
    name: "Велосипед GT MTB Racemax",
    slug: "gt-mtb-racemax",
    description: "Премиальный горный велосипед с отличными характеристиками",
    specifications: {
      "Размер колёс": "24\"",
      "Скоростей": "7",
      "Цвет": "Матовый синий"
    },
    price: 69990,
    sale_price: 48500,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/a5ead181-0ac3-4773-8eac-a927ad4834c2.jpg"],
    in_stock: true,
    stock_quantity: 2,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.9,
    rating_count: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    category_id: "bicycles",
    name: "Велосипед Action AN100",
    slug: "action-an100",
    description: "Городской велосипед с промышленными подшипниками",
    specifications: {
      "Размер колёс": "20\"",
      "Рама": "Сталь",
      "Скоростей": "7",
      "Подшипники": "Промышленные"
    },
    price: 10600,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/d3b0465d-0d26-477c-96bb-4021bde68e0d.jpg"],
    in_stock: true,
    stock_quantity: 5,
    season: "summer",
    is_featured: false,
    is_new: true,
    rating_average: 4.5,
    rating_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    category_id: "bicycles",
    name: "Велосипед Action AN200",
    slug: "action-an200",
    description: "Качественный велосипед для города и прогулок",
    specifications: {
      "Размер колёс": "22\"",
      "Рама": "Сталь",
      "Скоростей": "7",
      "Цвет": "Матовый синий"
    },
    price: 13000,
    sale_price: 10900,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/a8569bc2-c1f8-4231-b73a-f54ec89a8874.jpg"],
    in_stock: true,
    stock_quantity: 4,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.6,
    rating_count: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "5",
    category_id: "bicycles",
    name: "Фэтбайк Action AN670",
    slug: "fatbike-an670",
    description: "Мощный фэтбайк с широкими колёсами для любых дорог",
    specifications: {
      "Размер колёс": "24x4.0\"",
      "Рама": "Алюминий",
      "Скоростей": "21",
      "Цвет": "Сине-зелёный градиент"
    },
    price: 18000,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/7b455a97-82fe-4cde-88fb-58ce8cd299e2.jpg"],
    in_stock: true,
    stock_quantity: 2,
    season: "all",
    is_featured: true,
    is_new: true,
    rating_average: 4.7,
    rating_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "6",
    category_id: "bicycles",
    name: "Велосипед Wolf #840",
    slug: "wolf-840",
    description: "Надёжный горный велосипед с алюминиевой рамой",
    specifications: {
      "Размер колёс": "26\"",
      "Рама": "Алюминий",
      "Скоростей": "24",
      "Цвет": "Пустынный"
    },
    price: 18500,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/ac74ff49-a1cc-4236-8db1-b8f48a5a981f.jpg"],
    in_stock: true,
    stock_quantity: 3,
    season: "summer",
    is_featured: false,
    is_new: false,
    rating_average: 4.4,
    rating_count: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Детские велосипеды
  {
    id: "7",
    category_id: "kids",
    name: "Детский велосипед SPACE BABY 18\"",
    slug: "space-baby-18",
    description: "Яркий детский велосипед с алюминиевой рамой",
    specifications: {
      "Размер колёс": "18\"",
      "Рама": "Алюминий",
      "Скоростей": "1",
      "Возраст": "5-8 лет"
    },
    price: 7700,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/51a66775-8baa-41eb-9c29-c68ff12ba6f9.jpg"],
    in_stock: true,
    stock_quantity: 8,
    season: "summer",
    is_featured: false,
    is_new: true,
    rating_average: 4.9,
    rating_count: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "8",
    category_id: "kids",
    name: "Детский велосипед BLUE CAT 22\"",
    slug: "blue-cat-22",
    description: "Стильный детский велосипед с литыми дисками",
    specifications: {
      "Размер колёс": "22\"",
      "Рама": "Сталь",
      "Скоростей": "1",
      "Диски": "Литые"
    },
    price: 9500,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/0aba2ed7-a00e-4ba2-9f51-06802d00ff33.jpg"],
    in_stock: true,
    stock_quantity: 5,
    season: "summer",
    is_featured: false,
    is_new: false,
    rating_average: 4.7,
    rating_count: 32,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "9",
    category_id: "kids",
    name: "Детский велосипед ASTER 20\"",
    slug: "aster-20",
    description: "Компактный детский велосипед с литыми дисками",
    specifications: {
      "Размер колёс": "20\"",
      "Рама": "Сталь",
      "Скоростей": "1",
      "Диски": "Литые"
    },
    price: 8500,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/d7fea09a-dd15-423a-bda6-18fa59b4352d.jpg"],
    in_stock: true,
    stock_quantity: 6,
    season: "summer",
    is_featured: false,
    is_new: false,
    rating_average: 4.6,
    rating_count: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // BMX
  {
    id: "10",
    category_id: "bmx",
    name: "BMX OCIMA XZQ-20",
    slug: "bmx-ocima-xzq20",
    description: "Профессиональный трюковой BMX с поворотом руля 360°",
    specifications: {
      "Размер колёс": "20\"",
      "Рама": "Сталь",
      "Руль": "360°",
      "Цвет": "Тёмно-серый"
    },
    price: 18000,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/c2af4791-f230-41bb-ba52-52baf0f9a8f3.jpg"],
    in_stock: true,
    stock_quantity: 3,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.8,
    rating_count: 16,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "11",
    category_id: "bmx",
    name: "BMX Action LMG-20 Хамелеон",
    slug: "bmx-action-lmg20",
    description: "Трюковой BMX с алюминиевой рамой и промподшипниками",
    specifications: {
      "Размер колёс": "20\"",
      "Рама": "Алюминиевый сплав",
      "Подшипники": "Промышленные",
      "Цвет": "Хамелеон"
    },
    price: 22000,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/8dd8b4db-3f97-48c9-a93f-d29c1f5253c0.jpg"],
    in_stock: true,
    stock_quantity: 2,
    season: "summer",
    is_featured: false,
    is_new: true,
    rating_average: 4.9,
    rating_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "12",
    category_id: "bmx",
    name: "BMX Tech Team Millennium",
    slug: "bmx-techteam-millennium",
    description: "Профессиональный трюковой BMX от Tech Team",
    specifications: {
      "Размер колёс": "20\"",
      "Рама": "Сталь усиленная",
      "Размер рамы": "20.5\"",
      "Вес": "11.55 кг",
      "Рулевая": "NECO интегрированная на промподш."
    },
    price: 25000,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/31a44b8b-42e9-445d-bb34-689465427b5d.jpg"],
    in_stock: true,
    stock_quantity: 2,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.7,
    rating_count: 19,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Электровелосипеды
  {
    id: "13",
    category_id: "e-bikes",
    name: "Электровелосипед Kugoo Kirin V3",
    slug: "kugoo-kirin-v3",
    description: "Стильный электровелосипед для города и загорода",
    specifications: {
      "Мощность": "350W",
      "Батарея": "13 Ah",
      "Запас хода": "45 км",
      "Макс. скорость": "45 км/ч",
      "Размер колёс": "27.5\""
    },
    price: 69990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/2a228bf0-4281-423c-bace-a1623d0491d2.jpg"],
    in_stock: true,
    stock_quantity: 2,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.8,
    rating_count: 32,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "14",
    category_id: "e-bikes",
    name: "Электровелосипед Kugoo Kirin V3 Max",
    slug: "kugoo-kirin-v3-max",
    description: "Мощный электровелосипед с увеличенным запасом хода",
    specifications: {
      "Мощность": "500W",
      "Батарея": "15.6 Ah",
      "Запас хода": "65 км",
      "Макс. скорость": "45 км/ч"
    },
    price: 89990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/b68f13f8-a140-40df-9c44-d80c983f8277.jpg"],
    in_stock: true,
    stock_quantity: 1,
    season: "summer",
    is_featured: true,
    is_new: true,
    rating_average: 4.9,
    rating_count: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "15",
    category_id: "e-bikes",
    name: "Электровелосипед Kugoo Kirin V5",
    slug: "kugoo-kirin-v5",
    description: "Ультрамощный электровелосипед нового поколения",
    specifications: {
      "Мощность": "750W",
      "Батарея": "20 Ah",
      "Запас хода": "70 км",
      "Макс. скорость": "50 км/ч"
    },
    price: 119990,
    sale_price: 99990,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/424aa294-0b34-4e6c-80cb-7fc8813cf7c8.jpg"],
    in_stock: true,
    stock_quantity: 1,
    season: "summer",
    is_featured: true,
    is_new: true,
    rating_average: 5.0,
    rating_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "16",
    category_id: "e-bikes",
    name: "Электровелосипед Kugoo Kirin V3 Pro Plus",
    slug: "kugoo-kirin-v3-pro-plus",
    description: "Идеален для курьеров и длительных поездок",
    specifications: {
      "Мощность": "240W (пик 1200W)",
      "Батарея": "21 Ah",
      "Запас хода": "60 км",
      "Макс. скорость": "50 км/ч"
    },
    price: 79990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/50457a45-3737-4e1d-adc4-c3117bd40d53.jpg"],
    in_stock: true,
    stock_quantity: 2,
    season: "summer",
    is_featured: false,
    is_new: false,
    rating_average: 4.7,
    rating_count: 24,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Электросамокаты
  {
    id: "17",
    category_id: "e-scooters",
    name: "Электросамокат Kugoo A2",
    slug: "kugoo-a2",
    description: "Компактный городской электросамокат",
    specifications: {
      "Мощность": "350W",
      "Батарея": "36V 7.5Ah",
      "Запас хода": "25 км",
      "Макс. скорость": "30 км/ч"
    },
    price: 29990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/71a81878-4e51-4aa1-a085-2d1b94cce964.jpg"],
    in_stock: true,
    stock_quantity: 5,
    season: "summer",
    is_featured: true,
    is_new: false,
    rating_average: 4.6,
    rating_count: 42,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "18",
    category_id: "e-scooters",
    name: "Электросамокат Kugoo Kirin First",
    slug: "kugoo-kirin-first",
    description: "Надёжный электросамокат для начинающих",
    specifications: {
      "Мощность": "300W",
      "Батарея": "36V 6Ah",
      "Запас хода": "20 км",
      "Макс. скорость": "25 км/ч"
    },
    price: 24990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/ce55d05d-6f4f-44a8-9cf5-c76a7d92f437.jpg"],
    in_stock: true,
    stock_quantity: 4,
    season: "summer",
    is_featured: false,
    is_new: true,
    rating_average: 4.5,
    rating_count: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Детские самокаты
  {
    id: "19",
    category_id: "scooters",
    name: "Детский трёхколёсный самокат",
    slug: "kids-scooter-3wheel",
    description: "Яркий самокат со светящимися колёсами для детей от 2 лет",
    specifications: {
      "Колёса": "Светящиеся",
      "Руль": "Складной, съёмный",
      "Возраст": "От 2 лет",
      "Колёс": "3"
    },
    price: 3990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/4c80292a-0679-4945-b342-efafb7dde38b.jpg"],
    in_stock: true,
    stock_quantity: 15,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.8,
    rating_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Аксессуары
  {
    id: "20",
    category_id: "accessories",
    name: "Велофонарь LED 4 в 1",
    slug: "bike-light-4in1",
    description: "Светодиодный фонарь с функциями Power Bank, держателя телефона и сигнала",
    specifications: {
      "Функции": "Фонарь, Power Bank, держатель телефона, сигнал",
      "Зарядка": "USB",
      "Тип": "Передний"
    },
    price: 2490,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/f78a25ad-bca1-46d9-9b55-e19037428312.jpg"],
    in_stock: true,
    stock_quantity: 20,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.4,
    rating_count: 35,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "21",
    category_id: "accessories",
    name: "Набор фонарей задний + передний",
    slug: "bike-lights-set",
    description: "Комплект велосипедных фонарей с USB зарядкой",
    specifications: {
      "Зарядка": "Micro USB",
      "Комплект": "Передний + задний",
      "Режимы": "Несколько"
    },
    price: 1490,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/7c01ac58-c8da-4d0c-9e03-5e18c369d5aa.jpg"],
    in_stock: true,
    stock_quantity: 25,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.3,
    rating_count: 42,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "22",
    category_id: "accessories",
    name: "Кодовый замок для велосипеда",
    slug: "bike-lock-code",
    description: "Надёжный кодовый замок для велосипеда и самоката",
    specifications: {
      "Тип": "Кодовый",
      "Длина": "1.2 м",
      "Материал": "Сталь в оплётке"
    },
    price: 890,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/734002b7-34ed-4af7-96cc-bf4fc4a0a3e6.jpg"],
    in_stock: true,
    stock_quantity: 30,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.2,
    rating_count: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Электропитбайк
  {
    id: "23",
    category_id: "e-bikes",
    name: "Электропитбайк WISH 01 (2024)",
    slug: "e-pitbike-wish01",
    description: "Мощный электропитбайк для города с быстрой зарядкой",
    specifications: {
      "Мощность": "1500W",
      "Батарея": "21000 mAh",
      "Запас хода": "65 км",
      "Макс. скорость": "50 км/ч"
    },
    price: 129990,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/d71143d3-7b91-4f6c-8347-e5fbcc9f6f57.jpg"],
    in_stock: true,
    stock_quantity: 1,
    season: "summer",
    is_featured: true,
    is_new: true,
    rating_average: 5.0,
    rating_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // Спортинвентарь
  {
    id: "24",
    category_id: "accessories",
    name: "Мяч футбольный",
    slug: "football",
    description: "Качественный футбольный мяч для игры",
    specifications: {
      "Тип": "Футбольный",
      "Размер": "5"
    },
    price: 1100,
    sale_price: null,
    images: ["https://274418.selcdn.ru/cv08300-33250f0d-0664-43fc-9dbf-9d89738d114e/uploads/521356/41e24257-5cd3-425c-9650-72ad0056ba50.jpg"],
    in_stock: true,
    stock_quantity: 20,
    season: "all",
    is_featured: false,
    is_new: false,
    rating_average: 4.5,
    rating_count: 18,
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

export function getProductsByCategory(categoryId: string): Product[] {
  return mockProducts.filter(p => p.category_id === categoryId);
}
