/**
 * Este script verifica la existencia de imágenes en la carpeta prod_img
 * y muestra una lista de imágenes que faltan.
 * 
 * Para ejecutar este script: node scripts/checkImages.js
 */

const fs = require('fs');
const path = require('path');

// Lista de imágenes utilizadas en la aplicación
const requiredImages = [
  'electronics1.jpg',
  'electronics2.jpg',
  'laptop.jpg',
  'smartphone.jpg',
  'furniture1.jpg',
  'furniture2.jpg',
  'kitchen.jpg',
  'livingroom.jpg',
  'clothing1.jpg',
  'clothing2.jpg',
  'shoes.jpg',
  'fashion.jpg',
  'sports1.jpg',
  'sports2.jpg',
  'bike.jpg',
  'fitness.jpg',
  'toy1.jpg',
  'toy2.jpg',
  'misc1.jpg',
  'misc2.jpg',
  'default.jpg'
];

// Ruta a la carpeta de imágenes
const imagePath = path.join(process.cwd(), 'public', 'prod_img');

// Verificar si la carpeta existe
if (!fs.existsSync(imagePath)) {
  console.log('⚠️ La carpeta prod_img no existe. Creándola...');
  
  try {
    fs.mkdirSync(path.join(process.cwd(), 'public', 'prod_img'), { recursive: true });
  } catch (err) {
    console.error('❌ Error al crear la carpeta prod_img:', err);
    process.exit(1);
  }
}

// Verificar las imágenes
console.log('📋 Comprobando imágenes disponibles...');

const existingImages = fs.readdirSync(imagePath);
const missingImages = requiredImages.filter(img => !existingImages.includes(img));

if (missingImages.length === 0) {
  console.log('✅ Todas las imágenes están disponibles.');
} else {
  console.log('⚠️ Faltan las siguientes imágenes:');
  missingImages.forEach(img => console.log(`   - ${img}`));
  
  console.log('\n📝 Para añadir estas imágenes:');
  console.log('1. Busca imágenes adecuadas para cada categoría');
  console.log('2. Renómbralas según la lista anterior');
  console.log(`3. Colócalas en la carpeta: ${imagePath}`);
}

console.log('\n📷 Lista de imágenes disponibles:', existingImages);

console.log('\nLas imágenes son necesarias para mostrar los productos en las subastas.');
