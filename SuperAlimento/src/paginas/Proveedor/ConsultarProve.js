import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import useDataTable from '../../hooks/useDataTable';

const ConsultarProve = () => {
    const tableRef = useRef(null);
    const [proveedores, setProveedores] = useState([]);

    useDataTable(tableRef, proveedores); // Pasar los datos al hook

    useEffect(() => {
      const fetchProveedores = async () => {
        try {
          const token = localStorage.getItem('token');
          const rol = localStorage.getItem('Rol');

          const response = await fetch('http://localhost:3001/api/proveedor/todos', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setProveedores(data);
          } else {
            console.error('Error al obtener los proveedores');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };

      fetchProveedores();
    }, []);

    const handleEstado = async (id_proveedor) => {
        try {
          const token = localStorage.getItem('token');
          const rol = localStorage.getItem('Rol');

          const response = await fetch(`http://localhost:3001/api/proveedor/estado/${id_proveedor}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol,
            },
            body: JSON.stringify({ estado: 'Desactivo' }), // Cambia el estado a 'Desactivo'
          });
    
          if (response.ok) {
            setProveedores(proveedores.filter(proveedor => proveedor.id_proveedor !== id_proveedor));
            window.alert('Proveedor desactivado');
          } else {
            console.error('Error al cambiar el estado del proveedor');
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
                      <h3 className="card-title">Proveedores</h3>
                    </div>
                    <div className="card-body table-responsive p-0">
                      {proveedores.length === 0 ? (
                        <p>No hay datos en esta tabla</p>
                      ) : (
                        <table ref={tableRef} className="table table-hover text-nowrap">
                          <thead>
                            <tr>
                              <th>Id de proveedor</th>
                              <th>Nombre de proveedor</th>
                              <th>Numero de documento</th>
                              <th>Tipo de documento</th>
                              <th>Telefono</th>
                              <th>Email</th>
                              <th>Actualizar</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proveedores.map((proveedor) => (
                              proveedor.estado !== 'Desactivo' && ( // Solo muestra proveedores activos
                                <tr key={proveedor.id_proveedor}>
                                  <td>{proveedor.id_proveedor}</td>
                                  <td>{proveedor.nombre_proveedor}</td>
                                  <td>{proveedor.numero_documento}</td>
                                  <td>{proveedor.tipo_documento}</td>
                                  <td>{proveedor.telefono_proveedor}</td>
                                  <td>{proveedor.correo_proveedor}</td>
                                  <td>
                                    <Link to={`/ActualizarProve/${proveedor.id_proveedor}`} className="btn btn-warning">
                                      Actualizar
                                    </Link>
                                  </td>
                                  <td>
                                    <button 
                                      className="btn btn-danger"
                                      onClick={() => handleEstado(proveedor.id_proveedor)}
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

export default ConsultarProve;
