import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

const ConsultarProd = () => {
  const tableRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false); 
  const [busqueda, setBusqueda] = useState('');
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  const [orden, setOrden] = useState({ campo: 'id_producto', direccion: 'asc' });
  
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/producto/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        } else {
          Swal.fire('Error', 'Error al obtener los productos', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };
/* eslint-disable no-mixed-operators */
    fetchProductos();
  }, [rol, token]);

  const handleEstado = async (id_producto, estadoActual) => {
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
          const response = await fetch(`http://localhost:3001/api/producto/estado/${id_producto}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol, 
            },
            body: JSON.stringify({ estado: nuevoEstado }), 
          });
          if (response.ok) {
            setProductos(productos.map(producto => 
              producto.id_producto === id_producto ? { ...producto, estado: nuevoEstado } : producto
            ));
            Swal.fire({
              title: '¡Estado cambiado!',
              text: `El producto ha sido cambiado a ${nuevoEstado}.`,
              icon: 'success',
              confirmButtonColor: '#28a745', 
            }).then(() => window.location.reload()); 
          } else {
            Swal.fire('Error', 'Error al cambiar el estado del producto', 'error');
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

  const productosFiltrados = productos.filter(producto => {
    const estadoProducto = mostrarInactivos ? 'Desactivo' : 'Activo';
    const esEstadoValido = producto.estado === estadoProducto;

    const nombre = producto.nombre_producto; 
    const id = producto.id_producto;

    const busquedaValida = 
        (nombre && nombre.toLowerCase().includes(busqueda.toLowerCase())) || 
        (id && id.toString().includes(busqueda));
    return esEstadoValido && busquedaValida;
});


  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const productosMostrados = productosFiltrados
      .sort((a, b) => {
          if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
          if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
          return 0;
      })
      .slice(indicePrimerRegistro, indiceUltimoRegistro);

  const totalPaginas = Math.ceil(productosFiltrados.length / registrosPorPagina);

  const manejarOrden = (campo) => {
    const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
    setOrden({ campo, direccion: nuevaDireccion });
  };
  const generarReporte = () => {
    const doc = new jsPDF('p', 'pt', 'a4');

    const logo = new Image();
    logo.src = '../../dist/img/SuperAlimento.png';

    logo.onload = () => {
        doc.addImage(logo, 'PNG', 40, 30, 50, 50); 
        doc.setFontSize(18);
        doc.text('SuperAlimento', 150, 60); 

        doc.setFontSize(14);
        doc.text('Reporte de Productos', 40, 100);

        const headers = [['Imagen', 'Nombre', 'Código de Barras', 'Precio Compra', 'Precio Venta', 'Cantidad']];

        // Filtra los productos que están activos
        const productosActivos = productos.filter(producto => producto.estado === 'Activo');

        // Mapea solo los productos activos
        const data = productosActivos.map((producto) => [
            '', 
            producto.nombre_producto,
            producto.codigo_barras,
            producto.precio_compra.toFixed(2),
            producto.precio_venta.toFixed(2),
            producto.cantidad
        ]);

        doc.autoTable({
            head: headers,
            body: data,
            startY: 120, 
            styles: { fontSize: 8 }, 
            headStyles: {
                fillColor: [34, 139, 34], 
                textColor: [255, 255, 255], 
            },
            didDrawCell: (data) => {
                if (data.column.index === 0 && data.cell.section === 'body') {
                    const imgUrl = `http://localhost:3001/uploads/${productosActivos[data.row.index].imagen}`;
                    const img = new Image();
                    img.src = imgUrl;

                    img.onload = () => {
                        doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 30, 30); 
                        if (data.row.index === productosActivos.length - 1) {
                            doc.save('reporte_productos.pdf'); 
                        }
                    };
                }
            },
        });
        if (productosActivos.every(p => !p.imagen)) {
            doc.save('reporte_productos.pdf');
        }
    };
  }
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
                        placeholder="Buscar producto"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ width: '200px' }} 
                      />
                    </div>
                    {productosFiltrados.length === 0 ? (
                      <p>No hay datos en esta tabla</p>
                    ) : (
                      <>
                        <table ref={tableRef} className="table table-hover text-nowrap">
                          <thead>
                            <tr>
                              <th>Imagen</th>
                              <th>Código</th>
                              <th onClick={() => manejarOrden('nombre')}>
                                Nombre de Producto {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '▲' : '▼')}
                              </th>
                              <th>Código de barras</th>
                              <th>Precio de compra</th>
                              <th>Precio de venta</th>
                              <th>Descripción</th>
                              <th>Cantidad</th>
                              <th>Actualizar</th>
                              <th>Cambiar Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productosMostrados.map((producto) => (
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
                                 className={`btn ${producto.estado === 'Activo' ? 'btn-danger' : 'btn-success'}`}
                                 onClick={() => handleEstado(producto.id_producto, producto.estado)}
                               >
                                 {producto.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                               </button>
                             </td>
                           </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="text-left">
                          <p>
                            Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, productosFiltrados.length)} de {productosFiltrados.length} registros
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <nav aria-label="Page navigation" className="text-center">
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
                    <button onClick={generarReporte} className="btn btn-secondary mr-2">Generar reporte de productos</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
};

export default ConsultarProd;
