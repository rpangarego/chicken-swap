"use client";
import "./globals.css";

import { WagmiConfig } from "wagmi";
import { client } from "./lib/wagmiClient";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig client={client}>{children}</WagmiConfig>
      </body>
    </html>
  );
}
