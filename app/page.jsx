'use client'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/app/firebase/config"
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect } from 'react';

export default function Home() {

  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');

  console.log({user})

  useEffect(() => {
    if (!user && !userSession) {
        router.push('/sign-in');
    }
  }, [user, userSession, router]);


  return (
    <div className="font-sans bg-gradient-to-b from-[#060828] to-[#292D7F] text-white flex flex-col items-center min-h-screen">
    {/* Menú Superior */}
    <header className="w-full fixed top-0 left-0 z-50">
      <nav className="bg-[#292D7F] rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit">
        <ul className="flex gap-10 list-none p-0 m-0">
          <li>
            <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
              <img src="/image_home/Buttom_home.svg" alt="Home" className="w-8 h-8 transition-colors hover:filter-white" />
            </a>
          </li>
          <li>
            <a className="text-[#c7c7d1] hover:text-white transition-colors"
            onClick={() => {
              router.push('/sign-in-spotify');
            }}>
              <img src="/image_home/Spotify.svg" alt="Spotify" className="w-8 h-8 transition-colors hover:filter-white" />
            </a>
          </li>
          <li>
            <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors"
            onClick={() => {
              router.push('/section-IA');
            }}>
              <img src="/image_home/music.svg" alt="Music" className="w-8 h-8 transition-colors hover:filter-white" />
            </a>
          </li>
          <li>
            <a className="text-[#c7c7d1] hover:text-white transition-colors">
              <img src="/image_home/logout.png" alt="Logout" className="w-8 h-8 transition-colors hover:filter-white" 
                onClick={() => {
                  signOut(auth)
                  sessionStorage.removeItem('user')
                }} />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  
    {/* Contenido Principal */}
    <main className="mt-20 max-w-2xl px-4 text-center">
      <section className="welcome-section mt-8">
        <img src="/image_home/logo.png" alt="Logo AudIA" className="w-96 mx-auto mb-8" />
        <h2 className="text-2xl mb-6">¡Bienvenido a AudIA!</h2>
        <p className="mb-4 leading-relaxed">
          Explora una nueva experiencia musical. Con AudIA, puedes escuchar tu música favorita accediendo
          directamente a tu biblioteca de Spotify, donde encontrarás todas las canciones, listas y álbumes que amas.
          ¡Inicia sesión y lleva tu música contigo a donde quieras!
        </p>
        <p className="mb-4 leading-relaxed">
          Además, AudIA te ofrece la posibilidad de liberar tu creatividad musical. Gracias a nuestra herramienta de
          inteligencia artificial, podrás crear melodías básicas desde cero. Experimenta, juega con los sonidos y
          descubre nuevas combinaciones que solo tú podrías imaginar.
        </p>
        <p className="leading-relaxed">
          ¡Empieza ahora y lleva tu pasión por la música al siguiente nivel con AudIA!
        </p>
      </section>
  
      {/* Sección de Pistas */}
      <section className="tracks-section mt-12">
        <h3 className="text-2xl mb-8 text-[#eaeaea]">Pistas generadas con Magenta</h3>
        <div className="track flex items-center justify-center mb-8">
          <img
            src="image_home/imagen-cancion1.jpg" 
            alt="Icono 1" 
            className="w-24 h-24 rounded-full mr-4 object-cover" 
          />
          <a target="_blank" href="https://www.youtube.com/watch?v=NWy_IEcmqjo&ab_channel=Christian" className="text-lg text-[#eaeaea]">Machine Learning Piano Progressions with Magenta's Performance RNN </a>
        </div>
        <div className="track flex items-center justify-center mb-8">
          <a target="_blank" href= "https://www.youtube.com/watch?v=JVf6esaXeLE&ab_channel=FoobaruAI "className="text-lg text-[#eaeaea] mr-4">Performance RNN - TensorFlow / Magenta</a>
          <img
            src="image_home/imagen-cancion2.jpg"
            alt="Icono 2"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <div className="track flex items-center justify-center mb-8">
          <img
            src="image_home/imagen-cancion3.jpg"
            alt="Icono 3"
            className="w-24 h-24 rounded-full mr-4 object-cover"
          />
          <a target="_blank" href="https://www.youtube.com/watch?v=C065_AhBQEg" className="text-lg text-[#eaeaea]">Generating Music with Expressive Timing and Dynamics - Magenta PerformanceRNN</a>
        </div>
      </section>
    </main>
  
    {/* Pie de página */}
    <footer className="w-full bg-[#060828] text-center p-8 mt-12 text-[#eaeaea] text-sm">
      <p className="text-base mb-2">Team AudIA ®</p>
      <a href="https://github.com/Dagus21/AudiA" className="text-base flex items-center justify-center space-x-2 mt-2 text-white" aria-label="Visit GitHub">
        <img src="image_home/logo-git.png" alt="Logo GitHub"  className="w-8 h-8" />
        GitHub
      </a>
      <p className="text-base mt-2">Todos los derechos reservados</p>
    </footer>
  </div>  
  );
}
