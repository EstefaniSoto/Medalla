import { useEffect, useState } from "react";
import { obtenerCategorias } from "../../../api/categorias.api";

export default function SeleccionarCategoria({ onSelect }) {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCategorias()
      .then(res => setCategorias(res.data || []))
      .catch(() => setError("Error cargando categorías"));
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">
        Seleccione una categoría
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {categorias.map(c => (
          <div
            key={c.categoriaId}
            onClick={() => onSelect(c)}
            className="relative cursor-pointer group"
          >
            {/* CARD INTERNA (esta es la que anima) */}
            <div
              className="
                bg-white p-6 rounded-2xl
                shadow-md
                transition-all duration-300 ease-out
                group-hover:-translate-y-2
                group-hover:shadow-2xl
                group-active:scale-[0.98]
              "
            >
              <h3 className="font-bold text-lg text-slate-800">
                {c.nombre}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Click para seleccionar
              </p>
            </div>

            {/* Glow suave (no afecta layout) */}
            <div
              className="
                absolute inset-0 rounded-2xl
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                bg-linear-to-r from-yellow-300/20 to-orange-400/20
                pointer-events-none
              "
            />
          </div>
        ))}
      </div>
    </>
  );
}
