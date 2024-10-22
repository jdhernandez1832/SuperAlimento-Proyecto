import React, { useState, useEffect, useRef } from 'react';  
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const ConsultarCate = () => {
    const tableRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [mostrarInactivas, setMostrarInactivas] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [registrosPorPagina, setRegistrosPorPagina] = useState(5); // Cambiado a 5
    const [paginaActual, setPaginaActual] = useState(1);
    const [orden, setOrden] = useState({ campo: 'id_categoria', direccion: 'asc' });

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/categoria/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);
                } else {
                    Swal.fire('Error', 'Error al obtener las categorías', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error en la solicitud', 'error');
            }
        };
        fetchCategorias();
    }, [rol, token]);

    const handleEstado = async (id_categoria, estadoActual) => {
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
                    const response = await fetch(`http://localhost:3001/api/categoria/estado/${id_categoria}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'X-Rol': rol, 
                        },
                        body: JSON.stringify({ estado: nuevoEstado }), 
                    });
                    if (response.ok) {
                        setCategorias(categorias.map(categoria => 
                            categoria.id_categoria === id_categoria ? { ...categoria, estado: nuevoEstado } : categoria
                        ));
                        Swal.fire({
                            title: '¡Estado cambiado!',
                            text: `La categoría ha sido cambiada a ${nuevoEstado}.`,
                            icon: 'success',
                            confirmButtonColor: '#28a745', 
                        }).then(() => window.location.reload()); 
                    } else {
                        Swal.fire('Error', 'Error al cambiar el estado de la categoría', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Error en la solicitud', 'error');
                }
            }
        });
    };

    const toggleInactivas = () => {
        setMostrarInactivas(!mostrarInactivas);
    };

    const categoriasFiltradas = categorias
        .filter(categoria => 
            (mostrarInactivas ? categoria.estado === 'Desactivo' : categoria.estado === 'Activo') &&
            (categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
             categoria.id_categoria.toString().includes(busqueda))
        );

    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const categoriasMostradas = categoriasFiltradas
        .sort((a, b) => {
            if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
            if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
        })
        .slice(indicePrimerRegistro, indiceUltimoRegistro);

    const totalPaginas = Math.ceil(categoriasFiltradas.length / registrosPorPagina);

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
                                        <h3 className="card-title">Categorías</h3>
                                        <button onClick={toggleInactivas} className="btn btn-info float-right">
                                            {mostrarInactivas ? "Mostrar Activas" : "Mostrar Inactivas"}
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
                                                placeholder="Buscar categoria"
                                                value={busqueda}
                                                onChange={(e) => setBusqueda(e.target.value)}
                                                style={{ width: '200px' }} 
                                            />
                                        </div>
                                        {categoriasFiltradas.length === 0 ? (
                                            <p>No hay datos en esta tabla</p>
                                        ) : (
                                            <>
                                                <table ref={tableRef} className="table table-hover text-nowrap">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => manejarOrden('id_categoria')}>
                                                                Id de Categoría {orden.campo === 'id_categoria' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('nombre')}>
                                                                Nombre de Categoría {orden.campo === 'nombre' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th onClick={() => manejarOrden('estado')}>
                                                                Estado {orden.campo === 'estado' && (orden.direccion === 'asc' ? '▲' : '▼')}
                                                            </th>
                                                            <th>Actualizar</th>
                                                            <th>Cambiar Estado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {categoriasMostradas.map((categoria) => (
                                                            <tr key={categoria.id_categoria}>
                                                                <td>{categoria.id_categoria}</td>
                                                                <td>{categoria.nombre}</td>
                                                                <td>{categoria.estado}</td>
                                                                <td>
                                                                    <Link to={`/ActualizarCate/${categoria.id_categoria}`} className="btn btn-warning">
                                                                        Actualizar
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <button 
                                                                        className={`btn ${categoria.estado === 'Activo' ? 'btn-danger' : 'btn-success'}`}
                                                                        onClick={() => handleEstado(categoria.id_categoria, categoria.estado)}
                                                                    >
                                                                        {categoria.estado === 'Activo' ? 'Desactivar' : 'Activar'}
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
                                                        Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, categoriasFiltradas.length)} de {categoriasFiltradas.length} registros
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

export default ConsultarCate;
