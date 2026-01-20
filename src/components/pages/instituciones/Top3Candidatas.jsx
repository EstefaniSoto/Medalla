import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  obtenerTop3PorCategoria,
  registrarVotoInstitucional
} from "../../../api/votosInstitucionales.api";
import {
  LogOut
} from "lucide-react";
export default function Top3Candidatas({
  categoria,
  onSiguiente,
  esUltima
}) {
  const [top3, setTop3] = useState([]);
  const [candidataSeleccionada, setCandidataSeleccionada] = useState(null);
  const [votado, setVotado] = useState(false);

  const institucionId = Number(
    localStorage.getItem("institucionId")
  );

  useEffect(() => {
    setVotado(false);
    setCandidataSeleccionada(null);

    obtenerTop3PorCategoria(categoria.categoriaId)
      .then(res => setTop3(res.data))
      .catch(() => {
        Swal.fire("Error", "No se pudo cargar el Top 3", "error");
      });
  }, [categoria]);

  const votar = async (candidataId) => {
    if (votado) return;

    const confirm = await Swal.fire({
      title: "Confirmar voto",
      text: "Esta acción no se puede cambiar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      await registrarVotoInstitucional({
        institucionId,
        candidataId,
        categoriaId: categoria.categoriaId
      });

      setCandidataSeleccionada(candidataId);
      setVotado(true);

      Swal.fire(
        "Voto registrado",
        "Puede continuar a la siguiente categoría",
        "success"
      );
    } catch {
      Swal.fire(
        "Error",
        "Ya votó en esta categoría",
        "error"
      );
    }
  };

  return (
   

    <div>
       {/* NAVBAR */}
      <nav className="w-full bg-[#003478] shadow-md p-4 flex justify-between items-center">
        <img src="img/logo2.jpg" alt="" width={200} />

              <button
        onClick={() => {
          localStorage.clear(); 
          window.location.href = "/";
        }}
        className="flex items-center gap-2 px-3 py-2 rounded 
        bg-linear-to-r from-[#CDA776] to-[#b88a4b]
        text-black font-semibold hover:opacity-90 transition cursor-pointer"
      >
        <LogOut size={18} /> Cerrar Sesión
      </button>
      </nav>

      <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center">
        {categoria.nombre}
      </h2>

      <p className="text-center text-gray-600 mb-10">
        Haga clic sobre la candidata que desea seleccionar
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {top3.map((c, index) => {
          const seleccionada = candidataSeleccionada === c.candidataId;
          const deshabilitada = votado && !seleccionada;

          return (
            <div
              key={c.candidataId}
              onClick={() => !deshabilitada && votar(c.candidataId)}
              className={`
                rounded-2xl shadow-lg p-6 text-center cursor-pointer
                transition-all duration-200
                ${
                  seleccionada
                    ? "bg-[#CDA776]/20 border-2 border-[#CDA776] scale-105"
                    : "bg-white hover:shadow-xl hover:-translate-y-1"
                }
                ${deshabilitada && "opacity-40 cursor-not-allowed"}
              `}
            >
              <div className="text-xl font-bold mb-2">
                #{index + 1}
              </div>

              <img
                src={`https://9pwgkwzs-7212.use.devtunnels.ms/${c.fotoUrl}`}
                className="w-28 h-28 mx-auto rounded-full object-cover mb-4"
              />

              <h3 className="font-semibold text-lg">
                {c.nombre}
              </h3>

              {seleccionada && (
                <p className="mt-4 text-sm font-semibold text-[#8a6a2d]">
                  ✓ Seleccionada
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* SIGUIENTE */}
      <div className="flex justify-center mt-14">
              <button
          onClick={onSiguiente}
          disabled={!votado}
          className={`
            px-10 py-3 rounded-xl text-lg font-semibold transition
            ${votado
              ? "bg-black text-white hover:opacity-90"
              : "bg-gray-300 cursor-not-allowed"}
          `}
        >
          Volver a categorías
        </button>

      </div>
    </div>
    </div>
  );
}
