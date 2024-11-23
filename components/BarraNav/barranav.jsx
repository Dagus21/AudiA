import React from 'react';
import { signOut } from "firebase/auth"; // Asegúrate de tener esto configurado correctamente
import { auth } from "@/app/firebase/config" // Asegúrate de importar correctamente la configuración de Firebase

const BarraNav = () => {
  const handleLogout = () => {
    signOut(auth);
    sessionStorage.removeItem('user');
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <nav className="bg-[#292D7F] rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit">
        <ul className="flex gap-10 list-none p-0 m-0">
          <li>
            <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
              <img
                src="/image_home/Buttom_home.svg"
                alt="Home"
                className="w-8 h-8 transition-colors hover:filter-white"
              />
            </a>
          </li>
          <li>
            <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
              <img
                src="/image_home/Spotify.svg"
                alt="Spotify"
                className="w-8 h-8 transition-colors hover:filter-white"
              />
            </a>
          </li>
          <li>
            <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
              <img
                src="/image_home/music.svg"
                alt="Music"
                className="w-8 h-8 transition-colors hover:filter-white"
              />
            </a>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-[#c7c7d1] hover:text-white transition-colors"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              <img
                src="/image_home/logout.png"
                alt="Logout"
                className="w-8 h-8 transition-colors hover:filter-white"
              />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default BarraNav;
