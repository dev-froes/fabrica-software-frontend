import { http } from "./http";

export const clientesApi = {
    listar: (search) => http.get("/clientes", { params: search ? { search } : {} }),
    criar: (payload) => http.post("/clientes", payload),
    atualizar: (id, payload) => http.put(`/clientes/${id}`, payload),
    excluir: (id) => http.delete(`/clientes/${id}`),
};