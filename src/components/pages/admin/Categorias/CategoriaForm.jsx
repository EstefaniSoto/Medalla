import { useState } from "react";
import Swal from "sweetalert2";
import {
  crearCategoria,
  actualizarCategoria
} from "../../../../api/categorias.api";

export default function CategoriaForm({ categoria, onClose, onSave }) {
  const [nombre, setNombre] = useState(categoria?.nombre || "");
  const [descripcion, setDescripcion] = useState(categoria?.descripcion || "");
  const [loading, setLoading] = useState(false);

  const guardar = async () => {
    if (!nombre.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Nombre obligatorio",
        text: "Debes ingresar un nombre para la categoría"
      });
    }

    const confirmacion = await Swal.fire({
      title: categoria ? "¿Actualizar categoría?" : "¿Crear categoría?",
      text: categoria
        ? "Se guardarán los cambios realizados"
        : "La nueva categoría será creada",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#003478",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setLoading(true);

      if (categoria) {
        await actualizarCategoria(categoria.categoriaId, {
          nombre,
          descripcion
        });
      } else {
        await crearCategoria({
          nombre,
          descripcion
        });
      }

      Swal.fire({
        icon: "success",
        title: categoria
          ? "Categoría actualizada"
          : "Categoría creada",
        timer: 1500,
        showConfirmButton: false
      });

      onSave();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data ||
          "Ocurrió un error al guardar la categoría"
      });
    } finally {
      setLoading(false);
    }
  };

  const cerrar = async () => {
    const res = await Swal.fire({
      title: "¿Cerrar formulario?",
      text: "Los cambios no guardados se perderán",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar"
    });

    if (res.isConfirmed) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
        <h3 className="font-bold mb-4 text-lg text-[#003478]">
          {categoria ? "Editar Categoría" : "Nueva Categoría"}
        </h3>

        <input
          className="w-full border px-3 py-2 mb-3 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          disabled={loading}
        />

        <textarea
          className="w-full border px-3 py-2 rounded"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          disabled={loading}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={cerrar}
            className="border px-4 py-2 rounded"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={loading}
            className="bg-[#003478] text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
