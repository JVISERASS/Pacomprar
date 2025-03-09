'use client';

// Este archivo se necesita porque el componente SubastasPage hace referencia a él.
// Contiene hooks personalizados para la página de subastas.

export function useAuctionFilters() {
  // Este hook podría contener la lógica de filtrado,
  // pero en este caso lo dejamos vacío ya que la lógica
  // de filtrado está directamente en el componente SubastasContent
  return {};
}
