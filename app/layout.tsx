import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Finance Calculator — Loan EMI, FD & RD Calculator",
  description:
    "Calculate loan EMI, total interest, FD maturity amount, and RD returns quickly with our simple Indian finance calculator.",
  applicationName: "Smart Finance Calculator",
  keywords: ["EMI calculator", "loan calculator", "FD calculator", "RD calculator", "fixed deposit", "recurring deposit", "India"],
  openGraph: {
    title: "Smart Finance Calculator — Loan EMI, FD & RD Calculator",
    description:
      "Calculate loan EMI, total interest, FD maturity amount, and RD returns quickly with our simple Indian finance calculator.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
