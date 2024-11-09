'use client'
import { useState } from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    
    // Funciones 
    const handleSignUp = async () => {
        try{
            const res = await createUserWithEmailAndPassword(email,password)
            console.log({res})
            sessionStorage.setItem('user',true)
            setEmail('');
            setPassword('');
            setconfirmPassword('');
        }catch(e){
            console.error(e)
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmShowPassword(!confirmShowPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-customTop to-customBottom" style={{ backgroundPosition: 'top', backgroundSize: '100% 200%', background: 'linear-gradient(to bottom, #060828 46%, #200A3A 100%)' }}>
            <img src="/image_registro/img_fondo_registro.svg" alt="Imagen de fondo"  className="absolute opacity-80 h-full w-9/12 object-cover left-0" />
            <div className="bg-transparent p-10 w-5/12 right-20 absolute">

                <div className="flex items-center justify-center">
                    <img src="\image_registro\Logo_AudIA_registro.svg" alt="" className='w-7/12'/>
                </div>
                
                
                <h1 className='text-2xl'>Correo electronico</h1>
                <img src="\image_registro\Icono_mail.svg" alt="" className='absolute pt-3' />
                <input
                    type="email"
                    placeholder="Digite su correo electronico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-transparent text-white placeholder-white border-b border-b-white border-transparent focus:outline-none pl-8"
                />


            <div className="relative w-full">
                <h1 className="text-2xl text-white mb-4">Contraseña</h1>
                <img src="/image_registro/Icono_candado.svg" alt="Candado" className="absolute top-11 w-6 h-6" />

                <input
                    type={showPassword ? "text" : "password"}  // Cambia entre "text" y "password" según el estado
                    placeholder="Digite su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pb-2 mb-4 bg-transparent text-white placeholder-white border-b border-b-white border-transparent focus:outline-none pl-8"
                />

                <img
                    src={showPassword ? "/image_registro/ojo_cerrado.svg" : "/image_registro/ojo_abierto.svg"}
                    alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-11 w-6 h-6 cursor-pointer"
                    onClick={togglePasswordVisibility}
                />
            </div>



            <div className="relative w-full">
                <h1 className="text-2xl text-white mb-4">Confirmar contraseña</h1>
                <img src="/image_registro/Icono_candado.svg" alt="Candado" className="absolute top-11 w-6 h-6" />

                <input
                    type={confirmShowPassword ? "text" : "password"}  // Cambia entre "text" y "password" según el estado
                    placeholder="Digite su contraseña"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                    className="w-full pb-2 mb-4 bg-transparent text-white placeholder-white border-b border-b-white border-transparent focus:outline-none pl-8"
                />

                <img
                    src={confirmShowPassword ? "/image_registro/ojo_cerrado.svg" : "/image_registro/ojo_abierto.svg"}
                    alt={confirmShowPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-3 top-11 w-6 h-6 cursor-pointer"
                    onClick={toggleConfirmPasswordVisibility}
                />
            </div>


                <button
                    onClick={handleSignUp}
                    className="bg-white text-[#080829] rounded-[32px] font-bold p-4 ml-[80px] mt-3 w-2/3 text-2xl"
                >
                    Registrarse
                </button>

            </div>
        </div>
    );
};

export default SignUp;
