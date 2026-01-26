import { http } from "./http";

export const dashboardApi = {
    buscar: (projetoId, inicio, fim) =>
        http.get(`/projetos/${projetoId}/dashboard`, { params: { inicio, fim } }),
};