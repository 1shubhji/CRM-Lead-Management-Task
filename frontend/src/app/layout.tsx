import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexCRM - Lead Management Module",
  description: "Enterprise customer pipeline and lead tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
