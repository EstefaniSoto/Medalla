import axios from "./axiosClient";

/* Obtener preguntas por categoría */
export const obtenerPreguntasPorCategoria = (categoriaId) =>
  axios.get(`/PreguntasCategoria/categoria/${categoriaId}`);

/* Crear pregunta */
export const crearPregunta = (data) =>
  axios.post("/PreguntasCategoria", data);

/* Actualizar pregunta */
export const actualizarPregunta = (id, data) =>
  axios.put(`/PreguntasCategoria/${id}`, data);

/* Eliminar pregunta */
export const eliminarPregunta = (id) =>
  axios.delete(`/PreguntasCategoria/${id}`);
