import  { useEffect, useState } from 'react';
import { projetosApi } from '../services/projetos';
import { clientesApi } from '../services/clientes';
import './Projetos.css';


export default function Projetos() {
    const [projetos, setProjetos] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [form, setForm] = useState({
        cliente_id: "",
        nome: "",
        descricao: "",
        data_inicio: "",
        data_fim: "",
        valor_contrato: "",
        status: "planejamento",
    });
    const [salvando, setSalvando] = useState(false);

    async function carregarProjetos() {
        setErro("");
        setCarregando(true);

        try {
            const res = await projetosApi.listar();
            setProjetos(res.data);
        } catch (err) {
            setErro("Erro ao carregar projetos.");
            console.error(err);
        } finally {
            setCarregando(false);
        }
    }

    async function carregarClientes() {
        try {
            const res = await clientesApi.listar();
            setClientes(res.data);
        } catch (err) {
            setErro("Erro ao carregar clientes para selecinar.");
            console.error(err);
        }
        
    }
    async function excluirProjeto(id) {
        const ok = confirm("Tem certeza que deseja excluir este projeto?");
        if (!ok) return;

        try {
            await projetosApi.excluir(id);
            await carregarProjetos();
        } catch (err) {
            setErro("Erro ao excluir projeto.");
            console.error(err);
        }
    
    }
    async function criarProjeto(e) {
        e.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            await projetosApi.criar({
                cliente_id: Number(form.cliente_id),
                nome: form.nome,
                descricao: form.descricao || null,
                data_inicio: form.data_inicio,
                data_fim: form.data_fim || null,
                valor_contrato: Number(form.valor_contrato),
                custo_hora_base: Number(form.custo_hora_base),
                status: form.status,
            });
            
            setForm({
                cliente_id: "",
                nome: "",
                descricao: "",
                data_inicio: "",
                data_fim: "",
                valor_contrato: "",
                status: "planejado",
            });
            await carregarProjetos();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Erro ao criar projeto. (verifique os dados e tente novamente)";
            setErro(msg);
            console.error(err);
        } finally {
            setSalvando(false);
        }
    }

    useEffect(() => {
        carregarProjetos();
        carregarClientes();
    }, []);

    return (
        <div className="pageWrap">
            <div className="card">
                <h1 className="title">Projetos</h1>

                {carregando && <p>Carregando...</p>}

                {erro && <p style={{ color: "crimson" }}>{erro}</p>}

                <table className="table">
                    <thead className="thead">
                        <tr>
                            <th className='th'>ID</th>
                            <th className='th'>Nome</th>
                            <th className='th'>Cliente ID</th>
                            <th className='th'>Status</th>
                            <th className='th'>Valor Contrato</th>
                            <th className='th'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projetos.map((p) => (
                            <tr key={p.id} className="tr">
                                <td className='td'>{p.id}</td>
                                <td className='td'>{p.nome}</td>
                                <td className='td'>{p.cliente_id}</td>
                                <td className='td'>{p.status}</td>
                                <td className='td'>
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(p.valor_contrato)}
                                </td>
                                <td className='td' style={{ textAlign: "right"}}>
                                    <button className='btn btnDanger' onClick={() => excluirProjeto(p.id)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {projetos.length === 0 && !carregando && (
                            <tr className='tr'>
                                <td className='td' colSpan="6">Nenhum projeto encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className='formCard'>
                    <h2 className='formTitle'>Criar Novo Projeto</h2>

                    <form onSubmit={criarProjeto}>
                        <div className='formGrid'>
                            <select
                                className='input'
                                value={form.cliente_id}
                                onChange={(e) => setForm((f) => ({ ...f, cliente_id: e.target.value}))}
                                required 
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        (ID: {c.id}) {c.nome} 
                                    </option>
                                ))}
                            </select>

                            <input
                                className='input'
                                placeholder='Nome do projeto'
                                value={form.nome}
                                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value}))}
                                required
                            />
                            <input
                                className='input formGridFull'
                                placeholder='Descrição (opcional)'
                                value={form.descricao}
                                onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value}))}
                            />
                            <div>
                                <label className='label'>Data de início</label>
                                <input
                                    className='input'
                                    type='date'
                                    value={form.data_inicio}
                                    onChange={(e) => setForm((f) => ({ ...f, data_inicio: e.target.value}))}
                                    required
                                />
                            </div>
                            <div>
                                <label className='label'>Data de término (opcional)</label>
                                <input
                                className='input'
                                type='date'
                                value={form.data_fim}
                                onChange={(e) => setForm((f) => ({ ...f, data_fim: e.target.value}))}
                                />
                            </div>
                            <input
                                className='input'
                                type='number'
                                step="0.01"
                                placeholder='Valor do contrato'
                                value={form.valor_contrato}
                                onChange={(e) => setForm((f) => ({ ...f, valor_contrato: e.target.value}))}
                                required
                            />
                            <input
                                className='input'
                                type='number'
                                step="0.01"
                                placeholder='Custo hora base'
                                value={form.custo_hora_base}
                                onChange={(e) => setForm((f) => ({ ...f, custo_hora_base: e.target.value}))}
                                required
                            />
                            <select
                                className='input formGridFull'
                                value={form.status}
                                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value}))}
                                required
                            >
                                <option value="planejado">planejado</option>
                                <option value="em_andamento">em andamento</option>
                                <option value="pausado">pausado</option>
                                <option value="finalizado">finalizado</option>
                            </select>
                        </div>

                        <div className='actionsRow'>
                            <button
                                type='buttom'
                                className='btn'
                                onClick={() =>
                                    setForm({
                                        cliente_id: "",
                                        nome: "",
                                        descricao: "",
                                        data_inicio: "",
                                        data_fim: "",
                                        valor_contrato: "",
                                        custo_hora_base: "",
                                        status: "planejado",
                                    })
                                }
                            >
                                Cancelar
                            </button>

                            <button type='submit' className='btn btnPrimary' disabled={salvando}>
                                {salvando ? "Salvando..." : "Criar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>       
        </div>
    )
}