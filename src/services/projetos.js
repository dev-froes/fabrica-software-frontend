import { http } from "./http";

export const projetosApi = {
    listar: (params) => http.get("/projetos", { params: params || {}}),
    criar: (payload) => http.post("/projetos", payload),
    excluir: (id) => http.delete(`/projetos/${id}`),
};