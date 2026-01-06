import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerResultadosPorCategoria } from "../../../../api/resultadosNormales.api";
import { ArrowLeft, Star } from "lucide-react";

export default function RankingCandidatas({ categoria, onBack }) {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await obtenerResultadosPorCategoria(
          categoria.categoriaId
        );
        setResultados(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los resultados"
        });
      }
    };

    cargar();
  }, [categoria]);

  const medalla = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="p-10">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Volver a categorías
      </button>

      <h2 className="text-2xl font-bold text-[#003478] mb-2">
        Ranking de Candidatas
      </h2>
      <p className="text-gray-500 mb-8">
        Categoría: <strong>{categoria.nombre}</strong>
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {resultados.map((r, index) => (
          <div
            key={r.candidataId}
            className="relative bg-white rounded-2xl shadow-lg p-8 text-center hover:-translate-y-1 transition-all"
          >
            {/* POSICIÓN */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full 
                            bg-[#CDA776] text-black flex items-center justify-center 
                            font-bold text-lg shadow">
              {medalla(index)}
            </div>

            {/* FOTO */}
            <img
              src={`https://localhost:7212${r.fotoUrl}`}
              className="w-28 h-28 mx-auto rounded-full object-cover 
                         border-4 border-[#CDA776] mb-4"
            />

            <h3 className="text-xl font-semibold text-[#003478]">
              {r.nombre}
            </h3>

            {/* PROMEDIO */}
            <div className="flex justify-center items-center gap-2 mt-3 text-[#003478]">
              <Star size={18} fill="#003478" />
              <span className="text-lg font-bold">
                {Number(r.promedio).toFixed(2)}
              </span>
            </div>

            {/* DETALLES */}
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>
                <strong>Total puntos:</strong> {r.sumaPuntos}
              </p>
              <p>
                <strong>Votos recibidos:</strong> {r.totalVotos}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
