// pages/api/auth/error.js
export default function AuthError({ error }) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error de Autenticación</h1>
          <p className="text-lg">{error.message}</p>
          <a href="/sign-in-spotify" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
            Intentar de Nuevo
          </a>
        </div>
      </div>
    );
}
  