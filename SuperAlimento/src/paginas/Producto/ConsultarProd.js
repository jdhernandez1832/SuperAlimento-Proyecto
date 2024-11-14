import React, { useState, useEffect, useRef } from 'react';
import {useNavigate } from 'react-router-dom';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import Select from 'react-select'; 

const ConsultarProd = () => {
  const tableRef = useRef(null);
  const [productos, setProductos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false); 
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState([]); // Estado para las categorías
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  const navigate = useNavigate();
  const [orden, setOrden] = useState({ campo: 'id_producto', direccion: 'asc' });
  
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://superalimento-proyecto.onrender.com/api/categoria/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const categoriasActivas = data.filter(categoria => categoria.estado !== 'Desactivo');
          setCategorias(categoriasActivas);
        } else {
          console.error('Error al obtener categorías:', response.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };
    fetchCategorias();
  }, [token, rol]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('https://superalimento-proyecto.onrender.com/api/producto/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (response.ok) {
          const data = await response.json();
  
          // Para cada producto, obtenemos la cantidad
          const productosConCantidad = await Promise.all(data.map(async (producto) => {
            const cantidadResponse = await fetch(`https://superalimento-proyecto.onrender.com/api/producto/cantidad/${producto.id_producto}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'X-Rol': rol,
              },
            });
            const cantidadData = await cantidadResponse.json();
            return { ...producto, cantidad: cantidadData.cantidad }; // Añadimos la cantidad al producto
          }));
  
          setProductos(productosConCantidad);
        } else {
          Swal.fire('Error', 'Error al obtener los productos', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };
  
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
          const response = await fetch(`https://superalimento-proyecto.onrender.com/api/producto/estado/${id_producto}`, {
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
    
    // Verificamos si hay una categoría seleccionada y si coincide con la del producto
    const coincideCategoria = categoriaSeleccionada 
      ? producto.id_categoria === parseInt(categoriaSeleccionada) 
      : true;
  
    const busquedaValida = producto.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.id_producto.toString().includes(busqueda);
  
    return esEstadoValido && busquedaValida && coincideCategoria;
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
    console.log('Generando reporte...');
    const doc = new jsPDF('p', 'pt', 'a4');
  
    const logo = new Image();
    logo.src = '../../dist/img/SuperAlimento.png';
  
    logo.onload = () => {
      console.log('Logo cargado');
  
      doc.addImage(logo, 'PNG', 40, 30, 50, 50);
      doc.setFontSize(18);
      doc.text('SuperAlimento', 150, 60);
  
      doc.setFontSize(14);
      doc.text('Reporte de Productos', 40, 100);
  
      const headers = [['Imagen', 'Nombre', 'Código de Barras', 'Precio Compra', 'Precio Venta', 'Cantidad', 'Categoría']];
  
      const productosActivos = productos.filter(producto => producto.estado === 'Activo');
      console.log('Productos activos:', productosActivos);
  
      const data = productosActivos.map((producto) => {
        const categoria = categorias.find(c => c.id_categoria === producto.id_categoria);
        return [
          '', // Dejar vacía la imagen si no se desea incluir en la tabla
          producto.nombre_producto,
          producto.codigo_barras,
          producto.precio_compra.toFixed(2),
          producto.precio_venta.toFixed(2),
          producto.cantidad,
          categoria ? categoria.nombre : 'Sin categoría',
        ];
      });
  
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
            const imgUrl = productosActivos[data.row.index].imagen; // Imagen de Cloudinary
            const img = new Image();
            img.src = imgUrl;
  
            img.onload = () => {
              console.log('Imagen cargada para el producto:', imgUrl);
              doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 30, 30); 
              if (data.row.index === productosActivos.length - 1) {
                console.log('Generando PDF...');
                doc.save('reporte_productos.pdf');
              }
            };
  
            img.onerror = (error) => {
              console.error('Error al cargar la imagen:', error);
            };
          }
        },
      });
  
      // Caso en que no haya imagen
      if (productosActivos.every(p => !p.imagen)) {
        doc.save('reporte_productos.pdf');
      }
    };
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
                      <Select
                        options={categorias.map(categoria => ({
                          value: categoria.id_categoria,
                          label: categoria.nombre
                        }))}
                        value={categorias.find(categoria => categoria.id_categoria === categoriaSeleccionada) 
                                ? { value: categoriaSeleccionada, label: categorias.find(categoria => categoria.id_categoria === categoriaSeleccionada).nombre } 
                                : null}
                        onChange={(seleccion) => setCategoriaSeleccionada(seleccion ? seleccion.value : null)}
                        placeholder="Seleccione una categoría a buscar"
                        isClearable
                        classNamePrefix="select"
                        className="ml-2 mr-2"
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
                              <th onClick={() => manejarOrden('nombre')}>
                                Nombre de Producto {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '▲' : '▼')}
                              </th>
                              <th>Código de barras</th>
                              <th>Precio de compra</th>
                              <th>Precio de venta</th>
                              <th>Descripción</th>
                              <th>Categoría</th>
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
                                  src={producto.imagen}  // Aquí usamos directamente la URL de Cloudinary
                                  alt={producto.nombre_producto}
                                  width="50"
                                  height="50"
                                />
                              </td>
                             <td>{producto.nombre_producto}</td>
                             <td>{producto.codigo_barras}</td>
                             <td>{producto.precio_compra}</td>
                             <td>{producto.precio_venta}</td>
                             <td>{producto.descripcion_producto}</td>
                             <td>{categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre|| 'Sin categoría'}</td>
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
                    <button onClick={() => navigate('/RegistrarProd')} className="btn btn-secondary float-right">
                      Registrar otro producto
                    </button>
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