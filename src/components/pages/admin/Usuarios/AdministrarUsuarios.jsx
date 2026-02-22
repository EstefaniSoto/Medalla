import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import {
  obtenerUsuarios,
  eliminarUsuario
} from "../../../../api/usuarios.api";
import UsuarioForm from "./UsuarioForm";

export default function AdministrarUsuarios({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const cargar = async () => {
    const { data } = await obtenerUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  /* 🔥 BORRAR CON SWEET ALERT */
  const borrar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      await eliminarUsuario(id);

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        timer: 1500,
        showConfirmButton: false
      });

      cargar();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el usuario"
      });
    }
  };

  const getRol = (roleId) => {
    if (roleId === 1) return "Administrador";
    if (roleId === 3) return "Institución";
    return "Individual";
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
            Administrar Usuarios
          </h1>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003478] text-white rounded-xl shadow hover:opacity-90 cursor-pointer"
        >
          <Plus size={18} /> Nuevo usuario
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#003478] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Usuario</th>
              <th className="px-6 py-4 text-left">Rol</th>
              <th className="px-6 py-4 text-left">Institución</th>
              <th className="px-6 py-4 text-center w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, idx) => (
              <tr
                key={u.usuarioId}
                className={`border-t hover:bg-slate-50 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                }`}
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {u.nombre}
                </td>
                <td className="px-6 py-4">{u.username}</td>
                <td className="px-6 py-4">{getRol(u.roleId)}</td>
                <td className="px-6 py-4">
                  {u.institucion ?? "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditItem(u);
                        setShowForm(true);
                      }}
                      className="p-2 rounded-lg bg-blue-600 text-white cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => borrar(u.usuarioId)}
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
        {usuarios.map((u) => (
          <div
            key={u.usuarioId}
            className="bg-white rounded-2xl shadow p-5"
          >
            <h3 className="font-semibold text-lg text-[#003478]">
              {u.nombre}
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Usuario: <span className="font-medium">{u.username}</span>
            </p>

            <p className="text-sm text-slate-600">
              Rol: <span className="font-medium">{getRol(u.roleId)}</span>
            </p>

            <p className="text-sm text-slate-600">
              Institución:{" "}
              <span className="font-medium">
                {u.institucion ?? "—"}
              </span>
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setEditItem(u);
                  setShowForm(true);
                }}
                className="p-2 rounded-lg bg-blue-600 text-white"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => borrar(u.usuarioId)}
                className="p-2 rounded-lg bg-red-600 text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No hay usuarios registrados
        </div>
      )}

      {showForm && (
        <UsuarioForm
          usuario={editItem}
          onClose={() => setShowForm(false)}
          onSave={cargar}
        />
      )}
    </div>
  );
}
