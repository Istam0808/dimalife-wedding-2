import { Marck_Script, Caveat } from "next/font/google";
import "./globals.scss";

const marckScript = Marck_Script({
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  variable: "--font-marck-script",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata = {
  title: "Дильмурод и Шакира",
  description: "Приглашение на свадьбу — 26 июня 2026, Crystal Plaza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${marckScript.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
