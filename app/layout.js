import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Assignment Enumerate - Design System Dashboard",
    template: "%s | Assignment Enumerate",
  },
  description:
    "A modern, accessible dashboard built with Next.js 15, featuring a comprehensive design system with indigo/pink theming, responsive design, and motion preferences support.",
  keywords: [
    "dashboard",
    "design system",
    "Next.js",
    "React",
    "Tailwind CSS",
    "shadcn/ui",
    "responsive design",
    "accessibility",
    "analytics",
  ],
  authors: [{ name: "Assignment Enumerate Team" }],
  creator: "Assignment Enumerate",
  publisher: "Assignment Enumerate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Assignment Enumerate - Design System Dashboard",
    description:
      "A modern, accessible dashboard with comprehensive design system featuring responsive layouts and smooth animations.",
    url: "http://localhost:3000",
    siteName: "Assignment Enumerate",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assignment Enumerate - Design System Dashboard",
    description:
      "Modern dashboard with responsive design and accessibility features.",
    creator: "@assignment_enumerate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
