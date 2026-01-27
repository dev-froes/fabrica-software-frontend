import { useEffect, useState } from "react";
import { clientesApi } from "../services/clientes";
import "./Clientes.css";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    ativo: true, 
  });
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  async function carregar() {
    setErro("");
    setCarregando(true);

    try {
      const res = await clientesApi.listar(busca);
      setClientes(res.data);
    } catch (err) {
      setErro("Erro ao carregar clientes.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }
    async function excluir(id) {
        const ok = confirm("Tem certeza que deseja excluir este cliente?");
        if (!ok) return;

        try {
            await clientesApi.excluir(id);
            await carregar();
        } catch(err) {
            setErro("Erro ao excluir cliente.");
            console.error(err);
        }
    }
    function iniciarEdicao(cliente) {
      setEditandoId(cliente.id);
      setForm({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone || "",
        ativo: !!cliente.ativo,
      });
    }
    function cancelarEdicao() {
      setEditandoId(null);
      setForm({ nome: "", email: "", telefone: "", ativo: true });
    }

    async function criarCliente(e) {
        e.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            const payload = {
                nome: form.nome,
                email: form.email,
                telefone: form.telefone|| null,
                ativo: !!form.ativo,
            };

            if (editandoId) {
              await clientesApi.atualizar(editandoId, payload);
            } else {
              await clientesApi.criar(payload);
            }

            cancelarEdicao();
            await carregar();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Erro ao salvar cliente. (verifique os dados e tente novamente)";
            setErro(msg);
            console.error(err);
        } finally {
            setSalvando(false);
        }
    }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="pageWrap">
      <div className="card">
        <h1 className="title">Clientes</h1>

        <div className="searchRow">
          <input
            className="searchInput"
            placeholder="Buscar por nome ou e-mail"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <button className="btn btnPrimary" onClick={carregar}>
            {carregando ? "Carregando..." : "Buscar"}
          </button>

          <button
            className="btn"
            onClick={() => {
              setBusca("");
              clientesApi.listar("").then((res) => setClientes(res.data));
            }}
          >
            Limpar
          </button>
        </div>

        {erro && <p className="error">{erro}</p>}

        <table className="table">
          <thead className="thead">
            <tr>
              <th className="th">ID</th>
              <th className="th">Nome</th>
              <th className="th">Email</th>
              <th className="th">Telefone</th>
              <th className="th">Ativo</th>
              <th className="th"></th>
              <th className="th"></th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((c) => (
              <tr key={c.id} className="tr">
                <td className="td">{c.id}</td>
                <td className="td">{c.nome}</td>
                <td className="td">{c.email}</td>
                <td className="td">{c.telefone ?? "-"}</td>
                <td className="td">{c.ativo ? "Sim" : "Não"}</td>
                <td className="td" style={{ textAlign: "right"}}>
                  <button className="btn" onClick={() => iniciarEdicao(c)}>
                    Editar
                  </button>
                </td>
                <td className="td" style={{ textAlign: "right"}}>        
                  <button className="btn btnDanger" onClick={() => excluir(c.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {clientes.length === 0 && (
              <tr className="tr">
                <td className="td" colSpan="7">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="formCard">
            <h2 className="formTitle">
              {editandoId ? `Editar Cliente (ID: ${editandoId})` : "Criar Novo Cliente"}
            </h2>

            <form onSubmit={criarCliente}>
                <div className="formGrid">
                    <input
                        className="input"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value}))}
                        required
                    />

                    <input
                        className="input"
                        placeholder="E-mail"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value}))}
                        required
                    />

                    <input
                        className="input formGridFull"
                        placeholder="Telefone (opcional)"
                        value={form.telefone}
                        onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value}))}
                    />

                    <label
                        className="formGridFull"
                        style={{ display: "flex", gap: 10, alignItems: "center"}}
                    >
                        <input
                            type="checkbox"
                            checked={form.ativo}
                            onChange={(e) => setForm((f) => ({ ...f, ativo: e.target.checked}))} 
                        />
                        Ativo
                    </label>
                </div>

                <div className="actionsRow">
                    <button
                        type="button"
                        className="btn"
                        onClick={cancelarEdicao}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="btn btnPrimary" disabled={salvando}>
                        {salvando ? "Salvando..." : editandoId ? "Atualizar" : "Criar"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
