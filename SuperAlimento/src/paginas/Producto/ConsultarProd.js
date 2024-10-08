import useDataTable from '../../hooks/useDataTable';
import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; // Importa el componente correctamente
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const ConsultarProd = () => {
  const tableRef1 = useRef(null);
  const [productos, setProducto] = useState([]);
  useDataTable(tableRef1, productos); // Pasar los datos al hook
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/producto/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProducto(data);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Error al obtener los productos',
            icon: 'error',
            confirmButtonColor: '#4caf50',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: `Error en la solicitud: ${error.message}`,
          icon: 'error',
          confirmButtonColor: '#4caf50',
        });
      }
    };

    fetchProducto();
  }, [rol, token]);

  const handleEstado = async (id_producto) => {
    try {
      const response = await fetch(`http://localhost:3001/api/producto/estado/${id_producto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
        body: JSON.stringify({ estado: 'Desactivo' }),
      });

      if (response.ok) {
        setProducto(productos.filter(producto => producto.id_producto !== id_producto));
        Swal.fire({
          title: 'Éxito',
          text: 'Producto desactivado correctamente',
          icon: 'success',
          confirmButtonColor: '#4caf50',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al cambiar el estado del producto',
          icon: 'error',
          confirmButtonColor: '#4caf50',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: `Error en la solicitud: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#4caf50',
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
                    <h3 className="card-title">Productos</h3>
                  </div>
                  <div className="card-body table-responsive p-0">
                    {productos.length === 0 ? (
                      <p>No hay datos en esta tabla</p>
                    ) : (
                      <table ref={tableRef1} className="table table-hover text-nowrap">
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Código</th>
                            <th>Nombre de producto</th>
                            <th>Código de barras</th>
                            <th>Precio de compra</th>
                            <th>Precio de venta</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Actualizar</th>
                            <th>Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((producto) => (
                            producto.estado !== 'Desactivo' && (
                              <tr key={producto.id_producto}>
                                <td>
                                  <img
                                    src={`http://localhost:3001/uploads/${producto.imagen}`}
                                    alt={producto.nombre_producto}
                                    width="50"
                                    height="50"
                                  />
                                </td>
                                <td>{producto.id_producto}</td>
                                <td>{producto.nombre_producto}</td>
                                <td>{producto.codigo_barras}</td>
                                <td>{producto.precio_compra}</td>
                                <td>{producto.precio_venta}</td>
                                <td>{producto.descripcion_producto}</td>
                                <td>{producto.cantidad}</td>
                                <td><Link to={`/ActualizarProd/${producto.id_producto}`} className="btn btn-warning">Actualizar</Link></td>
                                <td>
                                  <button 
                                    className="btn btn-danger"
                                    onClick={() => handleEstado(producto.id_producto)}
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
                  <div className="card-header">
                    <Link to="#" className="btn btn-secondary mr-2">Generar reporte de productos</Link>
                    <Link to="#" className="btn btn-secondary">Generar reporte productos próximos de caducidad</Link>
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

export default ConsultarProd;
