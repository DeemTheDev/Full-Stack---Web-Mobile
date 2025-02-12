import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Fonts

const roboto_font = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "500", "700"],
});

export const metadata: Metadata = {
  title: "Admin",
  description: "Ziaee Technologies Admin Control ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`${roboto_font.variable} antialiased h-[90vh]`}
      lang="en"
      data-theme="forest"
    >
      <Navbar />
      <div>{children}</div>
      <Footer />
    </main>
  );
}
