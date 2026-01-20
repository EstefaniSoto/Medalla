import { useState } from "react";
import { LogOut } from "lucide-react";
import SeleccionarCategoriaInstitucion from "./SeleccionarCategoriaInstitucion";
import Top3Candidatas from "./Top3Candidatas";

export default function VotacionInstitucional() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR (IGUAL AL ADMIN) */}
      <nav className="w-full bg-[#003478] shadow-md p-4 flex justify-between items-center">
        <img src="img/logo2.jpg" alt="" width={200} />

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="
            flex items-center justify-center gap-2
            px-3 py-2 md:px-4 md:py-2.5
            rounded-lg
            bg-linear-to-r from-[#CDA776] to-[#b88a4b]
            text-black font-semibold
            hover:opacity-90 transition
            cursor-pointer
          "
        >
          <LogOut size={18} />
          <span className="hidden md:inline">
            Cerrar Sesión
          </span>
        </button>
      </nav>

      {/* CONTENIDO */}
      <div className="flex-1">
        {!categoriaSeleccionada ? (
          <SeleccionarCategoriaInstitucion
            onSelect={(categoria) => setCategoriaSeleccionada(categoria)}
          />
        ) : (
          <Top3Candidatas
            categoria={categoriaSeleccionada}
            onSiguiente={() => setCategoriaSeleccionada(null)}
            esUltima={true}
          />
        )}
      </div>
    </div>
  );
}
