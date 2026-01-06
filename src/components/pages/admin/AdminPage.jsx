import { useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
import AdministrarCategorias from "./Categorias/AdministrarCategorias";
import AdministrarCandidatas from "./Candidatas/AdministrarCandidatas";
import AdministrarInstituciones from "./Instituciones/AdministrarInstituciones";
import AdministrarUsuarios from "./Usuarios/AdministrarUsuarios";
import CategoriasPreguntas from "./CategoriasPreguntas/CategoriasPreguntas";

import PanelResultados from "./Resultados/PanelResultados";
import SeleccionarCategoriaResultados from "./Resultados/SeleccionarCategoriaResultados";


export default function AdminPage() {
  const [vista, setVista] = useState("dashboard");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <>
      {vista === "dashboard" && (
        <DashboardAdmin
          onCategorias={() => setVista("categorias")}
          onCandidatas={() => setVista("candidatas")}
          onInstituciones={() => setVista("instituciones")}
          onUsuarios={() => setVista("usuarios")}
          onPreguntasCategoria={() => setVista("preguntas-categoria")}
          onResultados={() => setVista("resultados")}
        />
      )}

      {vista === "categorias" && (
        <AdministrarCategorias onBack={() => setVista("dashboard")} />
      )}

      {vista === "preguntas-categoria" && (
        <CategoriasPreguntas onBack={() => setVista("dashboard")} />
      )}

      {vista === "candidatas" && (
        <AdministrarCandidatas onBack={() => setVista("dashboard")} />
      )}

      {vista === "instituciones" && (
        <AdministrarInstituciones onBack={() => setVista("dashboard")} />
      )}

      {vista === "usuarios" && (
        <AdministrarUsuarios onBack={() => setVista("dashboard")} />
      )}

      {vista === "resultados" && (
        <PanelResultados
          onEvaluaciones={() => setVista("evaluaciones")}
          onFinalistas={() => setVista("finalistas")}
          onBack={() => setVista("dashboard")}
        />
      )}

      {vista === "evaluaciones" && (
        <SeleccionarCategoriaResultados
          onSelect={(categoria) => {
            setCategoriaSeleccionada(categoria);
            setVista("ranking");
          }}
        />
      )}

   

      {vista === "finalistas" && (
        <div className="p-10 text-center text-gray-500">
          Finalistas (próximamente)
        </div>
      )}
    </>
  );
}
