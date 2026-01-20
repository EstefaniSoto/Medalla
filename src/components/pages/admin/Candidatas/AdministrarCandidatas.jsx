// src/components/pages/admin/AdministrarCandidatas.jsx
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import {
  obtenerCandidatas,
  eliminarCandidata
} from "../../../../api/candidatas.api";
import CandidataForm from "./CandidataForm";

export default function AdministrarCandidatas({ onBack }) {
  const [candidatas, setCandidatas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const cargar = async () => {
    const { data } = await obtenerCandidatas();
    setCandidatas(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const borrar = async (id) => {
    if (!confirm("¿Eliminar esta candidata?")) return;
    await eliminarCandidata(id);
    cargar();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 cursor-pointer rounded-lg bg-white shadow hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-[#003478]">
            Administrar Candidatas
          </h1>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex cursor-pointer items-center gap-2 px-5 py-2.5 bg-[#003478] text-white rounded-xl shadow hover:opacity-90"
        >
          <Plus size={18} /> Nueva candidata
        </button>
      </div>

      {/* ===== DESKTOP: TABLA ===== */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#003478] text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Foto</th>
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Categoría</th>
              <th className="px-6 py-4 text-center font-semibold w-32">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {candidatas.map((c, idx) => (
              <tr
                key={c.candidataId}
                className={`border-t transition hover:bg-slate-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                }`}
              >
                {/* FOTO */}
                <td className="px-6 py-4">
                  <img
                    src={
                      c.fotoUrl
                        ? `https://9pwgkwzs-7212.use.devtunnels.ms/${c.fotoUrl}`
                        : "https://img.icons8.com/bubbles/100/user.png"
                    }
                    alt={c.nombre}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-slate-800">
                  {c.nombre}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {c.categoriaNombre}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditItem(c);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg bg-blue-600 cursor-pointer text-white hover:bg-blue-700"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => borrar(c.candidataId)}
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
        {candidatas.map((c) => (
          <div
            key={c.candidataId}
            className="bg-white rounded-2xl shadow p-5 flex gap-4 items-center"
          >
            <img
              src={
                c.fotoUrl
                  ? `https://9pwgkwzs-7212.use.devtunnels.ms/${c.fotoUrl}`
                  : "https://img.icons8.com/bubbles/100/user.png"
              }
              alt={c.nombre}
              className="w-14 h-14 rounded-full object-cover border"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-lg text-[#003478]">
                {c.nombre}
              </h3>
              <p className="text-gray-600 text-sm">
                {c.categoriaNombre}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditItem(c);
                  setShowForm(true);
                }}
                className="p-2 rounded-lg bg-blue-600 text-white"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => borrar(c.candidataId)}
                className="p-2 rounded-lg bg-red-600 text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY */}
      {candidatas.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No hay candidatas registradas
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <CandidataForm
          candidata={editItem}
          onClose={() => setShowForm(false)}
          onSave={cargar}
        />
      )}
    </div>
  );
}
