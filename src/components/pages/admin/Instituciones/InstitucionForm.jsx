import { useEffect, useState } from "react";

export default function InstitucionForm({ institucion, onClose, onSave }) {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (institucion) {
      setNombre(institucion.nombre);
    }
  }, [institucion]);

  const guardar = async (e) => {
    e.preventDefault();

    const data = {
      nombre
    };

    if (institucion) {
      await onSave("update", institucion.institucionId, data);
    } else {
      await onSave("create", null, data);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={guardar}
        className="bg-white w-full max-w-md rounded-2xl p-6 space-y-5 shadow-lg"
      >
        <h2 className="text-xl font-bold text-[#003478]">
          {institucion ? "Editar institución" : "Nueva institución"}
        </h2>

        <input
          className="w-full border rounded-xl p-3"
          placeholder="Nombre de la institución"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#003478] text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
