import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { obtenerResultadosPorCategoria } from "../../../../api/resultadosNormales.api";
import { borrarVotosFinalistas } from "../../../../api/votosInstitucionales.api";
import { ArrowLeft, Star, FileSpreadsheet } from "lucide-react";

export default function RankingCandidatas({ categoria, onBack }) {
  const [resultados, setResultados] = useState([]);

  const rol = localStorage.getItem("rol");

  useEffect(() => {
    cargarResultados();
  }, [categoria]);

  const cargarResultados = async () => {
    try {
      const { data } = await obtenerResultadosPorCategoria(
        categoria.categoriaId
      );
      setResultados(data);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los resultados"
      });
    }
  };

  /* 🟡 EXPORTAR A EXCEL */
  const exportarExcel = () => {
    if (resultados.length === 0) {
      Swal.fire("Sin datos", "No hay resultados para exportar", "info");
      return;
    }

    const dataExcel = resultados.map((r, index) => ({
      Posición: index + 1,
      Medalla:
        index === 0
          ? "Oro"
          : index === 1
          ? "Plata"
          : index === 2
          ? "Bronce"
          : "",
      Categoría: categoria.nombre,
      Candidata: r.nombre,
      "Total de puntos": r.sumaPuntos,
      Promedio: Number(r.promedio).toFixed(2),
      "Votos recibidos": r.totalVotos
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Ranking");

    XLSX.writeFile(
      workbook,
      `Ranking_${categoria.nombre.replace(/\s+/g, "_")}.xlsx`
    );
  };

  /* 🔥 BORRAR VOTOS FINALISTAS */
  const eliminarVotosFinalistas = async () => {
    const confirm = await Swal.fire({
      title: "Eliminar votos del Top 3",
      text: "Se eliminarán todos los votos institucionales de las finalistas",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirm.isConfirmed) return;

    try {
      await borrarVotosFinalistas(categoria.categoriaId);

      Swal.fire(
        "Eliminado",
        "Los votos fueron borrados correctamente",
        "success"
      );

      await cargarResultados();
    } catch {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const medalla = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Volver a categorías
        </button>

        <div className="flex gap-3">
          <button
            onClick={exportarExcel}
            className="flex items-center gap-2 bg-green-600 text-white 
                       px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <FileSpreadsheet size={18} />
            Exportar Excel
          </button>

          {rol === "admin" && (
            <button
              onClick={eliminarVotosFinalistas}
              className="flex items-center gap-2 bg-red-600 text-white 
                         px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              🗑 Borrar votos finalistas
            </button>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#003478] mb-2">
        Ranking de Candidatas
      </h2>

      <p className="text-gray-500 mb-8">
        Categoría: <strong>{categoria.nombre}</strong>
      </p>

      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {resultados.map((r, index) => (
          <div
            key={r.candidataId}
            className="relative bg-white rounded-2xl shadow-lg p-8 
                       text-center hover:-translate-y-1 transition-all"
          >
            {/* POSICIÓN */}
            <div
              className="absolute -top-4 -right-4 w-12 h-12 rounded-full 
                         bg-[#CDA776] text-black flex items-center justify-center 
                         font-bold text-lg shadow"
            >
              {medalla(index)}
            </div>

            {/* FOTO */}
            <img
              src={`http://190.166.237.107/Medalla_Al_Merito_Api/${r.fotoUrl}`}
              className="w-28 h-28 mx-auto rounded-full object-cover 
                         border-4 border-[#CDA776] mb-4"
            />

            <h3 className="text-xl font-semibold text-[#003478]">
              {r.nombre}
            </h3>

            {/* PROMEDIO */}
            <div className="flex justify-center items-center gap-2 mt-3 text-[#003478]">
              <Star size={18} fill="#003478" />
              <span className="text-lg font-bold">
                {Number(r.promedio).toFixed(2)}
              </span>
            </div>

            {/* DETALLES */}
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <p>
                <strong>Total puntos:</strong> {r.sumaPuntos}
              </p>
              <p>
                <strong>Votos recibidos:</strong> {r.totalVotos}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
