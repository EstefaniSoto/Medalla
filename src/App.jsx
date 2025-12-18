import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./components/pages/admin/AdminPage";
/*import CandidatasList from "./pages/admin/CandidatasList";
import Resultados from "./pages/admin/Resultados";
import Votacion from "./pages/votante/Votacion";
import VotacionInstituciones from "./pages/instituciones/VotacionInstituciones";*/

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}
   
        <Route path="/admin" element={<AdminPage />} />
        {/*<Route path="/admin/candidatas" element={<CandidatasList />} />
        <Route path="/admin/resultados" element={<Resultados />} /> */}

        {/* VOTANTE NORMAL */}
        {/*<Route path="/votacion" element={<Votacion />} />*/}

        {/* INSTITUCIONES */}
        {/*<Route path="/instituciones/votar" element={<VotacionInstituciones />} />*/}
       

      </Routes>
    </BrowserRouter>
  );
}
