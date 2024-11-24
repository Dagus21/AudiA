// 'use client'

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { signOut } from 'firebase/auth';

// const MiComponente = () => {
//   return (
//     <h1>¡Hola, este es un componente React!</h1>
//   );
// };



// export default function sectionSpotify() {
//   const router = useRouter();



//   return (
//     <div className="bg-gradient-to-b from-green-800 via-black to-black min-h-screen text-white">
//       {/* Menu superior */}
//       <header className="w-full fixed top-0 left-0 z-50">
//         <nav className="bg-green-700 rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit">
//           <ul className="flex gap-10 list-none p-0 m-0">
//             <li>
//               <a href="#" className="text-[#c7c7d1] hover:text-white transition-colors">
//                 <img src="/image_home/Buttom_home.svg"alt="Home"className="w-8 h-8 transition-colors hover:filter-white"/>
//               </a>
//             </li>
//             <li>
//               <a className="text-white transition-colors"
//                 onClick={() => {
//                   router.push('/section-spotify');
//                 }}>
//                 <img src="/image_home/Spotify.svg"alt="Spotify"className="w-8 h-8 transition-colors"/>
//               </a>
//             </li>
//             <li>
//               <a href="#"className="text-[#c7c7d1] hover:text-white transition-colors">
//                 <img src="/image_home/music.svg"alt="Music"className="w-8 h-8 transition-colors hover:filter-white"/>
//               </a>
//             </li>
//             <li>
//               <a className="text-[#c7c7d1] hover:text-white transition-colors">
//                 <img src="/image_home/logout.png"alt="Logout"className="w-8 h-8 transition-colors hover:filter-white"
//                   onClick={() => {
//                     signOut(auth);
//                     sessionStorage.removeItem('user');
//                   }}
//                 />
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </header>


//       {/* Main Content */}
//       <div className="pt-20 grid grid-cols-3 gap-4 p-6">
//         {/* Player Section */}
//         <div className="bg-green-800 text-white p-6 rounded-lg col-span-1">
//           <div className="flex flex-col items-center">
//             <div className="text-6xl mb-4">🎵</div>
//             <h2 className="text-lg font-bold">Título canción</h2>
//             <p className="text-sm text-gray-300">Nombre del artista</p>
//             <div className="flex items-center justify-between w-full mt-4">
//               <span>00:00</span>
//               <span>00:00</span>
//             </div>
//             <div className="flex justify-center mt-2 space-x-4">
//               <button className="bg-white text-black px-4 py-2 rounded-lg">⏮</button>
//               <button className="bg-white text-black px-4 py-2 rounded-lg">⏯</button>
//               <button className="bg-white text-black px-4 py-2 rounded-lg">⏭</button>
//             </div>
//           </div>
//         </div>

//         {/* Playlist Section */}
//         <div className="bg-green-700 text-white p-6 rounded-lg col-span-2">
//           <input
//             type="text"
//             placeholder="Buscar"
//             className="w-full px-4 py-2 rounded-lg mb-4 text-black"
//           />
//           <div className="flex space-x-4 mb-4">
//             <button className="bg-green-600 px-4 py-2 rounded-lg">Playlist 1</button>
//             <button className="bg-green-600 px-4 py-2 rounded-lg">Playlist 2</button>
//           </div>
//           <div className="space-y-2">
//             {[1, 2, 3].map((item) => (
//               <div
//                 key={item}
//                 className="flex justify-between items-center p-2 bg-green-600 rounded-lg"
//               >
//                 <div className="flex items-center space-x-4">
//                   <div className="text-3xl">🎵</div>
//                   <div>
//                     <h3 className="text-sm font-bold">Título canción</h3>
//                     <p className="text-xs text-gray-300">Nombre del artista</p>
//                   </div>
//                 </div>
//                 <span>00:00</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// sign-in-spotify/page.jsx
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
