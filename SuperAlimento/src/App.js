import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './componentes/componentes/PrivateRoute'; // Asegúrate de que la ruta es correcta
import Login from './paginas/auth/Login';
import Index from './paginas/Index';
import Perfil from './paginas/Usuarios/Perfil';
import RegistrarUsu from './paginas/Usuarios/RegistrarUsu';
import RegistrarSoli from './paginas/Solicitud/RegistrarSoli';
import RegistrarCate from './paginas/Categoria/RegistrarCate';
import RegistrarProve from './paginas/Proveedor/RegistrarProve';
import RegistrarProd from './paginas/Producto/RegistrarProd';
import ConsultarUsu from './paginas/Usuarios/ConsultarUsu';
import ConsultarProd from './paginas/Producto/ConsultarProd';
import ConsultarProve from './paginas/Proveedor/ConsultarProve';
import ConsultarCate from './paginas/Categoria/ConsultarCate';
import ActualizarUsu from './paginas/Usuarios/ActualizarUsu';
import ActualizarProve from './paginas/Proveedor/ActualizarProve';
import ActualizarCate from './paginas/Categoria/ActualizarCate';
import ActualizarProd from './paginas/Producto/ActualizarProd';
import ConsultarSoli from './paginas/Solicitud/ConsultarSoli';
import RegistrarVent from './paginas/Ventas/RegistrarVent';
import ConsultarVent from './paginas/Ventas/ConsultarVent';
import Contacto from './paginas/Contacto';
import DetallesSolicitud from './paginas/Solicitud/DetallesSoli';
import DetallesVenta from './paginas/Ventas/DetallesVent';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Index" element={<PrivateRoute element={Index} roles="Administrador, Inventarista, Cajero" />} />
          <Route path="/Perfil/:numero_documento" element={<PrivateRoute element={Perfil} roles="Administrador, Inventarista, Cajero" />} />
          <Route path="/RegistrarUsu" element={<PrivateRoute element={RegistrarUsu} roles="Administrador" />} />
          <Route path="/RegistrarSoli" element={<PrivateRoute element={RegistrarSoli} roles="Administrador, Inventarista" />} />
          <Route path="/RegistrarCate" element={<PrivateRoute element={RegistrarCate} roles="Administrador, Inventarista" />} />
          <Route path="/RegistrarProve" element={<PrivateRoute element={RegistrarProve} roles="Administrador, Inventarista" />} />
          <Route path="/RegistrarProd" element={<PrivateRoute element={RegistrarProd} roles="Administrador, Inventarista" />} />
          <Route path="/RegistrarVent" element={<PrivateRoute element={RegistrarVent} roles="Administrador, Cajero" />} />
          <Route path="/ConsultarUsu" element={<PrivateRoute element={ConsultarUsu} roles="Administrador" />} />
          <Route path="/ConsultarProd" element={<PrivateRoute element={ConsultarProd} roles="Administrador, Inventarista" />} />
          <Route path="/ConsultarProve" element={<PrivateRoute element={ConsultarProve} roles="Administrador, Inventarista" />} />
          <Route path="/ConsultarSoli" element={<PrivateRoute element={ConsultarSoli} roles="Administrador, Inventarista" />} />
          <Route path="/ConsultarCate" element={<PrivateRoute element={ConsultarCate} roles="Administrador, Inventarista" />} />
          <Route path="/ConsultarVent" element={<PrivateRoute element={ConsultarVent} roles="Administrador, Cajero" />} />
          <Route path="/ActualizarUsu/:numero_documento" element={<PrivateRoute element={ActualizarUsu} roles="Administrador, Inventarista" />} />
          <Route path="/ActualizarProve/:id_proveedor" element={<PrivateRoute element={ActualizarProve} roles="Administrador, Inventarista" />} />
          <Route path="/ActualizarCate/:id_categoria" element={<PrivateRoute element={ActualizarCate} roles="Administrador, Inventarista" />} />
          <Route path="/ActualizarProd/:id_producto" element={<PrivateRoute element={ActualizarProd} roles="Administrador, Inventarista" />} />
          <Route path="/DetallesSolicitud/:id_solicitud" element={<PrivateRoute element={DetallesSolicitud} roles="Administrador, Inventarista" />} />
          <Route path="/DetallesVenta/:id_venta" element={<PrivateRoute element={DetallesVenta} roles="Administrador, Cajero" />} />
          <Route path="/Contacto" element={<PrivateRoute element={Contacto} roles="Administrador, Inventarista, Cajero" />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;