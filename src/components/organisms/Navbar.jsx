import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/navbar.css';

const Navbar = ({routes}) => {
    const location = useLocation();

    useEffect(() => {console.log(routes)},[])
    
    const renderRoutes = () => {
        return routes.map((element, i) => {

            return (
                <div key={i} className="nav-item">
                    <a className={location.pathname === element.path ? "nav-active nav-link" : "nav-link"} href={element.path}>{element.name}</a>    
                </div>
            )
        })  
    }
    return (
        <div className="navbar">
            <h1 className="navbar-title">Expense Tracker</h1>
            {renderRoutes()}
        </div>
    )
}

export default Navbar;