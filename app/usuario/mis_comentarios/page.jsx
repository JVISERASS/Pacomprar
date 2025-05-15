'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthFetch } from '../../../hooks/useAuthFetch';
import { API_ROUTES } from '../../../config/apiConfig';
import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './styles.module.css';

export default function MisComentariosPage() {
  const [comentarios, setComentarios] = useState([]);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const { authFetch } = useAuthFetch();
  
  // Función para cargar comentarios del usuario
  const fetchComentarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authFetch(API_ROUTES.MY_COMMENTS);
      
      // Ordenar comentarios desde el más reciente al más antiguo
      const ordenados = data.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      
      setComentarios(ordenados);
      
      // Obtener detalles de cada subasta
      await fetchAuctionDetails(ordenados);
      
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setError('No se pudieron cargar tus comentarios. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para obtener detalles de todas las subastas relacionadas
  const fetchAuctionDetails = async (comments) => {
    const uniqueAuctionIds = [...new Set(comments.map(comentario => comentario.subasta))];
    const details = {};
    
    try {
      // Obtener detalles de subastas en paralelo
      await Promise.all(uniqueAuctionIds.map(async (auctionId) => {
        try {
          const auctionData = await authFetch(API_ROUTES.AUCTION_BY_ID(auctionId));
          details[auctionId] = auctionData;
        } catch (error) {
          console.error(`Error al obtener detalles de la subasta ${auctionId}:`, error);
        }
      }));
      
      setAuctionDetails(details);
    } catch (err) {
      console.error('Error al obtener detalles de las subastas:', err);
    }
  };
  
  useEffect(() => {
    fetchComentarios();
  }, [authFetch]);
  
  // Formatear fecha y hora
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
  
  // Función para editar un comentario
  const handleEdit = async (comentario) => {
    router.push(`/subastas/${comentario.subasta}?editComment=${comentario.id}`);
  };

  // Función para eliminar un comentario
  const handleDelete = async (comentario) => {
    // Confirmar antes de eliminar
    if (!window.confirm(`¿Estás seguro de que quieres eliminar este comentario?`)) {
      return;
    }

    try {
      await authFetch(API_ROUTES.COMMENT_BY_ID(comentario.subasta, comentario.id), {
        method: 'DELETE',
      });
      
      // Recargar datos después de la eliminación
      await fetchComentarios();
      
      // Mostrar mensaje de éxito
      alert('Comentario eliminado correctamente');
      
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      alert('No se pudo eliminar el comentario. Por favor, inténtalo de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando tus comentarios...</p>
      </div>
    );
  }

  return (
    <div className={styles.misComentariosContainer}>
      <h1 className={styles.title}>Mis Comentarios</h1>
      
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button 
            onClick={() => fetchComentarios()} 
            className={styles.reloadButton}
          >
            Intentar nuevamente
          </button>
        </div>
      )}
      
      {!error && comentarios.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No has realizado ningún comentario todavía.</p>
          <Link href="/subastas" className={styles.browseLink}>
            Explorar subastas disponibles
          </Link>
        </div>
      ) : (
        <div className={styles.comentariosTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Comentario</div>
            <div className={styles.headerCell}>Fecha</div>
            <div className={styles.headerCell}>Subasta</div>
            <div className={styles.headerCell}>Acciones</div>
          </div>
          
          {comentarios.map((comentario) => {
            const auction = auctionDetails[comentario.subasta];
            
            return (
              <div 
                key={comentario.id} 
                className={styles.tableRow}
              >
                <div className={styles.cell}>
                  <div className={styles.comentarioContent}>
                    <span className={styles.comentarioTitle}>{comentario.titulo}</span>
                    <span className={styles.comentarioText}>{comentario.texto}</span>
                  </div>
                </div>
                
                <div className={styles.cell}>
                  {formatDateTime(comentario.fecha_creacion)}
                </div>
                
                <div className={styles.cell}>
                  <Link href={`/subastas/${comentario.subasta}`} className={styles.subastaLink}>
                    {auction ? auction.titulo : `Cargando subasta #${comentario.subasta}...`}
                  </Link>
                </div>
                
                <div className={styles.cell}>
                  <div className={styles.actionButtons}>
                    <Link href={`/subastas/${comentario.subasta}`} className={styles.actionButton}>
                      Ver subasta
                    </Link>
                    
                    <button 
                      onClick={() => handleEdit(comentario)} 
                      className={`${styles.iconButton} ${styles.editButton}`}
                      aria-label="Editar comentario"
                      title="Editar comentario"
                    >
                      <FaEdit />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(comentario)} 
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      aria-label="Eliminar comentario"
                      title="Eliminar comentario"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
