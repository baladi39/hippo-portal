import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hippo Portal",
  description: "Hippo Portal - Account Management System",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: 'Nunito', sans-serif;
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
