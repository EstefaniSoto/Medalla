import axiosClient from "./axiosClient";

export const obtenerTop3PorCategoria = (categoriaId) =>
  axiosClient.get(`/votos-institucionales/top3/${categoriaId}`);

export const registrarVotoInstitucional = (data) =>
  axiosClient.post(`/votos-institucionales`, data);

export const obtenerPodioPorCategoria = (categoriaId) =>
  axiosClient.get(`/votos-institucionales/podio/${categoriaId}`);
