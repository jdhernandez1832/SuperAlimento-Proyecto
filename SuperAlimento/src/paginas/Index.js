/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/jquery/jquery.min.js';
import { useParams, useNavigate } from 'react-router-dom';
import 'chart.js/auto'; 
import { Line } from 'react-chartjs-2';
import 'admin-lte/dist/js/adminlte.min.js';
import Navegacion from './../componentes/componentes/navegacion';
import "../componentes/css/Login.css"; 
import Swal from 'sweetalert2';


const VentaList = () => {
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const navigate = useNavigate();
  const [gananciasTotales, setGananciasTotales] = useState(0);
  const [solicitudes, setSolicitudes] = useState([]); 
  const [totalSolicitudes, setTotalSolicitudes] = useState(0); 
  const [totalGastoSolicitudes, setTotalGastoSolicitudes] = useState(0); 
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [ventasSemanal, setVentasSemanal] = useState({ dates: [], sales: [] });

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  console.log('Ventas Semanal:', ventasSemanal);
  
  useEffect(() => {
    const fetchProductosBajoStock = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/producto/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
  
          // Para cada producto, obtenemos la cantidad
          const productosConCantidad = await Promise.all(data.map(async (producto) => {
            const cantidadResponse = await fetch(`http://localhost:3001/api/producto/cantidad/${producto.id_producto}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'X-Rol': rol,
              },
            });
            const cantidadData = await cantidadResponse.json();
            return { ...producto, cantidad: cantidadData.cantidad }; // Añadimos la cantidad al producto
          }));
  
          // Filtrar productos bajo stock y que estén activos
          const productosFiltrados = productosConCantidad.filter(producto => 
            producto.cantidad <= 10 && producto.estado === 'Activo'
          );
  
          const productosOrdenados = productosFiltrados.sort((a, b) => a.cantidad - b.cantidad);
          const productosLimitados = productosOrdenados.slice(0, 5);
  
          setProductosBajoStock(productosLimitados);
        } else {
          Swal.fire('Error', 'Error al obtener los productos', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };
  
    fetchProductosBajoStock();
  }, [rol, token]);
  
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/venta/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVentas(data);

        const totalGanancias = data.reduce((total, venta) => {
          const totalVenta = parseFloat(venta.total_venta); 
          return total + (isNaN(totalVenta) ? 0 : totalVenta); 
        }, 0);

        setTotalVentas(data.length);
        setGananciasTotales(totalGanancias);
      } catch (error) {
        console.error('Error fetching ventas:', error);
      }
    };

    const fetchVentasSemanal = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/venta/semana', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching ventas semanales');
        }
        const data = await response.json();
    
        // Transformar fechas
        const formattedData = {
          dates: data.dates.map(date => {
            // Parsear la fecha y formatearla como yyyy-mm-dd
            const [year, month, day] = date.split('T')[0].split('-');
            return `${year}-${month}-${day}`;
          }),
          sales: data.sales,
        };
    
        setVentasSemanal(formattedData);
      } catch (error) {
        console.error('Error fetching ventas semanales:', error);
      }
    };
     
    const fetchSolicitudes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/solicitud/todos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });
        const data = await response.json();
        setSolicitudes(data);

        const totalGasto = data.reduce((total, solicitud) => {
          const totalSolicitud = parseFloat(solicitud.precio_total);
          return total + (isNaN(totalSolicitud) ? 0 : totalSolicitud);
        }, 0);

        setTotalSolicitudes(data.length);
        setTotalGastoSolicitudes(totalGasto);
      } catch (error) {
        console.error('Error fetching solicitudes:', error);
      }
    };

    fetchVentas();
    fetchVentasSemanal()
    fetchSolicitudes();
  }, [token, rol]);

  const chartData = {
    labels: ventasSemanal.dates,
    datasets: [
      {
        label: 'Ventas',
        data: ventasSemanal.sales,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
    ],
  };
  return (
    <Navegacion>
      <div className="card card-success">
        <div className="card-body">
          <div className="container-fluid">
            <div className="row">
              {/* Tarjeta de Número de Ventas Totales */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>#{totalVentas}</h3>
                    <p>Ventas totales realizadas</p>
                  </div>
                  <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-ticket-detailed-fill" viewBox="0 0 16 16">
                          <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6zm4 1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m0 5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5M4 8a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1"/>
                        </svg> 
                      </i>
                    </div>
                </div>
              </div>
              {/* Tarjeta de Ganancias Totales */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-secondary">
                  <div className="inner">
                    <h3>${gananciasTotales.toFixed(2)}</h3>
                    <p>Ganancias totales</p>
                  </div>
                  <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-basket3" viewBox="0 0 16 16">
                          <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM3.394 15l-1.48-6h-.97l1.525 6.426a.75.75 0 0 0 .729.574h9.606a.75.75 0 0 0 .73-.574L15.056 9h-.972l-1.479 6z"/>
                        </svg>
                      </i>
                    </div>
                </div>
              </div>
              {/* Tarjeta de Abastecimientos Realizados */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>#{totalSolicitudes}</h3>
                    <p>Abastecimientos realizados</p>
                  </div>
                  <div className="icon">
                  <i>
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" class="bi bi-box-seam" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                      </svg>
                      </i>
                    </div>
                </div>
              </div>
              {/* Tarjeta de Total Gastado en Abastecimientos */}
              <div className="col-lg-3 col-6">
                <div className="small-box bg-secondary">
                  <div className="inner">
                    <h3>${totalGastoSolicitudes.toFixed(2)}</h3>
                    <p>Total gasto en abastecimientos</p>
                  </div>
                  <div className="icon">
                      <i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" className="bi bi-coin" viewBox="0 0 16 16">
                          <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                        </svg>
                      </i>
                    </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="card col-md-6">
                  <div className="card-header">
                    <h3 className="card-title">Historial de ventas</h3>
                  </div>
                  <div className="card-body">
                    <Line data={chartData} />
                  </div>
                </div>
                <div className="card col-md-6">
                <h3>Productos bajos en stock</h3>
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosBajoStock.length > 0 ? (
                        productosBajoStock.map((producto) => (
                          <tr key={producto.id_producto}>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.cantidad}</td>
                            <td>${(producto.precio_venta ? producto.precio_venta.toFixed(2) : '0.00')}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">No hay productos con bajo stock</td>
                        </tr>
                      )}
                    </tbody>
                    <div className="card-header">
                      <button onClick={() => navigate('/RegistrarSoli')} className="btn btn-secondary float-right">
                        Registrar solicitud
                      </button>
                    </div>
                  </table>
                </div>
              </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Navegacion>
  );
};

export default VentaList;