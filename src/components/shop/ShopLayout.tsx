import { ReactNode } from "react";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CompareFloatingBar } from "@/components/shop/CompareFloatingBar";
import { OfflineIndicator } from "@/components/shop/OfflineIndicator";
import { InteractiveParticles } from "@/components/shop/InteractiveParticles";

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <main className="flex-1 relative">
        <InteractiveParticles count={40} className="fixed inset-0 z-0" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <CompareFloatingBar />
      <OfflineIndicator />
      <Footer />
    </div>
  );
}
