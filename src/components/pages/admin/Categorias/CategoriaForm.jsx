import { useState } from "react";
import {
  crearCategoria,
  actualizarCategoria
} from "../../../../api/categorias.api";

export default function CategoriaForm({ categoria, onClose, onSave }) {
  const [nombre, setNombre] = useState(categoria?.nombre || "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion || "");

  const guardar = async () => {
    if (!nombre.trim()) return alert("Nombre obligatorio");

    categoria
      ? await actualizarCategoria(categoria.categoriaId, { nombre, descripcion })
      : await crearCategoria({ nombre, descripcion });

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h3 className="font-bold mb-4">
          {categoria ? "Editar Categoría" : "Nueva Categoría"}
        </h3>

        <input
          className="w-full border px-3 py-2 mb-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />

        <textarea
          className="w-full border px-3 py-2"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={guardar}
            className="bg-[#003478] text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
