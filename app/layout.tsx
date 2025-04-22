import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>World Explorer</title>
        <meta name="description" content="Explore countries around the world" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen`}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
