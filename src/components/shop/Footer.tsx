import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Clock, Instagram, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="container-shop py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-black text-2xl tracking-tight text-secondary">
                SPIN<span className="text-primary">RIDE</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Велосипеды и самокаты для всей семьи. От городских прогулок до экстремальных поездок.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://t.me/spinride" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/spinride" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-bold text-lg mb-4">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog/bicycles" className="text-white/70 hover:text-primary transition-colors">
                  Велосипеды
                </Link>
              </li>
              <li>
                <Link to="/catalog/e-bikes" className="text-white/70 hover:text-primary transition-colors">
                  Электровелосипеды
                </Link>
              </li>
              <li>
                <Link to="/catalog/e-scooters" className="text-white/70 hover:text-primary transition-colors">
                  Электросамокаты
                </Link>
              </li>
              <li>
                <Link to="/catalog/bmx" className="text-white/70 hover:text-primary transition-colors">
                  BMX
                </Link>
              </li>
              <li>
                <Link to="/catalog/kids" className="text-white/70 hover:text-primary transition-colors">
                  Детям
                </Link>
              </li>
              <li>
                <Link to="/catalog/accessories" className="text-white/70 hover:text-primary transition-colors">
                  Аксессуары
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Информация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/70 hover:text-primary transition-colors">
                  О магазине
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="text-white/70 hover:text-primary transition-colors">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-white/70 hover:text-primary transition-colors">
                  Гарантия
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-white/70 hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-primary hover:underline font-medium">
                  🎯 Подобрать велосипед
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-bold text-lg mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+79247881111" 
                  className="flex items-center gap-3 text-primary font-bold hover:underline"
                >
                  <Phone className="h-5 w-5" />
                  +7 924-788-11-11
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>г. Уссурийск, ул. Пушкина, 13</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="h-5 w-5" />
                <span>info@spinride.ru</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Пн-Вс: 10:00 - 19:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {currentYear} SPINRIDE. Все права защищены.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
