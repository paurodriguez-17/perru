import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Preguntamos al navegador: "¿Este usuario ya puso la contraseña?"
    const isAuth = localStorage.getItem('perru_auth');

    // Si NO está autorizado, lo mandamos al Login
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    // Si SÍ está autorizado, le dejamos ver el contenido (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;