import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";

const figtree = Figtree({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Codefyx - AI Coding Assistant",
  description: "Codefyx is a minimalist, powerful AI coding assistant designed for developers. Chat with AI, debug code, and explore new concepts in a distraction-free environment.",
  keywords: ["AI", "chatbot", "coding", "developer tools", "programming", "Codefyx", "Gemini", "DeepSeek"],
  authors: [{ name: "Fahmi Rizal" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Codefyx - AI Coding Assistant",
    description: "Minimalist, powerful AI coding assistant for developers.",
    siteName: "Codefyx",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codefyx - AI Coding Assistant",
    description: "Minimalist, powerful AI coding assistant for developers.",
    images: ["/logo.svg"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={figtree.className}>
        {children}
      </body>
    </html>
  );
}
