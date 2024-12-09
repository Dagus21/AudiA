'use client'
import React, { useEffect } from 'react';

const CancionEliminadaExitoso = ({ setMostrarCancionEliminadaExitoso }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setMostrarCancionEliminadaExitoso(false); // Ocultar la alerta después de 5 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
  }, [setMostrarCancionEliminadaExitoso]);

  return (
    <div className="relative bg-green-50 border-l-4 border-green-500 text-green-800 p-6 rounded-lg shadow-lg w-1/3 mx-auto flex items-start space-x-4">
      {/* Ícono de éxito */}
      <svg
        className="w-6 h-6 text-green-500 mt-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-7.707a1 1 0 111.414-1.414l2.293 2.293a1 1 0 01-1.414 1.414l-2.293-2.293z" clipRule="evenodd" />
      </svg>
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold">La canción se elimino correctamente.</h1>
      </div>
    </div>
  );
};

export default CancionEliminadaExitoso;