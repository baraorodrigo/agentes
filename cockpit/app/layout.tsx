import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "El Coyote Cockpit",
  description: "Operator UX para os 7 agentes do El Coyote OS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <Nav />
        <main className="mx-auto max-w-[1280px] px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
