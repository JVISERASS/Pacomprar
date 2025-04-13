'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './styles.module.css';
import AuctionItem from '../../components/AuctionItem/AuctionItem';
import { useAuthFetch } from '../../hooks/useAuthFetch';

// Define constant directly here to avoid external file dependency
const API_BASE_URL = 'https://pacomprarserver.onrender.com/api';

export default function SubastasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    categoria: searchParams.get('categoria') || '',
    precio_min: searchParams.get('precio_min') || '',
    precio_max: searchParams.get('precio_max') || '',
    search: searchParams.get('search') || ''
  });
  
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get authFetch hook
  const { authFetch, loading: fetchLoading, error: fetchError } = useAuthFetch();
  
  // Image URL sanitizer function
  const getSafeImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/default-auction.jpg';
    if (imageUrl.startsWith('/')) return imageUrl;
    try {
      if (imageUrl && !imageUrl.match(/^https?:\/\//)) {
        if (imageUrl.includes('.')) {
          imageUrl = 'https://' + imageUrl;
        }
      }
      return imageUrl;
    } catch (err) {
      if (imageUrl && typeof imageUrl === 'string') {
        if (!imageUrl.match(/^https?:\/\//)) {
          if (imageUrl.startsWith('./') || imageUrl.startsWith('../') || !imageUrl.includes('://')) {
            return imageUrl;
          }
        }
      }
      return '/images/default-auction.jpg';
    }
  };

  // Update URL with current filters
  const updateUrlWithFilters = (currentFilters) => {
    const params = new URLSearchParams();
    
    if (currentFilters.categoria) params.append('categoria', currentFilters.categoria);
    if (currentFilters.precio_min) params.append('precio_min', currentFilters.precio_min);
    if (currentFilters.precio_max) params.append('precio_max', currentFilters.precio_max);
    if (currentFilters.search) params.append('search', currentFilters.search);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/subastas${newUrl}`, { shallow: true });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'precio_min' || name === 'precio_max') && value !== '') {
      if (isNaN(value) || Number(value) < 0) {
        return;
      }
    }
    
    // Update the filters state
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(updatedFilters);
    // Update URL to reflect new filters
    updateUrlWithFilters(updatedFilters);
  };

  // Reset filters completely
  const resetFilters = () => {
    const emptyFilters = {
      categoria: '',
      precio_min: '',
      precio_max: '',
      search: ''
    };
    
    setFilters(emptyFilters);
    // Clear URL params when filters are reset
    router.replace('/subastas', { shallow: true });
  };

  // Fetch auctions with filtering using authFetch
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        
        const queryParams = new URLSearchParams();
        
        // Only add non-empty filter values
        if (filters.categoria) queryParams.append('categoria', filters.categoria);
        if (filters.precio_min && !isNaN(filters.precio_min) && Number(filters.precio_min) >= 0) {
          queryParams.append('precio_min', filters.precio_min);
        }
        if (filters.precio_max && !isNaN(filters.precio_max) && Number(filters.precio_max) >= 0) {
          queryParams.append('precio_max', filters.precio_max);
        }
        if (filters.search) queryParams.append('search', filters.search);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const url = `${API_BASE_URL}/subastas/${queryString}`;
        
        const data = await authFetch(url, { method: 'GET' });
        console.log("Datos de subastas recibidos:", data);
        
        // Map API response fields to the format expected by AuctionItem
        const mappedAuctions = (data || []).map(auction => {
          return {
            id: auction.id,
            title: auction.titulo,
            description: auction.descripcion,
            currentBid: parseFloat(auction.precio_actual || auction.precio_inicial),
            buyNowPrice: parseFloat(auction.precio_actual || auction.precio_inicial) * 1.3,
            imageUrl: getSafeImageUrl(auction.imagen),
            seller: auction.usuario_nombre || `Usuario ${auction.usuario}`,
            category: auction.categoria.toString(),
            endDate: auction.fecha_cierre
          };
        });
        
        setAuctions(mappedAuctions);
        setError(null);
      } catch (err) {
        console.error('Error al cargar subastas:', err);
        setError(err.message);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctions();
  }, [filters, authFetch]);

  // Effect to handle URL search parameter changes
  useEffect(() => {
    const search = searchParams.get('search');
    if (search && search !== filters.search) {
      setFilters(prev => ({
        ...prev,
        search: search
      }));
    }
  }, [searchParams]);

  return (
    <div className={styles.subastasContent}>
      <div className={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className={styles.searchInput}
        />
        <select 
          name="categoria" 
          value={filters.categoria} 
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="">Todas las categorías</option>
          <option value="1">Smartphones</option>
          <option value="2">Laptops</option>
          <option value="3">Hogar</option>
          <option value="4">Moda</option>
          <option value="5">Deportes</option>
        </select>
        <div className={styles.priceFilters}>
          <input
            type="number"
            min="0"
            placeholder="Precio mínimo"
            name="precio_min"
            value={filters.precio_min}
            onChange={handleFilterChange}
            className={styles.priceInput}
          />
          <input
            type="number"
            min="0"
            placeholder="Precio máximo"
            name="precio_max"
            value={filters.precio_max}
            onChange={handleFilterChange}
            className={styles.priceInput}
          />
        </div>
        <button 
          onClick={resetFilters} 
          className={styles.resetButton}
          disabled={!filters.categoria && !filters.precio_min && !filters.precio_max && !filters.search}
        >
          Limpiar filtros
        </button>
      </div>

      <div className={styles.resultsCount}>
        <p>Se encontraron {auctions.length} subastas</p>
      </div>

      {loading || fetchLoading ? (
        <div className={styles.loading}>Cargando subastas...</div>
      ) : error || fetchError ? (
        <div className={styles.error}>{error || fetchError}</div>
      ) : (
        <div className={styles.auctionsGrid}>
          {auctions.length > 0 ? (
            auctions.map(auction => (
              <AuctionItem 
                key={auction.id} 
                auction={auction}
              />
            ))
          ) : (
            <p className={styles.noResults}>No se encontraron subastas con estos filtros</p>
          )}
        </div>
      )}
    </div>
  );
}
