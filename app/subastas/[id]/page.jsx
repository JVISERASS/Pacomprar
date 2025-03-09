'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';

const AuctionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  
  // Función para formatear el precio correctamente
  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return 'No disponible';
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
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
  
  // Obtener datos de la subasta
  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      try {
        // Simulando una llamada a la API con datos de ejemplo
        const mockAuctions = [
          {
            id: '1',
            title: 'iPhone 13 Pro Max - 256GB',
            description: 'iPhone 13 Pro Max en excelente estado. Incluye cargador y auriculares originales.',
            currentBid: 650.00,
            buyNowPrice: 900.00,
            bids: 12,
            seller: 'tecnoventas',
            category: 'electronica',
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            title: 'Sofá de 3 plazas - Diseño moderno',
            description: 'Sofá moderno de 3 plazas en color gris. Material de alta calidad y muy cómodo.',
            currentBid: 250.00,
            buyNowPrice: 450.00,
            bids: 5,
            seller: 'homefurnish',
            category: 'hogar',
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            title: 'Zapatillas Nike Air Max - Talla 42',
            description: 'Zapatillas Nike Air Max nuevas, sin estrenar. Talla 42 (EU).',
            currentBid: 60.00,
            buyNowPrice: null,
            bids: 8,
            seller: 'sportgear',
            category: 'moda',
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '4',
            title: 'Bicicleta de montaña Specialized',
            description: 'Bicicleta de montaña Specialized en excelente estado. Poco uso, como nueva.',
            currentBid: 450.00,
            buyNowPrice: 800.00,
            bids: 3,
            seller: 'cycleworld',
            category: 'deportes',
            endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '5',
            title: 'MacBook Pro 2022 - 16"',
            description: 'MacBook Pro de 16 pulgadas, modelo 2022. Procesador M1 Max, 32GB RAM, 1TB SSD.',
            currentBid: 1800.00,
            buyNowPrice: 2400.00,
            bids: 15,
            seller: 'applefan',
            category: 'electronica',
            endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];
        
        // Esperar un poco para simular carga
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Si no tenemos un ID específico, usamos el primero
        if (!params.id) {
          setAuction(mockAuctions[0]);
          return;
        }
        
        const foundAuction = mockAuctions.find(item => item.id === params.id);
        
        if (foundAuction) {
          setAuction(foundAuction);
        } else {
          // Si no se encuentra la subasta, usamos la primera como fallback
          setAuction(mockAuctions[0]);
        }
      } catch (err) {
        console.error(err);
        // En caso de error, utilizamos un objeto de subasta por defecto
        setAuction({
          id: '1',
          title: 'iPhone 13 Pro Max - 256GB',
          description: 'iPhone 13 Pro Max en excelente estado. Incluye cargador y auriculares originales.',
          currentBid: 650.00,
          buyNowPrice: 900.00,
          bids: 12,
          seller: 'tecnoventas',
          category: 'electronica',
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuction();
  }, [params.id]);
  
  // Manejar el envío de una puja
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bidAmount) return;
    
    // En una app real, aquí enviaríamos la puja al servidor
    alert(`Has pujado ${bidAmount}€ por "${auction.title}"`);
    
    // Simular una subasta exitosa
    setAuction(prev => ({
      ...prev,
      currentBid: parseFloat(bidAmount),
      bids: prev.bids + 1
    }));
    
    setBidAmount('');
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando subasta...</p>
      </div>
    );
  }
  
  // Siempre tendremos una subasta para mostrar, ya que usamos valores por defecto
  const { title, description, currentBid, buyNowPrice, bids, seller, category, endDate } = auction;
  
  // Determinar la imagen a mostrar usando la categoría para seleccionar una imagen por defecto
  const imageToShow = getDefaultImage(category);
  
  // Comprobar si la subasta ha finalizado
  const isAuctionEnded = new Date(endDate) < new Date();
  const minBidAmount = currentBid + (currentBid * 0.05); // Mínimo 5% más que la puja actual
  
  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Volver
      </button>
      
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.infoBar}>
        <div className={styles.category}>Categoría: {category}</div>
        <div className={styles.timeRemaining}>
          {isAuctionEnded ? (
            <span className={styles.endedBadge}>Subasta finalizada</span>
          ) : (
            <>Finaliza el: {new Date(endDate).toLocaleDateString()}</>
          )}
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.leftCol}>
          {/* Imagen del producto */}
          <div className={styles.productImageContainer}>
            <Image 
              src={imageToShow}
              alt={title}
              width={500}
              height={350}
              className={styles.productImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/prod_img/default-product.jpg';
              }}
            />
          </div>
          
          <div className={styles.descriptionBox}>
            <h3>Descripción</h3>
            <p>{description}</p>
          </div>
          
          <div className={styles.sellerBox}>
            <h3>Vendedor</h3>
            <div className={styles.sellerInfo}>
              <p className={styles.sellerName}>{seller}</p>
              <div className={styles.sellerStats}>
                <span className={styles.sellerRating}>⭐⭐⭐⭐☆ (4.2)</span>
                <span className={styles.sellerSales}>134 ventas</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.rightCol}>
          <div className={styles.bidBox}>
            <h3>Información de la subasta</h3>
            
            <div className={styles.priceInfo}>
              <p>
                <span className={styles.priceLabel}>Puja actual:</span>
                <span className={styles.priceValue}>{formatPrice(currentBid)}</span>
              </p>
              
              <p>
                <span className={styles.priceLabel}>Número de pujas:</span>
                <span>{bids}</span>
              </p>
              
              {buyNowPrice && (
                <p>
                  <span className={styles.priceLabel}>Comprar ya por:</span>
                  <span className={styles.buyNowValue}>{formatPrice(buyNowPrice)}</span>
                </p>
              )}
            </div>
            
            {!isAuctionEnded ? (
              <>
                <form onSubmit={handleSubmit} className={styles.bidForm}>
                  <div className={styles.bidInputGroup}>
                    <input
                      type="number"
                      step="0.01"
                      min={minBidAmount}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Mínimo ${formatPrice(minBidAmount)}`}
                      className={styles.bidInput}
                      required
                    />
                    <span className={styles.euroSymbol}>€</span>
                  </div>
                  <button type="submit" className={styles.bidButton}>Pujar</button>
                </form>
                
                {buyNowPrice && (
                  <button className={styles.buyNowButton}>
                    Comprar ahora ({formatPrice(buyNowPrice)})
                  </button>
                )}
              </>
            ) : (
              <div className={styles.auctionEnded}>
                <p>Esta subasta ha finalizado</p>
              </div>
            )}
            
            <div className={styles.bidTips}>
              <h4>Consejos para pujar:</h4>
              <ul>
                <li>Revisa detenidamente la descripción y las imágenes</li>
                <li>Comprueba la valoración del vendedor</li>
                <li>Incrementa tu puja en al menos un 5% sobre la puja actual</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.shippingInfo}>
            <h3>Información de envío</h3>
            <p>Envío estándar: 3-5 días laborables</p>
            <p>Coste de envío: A determinar según ubicación</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
