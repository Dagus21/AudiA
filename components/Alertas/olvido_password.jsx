'use client'
import { useState } from 'react';
import React from 'react';

const OlvidoPassword = ({ setMostrarAlertaContra }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    setEmail(''); // Reset email field
    setPassword(''); // Reset password field
    setMostrarAlertaContra(false); // Close alert
  };

  return (
    <div className="relative bg-white text-black p-6 rounded-lg shadow-xl text-center mx-4 w-full sm:w-3/4 md:w-1/2 lg:w-1/4">
      <button 
        onClick={handleClose} 
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-950 text-4xl lg:text-2xl"
      >
        &times;
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold">Ingresa tu Correo</h1>
      <h2 className="font-bold mt-2 text-sm sm:text-base">Una vez presiones Enviar, se te mandará un correo para restablecer una contraseña</h2>
      <div className="flex items-center justify-center border-b-2 border-black h-auto">
        <input
          type="email"
          placeholder="Digite su correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-transparent rounded outline-none text-black placeholder-gray-400"
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <button
          onClick={handleSignIn}
          className="w-3/4 sm:w-1/2 p-3 bg-[#1C1F57] rounded-3xl hover:bg-[#34376C]"
        >
          <h2 className="text-white font-semibold">Enviar</h2>
        </button>
      </div>
    </div>
  );
};

export default OlvidoPassword;
