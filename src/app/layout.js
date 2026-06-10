import { Outfit, Caveat } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata = {
  title: "Absolute World Cup Challenge",
  description: "Registra tu predicción y genera tu boleto para la Quiniela del Mundial de Absolute Group.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${outfit.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
