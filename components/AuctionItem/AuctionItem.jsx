'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegClock, FaUser } from 'react-icons/fa';
import styles from './styles.module.css';

export default function AuctionItem({ auction }) {
  const [imageError, setImageError] = useState(false);
  
  if (!auction) {
    return (
      <div className={styles.errorContainer}>
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
    seller: auction.seller || 'Vendedor anónimo',
    category: auction.category || 'otros',
    endDate: auction.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  // Determinar la imagen a mostrar, teniendo en cuenta el estado de error
  const imageToShow = imageError ? 
    '/images/default-auction.jpg' : 
    (auction.imageUrl || '/images/default-auction.jpg');
  
  // Formateo de precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  // Calcular tiempo restante
  const getTimeRemaining = (endDate) => {
    const total = new Date(endDate) - new Date();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    
    if (total <= 0) {
      return "Finalizada";
    }
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    
    return `${minutes}m`;
  };

  return (
    <div className={styles.auctionCard}>
      <Link href={auctionUrl} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <Image 
            src={imageToShow}
            alt={safeAuction.title}
            width={300}
            height={200}
            className={styles.image}
            onError={() => setImageError(true)}
          />
          {safeAuction.buyNowPrice && (
            <div className={styles.buyNowBadge}>
              Comprar ya: {formatPrice(safeAuction.buyNowPrice)}
            </div>
          )}
        </div>
      </Link>
      
      <div className={styles.content}>
        <Link href={auctionUrl} className={styles.titleLink}>
          <h3 className={styles.title}>{safeAuction.title}</h3>
        </Link>
        
        <p className={styles.description}>
          {safeAuction.description.length > 80
            ? `${safeAuction.description.substring(0, 80)}...`
            : safeAuction.description}
        </p>
        
        <div className={styles.priceRow}>
          <div className={styles.currentPrice}>
            {formatPrice(safeAuction.currentBid)}
          </div>
          
          <div className={styles.timeLeft}>
            <FaRegClock className={styles.clockIcon} />
            {getTimeRemaining(safeAuction.endDate)}
          </div>
        </div>
        
        <div className={styles.sellerInfo}>
          <FaUser className={styles.userIcon} />
          <span className={styles.sellerName}>{safeAuction.seller}</span>
        </div>
      </div>
    </div>
  );
}
