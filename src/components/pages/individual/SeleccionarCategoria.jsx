import { useEffect, useState } from "react";
import { obtenerCategorias } from "../../../api/categorias.api";

export default function SeleccionarCategoria({ onSelect }) {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCategorias()
      .then(res => setCategorias(res.data))
      .catch(() => setError("Error cargando categorías"));
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Seleccione una categoría</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {categorias.map(c => (
          <div
            key={c.categoriaId}
            onClick={() => onSelect(c)}
            className="bg-white p-5 rounded-xl shadow cursor-pointer hover:scale-105 transition"
          >
            <h3 className="font-bold">{c.nombre}</h3>
          </div>
        ))}
      </div>
    </>
  );
}
