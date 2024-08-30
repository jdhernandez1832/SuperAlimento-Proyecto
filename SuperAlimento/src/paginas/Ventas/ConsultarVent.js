import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useDataTable from '../../hooks/useDataTable';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";

const ConsultarVent = () => {
    const [ventas, setVentas] = useState([]);
    const tableRef1 = useRef(null);
    useDataTable(tableRef1, ventas);
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
    useEffect(() => {
        // Función para obtener las ventas desde el backend
        const fetchVentas = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/venta/todos', {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'X-Rol': rol, // Agregar el token en los encabezados
                    },
                });  
                const data = await response.json();
                console.log('Ventas obtenidas:', data); // Verifica la respuesta
                setVentas(data);
            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };

        fetchVentas();
    }, [rol, token]);

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
                                        <div className="card-tools"></div>
                                    </div>
                                    <div className="card-body table-responsive p-0">
                                        {ventas.length === 0 ? (
                                            <p>No hay datos en esta tabla</p>
                                        ) : (
                                            <table ref={tableRef1} className="table table-hover text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>Id de venta</th>
                                                        <th>Fecha de venta</th>
                                                        <th>Metodo de pago</th>
                                                        <th>Caja</th>
                                                        <th>Total de venta</th>
                                                        <th>Realizada por</th>
                                                        <th>Detalle venta</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ventas.map((venta) => (
                                                        <tr key={venta.id_venta}>
                                                            <td>{venta.id_venta}</td>
                                                            <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                                                            <td>{venta.metodo_pago}</td>
                                                            <td>{venta.caja}</td>
                                                            <td>{venta.total_venta}</td>
                                                            <td>{venta.numero_documento}</td>
                                                            <td>
                                                                <Link to={`/DetallesVenta/${venta.id_venta}`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-eye" viewBox="0 0 16 16">
                                                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C3.885 5.21 5.833 4 8 4c2.167 0 4.115 1.21 5.168 1.957A13.133 13.133 0 0 1 14.828 8a13.133 13.133 0 0 1-1.66 2.043C12.115 10.79 10.167 12 8 12c-2.167 0-4.115-1.21-5.168-1.957A13.133 13.133 0 0 1 1.172 8z"/>
                                                                        <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                                                        <path d="M8 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                                                    </svg>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div className="card-header">
                                        <Link to="#" className="btn btn-secondary">
                                            Generar reporte de ventas
                                        </Link>
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

export default ConsultarVent;
