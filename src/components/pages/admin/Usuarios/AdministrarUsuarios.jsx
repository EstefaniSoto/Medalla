import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import {
  obtenerUsuarios,
  eliminarUsuario
} from "../../../../api/usuarios.api";
import UsuarioForm from "./UsuarioForm";

export default function AdministrarUsuarios({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);

  const cargarUsuarios = async () => {
    const { data } = await obtenerUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const borrar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    await eliminarUsuario(id);
    cargarUsuarios();
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#003478] font-semibold"
        >
          <ArrowLeft size={18} /> Volver
        </button>

        <button
          onClick={() => {
            setUsuarioEdit(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#003478] text-white rounded"
        >
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Usuario</th>
              <th className="p-4 text-left">Rol</th>
              <th className="p-4 text-left">Institución</th>
              <th className="p-4 text-center w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.usuarioId} className="border-t">
                <td className="p-4">{u.nombre}</td>
                <td className="p-4">{u.username}</td>
                <td className="p-4">
                  {u.roleId === 2 ? "Votante" : "Admin"}
                </td>
                <td className="p-4">
                  {u.institucion ?? "—"}
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setUsuarioEdit(u);
                      setShowForm(true);
                    }}
                    className="bg-blue-600 text-white p-2 rounded"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => borrar(u.usuarioId)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <UsuarioForm
          usuario={usuarioEdit}
          onClose={() => setShowForm(false)}
          onSave={cargarUsuarios}
        />
      )}
    </div>
  );
}
