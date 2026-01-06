import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerPreguntasPorCategoria } from "../../../api/preguntasCategoria.api";
import { guardarVotoNormal, verificarVoto } from "../../../api/votosNormales.api";

export default function TablaPreguntas({ categoria, candidata, onBack }) {
  const [preguntas, setPreguntas] = useState([]);
  const [puntajes, setPuntajes] = useState({});
  const [loading, setLoading] = useState(false);
  const [yaVoto, setYaVoto] = useState(false);

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  // VERIFICAR SI YA VOTÓ
  useEffect(() => {
    const verificar = async () => {
      try {
        const { data } = await verificarVoto(usuarioId, candidata.candidataId);

        if (data === true) {
          setYaVoto(true);

          await Swal.fire({
            icon: "info",
            title: "Votación ya realizada",
            text: "Usted ya votó por esta candidata",
            confirmButtonText: "Entendido"
          });

          onBack();
        }
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo verificar el estado del voto"
        });
      }
    };

    verificar();
  }, [usuarioId, candidata, onBack]);

  // CARGAR PREGUNTAS
  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const { data } = await obtenerPreguntasPorCategoria(
          categoria.categoriaId
        );
        setPreguntas(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las preguntas"
        });
      }
    };

    cargarPreguntas();
  }, [categoria]);

  // CONTROL DE PUNTAJES
  const handleChange = (preguntaId, valor, max) => {
    if (valor < 0) return;

    if (valor > max) {
      Swal.fire({
        icon: "warning",
        title: "Puntaje inválido",
        text: `El puntaje máximo permitido es ${max}`
      });
      return;
    }

    setPuntajes((prev) => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  const total = preguntas.reduce(
    (acc, p) => acc + (puntajes[p.preguntaId] || 0),
    0
  );

  // GUARDAR VOTO
  const handleGuardar = async () => {
    if (total <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debe asignar al menos un puntaje"
      });
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Confirmar votación?",
      text: `Total asignado: ${total} puntos`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) return;

    try {
      setLoading(true);

      // 🔍 DEBUG: AQUÍ ES DONDE VA EL CONSOLE.LOG
      console.log("ENVIANDO VOTO:", {
        usuarioId,
        candidataId: candidata.candidataId,
        puntaje: total
      });

      await guardarVotoNormal({
        usuarioId,
        candidataId: candidata.candidataId,
        puntaje: total
      });

      await Swal.fire({
        icon: "success",
        title: "Voto registrado",
        text: "Tu votación fue guardada correctamente"
      });

      onBack();
    } catch (err) {
      console.error("ERROR AL GUARDAR VOTO:", err);

      if (err.response?.status === 409) {
        Swal.fire({
          icon: "info",
          title: "Voto duplicado",
          text: "Ya has votado por esta candidata"
        });
        onBack();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar el voto"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // SI YA VOTÓ, NO RENDERIZA NADA
  if (yaVoto) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Volver a candidatas
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {candidata.nombre}
      </h2>

      <table className="w-full border">
        <thead className="bg-slate-100">
          <tr>
            <th className="border p-2 text-left">Variable</th>
            <th className="border p-2 w-32 text-center">Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map((p) => (
            <tr key={p.preguntaId}>
              <td className="border p-2">{p.texto}</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  min={0}
                  max={p.puntajeMaximo}
                  disabled={loading}
                  value={puntajes[p.preguntaId] || ""}
                  onChange={(e) =>
                    handleChange(
                      p.preguntaId,
                      Number(e.target.value),
                      p.puntajeMaximo
                    )
                  }
                  className="w-20 border rounded px-2 py-1 text-center disabled:bg-gray-100"
                />
                <div className="text-xs text-gray-500">
                  Máx: {p.puntajeMaximo}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center">
        <p className="font-semibold">
          Total: <span className="text-blue-700">{total}</span>
        </p>

        <button
          onClick={handleGuardar}
          disabled={loading}
          className="bg-[#CDA776] px-6 py-2 rounded font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Voto"}
        </button>
      </div>
    </div>
  );
}
