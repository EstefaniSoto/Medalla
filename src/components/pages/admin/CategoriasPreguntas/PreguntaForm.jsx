import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  crearPregunta,
  actualizarPregunta
} from "../../../../api/preguntasCategoria.api";

export default function PreguntaForm({
  categoriaId,
  pregunta,
  totalActual,
  onClose,
  onSaved
}) {
  const [texto, setTexto] = useState("");
  const [puntajeMaximo, setPuntajeMaximo] = useState(1);
  const [orden, setOrden] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pregunta) {
      setTexto(pregunta.texto);
      setPuntajeMaximo(pregunta.puntajeMaximo);
      setOrden(pregunta.orden);
    } else {
      setTexto("");
      setPuntajeMaximo(1);
      setOrden(1);
    }
  }, [pregunta]);

  const guardar = async (e) => {
    e.preventDefault();

    // 🔹 Validaciones frontend (UX)
    if (!texto.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campo obligatorio",
        text: "Debes escribir el texto de la pregunta"
      });
    }

    if (puntajeMaximo <= 0) {
      return Swal.fire({
        icon: "warning",
        title: "Puntaje inválido",
        text: "El puntaje debe ser mayor que 0"
      });
    }

    // 🔹 Confirmación
    const confirmacion = await Swal.fire({
      title: pregunta ? "¿Actualizar pregunta?" : "¿Crear pregunta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    const data = {
      categoriaId,
      texto,
      puntajeMaximo,
      orden,
      activa: true
    };

    try {
      setLoading(true);

      if (pregunta) {
        await actualizarPregunta(pregunta.preguntaId, {
          ...data,
          preguntaId: pregunta.preguntaId
        });
      } else {
        await crearPregunta(data);
      }

      Swal.fire({
        icon: "success",
        title: "Guardado correctamente",
        timer: 1200,
        showConfirmButton: false
      });

      onSaved();
      onClose();
    } catch (err) {
      const mensaje = err.response?.data;

      Swal.fire({
        icon: "warning",
        title: "Regla de puntaje",
        text: mensaje || "No se pudo guardar la pregunta"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={guardar}
        className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-lg"
      >
        <h2 className="text-xl font-bold text-[#003478]">
          {pregunta ? "Editar pregunta" : "Nueva pregunta"}
        </h2>

        {/* TEXTO */}
        <textarea
          className="w-full border rounded-xl p-3 min-h-[100px]"
          placeholder="Texto de la pregunta"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={loading}
        />

        {/* PUNTAJE Y ORDEN */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Puntaje máximo</label>
            <input
              type="number"
              className="w-full border rounded-xl p-3"
              min={1}
              value={puntajeMaximo}
              onChange={(e) => setPuntajeMaximo(Number(e.target.value))}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Orden</label>
            <input
              type="number"
              className="w-full border rounded-xl p-3"
              min={1}
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
              disabled={loading}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#003478] text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
