import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === 'JohaPau2025') {
      localStorage.setItem('perru_auth', 'true');
      navigate('/'); // Lo mandamos al Dashboard
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000); // Quitar error a los 2 seg
    }
  };

  return (
    <div className="min-h-screen bg-perru-bg flex flex-col justify-center items-center p-4">
      
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-4 border-white w-full max-w-md animate-scaleUp">
        
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-perru-hotpink text-white rounded-full flex items-center justify-center text-5xl font-black mx-auto mb-4 shadow-lg shadow-perru-pink/50">
            🐾
          </div>
          <h1 className="text-3xl font-black text-gray-700 tracking-tight">¡Bienvenido!</h1>
          <p className="text-perru-purple font-bold text-sm mt-1">Sistema de Gestión Perruquería</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="label-perru ml-2">Usuario</label>
            <div className="input-perru bg-gray-50 text-gray-400 font-bold select-none cursor-not-allowed border-gray-100">
              Administrador
            </div>
          </div>

          <div>
            <label className="label-perru ml-2">Contraseña</label>
            <input 
              type="password" 
              className={`input-perru text-center font-black tracking-widest text-xl transition-all ${error ? 'border-red-400 bg-red-50 text-red-500 ring-4 ring-red-100' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-center text-red-500 font-bold text-sm bg-red-50 py-2 rounded-xl animate-bounce">
              🚫 Contraseña incorrecta
            </p>
          )}

          <button 
            type="submit" 
            className="w-full bg-perru-hotpink hover:bg-pink-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-perru-pink/40 transition-transform active:scale-95 mt-4"
          >
            Ingresar al Sistema 🚀
          </button>
        </form>

        <p className="text-center text-gray-300 text-xs font-bold mt-8">
          © 2025 Perruquería Spa & Shop
        </p>
      </div>
    </div>
  );
};

export default Login;