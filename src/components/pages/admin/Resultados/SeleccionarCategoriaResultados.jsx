import { useEffect, useState } from "react";
import { obtenerCategorias } from "../../../../api/categorias.api";
import { BarChart2 } from "lucide-react";

export default function SeleccionarCategoriaResultados({ onSelect = () => {} }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    obtenerCategorias().then(res => setCategorias(res.data));
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-2 text-[#003478]">
        Evaluaciones por Categoría
      </h2>
      <p className="text-gray-500 mb-8">
        Selecciona una categoría para ver el ranking de candidatas
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categorias.map(c => (
          <div
            key={c.categoriaId}
            onClick={() => onSelect(c)}
            className="group bg-white rounded-2xl shadow-md p-8 cursor-pointer 
                       hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full 
                            bg-[#003478]/10 mb-4 group-hover:bg-[#003478]/20 transition">
              <BarChart2 className="text-[#003478]" size={28} />
            </div>

            <h3 className="text-xl font-semibold text-[#003478]">
              {c.nombre}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Ver puntajes, votos y promedios
            </p>

            <span className="inline-block mt-4 text-sm font-medium text-[#003478] group-hover:underline">
              Ver resultados →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
