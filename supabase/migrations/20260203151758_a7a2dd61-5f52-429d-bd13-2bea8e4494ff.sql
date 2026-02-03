-- Create table for editable page content
CREATE TABLE public.page_content (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key text NOT NULL UNIQUE,
    title text NOT NULL,
    subtitle text,
    content jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read page content
CREATE POLICY "Page content is viewable by everyone"
ON public.page_content
FOR SELECT
USING (true);

-- Only admins can manage page content
CREATE POLICY "Only admins can manage page content"
ON public.page_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content for pages
INSERT INTO public.page_content (page_key, title, subtitle, content) VALUES
('warranty', 'Гарантия', 'Мы гарантируем качество всех товаров в нашем магазине', '{
  "warranty_periods": [
    {"category": "Снегокаты и снежные тюбинги", "period": "1 год"},
    {"category": "Ледянки и санки", "period": "6 месяцев"},
    {"category": "Снежколепы и аксессуары", "period": "3 месяца"},
    {"category": "Электротранспорт", "period": "1 год"}
  ],
  "coverage": [
    "Заводской брак материалов",
    "Дефекты сборки и пошива",
    "Неисправность механизмов",
    "Расхождение швов при нормальной эксплуатации"
  ],
  "requirements": [
    "Сохранить чек или накладную о покупке",
    "Предоставить товар в чистом виде",
    "Описать характер неисправности",
    "Обратиться в течение гарантийного срока"
  ],
  "exclusions": [
    "Механические повреждения по вине покупателя",
    "Естественный износ при интенсивном использовании",
    "Повреждения из-за несоблюдения условий эксплуатации",
    "Следы ненадлежащего хранения"
  ],
  "contact_phone": "+7 (999) 123-45-67",
  "contact_email": "warranty@spinride.ru",
  "processing_note": "Срок рассмотрения гарантийного обращения — до 14 рабочих дней. При подтверждении гарантийного случая товар будет отремонтирован или заменён на аналогичный."
}'::jsonb),
('delivery', 'Доставка', 'Быстрая и надёжная доставка по всей России', '{
  "methods": [
    {"name": "Самовывоз", "price": "Бесплатно", "time": "Сегодня"},
    {"name": "Курьер по городу", "price": "от 300 ₽", "time": "1-2 дня"},
    {"name": "СДЭК", "price": "от 350 ₽", "time": "2-5 дней"},
    {"name": "Почта России", "price": "от 250 ₽", "time": "5-14 дней"}
  ],
  "free_delivery_threshold": 5000,
  "pickup_address": "г. Москва, ул. Примерная, д. 1",
  "pickup_hours": "Пн-Пт: 10:00-19:00, Сб: 11:00-17:00"
}'::jsonb),
('about', 'О нас', 'Магазин зимнего и летнего активного отдыха', '{
  "description": "SPINRIDE — это магазин товаров для активного отдыха. Мы предлагаем широкий ассортимент снегокатов, тюбингов, санок и аксессуаров для зимних развлечений, а также велосипеды и самокаты для летнего сезона.",
  "features": [
    "Только проверенные производители",
    "Гарантия на все товары",
    "Быстрая доставка по России",
    "Консультация специалистов"
  ],
  "history": "Мы работаем с 2020 года и за это время помогли тысячам семей найти идеальный инвентарь для активного отдыха."
}'::jsonb),
('contacts', 'Контакты', 'Свяжитесь с нами любым удобным способом', '{
  "address": "г. Москва, ул. Примерная, д. 1",
  "phone": "+7 (999) 123-45-67",
  "email": "info@spinride.ru",
  "work_hours": "Пн-Пт: 10:00-19:00, Сб: 11:00-17:00, Вс: выходной",
  "social": {
    "telegram": "https://t.me/actionprim",
    "whatsapp": "https://wa.me/79991234567",
    "vk": "https://vk.com/spinride"
  }
}'::jsonb);