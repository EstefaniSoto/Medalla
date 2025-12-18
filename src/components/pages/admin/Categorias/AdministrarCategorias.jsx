import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { obtenerCategorias, eliminarCategoria } from "../../../../api/categorias.api";
import CategoriaForm from "./CategoriaForm";

export default function AdministrarCategorias({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  const cargarCategorias = async () => {
    const { data } = await obtenerCategorias();
    setCategorias(data);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const borrar = async (id) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await eliminarCategoria(id);
    cargarCategorias();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 cursor-pointer rounded-lg bg-white shadow hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-[#003478]">Administrar Categorías</h1>
        </div>

        <button
          onClick={() => {
            setCategoriaEdit(null);
            setShowForm(true);
          }}
          className="flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#003478] text-white rounded-xl shadow hover:opacity-90"
        >
          <Plus size={18} /> Nueva categoría
        </button>
      </div>

      {/* ===== DESKTOP: TABLA ===== */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#003478] text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Descripción</th>
              <th className="px-6 py-4 text-center font-semibold w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c, idx) => (
              <tr
                key={c.categoriaId}
                className={`border-t transition hover:bg-slate-50 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
              >
                <td className="px-6 py-4 font-medium text-slate-800">{c.nombre}</td>
                <td className="px-6 py-4 text-slate-600">{c.descripcion || "Sin descripción"}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setCategoriaEdit(c);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg bg-blue-600 cursor-pointer text-white hover:bg-blue-700"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => borrar(c.categoriaId)}
                      className="p-2 cursor-pointer rounded-lg bg-red-600 text-white hover:bg-red-700"
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

      {/* ===== MOBILE / TABLET: CARDS ===== */}
      <div className="md:hidden space-y-4">
        {categorias.map((c) => (
          <div key={c.categoriaId} className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-lg text-[#003478]">{c.nombre}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {c.descripcion || "Sin descripción"}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setCategoriaEdit(c);
                  setShowForm(true);
                }}
                className="p-2 rounded-lg bg-blue-600 text-white"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => borrar(c.categoriaId)}
                className="p-2 rounded-lg bg-red-600 text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {categorias.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No hay categorías registradas
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <CategoriaForm
          categoria={categoriaEdit}
          onClose={() => setShowForm(false)}
          onSave={cargarCategorias}
        />
      )}
    </div>
  );
}
