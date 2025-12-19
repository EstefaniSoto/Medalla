import { useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
import AdministrarCategorias from "./Categorias/AdministrarCategorias";
import AdministrarCandidatas from "./Candidatas/AdministrarCandidatas";
import AdministrarInstituciones from "./Instituciones/AdministrarInstituciones";
import AdministrarUsuarios from "./Usuarios/AdministrarUsuarios";

export default function AdminPage() {
  const [vista, setVista] = useState("dashboard");

  return (
    <>
      {vista === "dashboard" && (
        <DashboardAdmin
          onCategorias={() => setVista("categorias")}
          onCandidatas={() => setVista("candidatas")}
          onInstituciones={() => setVista("instituciones")}
          onUsuarios={() => setVista("usuarios")}
        />
      )}

      {vista === "categorias" && (
        <AdministrarCategorias onBack={() => setVista("dashboard")} />
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
    </>
  );
}
