import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPL Large-Scale Cricket Data Analytics | Flume · HDFS · Hive · PySpark",
  description:
    "Production-grade Academic Big Data Platform analyzing 2008–2026 IPL cricket records using Apache Flume, Hadoop HDFS, Hive, and PySpark.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#070B16] text-[#F4F6FA] min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-5 lg:px-6 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
