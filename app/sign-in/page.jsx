'use client'
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import OlvidoPassword from '@/components/Alertas/olvido_password';
import ValidacionCamposVacios from '@/components/Alertas/validacion_campos_vacios';
import ValidacionCampoCorreo from '@/components/Alertas/validacion_formato_correo';
import ValidacionCampoContraseña from '@/components/Alertas/validacion_formato_contraseña';
import ValidacionCorreo from '@/components/Alertas/verificacion_correo';
import ValidacionExistir from '@/components/Alertas/usuario_inexistente';
import { sendSignInLinkToEmail } from 'firebase/auth';
import VeficacionInicio from '@/components/Alertas/envioVerificacionInicio';



const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const auth = getAuth();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarAlertaCorreo, setMostrarAlertaCorreo] = useState(false);
  const [mostrarAlertaContra, setMostrarAlertaContra] = useState(false);
  const [mostrarValidacionCamposVacios, setMostrarValidacionCamposVacios] = useState(false);
  const [mostrarValidacionCampoCorreo, setMostrarValidacionCampoCorreo] = useState(false);
  const [mostrarValidacionCampoContraseña, setMostrarValidacionCampoContraseña] = useState(false);
  const [mostrarValidacionCorreo, setMostrarValidacionCorreo] = useState(false);
  const [mostrarValidacionExistir, setMostrarValidacionExistir] = useState(false);
  const [mostrarVeficacionInicio, setMostrarVeficacionInicio] = useState(false);



  // Funciones
  // Función para validar todos los campos
  const validateFields = () => {
    // Expresión regular para validar el formato de un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Expresión regular para validar la contraseña:
    // - Mínimo 8 caracteres
    // - Al menos una letra mayúscula
    // - Al menos un número
    // - Al menos un carácter especial
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!email || !password) {
        setMostrarValidacionCamposVacios(true); // Mostrar la alerta si hay campos vacíos
        throw new Error('Campos vacíos');
    }
    if (!emailRegex.test(email)) {
        setMostrarValidacionCampoCorreo(true); // Mostrar la alerta si el formato de correo es incorrecto
        throw new Error('Formato de correo electrónico inválido');
    }
    if (!passwordRegex.test(password)) {
        setMostrarValidacionCampoContraseña(true); // Mostrar la alerta si la contraseña no cumple con los requisitos
        throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.');
    }

};
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    try {
        validateFields();
        const res = await signInWithEmailAndPassword(email, password);
        if (res && res.user) {
            const user = res.user;
            if (!user.emailVerified) {
                setMostrarValidacionCorreo(true);
                setEmail('');
                setPassword('');
                throw new Error('El usuario no ha verificado el correo electronico');
            } else {
                // Enviar un correo de verificación adicional para confirmar que es el usuario quien intenta iniciar sesión
                // const actionCodeSettings = {
                //     url: 'http://localhost:3000/confirm', // URL a la que se redirige al usuario tras verificar el enlace
                //     handleCodeInApp: true,
                // };
                // await sendSignInLinkToEmail(user.auth, user.email, actionCodeSettings);
                // // Almacenar el email en localStorage para recuperarlo después de que el usuario haga clic en el enlace
                // window.localStorage.setItem('emailForSignIn', user.email);
                // setEmail('');
                // setPassword('');
                // setMostrarVeficacionInicio(true);
                router.push('/');
            }
        } else {
            setMostrarValidacionExistir(true);
            setEmail('');
            setPassword('');
            throw new Error('El usuario no existe o no se ha registrado');
        }
    } catch (e) {
        console.log(e);
    }
  };


  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0E0037] via-[#230C4D] to-[#3A1864]">
      <div
        className="lg:px-20 px-10 py-10 flex flex-col lg:flex-row items-center justify-center space-y-10 lg:space-y-0 lg:space-x-10"
      >
        {/* Sección izquierda */}
        <div
          className="bg-gradient-to-b from-[#12033D] via-[#0E4157] to-[#09A381] rounded-lg shadow-xl p-5 
                    w-full lg:w-1/2 flex flex-col items-center"
        >
          <div className="flex items-center justify-center">
            <img src="/img/ia-sing-up.svg" alt="ImagenLogin" className="lg:w-9/12 w-11/12" />
          </div>
          <h1 className="text-white text-3xl font-semibold pt-5 mb-3 text-center">
            ¡Bienvenido!
          </h1>
          <h2 className="text-white px-5 lg:px-20 mb-5 font-semibold text-center">
            Accede a tu biblioteca de música y disfruta de tus canciones y playlists
            favoritas en un solo lugar. Conéctate con tu cuenta de Spotify y comienza
            a escuchar. ¡La música te espera!
          </h2>
        </div>

        {/* Sección derecha */}
        <div
          className="py-16 px-8 sm:px-10 lg:px-24 rounded-lg w-full lg:w-1/2 bg-transparent flex flex-col"
        >
          <div className="flex items-center justify-center">
            <img src="/img/logo_audia.svg" alt="logo" className="w-3/4" />
          </div>

          <h2 className="text-white text-lg mt-5">Correo Electrónico</h2>
          <div className="flex items-center border-b-2 border-white h-auto">
            <img src="/img/icono_mail.svg" alt="Mail" className="w-6 h-6" />
            <input
              type="email"
              placeholder="Digite su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent text-white placeholder-white outline-none"
            />
          </div>

          <h2 className="text-white text-lg mt-5">Contraseña</h2>
          <div className="flex items-center border-b-2 border-white h-auto">
            <img src="/img/candado.svg" alt="Candado" className="w-6 h-6" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Digite su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent text-white placeholder-white outline-none"
            />
            <button
              onClick={togglePasswordVisibility}
              className="w-6 h-6 flex items-center justify-center"
            >
              <img
                src={
                  showPassword
                    ? "/img/eye-closed.svg"
                    : "/img/eye-open.svg"
                }
                alt="Toggle Contraseña"
              />
            </button>
          </div>

          {/* Enlaces */}
          <div className="flex flex-col items-center text-center pt-5 space-y-2">
            <a
              href="/sign-up"
              className="text-white text-lg font-semibold underline"
            >
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

          </div>

          {/* Botón Iniciar Sesión */}
          <div className="flex items-center justify-center pt-5">
            <button
              onClick={handleSignIn}
              className="w-3/6 p-3 bg-white rounded-3xl hover:bg-indigo-100"
            >
              <h2 className="text-[#2A2C7D] font-extrabold">Iniciar sesión</h2>
            </button>
          </div>
        </div>
      </div>


      {/* Componentes de las alertas */}

      {mostrarValidacionCamposVacios && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <ValidacionCamposVacios setMostrarValidacionCamposVacios={setMostrarValidacionCamposVacios} />
                </div>
      )}
      {mostrarValidacionCampoCorreo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionCampoCorreo setMostrarValidacionCampoCorreo={setMostrarValidacionCampoCorreo} />
          </div>
      )}
      {mostrarValidacionCampoContraseña && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionCampoContraseña setMostrarValidacionCampoContraseña={setMostrarValidacionCampoContraseña} />
          </div>
      )}
      {mostrarValidacionCorreo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionCorreo setMostrarValidacionCorreo={setMostrarValidacionCorreo} />
          </div>
      )}
      {mostrarValidacionExistir && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <ValidacionExistir setMostrarValidacionExistir={setMostrarValidacionExistir} />
          </div>
      )}
      {mostrarVeficacionInicio && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <VeficacionInicio setMostrarVeficacionInicio={setMostrarVeficacionInicio} />
          </div>
      )}
    </div>
  );
};

export default SignIn;
