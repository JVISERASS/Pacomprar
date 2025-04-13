"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import styles from './styles.module.css';

export default function MyAuctionsPage() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const router = useRouter();
    const { currentUser } = useAuth();
    const { authFetch } = useAuthFetch();
    // Check if user is authenticated

    const fetchAuctionsUser = async () => {
        if (!currentUser || !currentUser.access) {
            router.push('/login');
            return;
        }
    
        try {
            setLoading(true);
            setError('');
    
            const response = await authFetch('https://pacomprarserver.onrender.com/api/misSubastas/');
            
            // Comprueba el tipo de respuesta que tienes
            console.log("Tipo de respuesta:", typeof response);
            
            // Si la respuesta ya es un objeto JSON (no un objeto Response)
            if (response && typeof response.json !== 'function') {
                // Ya tenemos los datos JSON, no necesitamos procesarlos
                setAuctions(Array.isArray(response) ? response : []);
                return;
            }
            
            // Si es un objeto Response normal, procesa el JSON
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Error al cargar tus subastas');
            }
            
            try {
                const data = await response.json();
                setAuctions(Array.isArray(data) ? data : []);
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                setAuctions([]);
            }
        } catch (error) {
            console.error("Error fetching auction", error);
            setError(error.message || 'Error al cargar las subastas');
        } finally {   
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAuctionsUser();
    }, [currentUser, authFetch]);



    const handleDeleteAuction = async (id) => {
        try {
            setLoading(true);
            const response = await authFetch(`https://pacomprarserver.onrender.com/api/subastas/${id}/`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al eliminar la subasta');
            }

            // Refresh the auctions list after deletion
            fetchAuctionsUser();
        } catch (error) {
            console.error('Error deleting auction:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR'
        }).format(price);
      };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loading}>Cargando tus subastas...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.myAuctionsContainer}>
          <div className={styles.myAuctionsHeader}>
            <h1 className={styles.title}>Mis Subastas</h1>
            <Link href="/subastas/crear" className={styles.createButton}>
              Crear Nueva Subasta
            </Link>
          </div>
    
          {error && <div className={styles.error}>{error}</div>}
    
          {auctions.length === 0 && !error ? (
            <div className={styles.noAuctions}>
              <p>Aún no has creado ninguna subasta.</p>
              <Link href="/subastas/crear" className={styles.createFirstButton}>
                Crear mi primera subasta
              </Link>
            </div>
          ) : (
            <div className={styles.auctionsGrid}>
              {auctions.map(auction => (
                <div key={auction.id} className={styles.auctionCard}>
                  <div className={styles.auctionImageContainer}>
                    <Image
                      src={auction.imagen || '/images/prod_img/default-product.jpg'}
                      alt={auction.titulo}
                      width={200}
                      height={150}
                      className={styles.auctionImage}
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/prod_img/default-product.jpg';
                      }}
                    />
                  </div>
                  
                  <div className={styles.auctionInfo}>
                    <h2 className={styles.auctionTitle}>
                      <Link href={`/subastas/${auction.id}`} className={styles.titleLink}>
                        {auction.titulo}
                      </Link>
                    </h2>
                    
                    <div className={styles.auctionDetails}>
                      <p className={styles.auctionPrice}>
                        <strong>Precio actual:</strong> {formatPrice(auction.precio_actual || auction.precio_inicial)}
                      </p>
                      <p className={styles.auctionBids}>
                        <strong>Pujas:</strong> {auction.num_pujas || 0}
                      </p>
                      <p className={styles.auctionDateEnd}>
                        <strong>Finaliza:</strong> {formatDate(auction.fecha_cierre)}
                      </p>
                    </div>
                    
                    <div className={styles.auctionStatus}>
                      {new Date(auction.fecha_cierre) < new Date() ? (
                        <span className={styles.endedStatus}>Finalizada</span>
                      ) : (
                        <span className={styles.activeStatus}>Activa</span>
                      )}
                    </div>
                    
                    <div className={styles.auctionActions}>
                      <Link href={`/subastas/${auction.id}`} className={styles.viewButton}>
                        Ver Detalles
                      </Link>
                      <Link href={`/subastas/${auction.id}/editar`} className={styles.editButton}>
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDeleteAuction(auction.id)} 
                        className={styles.deleteButton}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

