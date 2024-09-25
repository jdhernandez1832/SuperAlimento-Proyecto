import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const Navegacion = ({ children }) => {
  const numeroDocumento = localStorage.getItem('numero_documento');
  const rol = localStorage.getItem('Rol'); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Rol");
    localStorage.removeItem("numero_documento");
    setTimeout(() => {
      navigate("/"); 
    }, 100); 
  };
  
  const renderNavItems = () => {
    const navItems = [
      {
        title: "Usuarios",
        icon: "fas fa-users",
        roles: ["Administrador"],
        links: [
          { to: "/RegistrarUsu", title: "Registrar"},
          { to: "/ConsultarUsu", title: "Consultar"},
        ],
      },
      {
        title: "Proveedores",
        icon: "fas fa-truck",
        roles: ["Administrador", "Inventarista"],
        links: [
          { to: "/RegistrarProve", title: "Registrar" },
          { to: "/ConsultarProve", title: "Consultar"},
        ],
      },
      {
        title: "Solicitudes",
        icon: "fas fa-file-alt",
        roles: ["Administrador", "Inventarista"],
        links: [
          { to: "/RegistrarSoli", title: "Registrar" },
          { to: "/ConsultarSoli", title: "Consultar"},
        ],
      },
      {
        title: "Productos",
        icon: "fas fa-box",
        roles: ["Administrador", "Inventarista"],
        links: [
          { to: "/RegistrarProd", title: "Registrar"},
          { to: "/ConsultarProd", title: "Consultar"},
          { to: "/RegistrarCate", title: "Registrar Categoría"},
          { to: "/ConsultarCate", title: "Consultar Categoría"},
        ],
      },
      {
        title: "Ventas",
        icon: "fas fa-shopping-cart",
        roles: ["Administrador", "Cajero"],
        links: [
          { to: "/RegistrarVent", title: "Registrar"},
          { to: "/ConsultarVent", title: "Consultar"},
        ],
      },
    ];

    return navItems.map(item => {
      if (item.roles.includes(rol)) {
        return (
          <li className="nav-item" key={item.title}>
            <Link to="#" className="nav-link">
              <i className={`${item.icon} nav-icon`} /> 
              <p>{item.title}<i className="right fas fa-angle-left" /></p>
            </Link>
            <ul className="nav nav-treeview">
              {item.links.map(link => (
                <li className="nav-item" key={link.to}>
                  <Link to={link.to} className="nav-link">
                    <p>{link.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      }
      return null;
    });
  };

  return (
    <div className="wrapper">
      <nav className="main-header navbar navbar-expand navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" data-widget="pushmenu" to="#" role="button">
              <i className="fas fa-bars" />
            </Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/Index" className="nav-link">Inicio</Link>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="#" className="nav-link">SuperAlimento</Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <Link className="nav-link" data-toggle="dropdown" to="#">
              <p>Opciones</p>
            </Link>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <div className="dropdown-divider" />
              <Link to={`/Perfil/${numeroDocumento}`} className="dropdown-item">
                <p>Perfil</p>
              </Link>
              <div className="dropdown-divider" />
              <Link onClick={handleLogout} className="dropdown-item">
                <p>Cerrar Sesión</p>
              </Link>
              <div className="dropdown-divider" />
              <Link to="/Contacto" className="dropdown-item">
                <p>Contacto</p>
              </Link>
              <div className="dropdown-divider" />
            </div>
          </li>
        </ul>
      </nav>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <Link to="/Index" className="brand-link">
          <img src="../../dist/img/SuperAlimento.png" className="brand-image img-circle elevation-3" alt="superalimento.logo" style={{ opacity: '.8' }} />
          <span className="brand-text font-weight-light">SuperAlimento</span>
        </Link>
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              {renderNavItems()}
            </ul>
          </nav>
        </div>
      </aside>
      <div className="content-wrapper colorFondo">
        {children}
      </div>
      <footer className="main-footer dark-mode">
        <strong>Copyright © 2024 <Link to="#">SuperAlimento</Link>.</strong>
      </footer>
      <aside className="control-sidebar control-sidebar-dark">
      </aside>
    </div>
  );
};

export default Navegacion;
