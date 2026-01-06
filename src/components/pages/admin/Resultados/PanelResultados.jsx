import { useState } from "react";
import { BarChart2, Trophy, ArrowLeft } from "lucide-react";
import SeleccionarCategoriaResultados from "./SeleccionarCategoriaResultados";
import RankingCandidatas from "./RankingCandidatas";
import Finalistas from "./Finalistas";

export default function PanelResultados({ onBack }) {
  const [vista, setVista] = useState("menu"); 
  // menu | categorias | ranking | finalistas
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  /* ================= MENU PRINCIPAL ================= */
  if (vista === "menu") {
    return (
      <div className="p-10">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Volver
        </button>

        <h2 className="text-3xl font-bold text-[#003478] mb-2">
          Panel de Resultados
        </h2>
        <p className="text-gray-600 mb-8">
          Consulta evaluaciones y finalistas del certamen.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card
            icon={BarChart2}
            title="Evaluaciones"
            text="Ver ranking y puntajes por categoría."
            onClick={() => setVista("categorias")}
          />

          <Card
            icon={Trophy}
            title="Finalistas"
            text="Ver candidatas finalistas del certamen."
            onClick={() => setVista("finalistas")}
          />
        </div>
      </div>
    );
  }

  /* ================= SELECCIONAR CATEGORIA ================= */
  if (vista === "categorias") {
    return (
      <div className="p-10">
        <button
          onClick={() => setVista("menu")}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Volver a resultados
        </button>

        <SeleccionarCategoriaResultados
          onSelect={(categoria) => {
            setCategoriaSeleccionada(categoria);
            setVista("ranking");
          }}
        />
      </div>
    );
  }

  /* ================= RANKING ================= */
  if (vista === "ranking") {
    return (
      <RankingCandidatas
        categoria={categoriaSeleccionada}
        onBack={() => setVista("categorias")}
      />
    );
  }

  /* ================= FINALISTAS ================= */
  if (vista === "finalistas") {
    return (
      <Finalistas
        onBack={() => setVista("menu")}
      />
    );
  }
}

/* ================= CARD ================= */
function Card({ icon: Icon, title, text, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-10 rounded-2xl shadow-lg 
                 hover:-translate-y-1 hover:shadow-xl 
                 transition cursor-pointer text-center"
    >
      <Icon size={56} className="mx-auto mb-5 text-[#003478]" />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
