import type { Metadata } from "next";
import "./globals.css";
import "nordlys-winter/styles.css";
import { AudioProvider } from "../components/audio/AudioProvider";
import { ThemeProvider } from "../components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Nordlys | Where the Northern Lights Come Alive.",
  description:
    "Watch emerald skies dance above a peaceful winter landscape. Let the snowfall slow the world down and experience a little Arctic magic.",
  keywords: [
    "nordlys",
    "northern-lights",
    "aurora-borealis",
    "norway",
    "tromso",
    "arctic",
    "winter",
    "snowfall"
  ],
  authors: [{ name: "Arnab Das" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❄</text></svg>"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#06101f] text-slate-100 antialiased selection:bg-emerald-400 selection:text-slate-950">
        <ThemeProvider>
          <AudioProvider>{children}</AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
