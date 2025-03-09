'use client';
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { fetchAuctions } from './utils';
import { useAuctionFilters } from './hooks';
import AuctionItem from '../../components/AuctionItem/AuctionItem';

const Subastas = ({ initialSearch = '' }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {
    filters,
    filteredAuctions,
    handleCategoryChange,
    handlePriceMinChange,
    handlePriceMaxChange,
    handleSearch,
    setSearchTerm
  } = useAuctionFilters(auctions);

  // Aplicar el término de búsqueda inicial si se proporciona
  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch, setSearchTerm]);

  useEffect(() => {
    const loadAuctions = async () => {
      setLoading(true);
      try {
        const data = await fetchAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAuctions();
  }, []);

  return (
    <div className={styles.subastasContainer}>
      <h1 className={styles.title}>Subastas</h1>
      
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="category">Categoría:</label>
          <select 
            id="category" 
            value={filters.category} 
            onChange={handleCategoryChange}
          >
            <option value="">Todas las categorías</option>
            <option value="electronica">Electrónica</option>
            <option value="hogar">Hogar</option>
            <option value="moda">Moda</option>
            <option value="deportes">Deportes</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Precio:</label>
          <div className={styles.priceInputs}>
            <input 
              type="number" 
              placeholder="Min €" 
              value={filters.minPrice} 
              onChange={handlePriceMinChange}
            />
            <span>-</span>
            <input 
              type="number" 
              placeholder="Max €" 
              value={filters.maxPrice} 
              onChange={handlePriceMaxChange}
            />
          </div>
        </div>
        
        <button className={styles.searchButton} onClick={handleSearch}>
          Buscar
        </button>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Cargando subastas...</div>
      ) : (
        <div className={styles.auctionsGrid}>
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map(auction => (
              <AuctionItem key={auction.id} auction={auction} />
            ))
          ) : (
            <p className={styles.noResults}>No se encontraron subastas con estos criterios.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Subastas;
