import { useState } from "react";
import {
  LogOut
} from "lucide-react";
import {
  ChevronRight
} from "lucide-react";

import SeleccionarCategoria from "./SeleccionarCategoria";
import SeleccionarCandidata from "./SeleccionarCandidata";
import TablaPreguntas from "./TablaPreguntas";

export default function PanelIndividual() {
  const [categoria, setCategoria] = useState(null);
  const [candidata, setCandidata] = useState(null);

  return (
    
    <div >
      {/* NAVBAR */}
      <nav className="w-full bg-[#003478] shadow-md p-4 flex justify-between items-center">
        <img src="img/logo2.jpg" alt="" width={200} />

        <button
          className="flex items-center gap-2 px-3 py-2 rounded 
          bg-linear-to-r from-[#CDA776] to-[#b88a4b]
          text-black font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </nav>

      
      {/* CONTENEDOR */}
      <div className=" mx-5">
        {/* HEADER */}
        <div className="my-8">
          <h1 className="text-3xl font-bold text-[#003478] flex items-center gap-3">
            Panel de Evaluación Individual
          </h1>

          <p className="text-slate-600 mt-2">
            Seleccione una categoría, luego una candidata y finalmente evalúe.
          </p>
        </div>

        {/* PASOS */}
        <div className="flex items-center gap-3 mb-8 text-sm">
          <Step
            activo={!categoria}
            texto="Categoría"
          />
          <ChevronRight className="text-slate-400" />
          <Step
            activo={categoria && !candidata}
            texto="Candidata"
          />
          <ChevronRight className="text-slate-400" />
          <Step
            activo={categoria && candidata}
            texto="Evaluación"
          />
        </div>

        {/* CONTENIDO */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          {!categoria && (
            <SeleccionarCategoria onSelect={setCategoria} />
          )}

          {categoria && !candidata && (
            <SeleccionarCandidata
              categoria={categoria}
              onBack={() => setCategoria(null)}
              onSelect={setCandidata}
            />
          )}

          {categoria && candidata && (
            <TablaPreguntas
              categoria={categoria}
              candidata={candidata}
              onBack={() => setCandidata(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- */
/* COMPONENTE PASO */
/* -------------------- */
function Step({ texto, activo }) {
  return (
    <div
      className={`
        px-4 py-1.5 rounded-full font-medium transition
        ${
          activo
            ? "bg-[#CDA776] text-black"
            : "bg-slate-200 text-slate-500"
        }
      `}
    >
      {texto}
    </div>
  );
}
