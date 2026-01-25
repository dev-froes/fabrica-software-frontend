import { http } from "./http";

export const lancamentosApi = {
    listar: (params) => http.get("/lancamentos", { params: params || {}}),
    criar: (payload) => http.post("/lancamentos", payload),
    excluir: (id) => http.delete(`/lancamentos/${id}`),
}