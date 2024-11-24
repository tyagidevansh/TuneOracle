import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "yt obscurify",
  description: "have ai judge your playlists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
