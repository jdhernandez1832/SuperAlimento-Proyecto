import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import useDataTable from '../../hooks/useDataTable';
import Swal from 'sweetalert2'; // Importar SweetAlert

const ConsultarUsu = () => {
    const tableRef1 = useRef(null);
    const [usuarios, setUsuarios] = useState([]);

    useDataTable(tableRef1, usuarios); // Pasar los datos al hook

    useEffect(() => {
      const fetchUsuarios = async () => {
        try {
          // Obtener el token del almacenamiento local
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
  
    const handleEstado = async (numero_documento) => {
      try {
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('Rol');

        const response = await fetch(`http://localhost:3001/api/usuario/estado/${numero_documento}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol, // Agregar el token en los encabezados
          },
          body: JSON.stringify({ estado: 'Desactivo' }), // Cambia el estado a 'Desactivo'
        });
    
        if (response.ok) {
          // eslint-disable-next-line no-unused-vars
          const usuarioActualizado = await response.json();
          setUsuarios(usuarios.filter(usuario => 
            usuario.numero_documento !== numero_documento
          ));
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario Eliminado',
            confirmButtonColor: '#28a745', // Color verde
          });
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
                              <th>Actualizar</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuarios.map((usuario) => (
                              usuario.estado !== 'Desactivo' && ( // Solo muestra usuarios activos
                                <tr key={usuario.numero_documento}>
                                  <td>{usuario.numero_documento}</td>
                                  <td>{usuario.nombre_usuario}</td>
                                  <td>{usuario.tipo_documento}</td>
                                  <td>{usuario.correo_usuario}</td>
                                  <td>{usuario.telefono_usuario}</td>
                                  <td>{usuario.id_rol}</td>
                                  <td><Link to={`/ActualizarUsu/${usuario.numero_documento}`} className="btn btn-warning">Actualizar</Link></td>
                                  <td>
                                    <button 
                                      className="btn btn-danger"
                                      onClick={() => handleEstado(usuario.numero_documento)}
                                    >
                                      Eliminar
                                    </button>
                                  </td>
                                </tr>
                              )
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
