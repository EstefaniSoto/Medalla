import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import {
  obtenerPreguntasPorCategoria,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta
} from "../../../../api/preguntasCategoria.api";
import PreguntaForm from "./PreguntaForm";

export default function PreguntasCategoria({ categoria, onBack }) {
  const [preguntas, setPreguntas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const cargar = async () => {
    const { data } = await obtenerPreguntasPorCategoria(categoria.categoriaId);
    setPreguntas(data);
  };

  useEffect(() => {
    cargar();
  }, [categoria]);

  const guardar = async (tipo, id, data) => {
    if (tipo === "create") {
      await crearPregunta({
        categoriaId: categoria.categoriaId,
        ...data
      });
    } else {
      await actualizarPregunta(id, {
        preguntaId: id,
        categoriaId: categoria.categoriaId,
        ...data
      });
    }
    cargar();
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar pregunta?")) return;
    await eliminarPregunta(id);
    cargar();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white shadow hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-[#003478]">
            {categoria.nombre}
          </h1>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003478] text-white rounded-xl shadow"
        >
          <Plus size={18} /> Nueva pregunta
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#003478] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Pregunta</th>
              <th className="px-6 py-4 text-center w-32">Puntaje</th>
              <th className="px-6 py-4 text-center w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map((p, idx) => (
              <tr
                key={p.preguntaId}
                className={`border-t hover:bg-slate-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                }`}
              >
                <td className="px-6 py-4">{p.texto}</td>
                <td className="px-6 py-4 text-center">
                  {p.puntajeMaximo}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditItem(p);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg bg-blue-600 text-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => borrar(p.preguntaId)}
                      className="p-2 rounded-lg bg-red-600 text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preguntas.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          Esta categoría no tiene preguntas
        </div>
      )}

      {showForm && (
  <PreguntaForm
    categoriaId={categoria.categoriaId}
    pregunta={editItem}
    onClose={() => setShowForm(false)}
    onSaved={cargar}
  />
)}

    </div>
  );
}
