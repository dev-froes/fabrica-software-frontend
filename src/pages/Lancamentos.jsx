import { useEffect, useState } from "react";
import { lancamentosApi } from "../services/lancamentos";
import { projetosApi } from "../services/projetos";
import "./Lancamentos.css";

export default function Lancamentos() {
    const [lancamentos, setLancamentos] = useState([]);
    const [projetos, setProjetos] = useState([]);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const [filtro, setFiltro] = useState ({
        projeto_id: "",
        inicio: "",
        fim: "",
    });
    const [form, setForm] = useState({
        projeto_id: "",
        colaborador: "",
        data: "",
        horas: "",
        tipo: "evolutiva",
        descricao: "",
    });

    const [salvando, setSalvando] = useState(false);

    async function carregarProjetos() {
        try {
            const res = await projetosApi.listar();
            setProjetos(res.data);
        } catch (err) {
            setErro("Erro ao carregar projetos.");
            console.error(err);
        }
    }
    async function carregarLancamentos() {
        setErro("")
        setCarregando(true);

        try {
            const params = {};

            if (filtro.projeto_id) params.projeto_id = filtro.projeto_id;
            if (filtro.inicio) params.inicio = filtro.inicio;
            if (filtro.fim) params.fim = filtro.fim;

            const res = await lancamentosApi.listar(params);
            setLancamentos(res.data);
        } catch (err) {
            setErro("Erro ao carregar os lançamentos.");
            console.error(err);
        } finally {
            setCarregando(false);
        }
    }
    async function criarLancamento(e) {
        e.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            await lancamentosApi.criar({
                projeto_id: Number(form.projeto_id),
                colaborador: form.colaborador,
                data: form.data,
                horas: Number(form.horas),
                tipo: form.tipo,
                descricao: form.descricao || null,
            });

            setForm({
                projeto_id: "",
                colaborador: "",
                data: "",
                horas: "",
                tipo: "evolutiva",
                descricao: "",
            });

            await carregarLancamentos();
        } catch (err) {
            const msg =
                err?.response?.data?.message || 
                "Erro ao criar lançamento (verifique os campos).";
            setErro(msg);
            console.error(err);
        } finally {
            setSalvando(false);
        }
        
    }
    async function excluirLancamento(id) {
        const ok = confirm("Tem certeza que deseja excluir este lançamento?");
        if (!ok) return;

        try {
            await lancamentosApi.excluir(id);
            await carregarLancamentos();
        } catch (err) {
            setErro("Erro ao excluir lançamento.");
            console.error(err);
        }
        
    }
    useEffect(() => {
        carregarProjetos();
        carregarLancamentos();
    }, []);

    return (
        <div className="pageWrap">
            <div className="card">
                <h1 className="title">Lançamentos (Timesheet)</h1>

                <div className="searchRow">
                    <select
                        className="searchInput"
                        value={filtro.projeto_id}
                        onChange={(e) =>
                            setFiltro((f) => ({...f, projeto_id: e.target.value }))
                        }
                    >
                        <option value="">Todos os Projetos</option>
                        {projetos.map((p) => (
                            <option key={p.id} value={p.id}>
                                (ID: {p.id}) {p.nome}
                            </option>
                        ))}
                    </select>    
                    <input 
                    className="searchInput"
                    type="date"
                    value={filtro.inicio}
                    onChange={(e) => setFiltro((f) => ({ ...f, inicio: e.target.value}))}
                    />

                    <input
                    className="searchInput"
                    type="date"
                    value={filtro.fim}
                    onChange={(e) => setFiltro((f) => ({ ...f, fim: e.target.value}))} 
                    />

                    <button className="btn btnPrimary" onClick={carregarLancamentos}>
                        {carregando ? "Carregando.." : "Buscar"}
                    </button>

                    <button 
                    className="btn"
                    onClick={() => {
                        setFiltro({ projeto_id: "", inicio: "", fim: "" });
                        setTimeout(carregarLancamentos, 0);
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
                            <th className="th">Projeto</th>
                            <th className="th">Colaborador</th>
                            <th className="th">Data</th>
                            <th className="th">Horas</th>
                            <th className="th">Tipo</th>
                            <th className="th">Descrição</th>
                            <th className="th"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {lancamentos.map((l) => (
                            <tr key={l.id} className="tr">
                                <td className="td">{l.id}</td>
                                <td className="td">{l.projeto_id}</td>
                                <td className="td">{l.colaborador}</td>
                                <td className="td">{l.data}</td>
                                <td className="td">{l.horas}h</td>
                                <td className="td">{l.tipo}</td>
                                <td className="td">{l.descricao ?? "-"}</td>
                                <td className="td" style={{ textAlign: "right"}}>
                                    <button className="btn btnDanger" onClick={() => excluirLancamento(l.id)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {lancamentos.length === 0 && !carregando && (
                            <tr className="tr">
                                <td className="td" colSpan="8">
                                    Nenhum lançamento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="formCard">
                    <h2 className="formTitle">Criar novo Lançamento</h2>

                    <form onSubmit={criarLancamento}>
                        <div className="formGrid">
                            <select
                            className="input"
                            value={form.projeto_id}
                            onChange={(e) => setForm((f) => ({ ...f, projeto_id: e.target.value}))}
                            required
                            >
                                <option value="">Selecione um projeto</option>
                                {projetos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        (ID: {p.id}) {p.nome}
                                    </option>
                                ))}
                            </select>
                            <input
                                className="input"
                                placeholder="Colaborador"
                                value={form.colaborador}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, colaborador: e.target.value }))
                                }
                                required
                            />
                            <input
                                className="input"
                                type="date"
                                value={form.data}
                                onChange={(e) => setForm ((f) => ({ ...f, data: e.target.value }))}
                                required
                            />
                            <input
                                className="input"
                                type="number"
                                step="0.25"
                                placeholder="Horas (ex: 1.5)"
                                value={form.horas}
                                onChange={(e) => setForm((f) => ({ ...f, horas: e.target.value }))}
                                required
                            />
                            <select
                                className="input"
                                value={form.tipo}
                                onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
                            >
                                <option value="corretiva">corretiva</option>
                                <option value="evolutiva">evolutiva</option>
                                <option value="implantacao">implantação</option>
                                <option value="legislativa">legislativa</option>
                            </select>

                            <input
                                className="input formGridFull"
                                placeholder="Descrição (opcional)"
                                value={form.descricao}
                                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                            />
                        </div>
                        <div className="actionsRow">
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    setForm({
                                        projeto_id: "",
                                        colaborador: "",
                                        data: "",
                                        horas: "",
                                        tipo: "evolutiva",
                                        descricao: "",
                                    })
                                }
                            >
                                Cancelar
                            </button>

                            <button type="submit" className="btn btnPrimary" disabled={salvando}>
                                {salvando ? "Criando..." : "Criar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}