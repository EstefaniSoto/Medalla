import axiosClient from "./axiosClient";

export const obtenerUsuarios = () =>
  axiosClient.get("/Usuarios");

export const crearUsuario = (data) =>
  axiosClient.post("/Usuarios", data);

export const actualizarUsuario = (id, data) =>
  axiosClient.put(`/Usuarios/${id}`, data);

export const eliminarUsuario = (id) =>
  axiosClient.delete(`/Usuarios/${id}`);
