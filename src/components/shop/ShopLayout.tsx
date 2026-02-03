import { ReactNode } from "react";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CompareFloatingBar } from "@/components/shop/CompareFloatingBar";
import { OfflineIndicator } from "@/components/shop/OfflineIndicator";

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <CompareFloatingBar />
      <OfflineIndicator />
      <Footer />
    </div>
  );
}
