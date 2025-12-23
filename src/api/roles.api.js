import axiosClient from "./axiosClient";

export const obtenerRoles = () => {
  return axiosClient.get("/roles");
};
