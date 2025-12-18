

export default function Login() {
  return (
    <div className="
        min-h-dvh w-full 
        bg-[url('/img/fondo.png')] 
        bg-cover bg-center bg-no-repeat 
        flex flex-col items-center justify-center
        text-white px-4
      "
    >

      {/* LOGO Y TÍTULO */}
      <div className="text-center mb-10 -mt-15">
        <img 
          src="/img/logo.png" 
          alt="Logo" 
          className="w-36 mx-auto "
        />

        <h1 className="text-3xl font-semibold 
    bg-linear-to-r from-[#C7A871] to-[#615237]
    bg-clip-text text-transparent ">
          Medalla al Mérito de la
        </h1>
        <h1 className="bg-linear-to-r from-[#C7A871] to-[#615237]
    bg-clip-text text-transparent text-lg font-semibold ">Mujer Dominicana 2026</h1>
      </div>

      {/* CAJA DEL LOGIN */}
      <div className="
          w-full max-w-md 
          bg-black/20 backdrop-blur-sm 
          p-8 rounded-xl 
          border border-[#CDA776]
        "
      >

        <h2 className="text-center mb-6 bg-linear-to-r from-[#C7A871] to-[#615237]
    bg-clip-text text-transparent text-lg font-semibold ">
          Inicio de sesión
        </h2>

        <div className="space-y-5">

          {/* INPUT 1 */}
          <div>
            <label className="block text-sm text-white mb-1">Nombre</label>
            <div className="flex items-center border border-[#CDA776] rounded px-3 py-2">
              <input 
                type="text"
                className="w-full bg-transparent outline-none text-white placeholder-gray-300"
                placeholder="Escribe tu nombre"
              />
              <i className="fa-solid fa-user text-[#CDA776] ml-2"></i>
            </div>
          </div>

          {/* INPUT 2 */}
          <div>
            <label className="block text-sm text-white mb-1">Contraseña</label>
            <div className="flex items-center border border-[#CDA776] rounded px-3 py-2 mb-10">
              <input 
                type="password"
                className="w-full bg-transparent outline-none text-white placeholder-gray-300"
                placeholder="Escribe tu contraseña"
              />
              <i className="fa-solid fa-lock text-[#CDA776] ml-2"></i>
            </div>
          </div>

          {/* BOTÓN */}
          <button className="
              w-full
              py-2 rounded 
              bg-linear-to-r from-[#CDA776] to-[#b88a4b]
              text-black font-semibold mt-2
              hover:opacity-90 transition
              cursor-pointer
             
             
            "
          >
            Entrar
          </button>

        </div>
      </div>

    </div>
  );
}
