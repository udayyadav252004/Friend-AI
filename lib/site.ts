import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const siteConfig = {
  name: APP_NAME,
  description:
    "An instantly available emotionally intelligent AI companion for real conversations in English or Hinglish.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export const defaultMetadata: Metadata = {
  title: {
    default: `${siteConfig.name} | A Friend Who Understands Your Real Life`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
