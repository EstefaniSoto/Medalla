import { useEffect, useState } from "react";
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
  const [error, setError] = useState("");

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

  const data = {
    categoriaId,
    texto,
    puntajeMaximo,
    orden,
    activa: true
  };

  console.log("DATA QUE SE ENVÍA:", data);

  try {
    await crearPregunta(data);
    onSaved();
    onClose();
  } catch (err) {
    console.error("ERROR DEL BACKEND:", err.response?.data);
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
          required
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
              required
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
              required
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* BOTONES */}
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
