import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { obtenerCategorias } from "../../../../api/categorias.api";
import PreguntasCategoria from "./PreguntasCategoria";

export default function CategoriasPreguntas({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const { data } = await obtenerCategorias();
    setCategorias(data);
  };

  if (categoriaSeleccionada) {
    return (
      <PreguntasCategoria
        categoria={categoriaSeleccionada}
        onBack={() => setCategoriaSeleccionada(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white shadow hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-[#003478]">
          Categorías
        </h1>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((c) => (
          <button
            key={c.categoriaId}
            onClick={() => setCategoriaSeleccionada(c)}
            className="bg-white rounded-2xl shadow-lg p-6 text-left hover:scale-[1.02] transition"
          >
            <h3 className="font-semibold text-lg text-[#003478]">
              {c.nombre}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Click para administrar preguntas
            </p>
          </button>
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No hay categorías registradas
        </div>
      )}
    </div>
  );
}
