import React, { useState, useEffect, useRef } from 'react'; 
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import useDataTable from '../../hooks/useDataTable';
import Swal from 'sweetalert2'; // Importación de SweetAlert

const ConsultarProve = () => {
    const tableRef = useRef(null);
    const [proveedores, setProveedores] = useState([]);
    const [showInactivos, setShowInactivos] = useState(false); // Estado para alternar entre proveedores activos/inactivos

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

    const handleEstado = async (id_proveedor, estadoActual) => {
        try {
          const token = localStorage.getItem('token');
          const rol = localStorage.getItem('Rol');
          const nuevoEstado = estadoActual === 'Activo' ? 'Desactivo' : 'Activo'; // Cambia el estado

          const response = await fetch(`http://localhost:3001/api/proveedor/estado/${id_proveedor}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol,
            },
            body: JSON.stringify({ estado: nuevoEstado }), 
          });
    
          if (response.ok) {
            setProveedores((prev) =>
              prev.map((proveedor) =>
                proveedor.id_proveedor === id_proveedor
                  ? { ...proveedor, estado: nuevoEstado }
                  : proveedor
              )
            );
            Swal.fire({
              icon: 'success',
              title: `Proveedor ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'}`,
              text: `El proveedor se ha ${nuevoEstado === 'Activo' ? 'activado' : 'desactivado'} exitosamente.`,
              confirmButtonColor: '#28a745', 
            });
            window.location.reload(); // Refrescar la página después de hacer el cambio
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al cambiar el estado del proveedor.',
              confirmButtonColor: '#28a745',
            });
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error en la solicitud',
            text: error.message,
            confirmButtonColor: '#28a745', 
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
                      <h3 className="card-title">Proveedores</h3>
                      {/* Botón para alternar entre activos e inactivos */}
                      <button 
                        className="btn btn-info float-right"
                        onClick={() => setShowInactivos(!showInactivos)}>
                        {showInactivos ? 'Mostrar Activos' : 'Mostrar Inactivos'}
                      </button>
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
                              <th>Estado</th>
                              <th>Actualizar</th>
                              <th>Cambiar Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {proveedores
                              .filter((proveedor) => 
                                showInactivos 
                                  ? proveedor.estado === 'Desactivo' 
                                  : proveedor.estado === 'Activo'
                              )
                              .map((proveedor) => (
                                <tr key={proveedor.id_proveedor}>
                                  <td>{proveedor.id_proveedor}</td>
                                  <td>{proveedor.nombre_proveedor}</td>
                                  <td>{proveedor.numero_documento}</td>
                                  <td>{proveedor.tipo_documento}</td>
                                  <td>{proveedor.telefono_proveedor}</td>
                                  <td>{proveedor.correo_proveedor}</td>
                                  <td>{proveedor.estado}</td>
                                  <td>
                                    <Link to={`/ActualizarProve/${proveedor.id_proveedor}`} className="btn btn-warning">
                                      Actualizar
                                    </Link>
                                  </td>
                                  <td>
                                    <button 
                                      className="btn btn-danger"
                                      onClick={() => handleEstado(proveedor.id_proveedor, proveedor.estado)}
                                    >
                                      {proveedor.estado === 'Activo' ? 'Desactivar' : 'Activar'}
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

export default ConsultarProve;
