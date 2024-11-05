import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {useNavigate } from 'react-router-dom';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import Swal from 'sweetalert2';

const ConsultarSoli = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const tableRef = useRef(null);
    const [busqueda, setBusqueda] = useState('');
    const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);
    const navigate = useNavigate();
    const [orden, setOrden] = useState({ campo: 'id_solicitud', direccion: 'asc' });

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/solicitud/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setSolicitudes(data);
                } else {
                    Swal.fire('Error', 'Error al obtener las solicitudes', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error en la solicitud', 'error');
            }
        };

        fetchSolicitudes();
    }, [rol, token]);

    const manejarOrden = (campo) => {
        const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
        setOrden({ campo, direccion: nuevaDireccion });
    };

    const solicitudesFiltradas = solicitudes.filter(solicitud =>
        solicitud.id_solicitud.toString().includes(busqueda)
    );

    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const solicitudesMostradas = solicitudesFiltradas
        .sort((a, b) => {
            if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
            if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
        })
        .slice(indicePrimerRegistro, indiceUltimoRegistro);

    const totalPaginas = Math.ceil(solicitudesFiltradas.length / registrosPorPagina);
    const handleAceptarEntrega = async (id) => {
        const { value: formValues } = await Swal.fire({
            title: 'Ingresar Lote y Fecha de Vencimiento',
            html:
                '<div><p>Lote</p></div>' +
                '<input id="lote" class="swal2-input" placeholder="Lote">' +
                '<div><p>Fecha de vencimiento</p></div>' +
                '<input id="fecha_vencimiento" type="date" class="swal2-input">',
            focusConfirm: false,
            confirmButtonText: 'Agregar',
            confirmButtonColor: '#28a745', 
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#6c757d', 
            showCancelButton: true, 
            preConfirm: () => {
                const lote = document.getElementById('lote').value;
                const fechaVencimiento = document.getElementById('fecha_vencimiento').value;
                if (!lote || !fechaVencimiento) {
                    Swal.showValidationMessage('Por favor, ingresa ambos valores');
                }
                return { lote, fechaVencimiento };
            }
        });

        if (formValues) {
            try {
                const response = await fetch(`http://localhost:3001/api/solicitud/aceptar-entrega/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                    body: JSON.stringify({
                        lote: formValues.lote,
                        fecha_vencimiento: formValues.fechaVencimiento,
                    })
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Entrega Aceptada',
                        text: 'Los productos han sido actualizados exitosamente.',
                        confirmButtonColor: '#28a745',
                    });

                    setSolicitudes(prevSolicitudes =>
                        prevSolicitudes.map(solicitud =>
                            solicitud.id_solicitud === id
                                ? { ...solicitud, estado_solicitud: 'Aprobada' }
                                : solicitud
                        )
                    );
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al aceptar la entrega.',
                        confirmButtonColor: '#28a745',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la solicitud',
                    text: error.message,
                    confirmButtonColor: '#28a745',
                });
            }
        }
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
                                        <h3 className="card-title">Solicitudes</h3>
                                    </div>
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
                                                placeholder="Buscar solicitud"
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                            />
                                        </div>
                                    <div className="card-body table-responsive p-0">
                                        {solicitudesFiltradas.length === 0 ? (
                                            <p>No hay datos en esta tabla</p>
                                        ) : (
                                            <table ref={tableRef} className="table table-hover text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th onClick={() => manejarOrden('id_solicitud')}>
                                                            Id de Solicitud {orden.campo === 'id_solicitud' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                        </th>
                                                        <th onClick={() => manejarOrden('fecha_entrada')}>
                                                            Fecha Entrada {orden.campo === 'fecha_entrada' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                        </th>
                                                        <th onClick={() => manejarOrden('estado_solicitud')}>
                                                            Estado de Solicitud {orden.campo === 'estado_solicitud' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                        </th>
                                                        <th onClick={() => manejarOrden('precio_total')}>
                                                            Precio Total {orden.campo === 'precio_total' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                        </th>
                                                        <th>Observación</th>
                                                        <th>Registrado por</th>
                                                        <th>Aceptar Entrega</th>
                                                        <th>Ver Detalles</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {solicitudesMostradas.map((solicitud) => (
                                                        <tr key={solicitud.id_solicitud}>
                                                            <td>{solicitud.id_solicitud}</td>
                                                            <td>{new Date(solicitud.fecha_entrada).toLocaleDateString()}</td>
                                                            <td>{solicitud.estado_solicitud}</td>
                                                            <td>{solicitud.precio_total}</td>
                                                            <td>{solicitud.observacion}</td>
                                                            <td>{solicitud.numero_documento}</td>
                                                            <td>
                                                                <button
                                                                    onClick={() => handleAceptarEntrega(solicitud.id_solicitud)}
                                                                    className="btn btn-success"
                                                                    disabled={solicitud.estado_solicitud === 'Aprobada'}
                                                                >
                                                                    {solicitud.estado_solicitud === 'Aprobada' ? 'Entrega Aceptada' : 'Aceptar Entrega'}
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <Link to={`/DetallesSolicitud/${solicitud.id_solicitud}`}>
                                                                    <button className="btn btn-info">Ver</button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                                <nav aria-label="Page navigation" className="text-center">
                                    <div className="text-left">
                                        <p>
                                            Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, solicitudesFiltradas.length)} de {solicitudesFiltradas.length} registros
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
                                <div className="card-header">
                                    <button onClick={() => navigate('/RegistrarSoli')} className="btn btn-secondary float-right">
                                    Registrar otra solicitud
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
}

export default ConsultarSoli;
