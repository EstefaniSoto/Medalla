import axiosClient from "./axiosClient";

export const verificarVoto = (usuarioId, candidataId) =>
  axiosClient.get(
    `/votos-normales/existe?usuarioId=${usuarioId}&candidataId=${candidataId}`
  );

export const guardarVotoNormal = (data) => {
  return axiosClient.post("/votos-normales", data);
};
