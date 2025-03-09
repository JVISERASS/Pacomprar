// Datos de ejemplo para las subastas
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
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 días desde ahora
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
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 días desde ahora
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
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días desde ahora
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
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() // 4 días desde ahora
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
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día desde ahora
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
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 días desde ahora
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
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días desde ahora
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
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 días desde ahora
  }
];

// Función para obtener todas las subastas
export const fetchAuctions = async () => {
  // En un caso real, esto sería una llamada a la API
  // Por ahora, devolvemos los datos de ejemplo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAuctions);
    }, 800); // Simular un delay de red
  });
};

// Función para obtener una subasta por ID
export const fetchAuctionById = async (id) => {
  // En un caso real, esto sería una llamada a la API
  // Por ahora, buscamos en los datos de ejemplo
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const auction = mockAuctions.find(auction => auction.id === id);
      
      if (auction) {
        resolve(auction);
      } else {
        reject(new Error('Subasta no encontrada'));
      }
    }, 600); // Simular un delay de red
  });
};

// Función para hacer una puja
export const placeBid = async (auctionId, amount, userId) => {
  // En un caso real, esto sería una llamada a la API
  // Por ahora, simulamos una respuesta exitosa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Puja realizada con éxito',
        newBid: amount
      });
    }, 1000); // Simular un delay de red
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(amount);
};

export const formatTimeRemaining = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end - now;
  
  if (diff < 0) return "Finalizada";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
