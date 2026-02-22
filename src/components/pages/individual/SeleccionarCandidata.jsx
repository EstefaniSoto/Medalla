import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Pencil } from "lucide-react";
import { obtenerCandidatas } from "../../../api/candidatas.api";
import { verificarVoto } from "../../../api/votosNormales.api";

export default function SeleccionarCandidata({ categoria, onSelect, onBack }) {
  const [candidatas, setCandidatas] = useState([]);
  const [votosRealizados, setVotosRealizados] = useState({});

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  const cargarCandidatas = async () => {
    try {
      const res = await obtenerCandidatas();

      const filtradas = res.data.filter(
        c => c.categoriaId === categoria.categoriaId
      );

      setCandidatas(filtradas);

      const resultados = await Promise.all(
        filtradas.map(c =>
          verificarVoto(usuarioId, c.candidataId)
        )
      );

      const votos = {};

      filtradas.forEach((c, index) => {
        const data = resultados[index].data;

        // 🔥 DETECCIÓN UNIVERSAL DE VOTO
        const existe =
          data === true ||
          data === 1 ||
          data?.existe === true ||
          data?.yaVoto === true ||
          (typeof data === "object" && data !== null);

        votos[c.candidataId] = {
          yaVoto: existe,
          nota: data?.nota ?? "Evaluada",
          votoId: data?.votoId ?? null
        };
      });

      console.log("MAPA VOTOS:", votos);

      setVotosRealizados(votos);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las candidatas"
      });
    }
  };

  useEffect(() => {
    cargarCandidatas();
  }, [categoria]);

  const editarVotoLocal = (candidata, voto) => {
    localStorage.setItem(
      "editarVotoLocal",
      JSON.stringify({
        candidataId: candidata.candidataId,
        categoriaId: categoria.categoriaId,
        notaAnterior: voto.nota,
        votoId: voto.votoId
      })
    );

    Swal.fire({
      icon: "info",
      title: "Editando voto",
      text: "Puedes cambiar la nota ahora"
    });

    onSelect(candidata);
  };

  const handleSelect = (candidata) => {
    const voto = votosRealizados[candidata.candidataId];

    if (voto?.yaVoto) {
      Swal.fire({
        icon: "info",
        title: "Ya evaluaste",
        text: "Usa el lápiz para editar"
      });
      return;
    }

    onSelect(candidata);
  };

  return (
    <>
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Volver
      </button>

      <h2 className="text-xl font-semibold mb-4">
        Candidatas – {categoria.nombre}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {candidatas.map(c => {
          const voto = votosRealizados[c.candidataId];
          const yaVoto = voto?.yaVoto;

          return (
            <div
              key={c.candidataId}
              className={`bg-white p-4 rounded-xl shadow flex gap-4 items-center justify-between transition ${
                !yaVoto ? "cursor-pointer hover:scale-105" : ""
              }`}
              onClick={() => handleSelect(c)}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={`http://190.166.237.107/${c.fotoUrl}`}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <span className="font-semibold block">{c.nombre}</span>

                  {yaVoto && (
                    <span className="text-xs text-red-600 font-medium">
                      ✔ Nota anterior: {voto.nota}
                    </span>
                  )}
                </div>
              </div>

              {yaVoto && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editarVotoLocal(c, voto);
                  }}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:scale-110"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
