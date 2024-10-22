import React, { useState, useEffect, useRef } from 'react';   
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const ConsultarVent = () => {
    const tableRef = useRef(null);
    const [ventas, setVentas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);
    const [orden, setOrden] = useState({ campo: 'id_venta', direccion: 'asc' });

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/venta/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setVentas(data);
                } else {
                    Swal.fire('Error', 'Error al obtener las ventas', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error en la solicitud', 'error');
            }
        };
        fetchVentas();
    }, [rol, token]);

    console.log('Valor de búsqueda:', busqueda);

    const ventasFiltradas = ventas.filter(venta => 
        venta.id_venta.toString().includes(busqueda)
    );


    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const ventasMostradas = ventasFiltradas
        .sort((a, b) => {
            if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
            if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
        })
        .slice(indicePrimerRegistro, indiceUltimoRegistro);

    const totalPaginas = Math.ceil(ventasFiltradas.length / registrosPorPagina);

    const manejarOrden = (campo) => {
        const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
        setOrden({ campo, direccion: nuevaDireccion });
    };

    return (
        <div>
            <Navegacion>
                <div className="card card-secondary">
                    <div className="card-body colorFondo">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Ventas</h3>
                                    </div>
                                    <div className="card-body table-responsive p-0">
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
                                        <div className="input-group mb-3">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm rounded-pill ml-2 mr-2" 
                                                placeholder="Buscar venta"
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                                style={{ width: '200px' }} 
                                            />
                                        </div>
                                        {ventasFiltradas.length === 0 ? (
                                            <p>No hay datos en esta tabla</p>
                                        ) : (
                                            <>
                                                <table ref={tableRef} className="table table-hover text-nowrap">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => manejarOrden('id_venta')}>
                                                                Id de Venta {orden.campo === 'id_venta' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('fecha_venta')}>
                                                                Fecha de Venta {orden.campo === 'fecha_venta' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('metodo_pago')}>
                                                                Método de Pago {orden.campo === 'metodo_pago' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('caja')}>
                                                                Caja {orden.campo === 'caja' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('total_venta')}>
                                                                Total de Venta {orden.campo === 'total_venta' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('numero_documento')}>
                                                                Realizada por {orden.campo === 'numero_documento' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th>Detalle</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ventasMostradas.map((venta) => (
                                                            <tr key={venta.id_venta}>
                                                                <td>{venta.id_venta}</td>
                                                                <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                                                                <td>{venta.metodo_pago}</td>
                                                                <td>{venta.caja}</td>
                                                                <td>{venta.total_venta}</td>
                                                                <td>{venta.numero_documento}</td>
                                                                <td>
                                                                    <Link to={`/DetallesVenta/${venta.id_venta}`} className="btn btn-info">
                                                                        Ver Detalle
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <nav aria-label="Page navigation" className="text-center">
                                    <div className="text-left">
                                        <p>
                                            Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, ventasFiltradas.length)} de {ventasFiltradas.length} registros
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
                            </div>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
}

export default ConsultarVent;
