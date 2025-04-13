/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Desactivamos la optimización de imágenes completamente
    // Esto permite cualquier URL de imagen sin validación
    unoptimized: true,
    
    // Mantenemos la lista de dominios solo por referencia
    domains: [
      'pacomprarserver.onrender.com',
      'cdn.example.com',
      'images.unsplash.com',
      'picsum.photos',
      'loremflickr.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'storage.googleapis.com',
      's3.amazonaws.com', 
      'githubusercontent.com',
      'raw.githubusercontent.com',
      'dummyimage.com',
      'via.placeholder.com',
      'placehold.it',
      'placekitten.com', 
      'cdn.dummyjson.com' 
    ],
  },
}

module.exports = nextConfig
