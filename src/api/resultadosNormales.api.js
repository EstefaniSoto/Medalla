import axiosClient from "./axiosClient";

export const obtenerResultadosPorCategoria = (categoriaId) =>
  axiosClient.get(`/resultados-normales/categoria/${categoriaId}`);
