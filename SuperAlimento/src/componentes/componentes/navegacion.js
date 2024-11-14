import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Navegacion = ({ children }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [openSections, setOpenSections] = useState({});
  const numeroDocumento = localStorage.getItem('numero_documento');
  const rol = localStorage.getItem('Rol');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Rol");
    localStorage.removeItem("numero_documento");
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const fetchUsuario = async () => {
    try {
      const response = await fetch(`https://superalimento-proyecto.onrender.com/api/usuario/${numeroDocumento}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNombreUsuario(data.nombre_usuario);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener el usuario',
          confirmButtonColor: '#28a745',
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en la solicitud: ${error}`,
        confirmButtonColor: '#28a745',
      });
    }
  };

  useEffect(() => {
    if (numeroDocumento && token && rol) {
      fetchUsuario();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numeroDocumento, token, rol]);

  // Función para manejar el despliegue de secciones
  const toggleSection = (sectionTitle) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionTitle]: !prevState[sectionTitle],
    }));
  };

  const renderNavItems = () => {
    const navItems = [
      {
        title: "Usuarios",
        icon: "fas fa-users",
        roles: ["Administrador"],
        links: [
          { to: "/RegistrarUsu", title: "Registrar" },
          { to: "/ConsultarUsu", title: "Consultar" },
        ],
      },
      {
        title: "Proveedores",
        icon: "fas fa-truck",
        roles: ["Administrador", "Inventarista"],
        links: [
          { to: "/RegistrarProve", title: "Registrar" },
          { to: "/ConsultarProve", title: "Consultar" },
        ],
      },
      {
        title: "Solicitudes",
        icon: "fas fa-file-alt",
        roles: ["Administrador", "Inventarista"],
        links: [
          { to: "/RegistrarSoli", title: "Registrar" },
          { to: "/ConsultarSoli", title: "Consultar" },
        ],
      },
      {
        title: "Productos",
        icon: "fas fa-box",
        roles: ["Administrador", "Inventarista"],
        links: [
          { to: "/RegistrarProd", title: "Registrar" },
          { to: "/ConsultarProd", title: "Consultar" },
          { to: "/RegistrarCate", title: "Registrar Categoría" },
          { to: "/ConsultarCate", title: "Consultar Categoría" },
        ],
      },
      {
        title: "Ventas",
        icon: "fas fa-shopping-cart",
        roles: ["Administrador", "Cajero"],
        links: [
          { to: "/RegistrarVent", title: "Registrar" },
          { to: "/ConsultarVent", title: "Consultar" },
        ],
      },
      {
      title: "Incidencias",
      icon: "fas fa-book",
      roles: ["Administrador", "Inventarista"],
      links: [
        { to: "/RegistrarInci", title: "Registrar" },
        { to: "/ConsultarInci", title: "Consultar" },
      ],
    },
    ];

    return navItems.map((item) => {
      if (item.roles.includes(rol)) {
        const isOpen = openSections[item.title];
        return (
          <li className="nav-item" key={item.title}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                color: '#c2c7d0',
                textDecoration: 'none',
                cursor: 'pointer',
                border: '1px solid transparent', // Borde transparente por defecto
                borderRadius: '5px', // Bordes redondeados
                transition: 'background-color 0.3s, border-color 0.3s, color 0.3s', // Animación suave para los cambios
              }}
              onClick={() => toggleSection(item.title)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#494e53'; // Cambio de color de fondo
                const pElement = e.currentTarget.querySelector('p');
                if (pElement) pElement.style.color = '#ffffff'; // Cambio de color de texto si el elemento p existe
              }} 
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'; // Vuelve al color original cuando el mouse sale
                const pElement = e.currentTarget.querySelector('p');
                if (pElement) pElement.style.color = '#c2c7d0'; // Vuelve al color de texto original
              }}
            >
              <i className={`${item.icon} nav-icon`} />
              <p style={{ margin: '0', paddingLeft: '10px', flexGrow: 1 }}>
                {item.title}
              </p>
              <i
                className={`right fas ${isOpen ? 'fa-angle-down' : 'fa-angle-left'}`}
                style={{
                  paddingLeft: '10px',
                  marginLeft: 'auto', // Empuja la flecha a la derecha
                }}
              />
            </div>
            <ul className="nav nav-treeview" style={{ display: isOpen ? 'block' : 'none' }}>
              {item.links.map((link) => (
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
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <Link className="nav-link " data-toggle="dropdown" to="#">
              <p>{nombreUsuario || numeroDocumento} |  {rol}</p>
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
        <Link className="brand-link" data-widget="pushmenu" to="#" role="button">
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
      <div className="content-wrapper colorFondo overflow-auto ">
        {children}
      </div>
      <footer className="main-footer dark-mode">
        <strong>Copyright © {new Date().getFullYear()} SuperAlimento.</strong>
      </footer>
      <aside className="control-sidebar control-sidebar-dark">
      </aside>
    </div>
  );
};

export default Navegacion;
