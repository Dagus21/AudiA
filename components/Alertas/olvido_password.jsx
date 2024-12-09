'use client'
import { useState } from 'react';
import React from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '@/app/firebase/config'
import ValidacionCampoVacio  from "@/components/Alertas/campoVacioOlvido";
import ValidacionCampoCorreo from '@/components/Alertas/validacion_formato_correo';
import EnvioMensajeOlvidoExitoso from '@/components/Alertas/envioMensajeOlvido';
import ValidacionCorreoInvalido from '@/components/Alertas/correoInvalido';
import ValidacionCorreoInexistente from '@/components/Alertas/usurioInexistenteOlvido';

const OlvidoPassword = ({ setMostrarAlertaContra }) => {
  const [email, setEmail] = useState('');


  // variables de alertas
  const [mostrarValidacionCamposVacio, setMostrarValidacionCampoVacio] = useState(false);
  const [mostrarValidacionCampoCorreo, setMostrarValidacionCampoCorreo] = useState(false);
  const [mostrarEnvioMensajeOlvidoExitoso, setMostrarEnvioMensajeOlvidoExitoso] = useState(false);
  const [mostrarValidacionCorreoInvalido, setMostrarValidacionCorreoInvalido] = useState(false);
  const [mostrarValidacionCorreoInexistente, setMostrarValidacionCorreoInexistente] = useState(false);

  // const handleSignIn = async () => {
  //   try {
  //     const res = await signInWithEmailAndPassword(email, password);
  //     console.log({ res });
  //     sessionStorage.setItem('user', true);
  //     setEmail('');
  //     setPassword('');
  //     router.push('/');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // validacion de los campos
  const validacionCampos = () => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setMostrarValidacionCampoVacio(true);
      throw new Error('No se ingreso el campo de correo requerido');
    }
    if (!emailRegex.test(email)) {
      setMostrarValidacionCampoCorreo(true); // Mostrar la alerta si el formato de correo es incorrecto
      throw new Error('Formato de correo electrónico inválido');
    }

  }

  const handleForgotPassword = async (email) => {
    try {
      validacionCampos();
      await sendPasswordResetEmail(auth, email);
      setMostrarEnvioMensajeOlvidoExitoso(true);
      setEmail(''); // Reset email field
    } catch (error) {
      console.log("Error al enviar el correo de restablecimiento:", error);
      switch (error.code) {
        case "auth/invalid-email":
          setMostrarValidacionCorreoInvalido(true);
          break;
        case "auth/user-not-found":
          setMostrarValidacionCorreoInexistente(true);
          break;
        default:
          console.log(error);
      }
    }
  };

  const handleClose = () => {
    setEmail(''); // Reset email field
    setMostrarAlertaContra(false); // Close alert
  };

  return (
    <div className="relative bg-white text-black p-6 rounded-lg shadow-xl text-center w-1/4"> 
      <button 
        onClick={handleClose} 
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-950 text-2xl"
      >
        &times;
      </button>
      <h1 className="text-3xl font-bold">Ingresa tu Correo</h1>
      <h2 className="font-bold mt-2">Una vez presiones Enviar, se te mandará un correo para restablecer una contraseña , recuerda que la nueva contraseña que establezcas debe tener el formato necesario (contraseña alfanumerica de minimo 8 caracteres y un caracter especial).</h2>
      <div className='flex items-center justify-center border-b-2 border-black h-auto'>
        <input
          type="email"
          placeholder="Digite su correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-transparent rounded outline-none text-black placeholder-white"
        />
      </div>
      <div className="flex items-center justify-center pt-5">
        <button
          onClick={() => {
            handleForgotPassword(email);
          }}
          className="w-3/6 p-3 bg-[#1C1F57] rounded-3xl hover:bg-[#34376C]"
        >
          <h2 className="text-white font-semibold">Enviar</h2>
        </button>
      </div>
       {/* Componentes de las alertas */}

       {mostrarValidacionCamposVacio && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <ValidacionCampoVacio setMostrarValidacionCampoVacio={setMostrarValidacionCampoVacio} />
                </div>
      )}

      {mostrarValidacionCampoCorreo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionCampoCorreo setMostrarValidacionCampoCorreo={setMostrarValidacionCampoCorreo} />
          </div>
      )}

      {mostrarEnvioMensajeOlvidoExitoso && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <EnvioMensajeOlvidoExitoso setMostrarEnvioMensajeOlvidoExitoso={setMostrarEnvioMensajeOlvidoExitoso} />
          </div>
      )}

      {mostrarValidacionCorreoInvalido && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionCorreoInvalido setMostrarValidacionCorreoInvalido={setMostrarValidacionCorreoInvalido} />
          </div>
      )}

      {mostrarValidacionCorreoInexistente && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionCorreoInexistente setMostrarValidacionCorreoInexistente={setMostrarValidacionCorreoInexistente} />
          </div>
      )}

    </div>
  );
};

export default OlvidoPassword;
