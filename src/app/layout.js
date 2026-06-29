import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated metadata for eHaat e-commerce platform
export const metadata = {
  title: "eHaat.com | Your Ultimate Multi-Vendor Marketplace",
  description: "Shop everything you need at eHaat. Connecting sellers and buyers across the nation.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Background updated to Alice Blue (Light Sky Tint) and text to Slate/Deep Blue */}
      <body className="min-h-screen bg-[#F0F8FF] text-[#0F172A] flex flex-col">
        {/* Global Toast Notifications with Light Sky Blue Theme */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFFFFF",
              color: "#0F172A",
              border: "1px solid #BAE6FD", // Light sky blue border
            },
            success: {
              iconTheme: {
                primary: "#0EA5E9", // Sky blue accent for active success events
                secondary: "#FFFFFF",
              },
            },
            error: {
              style: {
                border: "1px solid #EF4444",
              },
            },
          }}
        />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
