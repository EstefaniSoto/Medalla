import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { crearCandidata, actualizarCandidata } from "../../../../api/candidatas.api";
import { obtenerCategorias } from "../../../../api/categorias.api";
import { ImagePlus } from "lucide-react";

export default function CandidataForm({ candidata, onClose, onSave }) {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    obtenerCategorias().then(r => setCategorias(r.data));

    if (candidata) {
      setNombre(candidata.nombre);
      setCategoriaId(String(candidata.categoriaId));

      if (candidata.fotoUrl) {
        setPreview(candidata.fotoUrl); // 👈 directo desde la API
      }
    }

    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [candidata]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!nombre || !categoriaId) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debe completar todos los campos obligatorios"
      });
      return;
    }

    const confirm = await Swal.fire({
      title: candidata ? "¿Actualizar candidata?" : "¿Crear candidata?",
      text: candidata
        ? "Se guardarán los cambios realizados"
        : "Se registrará una nueva candidata",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#003478",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("Nombre", nombre);
      formData.append("CategoriaId", Number(categoriaId));

      if (foto) {
        formData.append("Foto", foto);
      }

      if (candidata) {
        await actualizarCandidata(candidata.candidataId, formData);
      } else {
        await crearCandidata(formData);
      }

      await Swal.fire({
        icon: "success",
        title: "Guardado",
        text: candidata
          ? "La candidata fue actualizada correctamente"
          : "La candidata fue creada correctamente",
        timer: 1800,
        showConfirmButton: false
      });

      onSave();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la candidata"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={guardar}
        className="bg-white w-full max-w-md rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-[#003478]">
          {candidata ? "Editar candidata" : "Nueva candidata"}
        </h2>

        <input
          className="w-full border rounded p-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <select
          className="w-full border rounded p-2"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((c) => (
            <option key={c.categoriaId} value={c.categoriaId}>
              {c.nombre}
            </option>
          ))}
        </select>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
          >
            <ImagePlus size={18} />
            Seleccionar imagen
          </button>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#003478] text-white"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
