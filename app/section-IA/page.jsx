'use client';
import React, { useEffect , useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import ValidacionCamposVacios from '@/components/AlertasIA/camposVacios';
import ValidacionCamposFormato from '@/components/AlertasIA/camposFormato';
import ValidacionCamposExtension from '@/components/AlertasIA/camposExtension';
import ValidacionCancionRepetida from '@/components/AlertasIA/cancionRepetida';
import CancionEliminadaExitoso from '@/components/AlertasIA/cancionEliminada';
import CancionGuardadaExitoso from '@/components/AlertasIA/cancionGuardada';
import { query ,where ,getFirestore, collection, addDoc, getDocs , deleteDoc , doc} from "firebase/firestore";


export default function SectionIA() {

  // Estado para almacenar la melodía generada
  const [generatedMelody, setGeneratedMelody] = useState(null);
  

  const db = getFirestore(); // Inicializa Firestore


  // variables para las alertas
  const [mostrarValidacionCamposVacios, setMostrarValidacionCamposVacios] = useState(false);
  const [mostrarValidacionCamposFormato, setMostrarValidacionCamposFormato] = useState(false);
  const [mostrarValidacionCamposExtension, setMostrarValidacionCamposExtension] = useState(false);
  const [mostrarValidacionCancionRepetida, setMostrarValidacionCancionRepetida] = useState(false);
  const [mostrarCancionEliminadaExitoso, setMostrarCancionEliminadaExitoso] = useState(false);
  const [mostrarCancionGuardadaExitoso, setMostrarCancionGuardadaExitoso] = useState(false);

  // variables para la sesion
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');

  // variables para el reproductor
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [mmLoaded, setMmLoaded] = useState(false); // Estado para comprobar si mm está cargado
  const [player, setPlayer] = useState(null); // Para guardar la instancia de player
  const [musicRnn, setMusicRnn] = useState(null); // Para guardar la instancia de musicRnn

  // variables para el control de notas en el json

  // JSON inicial
  const [twinkleTwinkle, setTwinkleTwinkle] = useState({
    notes: [],
    totalTime: 0,
  });

  // Estado para manejar el pitch y el tiempo
  //const [pitch, setPitch] = useState(60); // Pitch inicial
  const [startTime, setStartTime] = useState(0.0); // Tiempo inicial
  const [noteDuration, setNoteDuration] = useState(0.5); // Duración por defecto
  const [isAdding, setIsAdding] = useState(true); // Controla si estamos añadiendo notas

  // Variables para los botones de la seccion derecha
  const [isDisabledGrabar, setIsDisabledGrabar] = useState(false); // Estado para el botón
  const [isDisabledFinalizar, setIsDisabledFinalizar] = useState(true); // Estado para el botón
  const [isDisabledReproducir, setIsDisabledReproducir] = useState(true); // Estado para el botón
  const [isDisabledReiniciar, setIsDisabledReiniciar] = useState(true); // Estado para el botón
  const [isDisabledPiano, setIsDisabledPiano] = useState(true); // Estado para el botón
  const [isDisabledNombre, setIsDisabledNombre] = useState(true); // Estado para el botón

  // variables para manejar los estados de los campos de la seccion de IA
  const [inputValueIndice, setInputValueIndice] = useState('');
  const [inputValuePasos, setInputValuePasos] = useState('');
  const [inputValueNombre, setInputValueNombre] = useState('');

  // Función que se ejecuta al cambiar el valor del campo de texto
  const handleInputIndiceChange = (event) => {
    setInputValueIndice(event.target.value); // Actualiza el estado con el nuevo valor
  };
  const handleInputPasosChange = (event) => {
    setInputValuePasos(event.target.value); // Actualiza el estado con el nuevo valor
  };
  const handleInputNombreChange = (event) => {
    setInputValueNombre(event.target.value); // Actualiza el estado con el nuevo valor
  };


  // variables y funciones para manejar el estado habilitado de la seccion de IA
  const [isDisabledGenerarReproducir, setIsDisabledGenerarReproducir] = useState(true); // Estado para el botón
  const [isDisabledReinicarMelodia, setIsDisabledReinicarMelodia] = useState(true); // Estado para el botón
  const [isDisabledGuardar, setIsDisabledGuardar] = useState(true); // Estado para el botón
  const [isDisabledIndice, setIsDisabledIndice] = useState(true); // Estado para el botón
  const [isDisabledPasos, setIsDisabledPasos] = useState(true); // Estado para el botón
  const [isDisabledResetear, setIsDisabledResetear] = useState(true); // Estado para el botón
  const [isDisabledReproducirUsuario, setIsDisabledReproducirUsuario] = useState(true); // Estado para el botón
  const [isDisabledEliminar, setIsDisabledEliminar] = useState(true); // Estado para el botón
  const [isDisabledReproducirPlaylist, setIsDisabledReproducirPlaylist] = useState(false); // Estado para el botón
  const [isDisabledReiniciarFlujo, setIsDisabledReiniciarFlujo] = useState(true); // Estado para el botón
  const [isDisabledRecargar, setIsDisabledRecargar] = useState(true); // Estado para el botón

  // Estado global en tu componente principal
  const [isPlayingSong, setIsPlayingSong] = useState(true);  

useEffect(() => {
  if (!user && !userSession) {
    router.push('/sign-in');
  }

}, [user, userSession, router]);

  
// variables para la seccion de canciones del usuario
const [search, setSearch] = useState('');

// Datos ficticios para pruebas
const [tracks, setTracks] = useState([]);

// Función para cargar canciones desde Firebase
const fetchMelodiesFromFirebase = async () => {
  try {
    const userId = user.uid; // referencia del usuario

    const melodiesCollectionRef = collection(db, `users/${userId}/melodies`);
    const querySnapshot = await getDocs(melodiesCollectionRef);

    if (querySnapshot.empty) {
      console.log("No se encontraron canciones guardadas.");
      return;
    }

    const melodies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

     // Sobrescribir el estado en lugar de concatenar
     setTracks(melodies);
  } catch (error) {
    console.log("Error al cargar canciones desde Firebase:", error);
  }
};

// Cargar canciones al montar el componente
useEffect(() => {
  fetchMelodiesFromFirebase();
}, []);


// busqueda de canciones
const filteredTracks = tracks.filter(track =>
  track.name.toLowerCase().includes(search.toLowerCase())
);


// Cargar el script de Magenta cuando la página se renderice
useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@magenta/music@^1.0.0";
    script.async = true;
    document.body.appendChild(script);

    // Cuando el script se haya cargado, establecemos mmLoaded a true
    script.onload = () => {
      console.log("Script de Magenta cargado");
      setMmLoaded(true); // Actualizamos el estado
    };

    // Limpiar el script cuando el componente se desmonte
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Este efecto solo se ejecutará una vez al montar el componente




  // Inicializar el modelo una vez que mm esté cargado
  useEffect(() => {
    if (mmLoaded) {
      const musicRnnInstance = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn"
      );
      const playerInstance = new mm.Player();
      setMusicRnn(musicRnnInstance); // Guardamos la instancia de musicRnn
      setPlayer(playerInstance); // Guardamos la instancia de player
      const initializeModel = async () => {
        try {
          await musicRnnInstance.initialize();
          setIsModelLoaded(true);
          console.log("Modelo cargado correctamente");
        } catch (error) {
          console.error("Error al cargar el modelo:", error);
        }
      };
      initializeModel();
    }
  }, [mmLoaded]); // Este efecto se ejecuta cuando mmLoaded se vuelve true


let isPlaying = false; // Estado para evitar reproducciones concurrentes
const playSingleNote = async (note) => {
  if (!isModelLoaded || !player) {
    console.log("El modelo aún no está cargado o player no está definido.");
    return;
  }

  if (isPlaying) {
    console.log("Otra nota se está reproduciendo, los botones están deshabilitados.");
    return; // Salir si ya hay una nota reproduciéndose
  }

  isPlaying = true; // Marcar como reproduciendo
  setIsDisabledPiano(true); // Deshabilitar los botones del piano

  const noteSequence = {
    notes: [
      { pitch: note, startTime: 0.0, endTime: 0.5 },
    ],
    totalTime: 0.5,
  };

  try {
    await player.start(noteSequence); // Reproducir la nota
  } catch (error) {
    console.log("Error al reproducir la nota:", error);
  } finally {
    isPlaying = false; // Marcar como no reproduciendo
    setIsDisabledPiano(false); // Habilitar los botones del piano
  }
};




  // animacion al tocar la tecla
  const handleClick = (note) => {
      playSingleNote(note); // Reproducir la nota
      addNote(note);
  };

  // funcion para agregar las notas musicales
  const addNote = (pitch) => {
    if (!isAdding) {
      console.log("isAdding está deshabilitado, no se agrega la nota.");
      return;
    }
    const endTime = startTime + noteDuration;
    setTwinkleTwinkle((prev) => {
      console.log("Estado anterior:", prev);
      return {
        notes: [
          ...prev.notes,
          { pitch, startTime, endTime },
        ],
        totalTime: endTime,
      };
    });
    setStartTime(endTime);
  };
  

  // Función para finalizar
  const finishAdding = () => {
    setIsAdding(false);
    setIsDisabledReproducir(false);
    setIsDisabledFinalizar(true);
    setIsDisabledPiano(true);
    console.log("JSON final:", twinkleTwinkle);
  };

  // funciones de los botones de la seccion derecha

  const ClickBottonGrabar = () =>{
    setIsDisabledPiano(false);
    setIsDisabledGrabar(true);
    setIsDisabledFinalizar(false);
    setIsPlayingSong(true);
    setIsDisabledEliminar(true);
  }

  // funcion del boton reproducir

  const BottomReproducir = async () => {
    setIsDisabledPiano(true);
    player.start(twinkleTwinkle); // Reproduce la secuencia de notas
    setIsDisabledReproducir(true);
    setIsDisabledReiniciar(false);
    // habilitar campos de la seccion IA
    setIsDisabledGenerarReproducir(false);
    setIsDisabledIndice(false);
    setIsDisabledPasos(false);
    setIsDisabledNombre(false);
  };

  const BottomReiniciar = async () => {
    // Vaciar el JSON
    setTwinkleTwinkle({
      notes: [],
      totalTime: 0,
    });
    // Reiniciar `startTime` al valor inicial
    setStartTime(0);
    // habilitar `isAdding` 
    setIsAdding(true); 
    // Cambio en los estados de los botones
    setIsDisabledGrabar(false);  // Habilitar grabar
    setIsDisabledReiniciar(true); // Deshabilitar reiniciar
    // desabilitar campos de IA
    setIsDisabledGenerarReproducir(true);
    setIsDisabledIndice(true);
    setIsDisabledPasos(true);
    setIsDisabledNombre(true);
  };

  const validacionesGenerarMusicaIA = () => {
    if (inputValueIndice.length === 0 || inputValuePasos.length === 0 || inputValueNombre.length === 0) {
      setMostrarValidacionCamposVacios(true);
      throw new Error("Campos vacíos");
    }

    if(inputValueNombre.length > 20){
      setMostrarValidacionCamposExtension(true);
      throw new Error("Datos de nombre fuera del rango aceptado");
    }
  
    if (Number(inputValueIndice) < 0.0 || Number(inputValueIndice) > 2.0) {
      setMostrarValidacionCamposExtension(true);
      throw new Error("Datos de índice fuera del rango aceptado");
    }
  
    if (Number(inputValuePasos) < 30 || Number(inputValuePasos) > 500) {
      setMostrarValidacionCamposExtension(true);
      throw new Error("Datos de pasos fuera del rango aceptado");
    }
  
    if (isNaN(Number(inputValueIndice))) {
      setMostrarValidacionCamposFormato(true);
      throw new Error("El campo índice no es un número");
    }
  
    if (isNaN(Number(inputValuePasos))) {
      setMostrarValidacionCamposFormato(true);
      throw new Error("El campo pasos no es un número");
    }

    if(inputValueIndice.valueOf().charAt(1) == ','){
      setMostrarValidacionCamposFormato(true);
      throw new Error("El formato del campo indice no acepta comas");
    }
  };
  

  const GenerarReproducirMelodia = async () => {
    setIsDisabledReiniciar(true);
    try {
      // Asegúrate de esperar las validaciones
      validacionesGenerarMusicaIA();
  
      const model = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn"
      );
  
      await model.initialize();
      console.log("Modelo de Magenta.js cargado");
  
      const quantizedSequence = mm.sequences.quantizeNoteSequence(twinkleTwinkle, 4);
      const rnnSteps = Number(inputValuePasos);
      const rnnTemperature = Number(inputValueIndice);
  
      const generatedSequence = await model.continueSequence(
        quantizedSequence,
        rnnSteps,
        rnnTemperature
      );
  
      const player = new mm.Player();
      player.start(generatedSequence);


      // Guardar la melodía y la duración calculada en los estados
      setGeneratedMelody(generatedSequence);

      // limpiar el modelo
      model.dispose();
      // cambiar estados de los botones y campos
      setIsDisabledGenerarReproducir(true);
      setIsDisabledGuardar(false);
      setIsDisabledReinicarMelodia(false);
      setIsDisabledIndice(true);
      setIsDisabledPasos(true);
      setIsDisabledNombre(true);
      setIsDisabledResetear(false);
    } catch (e) {
      console.log("Error en el flujo:", e);
    }
  };

  
  const BottomReiniciarMelodia = async () => {
    // cambiar estado de los botones y campos
    setIsDisabledIndice(false);
    setIsDisabledPasos(false);
    setIsDisabledNombre(false);
    setIsDisabledGenerarReproducir(false);
    setInputValueIndice('');
    setInputValuePasos('');
    setInputValueNombre('');
    setIsDisabledReinicarMelodia(true);
    setIsDisabledGuardar(true);
    setIsDisabledResetear(true);
  };

  const BottomResetear = async () => {
    // cambiar estado de los botones y campos
    setIsDisabledReproducirPlaylist(false);
    setIsDisabledIndice(true);
    setIsDisabledPasos(true);
    setIsDisabledNombre(true);
    setIsDisabledGenerarReproducir(true);
    setIsDisabledGuardar(true);
    setIsDisabledReinicarMelodia(true);
    setIsDisabledGrabar(false);
    setIsDisabledResetear(true);
    setInputValueIndice('');
    setInputValuePasos('');
    setInputValueNombre('');
    // vaciar el json de reproducir las notas
    setTwinkleTwinkle({
      notes: [],
      totalTime: 0,
    });
     // Reiniciar `startTime` al valor inicial
     setStartTime(0);
     // habilitar `isAdding` 
     setIsAdding(true); 
  };

  const verificarNombreCancion = async (userId, inputValueNombre) => {
    try {
      // Referencia a la colección de melodías del usuario
      const melodiesCollectionRef = collection(db, `users/${userId}/melodies`);
  
      // Verificar si ya existe una canción con el mismo nombre
      const q = query(melodiesCollectionRef, where("name", "==", inputValueNombre));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        // Si ya existe una canción con el mismo nombre, retornar `true`
        return true;
      }
      return false; // Si no hay duplicados, retornar `false`
    } catch (error) {
      console.error("Error al verificar el nombre de la canción:", error);
      return false; // Retornar `false` en caso de error
    }
  };
  
  const BottomGuardarMelodia = async () => {
    setIsDisabledReproducirPlaylist(false);
    const userId = user.uid; // Asegúrate de obtener el UID del usuario autenticado
  
    if (!userId) {
      console.error("No se puede guardar la melodía sin un usuario autenticado.");
      return;
    }
  
    if (!generatedMelody) {
      console.error("No hay una melodía generada para guardar.");
      return;
    }
  
    try {
      // Convertir `generatedMelody` a un objeto serializable
      const serializedMelody = JSON.parse(JSON.stringify(generatedMelody));
      const totalQuantizedSteps = Number(serializedMelody.totalQuantizedSteps); // Total de pasos
      const stepsPerQuarter = Number(serializedMelody.quantizationInfo.stepsPerQuarter); // Pasos por cuarto de nota
      const qpm = Number(serializedMelody.tempos[0].qpm); // Cuartos de nota por minuto (tempo)

      const durationInSeconds = (totalQuantizedSteps / stepsPerQuarter) * (60 / qpm);
  
      // Preparar datos para guardar
      const melodyData = {
        name: inputValueNombre,
        duration: durationInSeconds,
        melody: serializedMelody,
        createdAt: new Date().toISOString(),
      };
  
      // Verificar si ya existe una canción con el mismo nombre
      const isDuplicate = await verificarNombreCancion(userId, inputValueNombre);
  
      if (isDuplicate) {
        // Si la canción ya existe, lanzar un error y detener el flujo
        throw new Error("Ya existe una canción con ese nombre.");
      } else {
        // Si no es un duplicado, guardar la melodía
        await addDoc(collection(db, `users/${userId}/melodies`), melodyData);
        setMostrarCancionGuardadaExitoso(true);
      }
  
      setIsDisabledGuardar(true); // Deshabilitar el botón después de guardar
      setIsDisabledNombre(true);
      setInputValueNombre('');
      
    } catch (error) {
      // Mostrar el error en consola y alertar al usuario
      console.log("Error al guardar la melodía:", error);
      setMostrarValidacionCancionRepetida(true);
      setIsDisabledNombre(false);
      setInputValueNombre('');
    
    }
  
  };
  

  // Función para recargar canciones
  const recargar = () => {
    fetchMelodiesFromFirebase(); // Vuelve a llamar a la función para cargar canciones
  };

  
  // Función para reproducir la canción
