import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Mail, MessageCircle } from "lucide-react";
import { useSeason } from "@/hooks/use-season";

const footerLinks = {
  catalog: [
    { name: "Велосипеды", href: "/catalog/bicycles" },
    { name: "Электровелосипеды", href: "/catalog/e-bikes" },
    { name: "Самокаты", href: "/catalog/scooters" },
    { name: "Электросамокаты", href: "/catalog/e-scooters" },
    { name: "BMX", href: "/catalog/bmx" },
    { name: "Детям", href: "/catalog/kids" },
  ],
  info: [
    { name: "О магазине", href: "/about" },
    { name: "Доставка", href: "/delivery" },
    { name: "Гарантия", href: "/warranty" },
    { name: "Контакты", href: "/contacts" },
  ],
};

export function Footer() {
  const { season } = useSeason();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container-shop py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-hero">
                <span className="text-2xl">🚴</span>
              </div>
              <span className="font-bold text-xl">
                SPIN<span className="text-primary">RIDE</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Магазин велосипедов и самокатов в Уссурийске. Большой выбор, доступные цены, гарантия качества.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/79991234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Catalog links */}
          <div>
            <h3 className="font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2">
              {footerLinks.catalog.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div>
                  <a href="tel:+79991234567" className="text-sm hover:text-primary">
                    +7 (999) 123-45-67
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  г. Уссурийск, ул. Комсомольская, 29
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Пн-Сб: 10:00 - 19:00<br />
                  Вс: выходной
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <a href="mailto:info@spinride.ru" className="text-sm hover:text-primary">
                  info@spinride.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SPINRIDE. Все права защищены.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary">
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
