import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const headingFont = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Puzzle Path",
  description: "A kid-friendly sequence of puzzles with score tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
