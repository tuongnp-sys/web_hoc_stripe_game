import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SessionProvider } from "@/components/SessionProvider";
import { MergeGuestOnLogin } from "@/components/MergeGuestOnLogin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web Học Stripe Game",
  description: "Game quiz học tích hợp Stripe — 5 lượt thử, Pro/Vip unlock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50`}
      >
        <SessionProvider>
          <MergeGuestOnLogin />
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
