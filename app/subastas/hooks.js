'use client';
import { useState, useEffect, useCallback } from 'react';

export const useAuctionFilters = (auctions) => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    searchTerm: ''
  });
  
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  
  // Función para establecer el término de búsqueda externamente
  const setSearchTerm = useCallback((term) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term
    }));
  }, []);
  
  const handleCategoryChange = (e) => {
    setFilters({
      ...filters,
      category: e.target.value
    });
  };
  
  const handlePriceMinChange = (e) => {
    setFilters({
      ...filters,
      minPrice: e.target.value
    });
  };
  
  const handlePriceMaxChange = (e) => {
    setFilters({
      ...filters,
      maxPrice: e.target.value
    });
  };
  
  const handleSearch = () => {
    applyFilters();
  };
  
  const applyFilters = useCallback(() => {
    let result = [...auctions];
    
    // Filtrar por categoría
    if (filters.category) {
      result = result.filter(auction => auction.category === filters.category);
    }
    
    // Filtrar por precio mínimo
    if (filters.minPrice !== '') {
      const min = parseFloat(filters.minPrice);
      result = result.filter(auction => auction.currentBid >= min);
    }
    
    // Filtrar por precio máximo
    if (filters.maxPrice !== '') {
      const max = parseFloat(filters.maxPrice);
      result = result.filter(auction => auction.currentBid <= max);
    }
    
    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(auction => 
        auction.title.toLowerCase().includes(term) || 
        auction.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredAuctions(result);
  }, [filters, auctions]);
  
  // Aplicar filtros cuando cambian los filtros o las subastas
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  return {
    filters,
    filteredAuctions,
    handleCategoryChange,
    handlePriceMinChange,
    handlePriceMaxChange,
    handleSearch,
    setSearchTerm
  };
};
