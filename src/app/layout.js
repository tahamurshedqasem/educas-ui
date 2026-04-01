// src/app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduCAS - Educational Content Analysis System",
  description:
    "AI-powered platform for analyzing educational content with subject-adaptive intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-50">{children}</div>
      </body>
    </html>
  );
}
