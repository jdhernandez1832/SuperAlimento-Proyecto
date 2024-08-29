import React from "react";
import { Link } from "react-router-dom";

const Navegacion = ({ children }) => {
  return (

<div className="wrapper">
  <nav className="main-header navbar navbar-expand navbar-dark">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" data-widget="pushmenu" to="#" role="button"><i className="fas fa-bars" /></Link>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <Link to="/Index" className="nav-link">Inicio</Link>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <Link to="#" className="nav-link">SuperAlimento</Link>
      </li>
    </ul>
    <ul className="navbar-nav ml-auto ">
      <li className="nav-item dropdown">
        <Link className="nav-link" data-toggle="dropdown" to="#">
          <p>Opciones</p>
        </Link>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <div className="dropdown-divider" />
          <Link to="/Perfil" className="dropdown-item">
              <p>Perfil</p>
          </Link>
          <div className="dropdown-divider" />
          <Link to="/" className="dropdown-item">
              <p>Cerrar Sesion</p>
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
      <img src="../../dist/img/SuperAlimento.png"className="brand-image img-circle elevation-3" alt="superalimento.logo" style={{opacity: '.8'}} />
      <span className="brand-text font-weight-light">SuperAlimento</span>
    </Link>
    <div className="sidebar">
      <nav className="mt-2">
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li className="nav-item">
            <Link to="#" className="nav-link">
              <p>
                Gestion de usuario
                <i className="right fas fa-angle-left" />
              </p>
            </Link>
            <ul className="nav nav-treeview">
              <li className="nav-item">
                <Link to="/RegistrarUsu" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Registrar</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ConsultarUsu" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Consultar</p>
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link">
              <p>
                Gestion de proveedor
                <i className="right fas fa-angle-left" />
              </p>
            </Link>
            <ul className="nav nav-treeview">
              <li className="nav-item">
                <Link to="/RegistrarProve" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Registrar</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ConsultarProve" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Consultar</p>
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link">
              <p>
                Gestion de solicitud
                <i className="fas fa-angle-left right" />
              </p>
            </Link>
            <ul className="nav nav-treeview">
              <li className="nav-item">
                <Link to="/RegistrarSoli" className="nav-link" id="RegistrarSoli">
                  <i className="far fa-circle nav-icon" />
                  <p>Registrar</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ConsultarSoli" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Consultar</p>
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link">
              <p>
                Gestion de producto
                <i className="fas fa-angle-left right" />
              </p>
            </Link>
            <ul className="nav nav-treeview">
              <li className="nav-item">
                <Link to="/RegistrarProd" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Registrar</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ConsultarProd" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Consultar</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/RegistrarCate" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Registrar Categoria</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ConsultarCate" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Consultar Categoria</p>
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link">
              <p>
                Gestion de venta
                <i className="fas fa-angle-left right" />
              </p>
            </Link>
            <ul className="nav nav-treeview">
              <li className="nav-item">
                <Link to="/RegistrarVent" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Registrar</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/ConsultarVent" className="nav-link">
                  <i className="far fa-circle nav-icon" />
                  <p>Consultar</p>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
  <div className="content-wrapper colorFondo">
  { children }
  </div>
  <footer className="main-footer dark-mode">
    <strong>Copyright © 2024 <Link to="#">SuperAlimento</Link>.</strong>
  </footer>
  <aside className="control-sidebar control-sidebar-dark">
  </aside>
</div>
  );
}

export default Navegacion;
