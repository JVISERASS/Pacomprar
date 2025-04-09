'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { FaSearch } from 'react-icons/fa';


const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/subastas?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      {/* Parte superior del header con logo y buscador */}
      <div className={styles.topHeader}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
            <Image 
              src="/images/paco_logo.png" 
              alt="Pacomprar Logo" 
              width={120} 
              height={40} 
              className={styles.logo}
              priority
            />
          </Link>
        </div>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Buscar subastas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <FaSearch />
          </button>
        </form>
        
        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          <div className={`${styles.menuBar} ${mobileMenuOpen ? styles.open : ''}`}></div>
          <div className={`${styles.menuBar} ${mobileMenuOpen ? styles.open : ''}`}></div>
          <div className={`${styles.menuBar} ${mobileMenuOpen ? styles.open : ''}`}></div>
        </div>
      </div>
      
      {/* Navegación principal */}
      <nav className={`${styles.navbar} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.navLinks}>
          <Link href="/" className={pathname === '/' ? styles.activeLink : styles.navLink}>
            Inicio
          </Link>
          <Link href="/subastas" className={pathname === '/subastas' ? styles.activeLink : styles.navLink}>
            Subastas
          </Link>
        </div>

        <div className={styles.userActions}>
          {currentUser ? (
            <>
              <span className={styles.welcomeText}>Hola, {currentUser.username}</span>
              <div className={styles.userMenu}>
                <button className={styles.userMenuButton}>Mi cuenta</button>
                <div className={styles.userMenuDropdown}>
                  <Link href="/perfil" className={styles.dropdownItem}>
                    Mi Perfil
                  </Link>
                  <Link href="/usuario" className={styles.dropdownItem}>
                    Editar Perfil
                  </Link>
                  <Link href="/subastas/crear" className={styles.dropdownItem}>
                    Crear Subasta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${styles.actionButton} ${styles.primaryButton}`}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className={`${styles.actionButton} ${styles.secondaryButton}`}
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
