import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  crearUsuario,
  actualizarUsuario
} from "../../../../api/usuarios.api";
import { obtenerInstituciones } from "../../../../api/instituciones.api";
import { obtenerRoles } from "../../../../api/roles.api";

export default function UsuarioForm({ usuario, onClose, onSave }) {
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [username, setUsername] = useState(usuario?.username || "");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState(usuario?.roleId || "");
  const [esInstitucion, setEsInstitucion] = useState(
    usuario?.institucionId != null
  );
  const [institucionId, setInstitucionId] = useState(
    usuario?.institucionId || ""
  );
  const [instituciones, setInstituciones] = useState([]);
  const [roles, setRoles] = useState([]);

  /* 🔹 CARGAR DATA */
  useEffect(() => {
    obtenerInstituciones().then(res => setInstituciones(res.data));
    obtenerRoles().then(res => setRoles(res.data));
  }, []);

  /* 🔹 AUTO ROL INSTITUCIÓN */
  useEffect(() => {
    if (!roles.length) return;

    const rolInstitucion = roles.find(r =>
      r.name?.toLowerCase().includes("institucion")
    );

    if (esInstitucion && rolInstitucion) {
      setRoleId(rolInstitucion.roleId);
    }
  }, [roles, esInstitucion]);

  const guardar = async (e) => {
    e.preventDefault();

    let nombreFinal = nombre;

    // Si es institución, usar el nombre de la institución seleccionada
    if (esInstitucion) {
      const institucionSeleccionada = instituciones.find(
        i => i.institucionId === Number(institucionId)
      );
      nombreFinal = institucionSeleccionada?.nombre || "";
    }

    const data = {
      usuarioId: usuario?.usuarioId || 0,
      nombre: nombreFinal, // 🔥 YA NO VA NULL
      username,
      password: password || null,
      roleId: Number(roleId),
      institucionId: esInstitucion ? Number(institucionId) : null
    };

    if (usuario) {
      await actualizarUsuario(usuario.usuarioId, data);
    } else {
      await crearUsuario(data);
    }

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={guardar}
        className="bg-white w-full max-w-md rounded-xl shadow p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {usuario ? "Editar Usuario" : "Nuevo Usuario"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-red-600 cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* 🔹 CHECK INSTITUCIÓN */}
        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={esInstitucion}
            onChange={(e) => {
              const checked = e.target.checked;
              setEsInstitucion(checked);

              if (!checked) {
                setInstitucionId("");
                setRoleId("");
              }
            }}
          />
          ¿Usuario pertenece a una institución?
        </label>

        <div className="space-y-4">
          {/* 🔹 SELECT INSTITUCIÓN */}
          {esInstitucion && (
            <select
              className="w-full border p-2 rounded"
              value={institucionId}
              onChange={(e) => setInstitucionId(Number(e.target.value))}
              required
            >
              <option value="">Seleccione institución</option>
              {instituciones.map(i => (
                <option key={i.institucionId} value={i.institucionId}>
                  {i.nombre}
                </option>
              ))}
            </select>
          )}

          {/* 🔹 NOMBRE SOLO SI NO ES INSTITUCIÓN */}
          {!esInstitucion && (
            <input
              className="w-full border p-2 rounded"
              placeholder="Nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          )}

          {/* 🔹 USERNAME */}
          <input
            className="w-full border p-2 rounded"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          {/* 🔹 PASSWORD */}
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required={!usuario}
          />

          {/* 🔹 ROL */}
          <select
            className="w-full border p-2 rounded"
            value={roleId}
            onChange={e => setRoleId(Number(e.target.value))}
            required
          >
            <option value="">Seleccione rol</option>
            {roles.map(r => (
              <option key={r.roleId} value={r.roleId}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancelar
          </button>

          <button className="px-4 py-2 bg-[#003478] text-white rounded cursor-pointer">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}