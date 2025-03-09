// components/Header/Header.jsx
'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="header__logo">
        <img src="/images/paco_logo.png" alt="logo pequeño" />
      </Link>
      <form id="formBusqueda" className="header__search" action="/subastas" method="GET">
        <input type="text" id="campoBusqueda" name="q" placeholder="Buscar..." className="header__search-input" />
        <button type="submit" className="header__search-button">Buscar</button>
      </form>
      <div className="header__buttons">
        <Link href="/login">
          <button className="header__button">Inicio de Sesión</button>
        </Link>
        <Link href="/registro">
          <button className="header__button">Registrarse</button>
        </Link>
      </div>
    </header>
  );
}
