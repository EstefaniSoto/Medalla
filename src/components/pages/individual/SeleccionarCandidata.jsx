import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { obtenerCandidatas } from "../../../api/candidatas.api";
import { verificarVoto } from "../../../api/votosNormales.api";

export default function SeleccionarCandidata({ categoria, onSelect, onBack }) {
  const [candidatas, setCandidatas] = useState([]);
  const [votosRealizados, setVotosRealizados] = useState({});

  const usuarioId = Number(localStorage.getItem("usuarioId"));

  useEffect(() => {
    const cargarCandidatas = async () => {
      try {
        const res = await obtenerCandidatas();
        const filtradas = res.data.filter(
          c => c.categoriaId === categoria.categoriaId
        );

        setCandidatas(filtradas);

        // Verificar votos por cada candidata
        const votos = {};
        for (const c of filtradas) {
          const { data } = await verificarVoto(usuarioId, c.candidataId);
          votos[c.candidataId] = data === true;
        }

        setVotosRealizados(votos);

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las candidatas"
        });
      }
    };

    cargarCandidatas();
  }, [categoria]);

  const handleSelect = (candidata) => {
    if (votosRealizados[candidata.candidataId]) {
      Swal.fire({
        icon: "info",
        title: "Voto ya registrado",
        text: "Usted ya votó por esta candidata"
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
          const yaVoto = votosRealizados[c.candidataId];

          return (
            <div
              key={c.candidataId}
              onClick={() => handleSelect(c)}
              className={`
                bg-white p-4 rounded-xl shadow flex gap-4 items-center transition
                ${yaVoto
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:scale-105"}
              `}
            >
              <img
                src={`https://localhost:7212${c.fotoUrl}`}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div>
                <span className="font-semibold block">{c.nombre}</span>

                {yaVoto && (
                  <span className="text-xs text-red-600 font-medium">
                    ✔ Ya votaste por esta candidata
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
