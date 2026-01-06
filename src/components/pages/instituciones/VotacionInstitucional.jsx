import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Top3Candidatas from "./Top3Candidatas";
import FinalVotacion from "./FinalVotacion";
import { obtenerCategorias } from "../../../api/categorias.api";

export default function VotacionInstitucional() {
  const [categorias, setCategorias] = useState([]);
  const [indice, setIndice] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    obtenerCategorias()
      .then(res => setCategorias(res.data))
      .catch(() =>
        Swal.fire("Error", "No se pudieron cargar categorías", "error")
      );
  }, []);

  if (!categorias.length) return null;

  if (finalizado) {
    return <FinalVotacion />;
  }

  return (
    <Top3Candidatas
      categoria={categorias[indice]}
      esUltima={indice === categorias.length - 1}
      onSiguiente={() => {
        if (indice === categorias.length - 1) {
          setFinalizado(true);
        } else {
          setIndice(indice + 1);
        }
      }}
    />
  );
}
