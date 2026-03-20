import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rishabh Tiwari — Developer",
  description: "Full Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}