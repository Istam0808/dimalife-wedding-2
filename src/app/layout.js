import { Cormorant_Garamond, Montserrat, Raleway } from "next/font/google";
import localFont from "next/font/local";
import "./globals.scss";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-raleway",
  display: "swap",
});

const playfairDisplay = localFont({
  src: [
    {
      path: "../../fonts/PlayfairDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/PlayfairDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-playfair",
  display: "swap",
});

const bickhamScript = localFont({
  src: "../../fonts/bickhamscriptone.ttf",
  variable: "--font-bickham",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Дильмурод и Шакира",
  description: "Приглашение на свадьбу — 26 июня 2026, Crystal Plaza",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${raleway.variable} ${playfairDisplay.variable} ${bickhamScript.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
