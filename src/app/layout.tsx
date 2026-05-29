import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "NetSentinel | Governança Visual de Vulnerabilidades e Patch Management",
  description: "Plataforma corporativa de Governança de Segurança e Patch Management com foco em IHC. Reduza a carga cognitiva do SOC cruzando ativos com a base NVD/NIST ao vivo.",
  keywords: "NetSentinel, Patch Management, Governança de TI, Ransomware, Trojans, CVSS, NVD, NIST, ODS 16, Segurança da Informação, IHC",
  authors: [{ name: "NetSentinel Team" }],
  openGraph: {
    title: "NetSentinel | Governança Visual de Vulnerabilidades",
    description: "Monitore, identifique e corrija vulnerabilidades em tempo real. IHC focada em reduzir o cansaço mental do analista de SOC.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