const ReproducircancionUsuario = (cancion) => {
  if (isPlayingSong) return; // Si ya está reproduciendo una canción, no hacer nada

  const player = new mm.Player();

  // Iniciar reproducción
  setIsPlayingSong(true); // Bloquear los botones
  player.start(cancion).then(() => {
    // Esto se ejecuta cuando la canción termina
    setIsPlayingSong(false); // Desbloquear los botones
  });

  // Alternativamente, puedes escuchar el evento `stop()` si la reproducción puede detenerse manualmente:
  player.stopCallback = () => {
    setIsPlayingSong(false); // Asegurar desbloqueo de los botones si se detiene manualmente
  };
};

  const ReproducirPlaylist = () =>{
    // habilitar botones en la seccion de canciones
    setIsPlayingSong(false);
    setIsDisabledEliminar(false);
    setIsDisabledReproducirPlaylist(true);
    setIsDisabledReiniciarFlujo(false);
    setIsDisabledRecargar(false);
    // solo dejar habilitado el boton grabar reniciando el flujo
    setIsDisabledFinalizar(true);
    setIsDisabledReproducir(true);
    setIsDisabledReiniciar(true);
    setIsDisabledGrabar(true);
    // desabilitar la seccion de crear canciones
    setIsDisabledGenerarReproducir(true);
    setIsDisabledReinicarMelodia(true);
    setIsDisabledResetear(true);
    setIsDisabledIndice(true);
    setIsDisabledNombre(true);
    setIsDisabledPasos(true);

  }

  const ReiniciarFlujo = () => {
    // habilitar y desabilitar botones
    setIsPlayingSong(true);
    setIsDisabledEliminar(true);
    setIsDisabledGrabar(false);
    setIsDisabledReproducirPlaylist(false);
    setIsDisabledReiniciarFlujo(true);
    setIsDisabledRecargar(false);

    // Vaciar el JSON de notas
    setTwinkleTwinkle({
      notes: [],
      totalTime: 0,
    });
    // Reiniciar `startTime` al valor inicial
    setStartTime(0);
    // habilitar `isAdding` 
    setIsAdding(true); 

  }


  const EliminarCancionUsuario = async (cancionId) => {
    try {
      setIsDisabledEliminar(true); // Deshabilitar botones de eliminación
  
      // Referencia al documento específico de la canción
      const userId = user.uid; // Asegúrate de que `user` contiene el UID del usuario
      const melodyDocRef = doc(db, `users/${userId}/melodies`, cancionId);
  
      // Eliminar el documento
      await deleteDoc(melodyDocRef);

      setMostrarCancionEliminadaExitoso(true);
  
      // Actualizar la lista local de canciones
      setTracks((prevTracks) => prevTracks.filter((track) => track.id !== cancionId));
  
      console.log(`Canción con ID ${cancionId} eliminada exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar la canción:", error);
    } finally {
      setIsDisabledEliminar(false); // Habilitar los botones nuevamente
    }
  };
  
  


  
  
  



  return (
    <div className="font-sans text-white flex flex-col min-h-screen" style={{ background: 'linear-gradient(to bottom, #2D2E33 59%, #4A4B4E 100%)',}}>
      {/* Menú Superior */}
      <header className="w-full fixed top-0 left-0 z-50">
        <nav className="bg-[#1F1F1F] rounded-full p-4 mt-4 mx-auto shadow-lg flex justify-center items-center w-fit">
          <ul className="flex gap-10 list-none p-0 m-0">
            <li>
              <a
                className="text-[#302F33] hover:text-white transition-colors"
                onClick={() => {
                  router.push('/');
                }}
              >
                <img
                  src="/image_IA/Buttom_home2.svg"
                  alt="Home"
                  className="w-8 h-8 transition-colors hover:filter-white"
                />
              </a>
            </li>
            <li>
              <a
                className="text-[#302F33] hover:text-white transition-colors"
                onClick={() => {
                  router.push('/sign-in-spotify');
                }}
              >
                <img
                  src="/image_IA/Spotify.svg"
                  alt="Spotify"
                  className="w-8 h-8 transition-colors hover:filter-white"
                />
              </a>
            </li>
            <li>
              <a
                className="text-[#302F33] hover:text-white transition-colors"
                onClick={() => {
                  router.push('/section-IA');
                }}
              >
                <img
                  src="/image_IA/music.svg"
                  alt="Music"
                  className="w-8 h-8 transition-colors hover:filter-white"
                />
              </a>
            </li>
            <li>
              <a className="text-[#302F33] hover:text-white transition-colors">
                <img
                  src="/image_IA/logout.svg"
                  alt="Logout"
                  className="w-8 h-8 transition-colors hover:filter-white"
                  onClick={() => {
                    signOut(auth);
                    sessionStorage.removeItem('user');
                  }}
                />
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Titulo Principal */}
      <main className="w-full px-8">
        <h1 className="absolute font-bold text-4xl text-white text-left top-10">
          Genera tu propia melodía
        </h1>
      </main>

      {/* Sección del Piano superior */}

      <div className="relative flex items-end ml-8 mt-28">

            {/* seccion de 3 teclas */}

            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(48)} className='bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1'> 48 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(49)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 49 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(50)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 50 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(51)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 51 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(52)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 52 </button>
            </div>

            {/* seccion de 4 teclas */}

            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(53)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 53 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(54)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 54 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(55)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 55 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(56)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 56 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(57)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 57 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(58)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 58 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(59)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 59 </button>
            </div>

            {/* seccion de 3 teclas */}

            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(60)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 60 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(61)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 61 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(62)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 62 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(63)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 63 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(64)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 64 </button>
            </div>

            {/* seccion de 4 teclas */}

            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(65)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 65 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(66)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 66 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(67)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 67 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(68)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 68 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(69)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 69 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(70)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 70 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(71)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 71 </button>
            </div>
      </div>



      {/* Sección del Piano inferior */}
      <div className="relative flex items-end ml-8 mt-1">
            {/* seccion de 3 teclas */}
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(72)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 72 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(73)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 73 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(74)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 74 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(75)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 75 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(76)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 76 </button>
            </div>

            {/* seccion de 4 teclas */}

            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(77)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 77 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(78)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 78 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(79)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 79 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(80)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 80 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(81)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 81 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(82)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 82 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(83)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 83 </button>
            </div>

            {/* seccion de 3 teclas */}
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(84)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 84 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(85)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 85 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(86)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 86 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(87)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 87 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(88)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 88 </button>
            </div>

            {/* seccion de 4 teclas */}

            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(89)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 89 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(90)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 90 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(91)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 91 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(92)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 92 </button>
            </div>
            {/* Tecla Blanca y Negra */}
            <div className="relative">
                <button disabled = {isDisabledPiano} onClick={() => handleClick(93)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 93 </button>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(94)} className="bg-[#1F1F1F] text-white w-8 h-16 absolute top-0 left-[70%] flex items-end justify-center text-sm z-10 rounded-xl pb-1"> 94 </button>
            </div>
            {/* Última Tecla Blanca */}
            <div>
                <button disabled = {isDisabledPiano} onClick={() => handleClick(95)} className="bg-[#F4F4F4] text-black border border-gray-400 w-14 h-24 flex items-end justify-center text-sm rounded-xl pb-1"> 95 </button>
            </div>
      </div>


    {/* Seccion de botones derecha */}
    <div className="fixed top-36 right-48 flex flex-col items-end space-y-4">
        <div className="flex space-x-4">

            <button disabled={isDisabledGrabar} onClick={() => ClickBottonGrabar()} className="flex items-center px-5 font-bold py-3 bg-[#1F1F1F] text-white rounded-lg shadow hover:bg-gray-700 transition ">
            <img src="/image_IA/icon_grabar.svg" alt="Icono de grabar" className="w-6 h-6 mr-2"/>
              Grabar
            </button>

            <button disabled={isDisabledFinalizar} onClick={() => finishAdding()} className="flex items-center px-5 font-bold py-3 bg-[#1F1F1F] text-white rounded-lg shadow hover:bg-gray-700 transition ">
            <img src="/image_IA/icon_finalizar.svg" alt="Icono de finalizar" className="w-6 h-6 mr-2"/>
             Finalizar
            </button>

        </div>
        <div className="flex space-x-4">

            <button disabled={isDisabledReproducir} onClick={() => BottomReproducir()} className="flex items-center px-5 font-bold py-3 bg-[#1F1F1F] text-white rounded-lg shadow hover:bg-gray-700 transition">
            <img src="/image_IA/icon_reproducir.svg" alt="Icono de reproducir" className="w-6 h-6 mr-2"/>
             Reproducir
            </button>

            <button disabled={isDisabledReiniciar} onClick={() => BottomReiniciar()} className="flex items-center px-5 font-bold py-3 bg-[#1F1F1F] text-white rounded-lg shadow hover:bg-gray-700 transition">
            <img src="/image_IA/icon_reiniciar.svg" alt="Icono de reproducir" className="w-6 h-6 mr-2"/>
             Reinicar
            </button>
            
        </div>
        
    </div>

     {/* Seccion de funciones con IA */}

     <div className=" text-white max-w-72 mx-auto absolute left-8 bottom-2">
        <h3 className="text-left text-3xl font-semibold mb-4">Funciones con IA</h3>
        
        {/* Input para Índice de aleatoriedad */}
        <div className="mb-4">
          <label className="block text-base mb-1">Índice de aleatoriedad (0.0 - 2.0)</label>
          <input disabled={isDisabledIndice} value={inputValueIndice} onChange={handleInputIndiceChange} placeholder="0.0" className="w-full bg-transparent border-b-2 border-slate-800 focus:outline-none focus:border-blue-500 disabled:border-gray-400 disabled:text-gray-400" />
        </div>

        {/* Input para Cantidad de pasos */}
        <div className="mb-6">
          <label className="block text-base mb-1">Cantidad de pasos (30 - 500)</label>
          <input disabled={isDisabledPasos} value={inputValuePasos} onChange={handleInputPasosChange} placeholder="30" className="w-full bg-transparent border-b-2 border-slate-800 focus:outline-none focus:border-blue-500 disabled:border-gray-400 disabled:text-gray-400" />
        </div>

        {/* Input nombre de la cancion */}
        <div className="mb-6">
          <label className="block text-base mb-1">Nombre de la cancion(maximo 50 caracteres)</label>
          <input disabled={isDisabledNombre} value={inputValueNombre} onChange={handleInputNombreChange} placeholder="name" className="w-full bg-transparent border-b-2 border-slate-800 focus:outline-none focus:border-blue-500 disabled:border-gray-400 disabled:text-gray-400" />
        </div>

        {/* Botones para Guardar Reiniciar y resetear */}
        <div className="relative">
          <button onClick={() => BottomGuardarMelodia()} disabled={isDisabledGuardar} className="flex items px-5 py-3 bg-[#1F1F1F] hover:bg-gray-700 text-sm font-bold rounded-lg absolute -right-80 bottom-32 w-32">
            <img src="/image_IA/icon_guardar.svg" alt="Icono de reproducir" className="w-6 h-6 mr-2"/>
            Guardar
          </button>
          <button onClick={() => BottomReiniciarMelodia()} disabled={isDisabledReinicarMelodia} className=" flex items px-5 py-3 bg-[#1F1F1F] hover:bg-gray-700 text-sm font-bold rounded-lg absolute left-80 bottom-8 w-32 ">
            <img src="/image_IA/icon_reiniciarSeccion.svg" alt="Icono de reproducir" className="w-6 h-6 mr-2"/>
            Reiniciar seccion 
          </button>
          <button onClick={() => BottomResetear()} disabled={isDisabledResetear} className=" flex items px-5 py-3 bg-[#1F1F1F] hover:bg-gray-700 text-sm font-medium rounded-lg  absolute left-80 bottom-32 w-32">
            <img src="/image_IA/icon_resetear.svg" alt="Icono de reproducir" className="w-6 h-6 mr-2"/>
            Resetear
          </button>
        </div>


        {/* Botones para Generar y Reproducir melodía */}
        <div className="relative">
          <button onClick={() => GenerarReproducirMelodia()} disabled={isDisabledGenerarReproducir} className="flex items-left px-5 py-3 bg-[#1F1F1F] hover:bg-gray-700 transition text-sm font-bold rounded-lg focus:outline-none absolute w-56 left-80 bottom-52">
          <img src="/image_IA/icon_grabarReiniciar.svg" alt="Icono de reproducir" className="w-6 h-6 mr-2"/>
             Generar y reproducir melodia
          </button>
        </div>

      </div>


        {/* Sección de visualización de canciones */}

       
        <div className="pl-4 pr-4 pt-4 rounded-lg w-1/3 mx-auto text-white absolute right-60 bottom-6 h-64 shadow-lg overflow-hidden" style={{ background: 'linear-gradient(to top, #2D2E33 59%, #4A4B4E 100%)',}}>
          {/* Barra de búsqueda e ícono de recarga */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 rounded-3xl bg-transparent border-black border-2 text-white placeholder-black"
            />
            <button onClick={() => recargar()} disabled = {isPlayingSong || isDisabledRecargar} className="ml-2 p-2 bg-transparent rounded-lg hover:bg-gray-600 transition" title="Recargar canciones">
              <img src="/image_IA/icon_recargar.svg" alt="Icono de recargar" className="w-8 h-8"/> 
            </button>
            <button onClick={() => ReproducirPlaylist()} disabled = {(isDisabledReproducirPlaylist && isDisabledGenerarReproducir) || isDisabledGenerarReproducir} className="ml-2 p-2 bg-transparent rounded-lg hover:bg-gray-600 transition" title="Reproducir Playlist">
              <img src="/image_IA/icon_playlist.svg" alt="Icono de reproducir playlist" className="w-8 h-8"/> 
            </button>
            <button onClick={() => ReiniciarFlujo()} disabled = {isDisabledReiniciarFlujo || isPlayingSong} className="ml-2 p-2 bg-transparent rounded-lg hover:bg-gray-600 transition" title="Reiniciar flujo">
              <img src="/image_IA/icon_resetearTotal.svg" alt="Icono de reiniciar flujo" className="w-8 h-8"/> 
            </button>
          </div>

          {/* Lista de canciones con scroll */}
          <div
            className="space-y-4 h-[calc(100%-74px)] overflow-y-auto custom-scrollbar pr-2"
            style={{ paddingBottom: "0px" }} // Ajustar el relleno inferior dinámicamente
          >
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 rounded-lg shadow border-2 border-black" style={{ background: 'linear-gradient(to right, #2D2E33 59%, #4A4B4E 100%)',}}
              >
                <div className="flex items-center">
                  <img
                    src={track.icon || "/image_IA/logo_cancion.png"}
                    alt="Icono de melodía"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.duration + " segundos" || "00:00"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-0">
                <button
                  onClick={() => ReproducircancionUsuario(track.melody)}
                  className={` p-1 bg-transparent rounded-lg hover:bg-slate-600 transition ${
                    isPlayingSong ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={isPlayingSong} // Botón deshabilitado si está reproduciendo
                >
                  <img src="/image_IA/icon_play-song.svg" alt="Icono de reproducir" className="w-8 h-8"/>
                </button>
                  <button
                    onClick={() => EliminarCancionUsuario(track.id)}
                    className="p-1  bg-transparent rounded-lg hover:bg-slate-600 transition"
                    disabled={isDisabledEliminar || isPlayingSong}
                  >
                    <img src="/image_IA/icon_deleteSong.svg" alt="Icono de reproducir" className="w-8 h-8"/>
                  </button>
                </div>
              </div>
            ))}
            {filteredTracks.length === 0 && (
              <p className="text-center text-gray-400">No se encontraron melodías.</p>
            )}
          </div>
        </div>

    {/* Componentes de las alertas */}

    {mostrarValidacionCamposVacios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <ValidacionCamposVacios setMostrarValidacionCamposVacios={setMostrarValidacionCamposVacios} />
        </div>
    )}

    {mostrarValidacionCamposFormato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <ValidacionCamposFormato setMostrarValidacionCamposFormato={setMostrarValidacionCamposFormato} />
        </div>
    )}

    {mostrarValidacionCamposExtension && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <ValidacionCamposExtension setMostrarValidacionCamposExtension={setMostrarValidacionCamposExtension} />
        </div>
    )}

    {mostrarValidacionCancionRepetida && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <ValidacionCancionRepetida setMostrarValidacionCancionRepetida={setMostrarValidacionCancionRepetida} />
        </div>
    )}

    {mostrarCancionEliminadaExitoso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <CancionEliminadaExitoso setMostrarCancionEliminadaExitoso={setMostrarCancionEliminadaExitoso} />
        </div>
    )}

    {mostrarCancionGuardadaExitoso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <CancionGuardadaExitoso setMostrarCancionGuardadaExitoso={setMostrarCancionGuardadaExitoso} />
        </div>
    )}

   </div>
  );
}
