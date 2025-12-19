import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import {
  obtenerInstituciones,
  crearInstitucion,
  actualizarInstitucion,
  eliminarInstitucion
} from "../../../../api/instituciones.api";
import InstitucionForm from "./InstitucionForm";

export default function AdministrarInstituciones({ onBack }) {
  const [instituciones, setInstituciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const cargar = async () => {
    const { data } = await obtenerInstituciones();
    setInstituciones(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardar = async (tipo, id, data) => {
    if (tipo === "create") {
      await crearInstitucion(data);
    } else {
      await actualizarInstitucion(id, {
        institucionId: id,
        ...data
      });
    }
    cargar();
  };

  const borrar = async (id) => {
    if (!confirm("¿Eliminar institución?")) return;
    await eliminarInstitucion(id);
    cargar();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-200 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-white shadow hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-[#003478]">
            Administrar Instituciones
          </h1>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003478] text-white rounded-xl shadow hover:opacity-90 cursor-pointer"
        >
          <Plus size={18} /> Nueva institución
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#003478] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-center w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {instituciones.map((i, idx) => (
              <tr
                key={i.institucionId}
                className={`border-t hover:bg-slate-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                }`}
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {i.nombre}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditItem(i);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg bg-blue-600 text-white cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => borrar(i.institucionId)}
                      className="p-2 rounded-lg bg-red-600 text-white cursor-pointer"
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

      {/* MOBILE */}
      <div className="md:hidden space-y-4">
        {instituciones.map((i) => (
          <div key={i.institucionId} className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-lg text-[#003478]">
              {i.nombre}
            </h3>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setEditItem(i);
                  setShowForm(true);
                }}
                className="p-2 rounded-lg bg-blue-600 text-white"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => borrar(i.institucionId)}
                className="p-2 rounded-lg bg-red-600 text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {instituciones.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No hay instituciones registradas
        </div>
      )}

      {showForm && (
        <InstitucionForm
          institucion={editItem}
          onClose={() => setShowForm(false)}
          onSave={guardar}
        />
      )}
    </div>
  );
}
