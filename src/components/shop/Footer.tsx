import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Clock, Instagram, Send, MessageCircle, Heart } from "lucide-react";
import { useFooterSettings } from "@/hooks/use-footer-settings";
import { useSeason } from "@/hooks/use-season";

const summerCatalogLinks = [
  { title: "Велосипеды", url: "/catalog/bicycles" },
  { title: "Электровелосипеды", url: "/catalog/e-bikes" },
  { title: "Электросамокаты", url: "/catalog/scooters" },
  { title: "BMX", url: "/catalog/bmx" },
  { title: "Детям", url: "/catalog/kids" },
  { title: "Аксессуары", url: "/catalog/accessories" },
];

const winterCatalogLinks = [
  { title: "Тюбинги", url: "/catalog/tubing" },
  { title: "Ёлки", url: "/catalog/christmas-trees" },
  { title: "Декор", url: "/catalog/decor" },
  { title: "Праздничные товары", url: "/catalog/party" },
  { title: "Детям", url: "/catalog/kids" },
  { title: "Аксессуары", url: "/catalog/accessories" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useFooterSettings();
  const { season } = useSeason();

  const catalogLinks = season === "winter" ? winterCatalogLinks : summerCatalogLinks;

  if (!settings) {
    return null; // Loading state
  }

  return (
    <footer className="bg-foreground text-white mt-16">
      <div className="container-shop py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <span className="font-black text-2xl tracking-tight text-secondary group-hover:scale-105 transition-transform inline-block">
                SPIN<span className="text-primary">RIDE</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              {settings.description}
            </p>
            <div className="flex gap-3">
              {settings.social.telegram && (
                <a 
                  href={settings.social.telegram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
                  aria-label="Telegram"
                >
                  <Send className="h-5 w-5" />
                </a>
              )}
              {settings.social.instagram && (
                <a 
                  href={settings.social.instagram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.social.whatsapp && (
                <a 
                  href={settings.social.whatsapp}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {settings.social.vk && (
                <a 
                  href={settings.social.vk}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
                  aria-label="VK"
                >
                  <span className="font-bold text-sm">VK</span>
                </a>
              )}
            </div>
          </div>

          {/* Catalog - Seasonal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Каталог</h4>
            <ul className="space-y-2">
              {catalogLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-white/70 hover:text-primary transition-colors inline-block hover:translate-x-1"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Информация</h4>
            <ul className="space-y-2">
              {settings.info_links.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className={link.highlight 
                      ? "text-primary hover:underline font-medium" 
                      : "text-white/70 hover:text-primary transition-colors"
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-bold text-lg mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center gap-3 text-primary font-bold hover:underline"
                >
                  <Phone className="h-5 w-5" />
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="h-5 w-5" />
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{settings.work_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>© {currentYear} {settings.copyright_text}</p>
          <div className="flex items-center gap-1 text-white/50">
            <span>Сделано с</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" fill="currentColor" />
            <a 
              href="https://24zxc.ru" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              24zxc.ru
            </a>
          </div>
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
