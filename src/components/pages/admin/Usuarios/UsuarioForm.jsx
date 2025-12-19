import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  crearUsuario,
  actualizarUsuario
} from "../../../../api/usuarios.api";
import { obtenerInstituciones } from "../../../../api/instituciones.api";

export default function UsuarioForm({ usuario, onClose, onSave }) {
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [username, setUsername] = useState(usuario?.username || "");
  const [password, setPassword] = useState("");
  const [esInstitucion, setEsInstitucion] = useState(
    usuario?.institucionId != null
  );
  const [institucionId, setInstitucionId] = useState(
    usuario?.institucionId || ""
  );
  const [instituciones, setInstituciones] = useState([]);

  useEffect(() => {
    obtenerInstituciones().then(res => setInstituciones(res.data));
  }, []);

  const guardar = async (e) => {
    e.preventDefault();

    const data = {
      nombre,
      username,
      password,
      roleId: 2,
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

        <div className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Nombre completo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required={!usuario}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={esInstitucion}
              onChange={e => setEsInstitucion(e.target.checked)}
            />
            ¿Es institución?
          </label>

          {esInstitucion && (
            <select
              className="w-full border p-2 rounded"
              value={institucionId}
              onChange={e => setInstitucionId(e.target.value)}
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
