import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const ConsultarUsu = () => {
  const tableRef = useRef(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();
  const [orden, setOrden] = useState({ campo: 'numero_documento', direccion: 'asc' });

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  const roles = {
    1: 'Administrador',
    2: 'Cajero',
    3: 'Inventarista'
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/usuario/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          Swal.fire('Error', 'Error al obtener los usuarios', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };

    fetchUsuarios();
  }, [rol, token]);

  const handleEstado = async (numero_documento, estadoActual) => {
    const nuevoEstado = estadoActual === 'Activo' ? 'Desactivo' : 'Activo';
    Swal.fire({
      title: `¿Estás seguro de cambiar el estado a ${nuevoEstado}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, cambiar a ${nuevoEstado}`,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:3001/api/usuario/estado/${numero_documento}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol,
            },
            body: JSON.stringify({ estado: nuevoEstado }),
          });

          if (response.ok) {
            setUsuarios(usuarios.map(usuario =>
              usuario.numero_documento === numero_documento ? { ...usuario, estado: nuevoEstado } : usuario
            ));
            Swal.fire({
              title: '¡Estado cambiado!',
              text: `El usuario ha sido cambiado a ${nuevoEstado}.`,
              icon: 'success',
              confirmButtonColor: '#28a745',
            }).then(() => window.location.reload());
          } else {
            Swal.fire('Error', 'Error al cambiar el estado del usuario', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Error en la solicitud', 'error');
        }
      }
    });
  };

  const toggleInactivos = () => {
    setMostrarInactivos(!mostrarInactivos);
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    (mostrarInactivos ? usuario.estado === 'Desactivo' : usuario.estado === 'Activo') &&
    ((usuario.nombre_usuario && usuario.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase())) || 
     (usuario.numero_documento && usuario.numero_documento.toString().includes(busqueda)))
  );
  
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const usuariosMostrados = usuariosFiltrados
    .sort((a, b) => {
      if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
      if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    })
    .slice(indicePrimerRegistro, indiceUltimoRegistro);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);

  const manejarOrden = (campo) => {
    const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
    setOrden({ campo, direccion: nuevaDireccion });
  };

  return (
    <div>
      <Navegacion>
        <div className="card card-success">
          <div className="card-body colorFondo">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Usuarios</h3>
                    <button onClick={toggleInactivos} className="btn btn-info float-right">
                      {mostrarInactivos ? "Mostrar Activos" : "Mostrar Inactivos"}
                    </button>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <div className="input-group mb-3">
                      <div className="col-12 mb-2 d-flex align-items-center">
                        <label htmlFor="registrosPorPagina" className="d-inline">Registros por página:</label>
                        <select 
                          id="registrosPorPagina" 
                          className="form-control form-control-sm d-inline-block w-auto ml-2"
                          value={registrosPorPagina} 
                          onChange={(e) => setRegistrosPorPagina(Number(e.target.value))}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-pill ml-2 mr-2"
                        placeholder="Buscar usuario"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ width: '200px' }}
                      />
                    </div>
                    {usuariosFiltrados.length === 0 ? (
                      <p>No hay datos en esta tabla</p>
                    ) : (
                      <>
                        <table ref={tableRef} className="table table-hover text-nowrap">
                          <thead>
                            <tr>
                              <th onClick={() => manejarOrden('numero_documento')}>
                                Número de Documento {orden.campo === 'numero_documento' && (orden.direccion === 'asc' ? '▲' : '▼')}
                              </th>
                              <th onClick={() => manejarOrden('nombre')}>
                                Nombre {orden.campo === 'nombre_usuario' && (orden.direccion === 'asc' ? '▲' : '▼')}
                              </th>
                              <th>Tipo de documento</th>
                              <th>Email</th>
                              <th>Telefono</th>
                              <th>Rol</th>
                              <th onClick={() => manejarOrden('estado')}>
                                Estado {orden.campo === 'estado' && (orden.direccion === 'asc' ? '▲' : '▼')}
                              </th>
                              <th>Actualizar</th>
                              <th>Cambiar Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuariosMostrados.map((usuario) => (
                              <tr key={usuario.numero_documento}>
                                <td>{usuario.numero_documento}</td>
                                <td>{usuario.nombre_usuario}</td>
                                <td>{usuario.tipo_documento}</td>
                                <td>{usuario.correo_usuario}</td>
                                <td>{usuario.telefono_usuario}</td>
                                {/* Muestra el rol basado en el ID del rol */}
                                <td>{roles[usuario.id_rol]}</td>
                                <td>{usuario.estado}</td>
                                <td>
                                  <Link to={`/ActualizarUsu/${usuario.numero_documento}`} className="btn btn-warning">
                                    Actualizar
                                  </Link>
                                </td>
                                <td>
                                  <button
                                    className={`btn ${usuario.estado === 'Activo' ? 'btn-danger' : 'btn-success'}`}
                                    onClick={() => handleEstado(usuario.numero_documento, usuario.estado)}
                                  >
                                    {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                  <nav aria-label="Page navigation" className="text-center">
                    <div className="text-left">
                      <p>
                        Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, usuariosFiltrados.length)} de {usuariosFiltrados.length} registros
                      </p>
                    </div>
                    <div className="btn-group" role="group" aria-label="Paginación">
                      <button
                        className="btn btn-secondary mr-2"
                        onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                      >
                        Anterior
                      </button>
                      {[...Array(totalPaginas)].map((_, index) => (
                        <button
                          key={index}
                          className={`btn btn-secondary ${paginaActual === index + 1 ? 'active' : ''}`}
                          onClick={() => setPaginaActual(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        className="btn btn-secondary ml-2"
                        onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                      >
                        Siguiente
                      </button>
                    </div>
                  </nav>
                  <div className="card-header">
                      <button onClick={() => navigate('/RegistrarUsu')} className="btn btn-secondary float-right">
                          Registrar otro usuario
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
}

export default ConsultarUsu;
