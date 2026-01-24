import { NavLink } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
    return (
        <nav className="menu">
            <NavLink className="menuLink" to="/clientes">
              Clientes
            </NavLink>

            <NavLink className="menuLink" to="/projetos">
              Projetos
            </NavLink>
            <NavLink className="menuLink" to="/lancamentos">
              Lançamentos
            </NavLink>
            <NavLink className="menuLink" to="/dashboard">
              Dashboard
            </NavLink>
        </nav>
    )
}