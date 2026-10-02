import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPL Big Data Analytics | Flume · HDFS · Hive · PySpark",
  description:
    "Production-grade Academic Big Data Platform analyzing 2008–2026 IPL records using Apache Flume, Hadoop HDFS, Hive, and PySpark.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0B0F19] text-gray-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
