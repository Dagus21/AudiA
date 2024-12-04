'use client';
import React, { useEffect , useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import ValidacionCamposVacios from '@/components/AlertasIA/camposVacios';
import ValidacionCamposFormato from '@/components/AlertasIA/camposFormato';
import ValidacionCamposExtension from '@/components/AlertasIA/camposExtension';


export default function SectionIA() {

  // variables para las alertas
  const [mostrarValidacionCamposVacios, setMostrarValidacionCamposVacios] = useState(false);
  const [mostrarValidacionCamposFormato, setMostrarValidacionCamposFormato] = useState(false);
  const [mostrarValidacionCamposExtension, setMostrarValidacionCamposExtension] = useState(false);

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
  const toggleButtonGrabar = () => {
    setIsDisabledGrabar(!isDisabledGrabar); // Cambia el estado entre habilitado y deshabilitado
  };

  const [isDisabledFinalizar, setIsDisabledFinalizar] = useState(true); // Estado para el botón
  const toggleButtonFinalizar = () => {
    setIsDisabledFinalizar(!isDisabledFinalizar); // Cambia el estado entre habilitado y deshabilitado
  };
  
  const [isDisabledReproducir, setIsDisabledReproducir] = useState(true); // Estado para el botón
  const toggleButtonReproducir = () => {
    setIsDisabledReproducir(!isDisabledReproducir); // Cambia el estado entre habilitado y deshabilitado
  };

  const [isDisabledReiniciar, setIsDisabledReiniciar] = useState(true); // Estado para el botón
  const toggleButtonReiniciar = () => {
    setIsDisabledReiniciar(!isDisabledReiniciar); // Cambia el estado entre habilitado y deshabilitado
  };

  const [isDisabledPiano, setIsDisabledPiano] = useState(true); // Estado para el botón
  const toggleButtonPiano = () => {
    setIsDisabledPiano(!isDisabledPiano); // Cambia el estado entre habilitado y deshabilitado
  };

  // variables para manejar los estados de los campos de la seccion de IA

  const [inputValueIndice, setInputValueIndice] = useState('');
  const [inputValuePasos, setInputValuePasos] = useState('');

  // Función que se ejecuta al cambiar el valor del campo de texto
  const handleInputIndiceChange = (event) => {
    setInputValueIndice(event.target.value); // Actualiza el estado con el nuevo valor
  };

  const handleInputPasosChange = (event) => {
    setInputValuePasos(event.target.value); // Actualiza el estado con el nuevo valor
  };

  // variables y funciones para manejar el estado habilitado de la seccion de IA

  const [isDisabledGenerarReproducir, setIsDisabledGenerarReproducir] = useState(true); // Estado para el botón
  const toggleButtonGenerarReproducir = () => {
    setIsDisabledGenerarReproducir(!isDisabledGenerarReproducir); // Cambia el estado entre habilitado y deshabilitado
  };

  const [isDisabledReinicarMelodia, setIsDisabledReinicarMelodia] = useState(true); // Estado para el botón
  const toggleButtonReinicarMelodia = () => {
    setIsDisabledReinicarMelodia(!isDisabledReinicarMelodia); // Cambia el estado entre habilitado y deshabilitado
  };


  const [isDisabledGuardar, setIsDisabledGuardar] = useState(true); // Estado para el botón
  const toggleButtonGuardar = () => {
    setIsDisabledGuardar(!isDisabledGuardar); // Cambia el estado entre habilitado y deshabilitado
  };

  const [isDisabledIndice, setIsDisabledIndice] = useState(true); // Estado para el botón
  const toggleImputIndice = () => {
    setIsDisabledIndice(!isDisabledIndice); // Cambia el estado entre habilitado y deshabilitado
  };

  const [isDisabledPasos, setIsDisabledPasos] = useState(true); // Estado para el botón
  const toggleImputPasos = () => {
    setIsDisabledPasos(!isDisabledPasos); // Cambia el estado entre habilitado y deshabilitado
  };








//   useEffect(() => {
//     if (!user && !userSession) {
//       router.push('/sign-in');
//     }

//   }, [user, userSession, router]);



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
    console.log("El reproductor está ocupado. Espera a que termine la nota actual.");
    return; // Salir si ya se está reproduciendo algo
  }

  isPlaying = true; // Marcar el reproductor como ocupado

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
    isPlaying = false; // Liberar el estado del reproductor
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
    toggleButtonReproducir();
    toggleButtonFinalizar();
    toggleButtonPiano();
    console.log("JSON final:", twinkleTwinkle);
  };

  // funciones de los botones de la seccion derecha

  const ClickBottonGrabar = () =>{
    toggleButtonPiano();
    toggleButtonGrabar();
    toggleButtonFinalizar();
  }

  // funcion del boton reproducir

  const BottomReproducir = async () => {
    if(!isDisabledPiano){
      toggleButtonPiano();
    }
    player.start(twinkleTwinkle); // Reproduce la secuencia de notas
    toggleButtonReproducir();
    toggleButtonReiniciar();
    // habilitar campos de la seccion IA
    toggleButtonGenerarReproducir();
    toggleImputIndice();
    toggleImputPasos();
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
    toggleButtonGrabar(); // Habilitar grabar
    toggleButtonReiniciar(); // Deshabilitar reiniciar
    // desabilitar campos de IA
    toggleButtonGenerarReproducir();
    toggleImputIndice();
    toggleImputPasos();
  };

  const validacionesGenerarMusicaIA = () => {
    if (inputValueIndice.length === 0 || inputValuePasos.length === 0) {
      setMostrarValidacionCamposVacios(true);
      throw new Error("Campos vacíos");
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
    if(!isDisabledReiniciar){
      toggleButtonReiniciar();
    }
    
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
  
      // limpiar el modelo
      model.dispose();
      // cambiar estados de los botones y campos
      toggleButtonGenerarReproducir();
      toggleButtonGuardar();
      toggleButtonReinicarMelodia();
      toggleImputIndice();
      toggleImputPasos();
    } catch (e) {
      console.log("Error en el flujo:", e);
    }
  };

  const BottomReiniciarMelodia = async () => {
    // cambiar estado de los botones y campos
    if(isDisabledIndice){
      toggleImputIndice();
    }
    if(isDisabledPasos){
      toggleImputPasos();
    }
    toggleButtonGenerarReproducir();
    setInputValueIndice('');
    setInputValuePasos('');
    toggleButtonReinicarMelodia();
    toggleButtonGuardar();
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
        <h1 className="block font-bold text-4xl text-white text-left mt-20">
          Genera tu propia melodía
        </h1>
      </main>

      {/* Sección del Piano superior */}

      <div className="relative flex items-end ml-8 mt-6">

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
    <div className="fixed top-1/4 right-24 flex flex-col items-end space-y-4">
        <div className="flex space-x-4">

            <button disabled={isDisabledGrabar} onClick={() => ClickBottonGrabar()} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition">
            <span className="mr-2">🔴</span> Grabar
            </button>

            <button disabled={isDisabledFinalizar} onClick={() => finishAdding()} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition">
            <span className="mr-2">⏹️</span> Finalizar
            </button>

        </div>
        <div className="flex space-x-4">

            <button disabled={isDisabledReproducir} onClick={() => BottomReproducir()} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition">
            <span className="mr-2">▶️</span> Reproducir
            </button>

            <button disabled={isDisabledReiniciar} onClick={() => BottomReiniciar()} className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition">
            <span className="mr-2">🔄</span> Reiniciar
            </button>
            
        </div>
        
    </div>

     {/* Seccion de funciones con IA */}

     <div className=" text-white max-w-sm mx-auto absolute left-8 bottom-20">
        <h3 className="text-center text-lg font-semibold mb-4">Funciones con IA</h3>
        
        {/* Input para Índice de aleatoriedad */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Índice de aleatoriedad (0.0 - 2.0)</label>
          <input disabled={isDisabledIndice} value={inputValueIndice} onChange={handleInputIndiceChange} placeholder="0.0" className="w-full bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Input para Cantidad de pasos */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Cantidad de pasos (30 - 500)</label>
          <input disabled={isDisabledPasos} value={inputValuePasos} onChange={handleInputPasosChange} placeholder="30" className="w-full bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        {/* Botones para Guardar y Reiniciar */}
        <div className="relative">
          <button disabled={isDisabledGuardar} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 absolute left-56 bottom-28"> Guardar </button>
          <button onClick={() => BottomReiniciarMelodia()} disabled={isDisabledReinicarMelodia} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 absolute left-56 bottom-12"> Reiniciar </button>
        </div>


        {/* Botones para Generar y Reproducir melodía */}
        <div className="relative">
          <button onClick={() => GenerarReproducirMelodia()} disabled={isDisabledGenerarReproducir} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 absolute w-64">
            🎵 Generar y reproducir melodía
          </button>
          
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

   </div>
  );
}
