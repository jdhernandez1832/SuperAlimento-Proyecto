import React, { useState, useEffect, useRef } from 'react'; 
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ConsultarProve = () => {
    const tableRef = useRef(null);
    const [proveedores, setProveedores] = useState([]);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);
    const navigate = useNavigate();
    const [orden, setOrden] = useState({ campo: 'id_proveedor', direccion: 'asc' });

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch('https://superalimento-proyecto.onrender.com/api/proveedor/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProveedores(data);
                } else {
                    Swal.fire('Error', 'Error al obtener los proveedores', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error en la solicitud', 'error');
            }
        };
        fetchProveedores();
    }, [rol, token]);

    const handleEstado = async (id_proveedor, estadoActual) => {
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
                    const response = await fetch(`https://superalimento-proyecto.onrender.com/api/proveedor/estado/${id_proveedor}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'X-Rol': rol,
                        },
                        body: JSON.stringify({ estado: nuevoEstado }),
                    });
                    if (response.ok) {
                        setProveedores(proveedores.map(proveedor => 
                            proveedor.id_proveedor === id_proveedor ? { ...proveedor, estado: nuevoEstado } : proveedor
                        ));
                        Swal.fire({
                            title: '¡Estado cambiado!',
                            text: `El proveedor ha sido cambiado a ${nuevoEstado}.`,
                            icon: 'success',
                            confirmButtonColor: '#28a745',
                        }).then(() => window.location.reload());
                    } else {
                        Swal.fire('Error', 'Error al cambiar el estado del proveedor', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Error en la solicitud', 'error');
                }
            }
        });
    };

    const toggleInactivas = () => {
        setMostrarInactivos(!mostrarInactivos);
    };

    const proveedoresFiltrados = proveedores
    .filter(proveedor => 
        (mostrarInactivos ? proveedor.estado === 'Desactivo' : proveedor.estado === 'Activo') &&
        ((proveedor.nombre_proveedor && proveedor.nombre_proveedor.toLowerCase().includes(busqueda.toLowerCase())) || 
         proveedor.id_proveedor.toString().includes(busqueda))
    );


    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const proveedoresMostrados = proveedoresFiltrados
        .sort((a, b) => {
            if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
            if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
        })
        .slice(indicePrimerRegistro, indiceUltimoRegistro);

    const totalPaginas = Math.ceil(proveedoresFiltrados.length / registrosPorPagina);

    const manejarOrden = (campo) => {
        const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
        setOrden({ campo, direccion: nuevaDireccion });
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
                                        <button onClick={toggleInactivas} className="btn btn-info float-right">
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
                                                placeholder="Buscar proveedor"
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                                style={{ width: '200px' }} 
                                            />
                                        </div>
                                        {proveedoresFiltrados.length === 0 ? (
                                            <p>No hay datos en esta tabla</p>
                                        ) : (
                                            <>
                                                <table ref={tableRef} className="table table-hover text-nowrap">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => manejarOrden('id_proveedor')}>
                                                                Id de Proveedor {orden.campo === 'id_proveedor' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('nombre')}>
                                                            Nombre de Proveedor {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th>Numero de documento</th>
                                                            <th>Tipo de documento</th>
                                                            <th>Telefono</th>
                                                            <th>Email</th>
                                                          
                                                            <th onClick={() => manejarOrden('estado')}>
                                                                Estado {orden.campo === 'estado' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th>Actualizar</th>
                                                            <th>Cambiar Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {proveedoresMostrados.map((proveedor) => (
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
                                                                        className={`btn ${proveedor.estado === 'Activo' ? 'btn-danger' : 'btn-success'}`}
                                                                        onClick={() => handleEstado(proveedor.id_proveedor, proveedor.estado)}
                                                                    >
                                                                        {proveedor.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                                                    </button>
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
                                            Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, proveedoresFiltrados.length)} de {proveedoresFiltrados.length} registros
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
                                                className={`btn ${paginaActual === index + 1 ? 'btn-secondary' : 'btn-secondary'}`}
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
                                    <button onClick={() => navigate('/RegistrarProve')} className="btn btn-secondary float-right">
                                    Registrar otro proveedor
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

export default ConsultarProve;
