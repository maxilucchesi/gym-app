import type React from "react"
import type { Metadata } from "next"
import { Roboto_Condensed } from "next/font/google"
import "./globals.css"

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-roboto-condensed",
})

export const metadata: Metadata = {
  title: "Tracker - Seguimiento de Entrenamientos",
  description: "Aplicación para seguimiento de rutinas de entrenamiento en el gimnasio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${robotoCondensed.variable} font-sans`}>{children}</body>
    </html>
  )
}

