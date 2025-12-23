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

  useEffect(() => {
    obtenerInstituciones().then(res => setInstituciones(res.data));
    obtenerRoles().then(res => setRoles(res.data));
  }, []);

  const generarUsernameInstitucion = (nombre) => {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  };

  const seleccionarInstitucion = (id) => {
    setInstitucionId(id);

    const institucion = instituciones.find(
      i => i.institucionId == id
    );

    if (institucion) {
      setUsername(generarUsernameInstitucion(institucion.nombre));
      setNombre(institucion.nombre);
    }
  };

  const guardar = async (e) => {
    e.preventDefault();

    const data = {
      nombre,
      username,
      password: password || null,
      roleId,
      institucionId: esInstitucion ? institucionId : null
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
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TIPO USUARIO */}
        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={esInstitucion}
            onChange={(e) => {
              setEsInstitucion(e.target.checked);
              if (!e.target.checked) {
                setInstitucionId("");
                setUsername("");
                setNombre("");
              }
            }}
          />
          ¿Usuario pertenece a una institución?
        </label>

        <div className="space-y-4">
          {/* INSTITUCIÓN */}
          {esInstitucion && (
            <select
              className="w-full border p-2 rounded"
              value={institucionId}
              onChange={(e) => seleccionarInstitucion(e.target.value)}
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

          {/* NOMBRE */}
          {!esInstitucion && (
            <input
              className="w-full border p-2 rounded"
              placeholder="Nombre completo"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          )}

          {/* USUARIO */}
          <input
            className={`w-full border p-2 rounded ${
              esInstitucion ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={esInstitucion}
            required
          />

          {/* CONTRASEÑA */}
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required={!usuario}
          />

          {/* ROL */}
          <select
            className="w-full border p-2 rounded"
            value={roleId}
            onChange={e => setRoleId(e.target.value)}
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
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-[#003478] text-white rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
