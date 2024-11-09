'use client';
import { useState } from 'react';
import React from 'react';

const RestablecerCorreo = ({ setMostrarAlertaCorreo }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      // Aquí puedes usar `currentEmail` y `newEmail` para la lógica de envío de correo
      const res = await signInWithEmailAndPassword(currentEmail, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setCurrentEmail('');
      setNewEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    setCurrentEmail(''); // Reset current email field
    setNewEmail(''); // Reset new email field
    setPassword(''); // Reset password field
    setMostrarAlertaCorreo(false); // Close alert
  };

  return (
    <div className="relative bg-white text-black p-6 rounded-lg shadow-xl text-center w-1/4"> 
      <button 
        onClick={handleClose} 
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-950 text-2xl"
      >
        &times;
      </button>
      <h1 className="text-3xl font-bold">Restablecer Correo</h1>
      
      {/* Campo para Correo Actual */}
      <h3 className="text-xl font-semibold mt-2">Correo Actual</h3>
      <div className='flex items-center justify-center border-b-2 border-black h-auto'>
        <input
          type="email"
          placeholder="Digite su correo actual"
          value={currentEmail}
          onChange={(e) => setCurrentEmail(e.target.value)}
          className="w-full p-3 bg-transparent rounded outline-none text-black placeholder-gray-500"
        />
      </div>
      
      {/* Campo para Correo Nuevo */}
      <h3 className="text-xl font-semibold mt-2">Correo Nuevo</h3>
      <div className='flex items-center justify-center border-b-2 border-black h-auto'>
        <input
          type="email"
          placeholder="Digite su correo nuevo"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full p-3 bg-transparent rounded outline-none text-black placeholder-gray-500"
        />
      </div>
      
      <p className="text-base font-semibold mt-2">Cuando presiones el botón Enviar se enviará un correo para confirmar el cambio.</p>
      
      <div className="flex items-center justify-center pt-5">
        <button
          onClick={handleSignIn}
          className="w-3/6 p-3 bg-[#1C1F57] rounded-3xl hover:bg-[#34376C]"
        >
          <h2 className="text-white font-semibold">Enviar</h2>
        </button>
      </div>
    </div>
  );
};

export default RestablecerCorreo;
