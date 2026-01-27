import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { FiUsers, FiBriefcase, FiClock, FiBarChart2 } from "react-icons/fi";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 className="Logo">Fábrica</h2>
            <nav className="nav">
                <NavLink to="/clientes" className="navItem">
                    <FiUsers className="navIcon"/>
                    <span> Clientes</span> 
                </NavLink>
                <NavLink to="/projetos" className="navItem">
                    <FiBriefcase className="navIcon"/>
                    <span> Projetos</span>
                </NavLink>
                <NavLink to="/lancamentos" className="navItem">
                    <FiClock className="navIcon"/>
                    <span> Lançamentos</span>                  
                </NavLink>
                <NavLink to="/dashboard" className="navItem">
                    <FiBarChart2 className="navIcon"/>
                    <span> Dashboard</span>              
                </NavLink>
            </nav>
            <div className="sidebarFooter">
                <div className="statusDot"/>
                <span className="footerText">Sistema online</span>
            </div>
        </aside>
    );
}