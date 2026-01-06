import { useEffect, useState } from "react";
import { obtenerCategorias } from "../../../api/categorias.api";

export default function SeleccionarCategoriaInstitucion({ onSelect }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    obtenerCategorias().then(res => setCategorias(res.data));
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">
        Seleccione una categoría
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {categorias.map(c => (
          <div
            key={c.categoriaId}
            onClick={() => onSelect(c)}
            className="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
          >
            <h3 className="font-semibold text-lg text-[#003478]">
              {c.nombre}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Votar como institución
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
