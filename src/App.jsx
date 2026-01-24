import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import Clientes from "./pages/Clientes";
import Projetos from "./pages/Projetos";
import Lancamentos from "./pages/Lancamentos";
import Dashboard from "./pages/dashboard";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/clientes" replace />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/projetos" element={<Projetos />} />
                <Route path="/lancamentos" element={<Lancamentos />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
}
