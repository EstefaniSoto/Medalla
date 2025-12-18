import axiosClient from "./axiosClient";

export const obtenerCategorias = () =>
  axiosClient.get("/Categorias");

export const crearCategoria = (data) =>
  axiosClient.post("/Categorias", data);

export const actualizarCategoria = (id, data) =>
  axiosClient.put(`/Categorias/${id}`, data);

export const eliminarCategoria = (id) =>
  axiosClient.delete(`/Categorias/${id}`);
