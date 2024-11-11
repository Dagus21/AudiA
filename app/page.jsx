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
    <div className="font-sans bg-[#1f1f3a] text-white flex flex-col items-center min-h-screen">
      {/* Menú Superior */}
      <header className="w-full bg-[#2a2a4a] fixed top-0 left-0 z-50">
        <nav className="bg-[#4a3e8a] rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit">
          <ul className="flex gap-10 list-none p-0 m-0">
            <li>
              <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
                <img src="/image_home/Buttom_home.svg" alt="Home" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
                <img src="/image_home/Spotify.svg" alt="Spotify" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
                <img src="/image_home/music.svg" alt="Music" className="w-8 h-8" />
              </a>
            </li>
            <li>
              <a className="text-[#c7c7d1] hover:text-white transition-colors">
                <img src="/image_home/logout.png" alt="Logout" className="w-8 h-8" 
                onClick={() => {
                signOut(auth)
                sessionStorage.removeItem('user')
                }}/>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Contenido Principal */}
      <main className="mt-20 max-w-2xl px-4 text-center">
        <section className="welcome-section mt-8">
          <img src="/image_home/logo.png" alt="Logo AudIA" className="w-72 mx-auto mb-8" />
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
              src="img/imagen-cancion1.jpg"
              alt="Icono 1"
              className="w-24 h-24 rounded-full mr-4 object-cover"
            />
            <p className="text-lg text-[#eaeaea]">Machine Learning Piano Progressions with Magenta's Performance RNN</p>
          </div>
          <div className="track flex items-center justify-center mb-8">
            <p className="text-lg text-[#eaeaea] mr-4">Performance RNN - TensorFlow / Magenta</p>
            <img
              src="img/imagen-cancion2.jpg"
              alt="Icono 2"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div className="track flex items-center justify-center mb-8">
            <img
              src="img/imagen-cancion3.jpg"
              alt="Icono 3"
              className="w-24 h-24 rounded-full mr-4 object-cover"
            />
            <p className="text-lg text-[#eaeaea]">Generating Music with Expressive Timing and Dynamics - Magenta PerformanceRNN</p>
          </div>
        </section>
      </main>

      {/* Pie de página */}
      <footer className="w-full bg-[#0f092e] text-center p-8 mt-12 text-[#eaeaea] text-sm">
        <p className="mb-2">Team AudIA ®</p>
        <a href="#" className="inline-flex items-center gap-2 hover:text-white">
          <img src="img/logo-git.png" alt="Logo GitHub" className="w-6 h-6" />
          GitHub
        </a>
        <p className="mt-2">Todos los derechos reservados</p>
      </footer>
    </div>
  );
}
