import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import useDataTable from '../../hooks/useDataTable';

const ConsultarUsu = () => {
    const tableRef1 = useRef(null);
    const [usuarios, setUsuarios] = useState([]);
    useDataTable(tableRef1, usuarios); // Pasar los datos al hook
  
    useEffect(() => {
      const fetchUsuarios = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/usuario/todos');
          if (response.ok) {
            const data = await response.json();
            setUsuarios(data);
          } else {
            console.error('Error al obtener los usuarios');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };
  
      fetchUsuarios();
    }, []);
  
    const handleEstado = async (numero_documento) => {
      try {
        const response = await fetch(`http://localhost:3001/api/usuario/estado/${numero_documento}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: 'Desactivo' }), // Cambia el estado a 'Desactivo'
        });
    
        if (response.ok) {
          // eslint-disable-next-line no-unused-vars
          const usuarioActualizado = await response.json();
          setUsuarios(usuarios.filter(usuario => 
            usuario.numero_documento !== numero_documento
          ));
          window.alert('Usuario Eliminado:');
        } else {
          console.error('Error al cambiar el estado del usuario');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
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
                              <th>Clave</th>
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
                                  <td>{usuario.clave}</td>
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
