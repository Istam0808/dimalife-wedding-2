import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata = {
  title: "Дильмурод и Шакира",
  description: "Приглашение на свадьбу — 26 июня 2026, Crystal Plaza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
