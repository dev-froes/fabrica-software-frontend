import {  Outlet } from "react-router-dom";
import Menu from "./Menu";

export default function Layout() {
    return (
        
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
            <Menu />
            <Outlet />
        </div>
        
    )
}