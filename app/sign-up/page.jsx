'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { sendEmailVerification } from 'firebase/auth';
import ValidacionCamposVacios from '@/components/Alertas/validacion_campos_vacios';
import ValidacionCampoCorreo from '@/components/Alertas/validacion_formato_correo';
import ValidacionCampoContraseña from '@/components/Alertas/validacion_formato_contraseña';
import ValidacionConfirmarContraseña from '@/components/Alertas/validacion_confirmar_contraseña';
import RegistroExitoso from '@/components/Alertas/registro_correcto';
import ValidacionUsuarioRegistrado from '@/components/Alertas/verificacion_registro';


const SignUp = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [mostrarValidacionCamposVacios, setMostrarValidacionCamposVacios] = useState(false);
    const [mostrarValidacionCampoCorreo, setMostrarValidacionCampoCorreo] = useState(false);
    const [mostrarValidacionCampoContraseña, setMostrarValidacionCampoContraseña] = useState(false);
    const [mostrarValidacionConfirmarContraseña, setMostrarValidacionConfirmarContraseña] = useState(false);
    const [mostrarRegistroExitoso, setMostrarRegistroExitoso] = useState(false);
    const [mostrarValidacionUsuarioRegistrado, setMostrarValidacionUsuarioRegistrado] = useState(false);


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

        if (!email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            setMostrarValidacionConfirmarContraseña(true); // Mostrar la alerta si las contraseñas no coinciden
            throw new Error('Las contraseñas no coinciden');
        }
    };

    const handleSignUp = async () => {
        try {
            validateFields();
            // Intentar crear el usuario
            const res = await createUserWithEmailAndPassword(email, password);
            if (res && res.user) {
                // Guardar el estado del usuario
                sessionStorage.setItem('user', true);
                const user = res.user;
                // Enviar correo de verificación
                await sendEmailVerification(user);
                // Efecto que controla la visibilidad del componente durante 5 segundos
                setMostrarRegistroExitoso(true);
                // Vaciar campos
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                // Redirigir después de 5 segundos
                setTimeout(() => {
                    router.push('/sign-in'); 
                }, 5000); // 5000 ms = 5 segundos
            }else{
                setMostrarValidacionUsuarioRegistrado(true);
                // Vaciar campos
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                throw new Error('El usuario que se intenta registrar ya existe previamente');
            }
        } catch (e) {
            console.log(e)
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
            <img src="/image_registro/img_fondo_registro.svg" alt="Imagen de fondo" className="absolute opacity-80 h-full w-9/12 object-cover left-0" />
            
            <div className="bg-transparent p-10 w-5/12 right-20 absolute bottom-15">
                <div className="flex items-center justify-center">
                    <img src="\image_registro\Logo_AudIA_registro.svg" alt="" className='w-7/12'/>
                </div>

                <h1 className='text-2xl'>Correo electrónico</h1>
                <img src="\image_registro\Icono_mail.svg" alt="" className='absolute pt-3' />
                <input
                    type="email"
                    placeholder="Digite su correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 bg-transparent text-white placeholder-white border-b border-b-white border-transparent focus:outline-none pl-8"
                />

                <div className="relative w-full">
                    <h1 className="text-2xl text-white mb-4">Contraseña</h1>
                    <img src="/image_registro/Icono_candado.svg" alt="Candado" className="absolute top-11 w-6 h-6" />
                    <input
                        type={showPassword ? "text" : "password"}
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
                        type={confirmShowPassword ? "text" : "password"}
                        placeholder="Confirme su contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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

                <a href="/sign-in" className="text-white text-lg font-semibold underline flex justify-center mt-4">
                Iniciar sesión
                </a>


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
            {mostrarValidacionConfirmarContraseña && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <ValidacionConfirmarContraseña setMostrarValidacionConfirmarContraseña={setMostrarValidacionConfirmarContraseña} />
                </div>
            )}
            {mostrarRegistroExitoso && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <RegistroExitoso setMostrarRegistroExitoso={setMostrarRegistroExitoso} />
                </div>
            )}
            {mostrarValidacionUsuarioRegistrado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <ValidacionUsuarioRegistrado setMostrarValidacionUsuarioRegistrado={setMostrarValidacionUsuarioRegistrado} />
                </div>
            )}
        </div>
    );
};

export default SignUp;
