'use client';

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function EditBidModal({ bid, auctionDetail, onClose, onUpdate }) {
  const [newAmount, setNewAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with current bid amount
  useEffect(() => {
    if (bid) {
      setNewAmount(bid.cantidad.toString());
    }
  }, [bid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!newAmount || isNaN(newAmount) || parseFloat(newAmount) <= 0) {
      setError('Por favor, introduce una cantidad válida.');
      return;
    }

    // New amount must be higher than current
    if (parseFloat(newAmount) <= parseFloat(bid.cantidad)) {
      setError('La nueva puja debe ser superior a la actual.');
      return;
    }

    // If we have auction details, validate against current price
    if (auctionDetail && auctionDetail.precio_actual) {
      const minimumAmount = parseFloat(auctionDetail.precio_actual) * 1.05;
      if (parseFloat(newAmount) < minimumAmount) {
        setError(`La nueva puja debe ser al menos un 5% superior al precio actual (${formatPrice(minimumAmount)}).`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onUpdate(parseFloat(newAmount));
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar la puja.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // If no bid selected, don't show modal
  if (!bid) return null;

  // Get auction title from details if available
  const auctionTitle = auctionDetail ? auctionDetail.titulo : `Subasta #${bid.subasta}`;
  // Get current auction price
  const currentAuctionPrice = auctionDetail ? auctionDetail.precio_actual : parseFloat(bid.cantidad);
  // Calculate minimum amount for next bid (5% more than current price)
  const minimumBidAmount = currentAuctionPrice * 1.05;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Editar Puja</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p>
            Estás editando tu puja para: 
            <strong>{auctionTitle}</strong>
          </p>
          
          <div className={styles.bidInfo}>
            <p className={styles.currentBid}>
              <span className={styles.bidLabel}>Tu puja actual:</span>
              <span className={styles.bidValue}>{formatPrice(bid.cantidad)}</span>
            </p>
            
            {auctionDetail && (
              <p className={styles.currentPrice}>
                <span className={styles.bidLabel}>Precio actual de la subasta:</span>
                <span className={styles.priceValue}>{formatPrice(currentAuctionPrice)}</span>
              </p>
            )}
          </div>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="newAmount">Nueva cantidad (€):</label>
              <input
                id="newAmount"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                min={minimumBidAmount.toFixed(2)}
                step="0.01"
                className={styles.formInput}
                required
                autoFocus
              />
              <small className={styles.bidHint}>
                Mínimo: {formatPrice(minimumBidAmount)}
              </small>
            </div>
            
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Puja'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
