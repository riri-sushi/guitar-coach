import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Zen_Kurenaido } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zenKurenaido = Zen_Kurenaido({
  variable: "--font-zen-kurenaido",
  subsets: ["latin"],
  weight: "400",
});

const APP_NAME = "guitar-coach";
const APP_DESCRIPTION =
  "完全初心者がギターをゼロから始めて、1曲弾けるようになるための練習ノート。";

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  openGraph: {
    type: "website",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf6e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1814" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${zenKurenaido.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[color:var(--rule)]">
          <div className="w-full max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link
              href="/"
              className="font-hand text-2xl tracking-wide text-[color:var(--ink)]"
            >
              guitar-coach 🎸
            </Link>
            <nav className="text-sm text-[color:var(--ink-soft)] flex gap-4">
              <Link
                href="/songs"
                className="hover:text-[color:var(--ink)] underline-offset-4 hover:underline"
              >
                目標曲
              </Link>
              <Link
                href="/metronome"
                className="hover:text-[color:var(--ink)] underline-offset-4 hover:underline"
              >
                メトロノーム
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
          {children}
        </div>
        <footer className="w-full max-w-3xl mx-auto px-4 py-4 text-xs text-[color:var(--ink-soft)]">
          guitar-coach — 初心者のためのギター練習ノート
        </footer>
      </body>
    </html>
  );
}
