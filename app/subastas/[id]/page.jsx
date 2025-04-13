'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthFetch } from '../../../hooks/useAuthFetch';

const AuctionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidsHistory, setBidsHistory] = useState([]);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const { currentUser } = useAuth();
  const { authFetch, loading: fetchLoading } = useAuthFetch();
  
  const [currentPrice, setCurrentPrice] = useState(0);
  const [highestBid, setHighestBid] = useState(0);

  const formatPrice = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return 'No disponible';
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const renderStars = (rating) => {
    if (rating === undefined || rating === null) return '☆☆☆☆☆';
    
    const ratingNum = typeof rating === 'number' ? rating : parseFloat(rating);
    
    if (isNaN(ratingNum)) return '☆☆☆☆☆';
    
    const fullStars = Math.floor(ratingNum);
    const halfStar = ratingNum % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
        <span className={styles.ratingValue}>({ratingNum.toFixed(1)})</span>
      </>
    );
  };

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      if (!params.id) {
        setError('ID de subasta no proporcionado');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await authFetch(`https://pacomprarserver.onrender.com/api/subastas/${params.id}/`);
        console.log("Datos de la subasta:", data);
        setAuction(data);
        
        setCurrentPrice(parseFloat(data.precio_actual) || parseFloat(data.precio_inicial) || 0);
        
        if (data.pujas && Array.isArray(data.pujas)) {
          setBidsHistory(data.pujas);
          
          if (data.pujas.length > 0) {
            const highestBidItem = data.pujas.reduce(
              (max, bid) => parseFloat(bid.cantidad) > parseFloat(max.cantidad) ? bid : max,
              data.pujas[0]
            );
            
            const highestAmount = parseFloat(highestBidItem.cantidad);
            setHighestBid(highestAmount);
            
            const minNextBid = (highestAmount * 1.05).toFixed(2);
            setBidAmount(minNextBid);
          } else {
            const initialPrice = parseFloat(data.precio_inicial) || 0;
            const minNextBid = (initialPrice * 1.05).toFixed(2);
            setBidAmount(minNextBid);
          }
        }
      } catch (err) {
        console.error('Error al cargar detalles de la subasta:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctionDetails();
  }, [params.id, authFetch]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!params.id) {
      setError('ID de subasta no proporcionado');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const data = await authFetch(`https://pacomprarserver.onrender.com/api/subastas/${params.id}/pujas/`, {
        method: 'POST',
        body: JSON.stringify({ cantidad: bidAmount }),
      });
  
      console.log('Puja realizada con éxito:', data);
      
      const newBidAmount = parseFloat(data.cantidad);
      setCurrentPrice(newBidAmount);
      setHighestBid(newBidAmount);
      
      const minNextBid = (newBidAmount * 1.05).toFixed(2);
      setBidAmount(minNextBid);
      
      const auctionData = await authFetch(`https://pacomprarserver.onrender.com/api/subastas/${params.id}/`);
      setAuction(auctionData);
      
      if (auctionData.pujas && Array.isArray(auctionData.pujas)) {
        setBidsHistory(auctionData.pujas);
      }
      
      alert(`¡Puja realizada con éxito! Tu puja: ${formatPrice(newBidAmount)}`);
    } catch (err) {
      console.error('Error al hacer puja:', err);
      setError(err.message);
      alert(`Error al hacer puja: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || fetchLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando detalles de la subasta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Volver
        </button>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className={styles.errorContainer}>
        <p>No se encontró la subasta solicitada</p>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Volver
        </button>
      </div>
    );
  }

  const isOwner = currentUser && auction?.usuario === currentUser.id;

  const title = auction?.titulo || 'Sin título';
  const description = auction?.descripcion || 'Sin descripción';
  const category = auction?.categoria_nombre || 'Sin categoría';
  const endDate = auction?.fecha_cierre || new Date().toISOString();
  const isAuctionEnded = new Date(endDate) < new Date();
  
  const precio_actual = parseFloat(auction?.precio_actual) || parseFloat(auction?.precio_inicial) || 0;
  const numBids = bidsHistory.length || 0;
  const buyNowPrice = (precio_actual * 1.3).toFixed(2);
  const minBidAmount = (precio_actual * 1.05).toFixed(2);
  
  const seller = auction?.usuario_nombre || 'Vendedor no disponible';
  const imageToShow = auction?.imagen || '/images/prod_img/default-product.jpg';

  return (
    <div className={styles.auctionDetailContainer}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Volver
      </button>
      
      <div className={styles.auctionHeader}>
        <h1 className={styles.title}>{title}</h1>
        
        <div className={styles.ratingDisplay}>
          <span className={styles.stars}>{renderStars(auction?.valoracion)}</span>
        </div>
        
        {isOwner && (
          <button 
            onClick={() => router.push(`/subastas/${params.id}/editar`)}
            className={styles.editButton}
          >
            ✏️ Editar Subasta
          </button>
        )}
      </div>
      
      <div className={styles.infoBar}>
        <div className={styles.category}>Categoría: <strong>{category}</strong></div>
        <div className={styles.timeRemaining}>
          {isAuctionEnded ? (
            <span className={styles.endedBadge}>Subasta finalizada</span>
          ) : (
            <>Finaliza el: <strong>{formatDateTime(endDate)}</strong></>
          )}
        </div>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.leftCol}>
          <div className={styles.productImageContainer}>
            <Image
              src={imageToShow}
              alt={title}
              width={500}
              height={350}
              className={styles.productImage}
              style={{
                objectFit: 'contain',
                width: '100%',
                height: 'auto'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/prod_img/default-product.jpg';
              }}
            />
          </div>
          
          <div className={styles.descriptionBox}>
            <h3 className={styles.sectionTitle}>Descripción</h3>
            <p>{description}</p>
          </div>
          
          <div className={styles.sellerBox}>
            <h3 className={styles.sectionTitle}>Vendedor</h3>
            <div className={styles.sellerInfo}>
              <div className={styles.sellerAvatar}>👤</div>
              <div className={styles.sellerDetails}>
                <p className={styles.sellerName}>{seller}</p>
                {auction?.fecha_registro && (
                  <p className={styles.sellerSince}>
                    Miembro desde: {formatDateTime(auction.fecha_registro)}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.bidsHistoryBox}>
            <h3 className={styles.sectionTitle}>Historial de Pujas</h3>
            {Array.isArray(bidsHistory) && bidsHistory.length > 0 ? (
              <table className={styles.bidsTable}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {bidsHistory.map((bid, index) => (
                    <tr key={bid.id} className={currentUser && bid.pujador === currentUser.id ? styles.userBid : ''}>
                      <td>{bid.pujador_nombre || `Usuario #${bid.pujador}`}</td>
                      <td>{formatPrice(bid.cantidad)}</td>
                      <td>{formatDateTime(bid.fecha_puja)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noBids}>No hay pujas realizadas aún.</p>
            )}
          </div>
        </div>
        
        <div className={styles.rightCol}>
          <div className={styles.bidBox}>
            <h3 className={styles.sectionTitle}>Información de puja</h3>
            
            <div className={styles.priceInfo}>
              <p className={styles.priceRow}>
                <span className={styles.priceLabel}>Precio actual:</span>
                <span className={styles.priceValue}>{formatPrice(precio_actual)}</span>
              </p>
              
              <p className={styles.priceRow}>
                <span className={styles.priceLabel}>Pujas realizadas:</span>
                <span className={styles.bidCount}>{numBids}</span>
              </p>
              
              <p className={styles.priceRow}>
                <span className={styles.priceLabel}>Comprar ahora:</span>
                <span className={styles.buyNowPrice}>{formatPrice(buyNowPrice)}</span>
              </p>
            </div>
            
            {!isAuctionEnded && !isOwner ? (
              <form onSubmit={handleSubmit} className={styles.bidForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="bidAmount">Tu puja:</label>
                  <input
                    id="bidAmount"
                    type="number"
                    min={minBidAmount}
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className={styles.bidInput}
                    placeholder={`Mínimo ${formatPrice(minBidAmount)}`}
                    required
                  />
                  <small className={styles.bidInfo}>
                    La puja mínima es de {formatPrice(minBidAmount)}
                  </small>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.bidButton}
                  disabled={loading || !currentUser}
                >
                  {loading ? 'Procesando...' : 'Realizar Puja'}
                </button>
                
                <button 
                  type="button"
                  className={styles.buyNowButton}
                  disabled={loading || !currentUser}
                  onClick={() => {
                    if (currentUser) {
                      setBidAmount(buyNowPrice);
                      setTimeout(() => {
                        if (confirm(`¿Confirmar compra directa por ${formatPrice(buyNowPrice)}?`)) {
                          const event = { preventDefault: () => {} };
                          handleSubmit(event);
                        }
                      }, 100);
                    } else {
                      alert("Debes iniciar sesión para comprar");
                    }
                  }}
                >
                  Comprar Ahora por {formatPrice(buyNowPrice)}
                </button>
                
                {!currentUser && (
                  <p className={styles.loginRequired}>
                    <a href="/login">Inicia sesión</a> para participar en esta subasta
                  </p>
                )}
              </form>
            ) : (
              <div className={styles.notAvailable}>
                {isAuctionEnded ? (
                  <p>Esta subasta ha finalizado</p>
                ) : isOwner ? (
                  <p>No puedes pujar en tu propia subasta</p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
