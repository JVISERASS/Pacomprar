'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import AuctionItem from '../../components/AuctionItem/AuctionItem';

export default function SubastasPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: initialSearchTerm,
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  
  // Lista de categorías disponibles
  const categories = [
    { id: '', name: 'Todas las categorías' },
    { id: 'electronica', name: 'Electrónica' },
    { id: 'hogar', name: 'Hogar' },
    { id: 'moda', name: 'Moda' },
    { id: 'deportes', name: 'Deportes' },
    { id: 'otros', name: 'Otros' }
  ];
  
  useEffect(() => {
    // Simular una llamada a la API para obtener las subastas
    const fetchAuctions = async () => {
      setLoading(true);
      
      try {
        // Datos de ejemplo - en una app real, se obtendrían del backend
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
          },
          {
            id: '6',
            title: 'Set de sartenes de cerámica',
            description: 'Set de 5 sartenes con recubrimiento cerámico antiadherente. Aptas para todo tipo de cocinas.',
            currentBid: 75.00,
            buyNowPrice: 120.00,
            bids: 6,
            seller: 'kitchenstore',
            category: 'hogar',
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '7',
            title: 'Abrigo de lana - Talla L',
            description: 'Abrigo de lana para hombre, talla L. Color azul marino, excelente calidad.',
            currentBid: 90.00,
            buyNowPrice: null,
            bids: 4,
            seller: 'fashionshop',
            category: 'moda',
            endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '8',
            title: 'Set de pesas y mancuernas',
            description: 'Set completo de pesas y mancuernas ajustables. Perfecto para entrenamientos en casa.',
            currentBid: 120.00,
            buyNowPrice: 180.00,
            bids: 10,
            seller: 'fitnessgear',
            category: 'deportes',
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ];
        
        // Simular un delay para mostrar el estado de carga
        setTimeout(() => {
          setAuctions(mockAuctions);
          setLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error al cargar subastas:', error);
        setLoading(false);
      }
    };
    
    fetchAuctions();
  }, []);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Filtrar las subastas según los criterios
  const filteredAuctions = auctions.filter(auction => {
    // Filtrar por término de búsqueda
    if (filters.searchTerm && !auction.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !auction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrar por categoría
    if (filters.category && auction.category !== filters.category) {
      return false;
    }
    
    // Filtrar por precio mínimo
    if (filters.minPrice && auction.currentBid < parseFloat(filters.minPrice)) {
      return false;
    }
    
    // Filtrar por precio máximo
    if (filters.maxPrice && auction.currentBid > parseFloat(filters.maxPrice)) {
      return false;
    }
    
    return true;
  });
  
  // Función para limpiar los filtros
  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Subastas disponibles</h1>
      
      <div className={styles.filtersContainer}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="searchTerm">Búsqueda</label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="¿Qué estás buscando?"
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="minPrice">Precio mínimo</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="€ Min"
              className={styles.filterInput}
              min="0"
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label htmlFor="maxPrice">Precio máximo</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="€ Max"
              className={styles.filterInput}
              min="0"
            />
          </div>
          
          <div className={styles.filterActions}>
            <button onClick={handleResetFilters} className={styles.resetButton}>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.resultsInfo}>
        <p>Se encontraron {filteredAuctions.length} subastas</p>
      </div>
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando subastas...</p>
        </div>
      ) : (
        <div className={styles.auctionsList}>
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map(auction => (
              <AuctionItem key={auction.id} auction={auction} />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No se encontraron subastas con los filtros aplicados.</p>
              <button onClick={handleResetFilters} className={styles.tryAgainButton}>
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
