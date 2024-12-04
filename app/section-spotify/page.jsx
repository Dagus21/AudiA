
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiSearch,
  FiMusic,
} from "react-icons/fi";

export default function SectionSpotify() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-green-800 via-black to-black min-h-screen text-white">
      {/* Menu superior */}
      <header className="w-full fixed top-0 left-0 z-50">
  <nav className="bg-green-700 rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit mb-12">
    <ul className="flex gap-10 list-none p-0 m-0">
      {/* Ícono Home */}
      <li>
        <a
          href="#"
          className="group flex items-center justify-center p-2 rounded-full bg-green-700 hover:bg-green-600 transition duration-300"
        >
          <img
            src="/image_home/Buttom_home.svg"
            alt="Home"
            className="w-8 h-8 filter brightness-0 group-hover:brightness-100 transition duration-300"
          />
        </a>
      </li>
      {/* Ícono Spotify (blanco por defecto) */}
      <li>
  <a
    onClick={() => {
      router.push("/section-spotify");
    }}
    className="group flex items-center justify-center p-2 rounded-full bg-green-700 hover:bg-green-600 transition duration-300"
  >
    <img
      src="/image_home/Spotify.svg"
      alt="Spotify"
      className="w-8 h-8 filter invert group-hover:brightness-125 transition duration-300"
    />
  </a>
</li>
      {/* Ícono Music */}
      <li>
        <a
          href="#"
          className="group flex items-center justify-center p-2 rounded-full bg-green-700 hover:bg-green-600 transition duration-300"
        >
          <img
            src="/image_home/music.svg"
            alt="Music"
            className="w-8 h-8 filter brightness-0 group-hover:brightness-100 transition duration-300"
          />
        </a>
      </li>
      {/* Ícono Logout */}
      <li>
        <a
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
          className="group flex items-center justify-center p-2 rounded-full bg-green-700 hover:bg-green-600 transition duration-300"
        >
          <img
            src="/image_home/logout.png"
            alt="Logout"
            className="w-8 h-8 filter brightness-0 group-hover:brightness-100 transition duration-300"
          />
        </a>
      </li>
    </ul>
  </nav>
</header>

      {/* Main Content */}
      <div className="pt-32 grid grid-cols-3 gap-4 p-8">
        {/* Player Section */}
        <div className="bg-green-700 p-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="w-40 h-40 bg-green-800 flex items-center justify-center rounded-full mb-4 shadow-lg">
            <FiMusic size={60} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-center">Título canción</h2>
          <p className="text-md text-gray-300 text-center">
            Nombre del artista
          </p>
          <div className="flex items-center justify-between w-full mt-4 text-sm">
            <span>00:00</span>
            <input type="range" className="w-full mx-2 bg-gray-300" />
            <span>03:45</span>
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300">
              <FiSkipBack size={24} />
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300">
              <FiPlay size={24} />
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300">
              <FiSkipForward size={24} />
            </button>
          </div>
        </div>

        {/* Playlist Section */}
        <div className="col-span-2 bg-green-700 p-6 rounded-lg shadow-lg">
          <div className="flex items-center bg-white rounded-lg px-4 py-2 mb-6">
            <FiSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full ml-2 bg-transparent focus:outline-none text-black"
            />
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition">
              Playlist 1
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition">
              Playlist 2
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 bg-green-800 rounded-lg shadow-sm hover:bg-green-600 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 flex items-center justify-center rounded-full">
                    <FiMusic size={24} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Título canción {item}
                    </h3>
                    <p className="text-sm text-gray-300">Nombre del artista</p>
                  </div>
                </div>
                <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-500 transition">
                  <FiPlay size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// sign-in-spotify/page.jsx
/*
'use client'
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SpotifySignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/section-spotify');
    } else if (status === 'unauthenticated') {
      router.push('/sign-in-spotify');
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      {status === 'loading' && <p>Cargando...</p>}
    </div>
  );
}
*/
