import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';

const AuctionItem = ({ auction }) => {
  // Formatear precio a euros
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '-- €'; // Valor por defecto cuando no hay precio
    }
    return price.toFixed(2) + ' €';
  };
  
  // Calcular tiempo restante de manera sencilla
  const getTimeRemaining = (endDate) => {
    try {
      const now = new Date();
      const end = new Date(endDate);
      const diffMs = end - now;
      
      if (isNaN(end.getTime())) return 'Fecha no disponible';
      if (diffMs <= 0) return 'Finalizada';
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `${diffDays} días, ${diffHours} h`;
      } else {
        return `${diffHours} horas`;
      }
    } catch (e) {
      return 'Fecha no disponible';
    }
  };
  
  // Obtener icono según la categoría
  const getCategoryIcon = (category) => {
    const icons = {
      'electronica': '💻',
      'hogar': '🏠',
      'moda': '👕',
      'deportes': '⚽',
      'otros': '📦'
    };
    
    return icons[category] || '📦';
  };
  
  // Obtener imagen por defecto basada en la categoría
  const getDefaultImage = (category) => {
    // Mapeo de categorías a imágenes de ejemplo
    const defaultImages = {
      'electronica': '/images/prod_img/default-electronics.jpg',
      'hogar': '/images/prod_img/default-home.jpg',
      'moda': '/images/prod_img/default-fashion.jpg',
      'deportes': '/images/prod_img/default-sports.jpg'
    };
    
    return defaultImages[category] || '/images/prod_img/default-product.jpg';
  };
  
  // Manejar el caso donde auction podría ser undefined o null
  if (!auction) {
    return (
      <div className={styles.errorItem}>
        <span className={styles.errorIcon}>⚠️</span>
        <p>Subasta no disponible</p>
      </div>
    );
  }
  
  // URL para ver detalle de la subasta
  const auctionUrl = `/subastas/${auction.id}`;
  
  // Asegurarse de que todos los valores existan
  const safeAuction = {
    id: auction.id || 'unknown',
    title: auction.title || 'Producto sin nombre',
    description: auction.description || 'Sin descripción disponible',
    currentBid: typeof auction.currentBid === 'number' ? auction.currentBid : 0,
    buyNowPrice: auction.buyNowPrice,
    bids: auction.bids || 0,
    seller: auction.seller || 'Vendedor anónimo',
    category: auction.category || 'otros',
    endDate: auction.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  // Determinar la imagen a mostrar
  const imageToShow = auction.imageUrl || getDefaultImage(safeAuction.category);
  
  return (
    <div className={styles.auctionItem}>
      <h3 className={styles.title}>{safeAuction.title}</h3>
      
      <div className={styles.categoryBadge}>
        <span className={styles.categoryIcon}>{getCategoryIcon(safeAuction.category)}</span>
        {safeAuction.category}
      </div>
      
      <div className={styles.imageContainer}>
        <Image 
          src={imageToShow}
          alt={safeAuction.title}
          width={300}
          height={200}
          className={styles.productImage}
          // Si la imagen falla, usamos una imagen por defecto
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/prod_img/default-product.jpg';
          }}
        />
      </div>
      
      <div className={styles.details}>
        <div className={styles.priceSection}>
          <p className={styles.currentPrice}>
            <span className={styles.priceIcon}>💰</span>
            <span className={styles.label}>Precio actual:</span>
            <span className={styles.price}>{formatPrice(safeAuction.currentBid)}</span>
          </p>
          
          {safeAuction.buyNowPrice && (
            <p className={styles.buyNowPrice}>
              <span className={styles.buyNowIcon}>🛒</span>
              <span className={styles.label}>Compra ya:</span>
              <span>{formatPrice(safeAuction.buyNowPrice)}</span>
            </p>
          )}
        </div>
        
        <p className={styles.info}>
          <span className={styles.bids}>
            <span className={styles.bidIcon}>🔨</span> {safeAuction.bids} pujas
          </span>
          <span className={styles.time}>
            <span className={styles.timeIcon}>⏱️</span> {getTimeRemaining(safeAuction.endDate)}
          </span>
        </p>
      </div>
      
      <p className={styles.description}>
        {safeAuction.description.length > 80 
          ? `${safeAuction.description.substring(0, 80)}...` 
          : safeAuction.description}
      </p>
      
      <div className={styles.footer}>
        <span className={styles.seller}>
          <span className={styles.sellerIcon}>👤</span> {safeAuction.seller}
        </span>
        <Link href={auctionUrl} className={styles.button}>
          Ver detalles <span className={styles.arrowIcon}>→</span>
        </Link>
      </div>
    </div>
  );
};

export default AuctionItem;
