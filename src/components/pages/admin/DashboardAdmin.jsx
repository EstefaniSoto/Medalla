import { useEffect, useState } from "react";
import {
  LogOut,
  Users,
  BarChart2,
  ListChecks,
  Layers,
  PlusCircle,
  Building,
  UserCog,
  LayersPlus
} from "lucide-react";

import { obtenerCandidatas } from "../../../api/candidatas.api";
import { obtenerUsuarios } from "../../../api/usuarios.api";
import { obtenerInstituciones } from "../../../api/instituciones.api";
import { obtenerCategorias } from "../../../api/categorias.api";

export default function DashboardAdmin({
  onCategorias,
  onCandidatas,
  onInstituciones,
  onUsuarios,
  onPreguntasCategoria
}) {

  const [totales, setTotales] = useState({
    candidatas: 0,
    votantes: 0,
    instituciones: 0,
    categorias: 0
  });

  useEffect(() => {
    cargarTotales();
  }, []);

  const cargarTotales = async () => {
    try {
      const [
        candidatasRes,
        usuariosRes,
        institucionesRes,
        categoriasRes
      ] = await Promise.all([
        obtenerCandidatas(),
        obtenerUsuarios(),
        obtenerInstituciones(),
        obtenerCategorias()
      ]);

      setTotales({
        candidatas: candidatasRes.data.length,
        votantes: usuariosRes.data.length,
        instituciones: institucionesRes.data.length,
        categorias: categoriasRes.data.length
      });
    } catch (error) {
      console.error("Error cargando totales", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="w-full bg-[#003478] shadow-md p-4 flex justify-between items-center">
        <img src="img/logo2.jpg" alt="" width={200} />

        <button
          className="flex items-center gap-2 px-3 py-2 rounded 
          bg-linear-to-r from-[#CDA776] to-[#b88a4b]
          text-black font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </nav>

      {/* CONTENIDO */}
      <div className="py-10 px-6">
        <h2 className="text-3xl font-bold">Bienvenida, Admin</h2>
        <p className="text-gray-700 mb-6">
          Aquí podrás gestionar usuarios, ver estadísticas y administrar el sistema.
        </p>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Candidatas"
            value={totales.candidatas}
            icon={Users}
            color="text-blue-600"
          />
          <StatCard
            title="Votantes Registrados"
            value={totales.votantes}
            icon={ListChecks}
            color="text-green-600"
          />
          <StatCard
            title="Instituciones"
            value={totales.instituciones}
            icon={Building}
            color="text-orange-500"
          />
          <StatCard
            title="Categorías"
            value={totales.categorias}
            icon={Layers}
            color="text-purple-600"
          />
        </div>

        {/* ACCESOS RÁPIDOS */}
        <h3 className="text-xl font-bold mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <QuickAction
            icon={PlusCircle}
            title="Agregar Candidata"
            onClick={onCandidatas}
            color="text-blue-600"
          />
          <QuickAction
            icon={UserCog}
            title="Crear Usuario Votante"
            onClick={onUsuarios}
            color="text-green-600"
          />
          <QuickAction
            icon={Building}
            title="Registrar Institución"
            onClick={onInstituciones}
            color="text-orange-500"
          />
          <QuickAction
            icon={Layers}
            title="Administrar Categorías"
            onClick={onCategorias}
            color="text-purple-600"
          />
        </div>

        {/* CARDS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MainCard
              icon={LayersPlus}
              title="Añadir preguntas categoría"
              text="Consulta y añade preguntas a categoría."
              color="text-purple-600"
              onClick={onPreguntasCategoria}
            />

          <MainCard
            icon={BarChart2}
            title="Ver Resultados"
            text="Consulta promedios, puntajes y finalistas."
            color="text-green-600"
          />
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES */

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <Icon className={color} size={36} />
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="font-bold text-2xl">{value}</h3>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow hover:scale-[1.02] transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Icon size={32} className={color} />
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>
    </div>
  );
}

function MainCard({ icon: Icon, title, text, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-8 shadow-lg rounded-xl flex flex-col items-center text-center hover:scale-[1.02] transition cursor-pointer"
    >
      <Icon size={50} className={`${color} mb-3`} />
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}

