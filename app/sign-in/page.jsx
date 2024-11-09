'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import OlvidoPassword from '@/components/Alertas/olvido_password';
import RestablecerCorreo from '@/components/Alertas/restablecer_correo';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarAlertaCorreo, setMostrarAlertaCorreo] = useState(false);
  const [mostrarAlertaContra, setMostrarAlertaContra] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    try{
        const res = await signInWithEmailAndPassword(email,password);
        console.log({res});
        sessionStorage.setItem('user',true)
        setEmail('');
        setPassword('');
        router.push('/')
    }catch(e){
        console.error(e)
    }
    
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0E0037] via-[#230C4D] to-[#3A1864]">
      <div className='px-20 py-10 flex'>
        
        <div className=" bg-gradient-to-b from-[#12033D] via-[#0E4157] to-[#09A381]  rounded-lg shadow-xl w-1/2 p-5">
          <div className="flex items-center justify-center">
            <img src='/img/ia-sing-up.svg' alt="ImagenLogin" className="w-9/12" /> 
          </div>
          <h1 className="text-white text-3xl font-semibold pt-5 mb-3 justify-center text-center">¡Bienvenido!</h1>
          <div className=''>
              <h2 className="text-white px-20 mb-5 font-semibold justify-center text-center"> Accede a tu biblioteca de música y disfruta de tus canciones y playlists favoritas en un solo lugar. Conéctate con tu cuenta de Spotify y comienza a escuchar. ¡La música te espera!</h2>
          </div>
        </div>

        <div className=" py-16 px-24 rounded-lg w-1/2">
          <div className="flex items-center justify-center">
            <img src='/img/logo_audia.svg' alt="logo" className="w-1/2" /> 
          </div>

          <h2 className="text-white text-lg mt-5">Correo Electrónico</h2>
          <div className='flex items-center justify-center border-b-2 border-white h-auto'>
            <div className="flex items-center justify-center">
              <img src='/img/icono_mail.svg' alt="Mail" className="w-full" />
            </div>
            <input
              type="email"
              placeholder="Digite su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent rounded outline-none text-white placeholder-white"
            />
          </div>

          <h2 className="text-white text-lg mt-5">Contraseña</h2>
          <div className="flex items-center justify-center border-b-2 border-white h-auto">
            <div className="flex items-center justify-center">
              <img src='/img/candado.svg' alt="Candado" className="w-full" />
            </div>

            <input
              type={showPassword ? "text" : "password"} // Cambia el tipo de input según el estado
              placeholder="Digite su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent rounded outline-none text-white placeholder-white"
            />

            <div className="flex items-center justify-center cursor-pointer" onClick={togglePasswordVisibility}>
              {showPassword ? (
                <img src='/img/eye-closed.svg' alt="Ver contraseña" className="w-full" />
              ) : (
                <img src='/img/eye-open.svg' alt="Ocultar contraseña" className="w-full" />
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center pt-5 space-y-2">
  <a href="/sign-up" className="text-white text-lg font-semibold underline">
    ¿Aún no estás registrado?
  </a>

  <div className="relative">
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        setMostrarAlertaContra(true);
      }}
      className="text-white text-lg font-semibold underline"
    >
      ¿Olvidaste tu contraseña?
    </a>

    {mostrarAlertaContra && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <OlvidoPassword setMostrarAlertaContra={setMostrarAlertaContra} />
      </div>
    )}
  </div>

  <div className="relative">
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        setMostrarAlertaCorreo(true);
      }}
      className="text-white text-lg font-semibold underline"
    >
      Restablecer correo electrónico
    </a>

    {mostrarAlertaCorreo && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <RestablecerCorreo setMostrarAlertaCorreo={setMostrarAlertaCorreo} />
      </div>
    )}
  </div>
</div>


          <div className="flex items-center justify-center pt-5">
            <button
              onClick={handleSignIn}
              className="w-3/6 p-3 bg-white rounded-3xl hover:bg-indigo-100"
            >
              <h2 className="text-[#2A2C7D] font-extrabold ">Entrar</h2>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
