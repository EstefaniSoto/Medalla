import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./components/pages/admin/AdminPage";
import PanelIndividual from "./components/pages/individual/PanelIndividual";
import VotacionInstitucional from "./components/pages/instituciones/VotacionInstitucional"
 


export default function App() {
  return (
    
    <BrowserRouter>
    
      <Routes>
        


        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}
   
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/panel-individual" element={<PanelIndividual />} />
        <Route path="/panel-institucion" element={<VotacionInstitucional />} />


      </Routes>
    </BrowserRouter>
  );
}
