'use client'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/app/firebase/config"
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useEffect, useState } from 'react';

export default function SingInSpotify() {

  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarValidacionCamposVacios, setMostrarValidacionCamposVacios] = useState(false);
  const [mostrarValidacionCampoCorreo, setMostrarValidacionCampoCorreo] = useState(false);
  const [mostrarValidacionCampoContraseña, setMostrarValidacionCampoContraseña] = useState(false);
  const [mostrarValidacionCorreo, setMostrarValidacionCorreo] = useState(false);
  const [mostrarValidacionExistir, setMostrarValidacionExistir] = useState(false);

  console.log({user})

//  useEffect(() => {
//    if (!user && !userSession) {
//        router.push('/sign-in');
//    }
//  }, [user, userSession, router]);

	const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="font-sans bg-gradient-to-b from-[#1F1B20] to-[#0F581E] text-white flex flex-col items-center min-h-screen"
		style={{ background: "linear-gradient(to bottom, #1F1B20 20%, #0F581E 100%)" }}>
			{/* Menú Superior */}
			<header className="w-full fixed top-0 left-0 z-50">
				<nav className="bg-[#2D9944] rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit">
					<ul className="flex gap-10 list-none p-0 m-0">
						<li>
							<a href="#" className="transition-colors">
							<img
									src="/image_home/Buttom_home.svg"
									alt="Home"
									className="w-8 h-8 filter invert hover:invert-0 transition-colors"
							/>
							</a>
						</li>
						<li>
							<a href="#" className="transition-colors">
							<img
									src="/image_spotify/spotify_icon.svg"
									alt="Spotify"
									className="w-8 h-8 filter invert-0 transition-colors"
							/>
							</a>
						</li>
						<li>
							<a href="#" className="transition-colors">
							<img
									src="/image_spotify/nota_icon.svg"
									alt="Music"
									className="w-8 h-8 filter invert hover:invert-0 transition-colors"
							/>
							</a>
						</li>
						<li>
							<a className="transition-colors">
							<img
									src="/image_spotify/logout.svg"
									alt="Logout"
									className="w-8 h-8 filter invert hover:invert-0 transition-colors"
									onClick={() => {
									signOut(auth);
									sessionStorage.removeItem("user");
									}}
							/>
							</a>
						</li>
					</ul>
				</nav>
			</header>

			{/* Contenido Principal */}
			<main className="mt-20 px-4 w-[75%] text-center">
				<div className="flex pt-24 pb-16 px-24">
					<img src="/image_spotify/spotify_icon_grande.svg" alt="email" className="" /> 
					<div className="flex flex-col items-center justify-center ml-[435px]">
						<h2 className="text-white text-3xl text-right font-bold">
							Para escuchar tus Playlist de Spotify debes iniciar sesión
						</h2>
					</div>
				</div>

				<div className="flex items-center justify-center">
					<button
						//onClick={handleSignIn}
						className="w-2/6 p-3 py-5 bg-white rounded-3xl hover:bg-indigo-100"
					>
						<h2 className="text-[#000000] font-extrabold text-3xl">Iniciar sesión</h2>
					</button>
				</div>
			</main>
    </div>
  );
}
