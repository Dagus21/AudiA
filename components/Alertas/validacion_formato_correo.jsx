'use client'
import React from 'react';

const ValidacionCampoCorreo = ({ setMostrarValidacionCampoCorreo }) => {
  
  const handleClose = () => {
    setMostrarValidacionCampoCorreo(false); // Cerrar alerta
  };

  return (
    <div className="relative bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mx-4 rounded-lg shadow-lg w-full max-w-lg flex flex-col sm:flex-row items-start space-y-4 sm:space-x-4 sm:space-y-0">

      {/* Ícono de advertencia modificado */}
      <svg
        className="w-8 h-8 text-yellow-600 mx-auto sm:mx-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-12.293a1 1 0 10-1.414 1.414l1 1a1 1 0 010 1.414l-1 1a1 1 0 101.414 1.414l1-1a1 1 0 010-1.414l-1-1a1 1 0 00-.707-.293zM9 13a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
      </svg>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-lg font-semibold">Por favor verifica el formato de tu correo</h1>
      </div>

      {/* Botón de cerrar */}
      <button 
        onClick={handleClose} 
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-4xl lg:text-2xl"
      >
        &times;
      </button>
    </div>

  );
};

export default ValidacionCampoCorreo;
