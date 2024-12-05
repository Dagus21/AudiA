'use client'
import React, { useEffect } from 'react';

const VeficacionInicio = ({ setMostrarVeficacionInicio }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setMostrarVeficacionInicio(false); // Ocultar la alerta después de 5 segundos
    }, 5000);

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte
  }, [setMostrarVeficacionInicio]);

  return (
    <div className="relative bg-green-50 border-l-4 border-green-500 text-green-800 
      p-4 mx-4 rounded-lg shadow-lg w-full max-w-lg flex flex-col sm:flex-row items-start space-y-4 sm:space-x-4 sm:space-y-0">

      {/* Ícono de éxito */}
      <svg
        className="w-8 h-8 text-green-500 mx-auto sm:mx-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-7.707a1 1 0 111.414-1.414l2.293 2.293a1 1 0 01-1.414 1.414l-2.293-2.293z" clipRule="evenodd" />
      </svg>

      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-lg font-semibold">Se ha enviado un enlace de verificación a tu correo. Por favor, revisa tu correo para confirmar.</h1>
      </div>
    </div>
  );
};

export default VeficacionInicio;
