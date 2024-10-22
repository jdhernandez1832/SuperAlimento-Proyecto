import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import useDataTable from '../../hooks/useDataTable';
import Swal from 'sweetalert2'; // Importar SweetAlert

const ConsultarUsu = () => {
  const tableRef1 = useRef(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false); // Estado para alternar entre usuarios activas e inactivas

  useDataTable(tableRef1, usuarios); // Pasar los datos al hook

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('Rol');

        const response = await fetch('http://localhost:3001/api/usuario/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol, // Agregar el token en los encabezados
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al obtener los usuarios',
            confirmButtonColor: '#28a745', // Color verde
          });
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error en la solicitud: ${error}`,
          confirmButtonColor: '#28a745', // Color verde
        });
      }
    };

    fetchUsuarios();
  }, []);

  const handleEstado = async (numero_documento, estadoActual) => {
    try {
      const token = localStorage.getItem('token');
      const rol = localStorage.getItem('Rol');
      const nuevoEstado = estadoActual === 'Activo' ? 'Desactivo' : 'Activo'; // Alternar estado

      const response = await fetch(`http://localhost:3001/api/usuario/estado/${numero_documento}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol, // Agregar el token en los encabezados
        },
        body: JSON.stringify({ estado: nuevoEstado }), // Cambia el estado
      });

      if (response.ok) {
        // Refrescar la lista de usuarios después de actualizar el estado
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `Usuario ${nuevoEstado === 'Activo' ? 'Activado' : 'Desactivado'}`,
          confirmButtonColor: '#28a745', // Color verde
        });
        // Recargar la página
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cambiar el estado del usuario',
          confirmButtonColor: '#28a745', // Color verde
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en la solicitud: ${error}`,
        confirmButtonColor: '#28a745', // Color verde
      });
    }
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
                    <button
                      className="btn btn-info float-right"
                      onClick={() => setMostrarInactivos(!mostrarInactivos)} // Alternar entre activas e inactivas
                    >
                      {mostrarInactivos ? 'Mostrar Activos' : 'Mostrar Inactivos'}
                    </button>
                  </div>
                  <div className="card-body table-responsive p-0">
                    {usuarios.length === 0 ? (
                      <p>No hay datos en esta tabla</p>
                    ) : (
                      <table ref={tableRef1} className="table table-hover text-nowrap">
                        <thead>
                          <tr>
                            <th>Numero de documento</th>
                            <th>Nombre</th>
                            <th>Tipo de documento</th>
                            <th>Email</th>
                            <th>Telefono</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Actualizar</th>
                            <th>Cambiar Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios
                            .filter(usuario => 
                              mostrarInactivos
                                ? usuario.estado === 'Desactivo'
                                : usuario.estado === 'Activo'
                            )
                            .map((usuario) => (
                              <tr key={usuario.numero_documento}>
                                <td>{usuario.numero_documento}</td>
                                <td>{usuario.nombre_usuario}</td>
                                <td>{usuario.tipo_documento}</td>
                                <td>{usuario.correo_usuario}</td>
                                <td>{usuario.telefono_usuario}</td>
                                <td>{usuario.id_rol}</td>
                                <td>{usuario.estado}</td>
                                <td>
                                  <Link to={`/ActualizarUsu/${usuario.numero_documento}`} className="btn btn-warning">
                                    Actualizar
                                  </Link>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleEstado(usuario.numero_documento, usuario.estado)}
                                  >
                                    {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
};

export default ConsultarUsu;
