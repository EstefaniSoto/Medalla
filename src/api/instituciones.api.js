
import axios from "./axiosClient";

export const obtenerInstituciones = () =>
  axios.get("/Instituciones");

export const crearInstitucion = (data) =>
  axios.post("/Instituciones", data);

export const actualizarInstitucion = (id, data) =>
  axios.put(`/Instituciones/${id}`, data);

export const eliminarInstitucion = (id) =>
  axios.delete(`/Instituciones/${id}`);
