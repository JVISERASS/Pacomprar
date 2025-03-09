import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.indexMain}>
      <video autoPlay muted loop className={styles.indexHero}>
        <source src="/images/pacomprarPromotion.mp4" type="video/mp4" />
        Tu navegador no soporta el formato de video.
      </video>
    </div>
  );
}