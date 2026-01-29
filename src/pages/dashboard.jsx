import { useEffect, useState } from "react";
import { projetosApi } from "../services/projetos";
import { dashboardApi } from "../services/dashboard";
import "./Dashboard.css";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
    const [projetos, setProjetos] = useState([]);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    
    const [filtro, setFiltro] = useState({
        projeto_id: "",
        inicio: "",
        fim: "",
    });
    const [resultado, setResultado] = useState(null);

    //gráfico
    const labels = resultado ? Object.keys(resultado.resumo_por_tipo || {}) : [];
    const horasPorTipo = resultado
        ? Object.values(resultado.resumo_por_tipo || {}).map((v) => Number(v.horas || 0))
        : [];
    const dadosGrafico = {
        labels,
        datasets: [
            {
                label: "Horas por tipo",
                data: horasPorTipo,
                backgroundColor: "rgba(47, 102, 255, 0.65)",
                borderColor: "rgba(47, 102, 255, 0.9)",
                borderWidth: 1,
            },
        ],
    };
    //--
    async function carregarProjetos() {
        try {
            const res = await projetosApi.listar();
            setProjetos(res.data);
        } catch (err) {
            setErro("Erro ao carregar os projetos.");
            console.error(err);
        }
    }

    async function buscarDashboard() {
        setErro("");

        if (!filtro.projeto_id || !filtro.inicio || !filtro.fim) {
            setErro("Selecione um projeto e informe o período (início e fim).");
            return;
        }

        setCarregando(true);

        try {
            const res = await dashboardApi.buscar(filtro.projeto_id, filtro.inicio, filtro.fim);
            setResultado(res.data);
        } catch (err) {
            setErro("Erro ao buscar dashboard.");
            console.error(err);
        } finally {
            setCarregando(false);
        }
    }
    function formatMoney(v) {
        const n = Number(v || 0);
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(n);
    }
    function formatHours(v) {
        const total = Number(v || 0);

        const horas = Math.floor(total);
        const minutos = Math.round((total - horas) * 60);

        if (minutos === 0) {
            return `${horas}h`;
        }
        return `${horas}h ${minutos}min`;
    }

    useEffect(() => {
        carregarProjetos();
    }, []);
    return (
        <div className="pageWrap">
            <div className="card">
                <h1 className="title">Dashboard de Lucratividade</h1>
                <div className="searchRow">
                    <select
                        className="searchInput"
                        value={filtro.projeto_id}
                        onChange={(e) => setFiltro((f) => ({ ...f, projeto_id: e.target.value }))} 
                    >
                        <option value="">Selecione um projeto</option>
                        {projetos.map((p) => (
                            <option key={p.id}value={p.id}>
                                (ID: {p.id}) {p.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        className="searchInput"
                        type="date"
                        value={filtro.inicio}
                        onChange={(e) => setFiltro((f) => ({ ...f, inicio: e.target.value }))}
                    />
                    <input
                        className="searchInput"
                        type="date"
                        value={filtro.fim}
                        onChange={(e) => setFiltro((f) => ({ ...f, fim: e.target.value }))}
                    />

                    <button className="btn btnPrimary" onClick={buscarDashboard}>
                        {carregando ? "Carregando..." : "Buscar"}
                    </button>
                </div>

                {erro && <p className="error">{erro}</p>}
                {!resultado && !carregando && (
                    <p className="error" style={{ color: "rgba(255, 255, 255, 0.65)"}}>
                        Selecione um projeto e informe o período (início e fim), depois clique em Buscar.
                    </p>
                )}
                {resultado && (
                    <div>
                        <div className="cardsGrid">
                            <div className="kpiCard">
                                <div className="kpiLabel">Horas totais</div>
                                <div className="kpiValue">{formatHours(resultado.metricas.horas_totais)}</div>
                            </div>

                            <div className="kpiCard">
                                <div className="kpiLabel">Custo total</div>
                                <div className="kpiValue">{formatMoney(resultado.metricas.custo_total)}</div>
                            </div>

                            <div className="kpiCard">
                                <div className="kpiLabel">Receita</div>
                                <div className="kpiValue">{formatMoney(resultado.metricas.receita)}</div>
                            </div>

                            <div className="kpiCard">
                                <div className="kpiLabel">Margem bruta</div>
                                <div className="kpiValue">{formatMoney(resultado.metricas.margem_bruta)}</div>
                            </div>

                            <div className="kpiCard">
                                <div className="kpiLabel">Margem percentual bruta(%)</div>
                                <div className="kpiValue">
                                    {Number(resultado.metricas.margem_bruta_percentual || 0).toFixed(2)}%
                                </div>
                            </div>

                            <div className="kpiCard">
                                <div className="kpiLabel">Break-even (horas)</div>
                                <div className="kpiValue">
                                    {formatHours(resultado.metricas.break_even_horas)}
                                </div>
                            </div>
                        </div>
                        <div className="twoColGrid">
                            <div className="panel">
                                <h1 className="panelTitle">Resumo por tipo</h1>

                                <table className="table">
                                    <thead className="thead">
                                        <tr>
                                            <th className="th">Tipo</th>
                                            <th className="th">Horas</th>
                                            <th className="th">Custo</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Object.entries(resultado.resumo_por_tipo || {}).map(([tipo, dados]) => (
                                            <tr key={tipo} className="tr">
                                                <td className="td">{tipo}</td>
                                                <td className="td">{formatHours(dados.horas)}</td>
                                                <td className="td">{formatMoney(dados.custo)}</td>
                                            </tr>
                                        ))}

                                        {Object.keys(resultado.resumo_por_tipo || {}).length === 0 && (
                                            <tr className="tr">
                                                <td className="td" colSpan="3">Sem lançamentos no período</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="panel">
                                <h2 className="sectionTitle">Horas por tipo (gráfico)</h2>

                                <div className="kpiCard" style={{ marginTop: 12 }}>
                                    <Bar
                                        data={dadosGrafico}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { display: true },
                                            },
                                            scales: {
                                                y: {beginAtZero: true},
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>                        
                )}
            </div>
        </div>
    );
}