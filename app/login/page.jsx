'use client';
import { useState } from 'react';
import styles from './login.module.css'; // ✅ Importamos CSS correctamente

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://das-p2-backend.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('username', data.username);
        window.location.href = '/'; // Redirige a la página principal
      } else {
        console.error('Error en login:', data);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <main className={styles.loginMain}> {/* ✅ Se usa styles.clase */}
      <div className={styles.loginContainer}>
        <h1>Iniciar Sesión</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className={styles.loginFormInput}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className={styles.loginFormInput}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Ingresar" className={styles.loginFormSubmit} />
        </form>
        <div className={styles.loginLinks}>
          <a href="/recuperar-contrasena" className={styles.loginLinksLink}>¿Olvidaste tu contraseña?</a>
          <a href="/registro" className={styles.loginLinksLink}>Crear cuenta nueva</a>
        </div>
      </div>
    </main>
  );
}
