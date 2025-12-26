import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/usuarios.api";

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Debe completar todos los campos");
      return;
    }

    try {
      setLoading(true);

      const { data: user } = await login({
        username: usuario,
        password: password
      });

      // Guardar sesión
      localStorage.setItem("usuarioId", user.usuarioId);
      localStorage.setItem("rol", user.role);
      localStorage.setItem("nombre", user.nombre);

      // Redirección por rol
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;

        case "individual":
          navigate("/panel-individual");
          break;

        case "institucion":
          navigate("/panel-institucion");
          break;

        default:
          setError("Rol no reconocido");
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-dvh w-full 
        bg-[url('/img/fondo.png')] 
        bg-cover bg-center bg-no-repeat 
        flex flex-col items-center justify-center
        text-white px-4
      "
    >
      {/* LOGO */}
      <div className="text-center mb-10 -mt-15">
        <img src="/img/logo.png" alt="Logo" className="w-36 mx-auto" />

        <h1 className="text-3xl font-semibold bg-linear-to-r from-[#C7A871] to-[#615237] bg-clip-text text-transparent">
          Medalla al Mérito de la
        </h1>
        <h1 className="bg-linear-to-r from-[#C7A871] to-[#615237] bg-clip-text text-transparent text-lg font-semibold">
          Mujer Dominicana 2026
        </h1>
      </div>

      {/* LOGIN */}
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-md 
          bg-black/20 backdrop-blur-sm 
          p-8 rounded-xl 
          border border-[#CDA776]
        "
      >
        <h2 className="text-center mb-6 bg-linear-to-r from-[#C7A871] to-[#615237] bg-clip-text text-transparent text-lg font-semibold">
          Inicio de sesión
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Usuario</label>
            <div className="flex items-center border border-[#CDA776] rounded px-3 py-2">
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-transparent outline-none text-white"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <div className="flex items-center border border-[#CDA776] rounded px-3 py-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-white"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2 rounded
              bg-linear-to-r from-[#CDA776] to-[#b88a4b]
              text-black font-semibold
              hover:opacity-90 transition
            "
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
