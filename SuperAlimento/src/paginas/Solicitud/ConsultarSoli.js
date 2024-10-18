import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navegacion from "../../componentes/componentes/navegacion";
import useDataTable from '../../hooks/useDataTable';
import "../../componentes/css/Login.css";
import Swal from 'sweetalert2'; 

const ConsultarSoli = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const tableRef1 = useRef(null);
    useDataTable(tableRef1, solicitudes);
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
                    console.log('Datos obtenidos:', data);
                    setSolicitudes(data);
                } else {
                    console.error('Error al obtener las solicitudes');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchSolicitudes();
    }, [rol, token]);

    const handleAceptarEntrega = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/solicitud/aceptar-entrega/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol, 
                },
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
                                    <div className="card-body table-responsive p-0">
                                        {solicitudes.length === 0 ? (
                                            <p>No hay datos en esta tabla</p>
                                        ) : (
                                            <table ref={tableRef1} className="table table-hover text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Id de solicitud</th>
                                                        <th>Fecha entrada</th>
                                                        <th>Estado de la solicitud</th>
                                                        <th>Precio total</th>
                                                        <th>Observación</th>
                                                        <th>Proveedor</th>
                                                        <th>Registrado por</th>
                                                        <th>Aceptar entrega</th>
                                                        <th>Ver Detalles</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {solicitudes.map((solicitud) => (
                                                        solicitud.estado !== 'Desactivo' && (
                                                            <tr key={solicitud.id_solicitud}>
                                                                <td>{solicitud.id_solicitud}</td>
                                                                <td>{new Date(solicitud.fecha_entrada).toLocaleDateString()}</td>
                                                                <td>{solicitud.estado_solicitud}</td>
                                                                <td>{solicitud.precio_total}</td>
                                                                <td>{solicitud.observacion}</td>
                                                                <td>{solicitud.id_proveedor}</td>
                                                                <td>{solicitud.numero_documento}</td>
                                                                <td>
                                                                    {solicitud.estado_solicitud === 'Aprobada' ? (
                                                                        <button className="btn btn-success" disabled>
                                                                            Entrega Aceptada   
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleAceptarEntrega(solicitud.id_solicitud)}
                                                                            className="btn btn-success"
                                                                        >
                                                                            Aceptar Entrega
                                                                        </button>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/DetallesSolicitud/${solicitud.id_solicitud}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-eye" viewBox="0 0 16 16">
                                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C3.885 5.21 5.833 4 8 4c2.167 0 4.115 1.21 5.168 1.957A13.133 13.133 0 0 1 14.828 8a13.133 13.133 0 0 1-1.66 2.043C12.115 10.79 10.167 12 8 12c-2.167 0-4.115-1.21-5.168-1.957A13.133 13.133 0 0 1 1.172 8z" />
                                                                            <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                                                                            <path d="M8 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                                                        </svg>
                                                                    </Link>
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
}

export default ConsultarSoli;

