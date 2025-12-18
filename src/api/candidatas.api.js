import axios from "./axiosClient";

export const obtenerCandidatas = () =>
  axios.get("/Candidatas");


export const crearCandidata = (formData) =>
  axios.post("/Candidatas", formData);

export const actualizarCandidata = (id, formData) =>
  axios.put(`/Candidatas/${id}`, formData);


export const eliminarCandidata = (id) =>
  axios.delete(`/Candidatas/${id}`);
