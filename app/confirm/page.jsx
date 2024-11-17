'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';

const ConfirmSignIn = () => {
    const router = useRouter();
    const [status, setStatus] = useState('Verificando enlace...');

    useEffect(() => {
        const verifySignInLink = async () => {
            try {
                // Verifica si el enlace es válido
                if (isSignInWithEmailLink(auth, window.location.href)) {
                    // Recupera el correo almacenado en localStorage
                    let email = window.localStorage.getItem('emailForSignIn');
                    if (!email) {
                        // Si el correo no está en localStorage, pídeselo al usuario
                        email = window.prompt('Por favor, introduce tu correo electrónico para confirmar:');
                    }

                    // Realiza el inicio de sesión con el enlace
                    if (email) {
                        await signInWithEmailLink(auth, email, window.location.href);
                        // Limpia localStorage
                        window.localStorage.removeItem('emailForSignIn');

                        // Redirige al usuario a la página principal o muestra un mensaje de éxito
                        setStatus('Inicio de sesión confirmado con éxito. Redirigiendo...');
                        setTimeout(() => router.push('/'), 5000);
                    } else {
                        throw new Error('No se proporcionó un correo electrónico.');
                    }
                } else {
                    throw new Error('El enlace no es válido.');
                }
            } catch (error) {
                console.log(error);
                setStatus('Error al confirmar el inicio de sesión. Por favor, intenta nuevamente.');
            }
        };

        verifySignInLink();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-white">
        <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex items-start space-x-4">
                {/* Ícono de éxito */}
                <svg
                    className="w-6 h-6 text-green-500 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-7.707a1 1 0 111.414-1.414l2.293 2.293a1 1 0 01-1.414 1.414l-2.293-2.293z"
                        clipRule="evenodd"
                    />
                </svg>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">{status}</h1>
                </div>
            </div>
        </div>
    </div>
    );
};

export default ConfirmSignIn;
