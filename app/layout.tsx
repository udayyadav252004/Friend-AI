import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { defaultMetadata } from "@/lib/site";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="relative min-h-screen overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 bg-aurora opacity-90" />
            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
            <div className="relative">{children}</div>
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
