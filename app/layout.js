import './globals.css'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Pacomprar',
  description: 'Aplicación de subastas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="layout-container">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}