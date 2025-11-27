import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Форма заказа 1688/Taobao",
  description: "Удобная форма для приема заказов с китайских маркетплейсов 1688 и Taobao с экспортом в Excel",
  keywords: ["1688", "Taobao", "заказ", "китай", "Excel", "экспорт"],
  authors: [{ name: "Order Form Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Форма заказа 1688/Taobao",
    description: "Удобная форма для приема заказов с китайских маркетплейсов",
    url: "https://chat.z.ai",
    siteName: "Order Form",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Форма заказа 1688/Taobao",
    description: "Удобная форма для приема заказов с китайских маркетплейсов",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
