/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";

const DetallesSolicitud = () => {
    const { id_solicitud } = useParams(); // Obtener el ID de la solicitud de la URL
    const [solicitud, setSolicitud] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productosExistentes, setProductosExistentes] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [proveedores, setProveedores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [setTotal] = useState(0); // Estado para el valor total
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');


    useEffect(() => {
        const fetchSolicitud = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/solicitud/detalles/${id_solicitud}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'X-Rol': rol, // Agregar el token en los encabezados
                    },
                  });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de solicitud:', data); // Depuración
                    setSolicitud(data.solicitud);
                    setProductos(data.productos);
                    calcularTotal(data.productos, productosExistentes);
                } else {
                    console.error('Error al obtener los detalles de la solicitud');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        const fetchProveedores = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/proveedor/todos', {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'X-Rol': rol, // Agregar el token en los encabezados
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProveedores(data);
                } else {
                    console.error('Error al obtener proveedores:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los proveedores:', error);
            }
        };

        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/usuario/todos', {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'X-Rol': rol, // Agregar el token en los encabezados
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsuarios(data);
                } else {
                    console.error('Error al obtener usuarios:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/producto/todos', {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'X-Rol': rol, // Agregar el token en los encabezados
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Productos existentes:', data); // Depuración
                    setProductosExistentes(data);
                } else {
                    console.error('Error al obtener productos:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchSolicitud();
        fetchProveedores();
        fetchUsuarios();
        fetchProductos();
    }, []);

    const calcularTotal = (productos, productosExistentes) => {
        const totalCalculado = productos.reduce((total, producto) => {
            const productoExistente = productosExistentes.find(prod => prod.id_producto === producto.id_producto);
            return total + (productoExistente ? productoExistente.precio_compra * producto.cantidad : 0);
        }, 0);
        setTotal(totalCalculado);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fecha).toLocaleDateString(undefined, opciones);
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <Navegacion>
                <div className="card card-success">
                    <div className="card-body colorFondo">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Detalles de la Solicitud</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="fecha_entrada">Fecha de Entrada</label>
                                            <input
                                                type="text"
                                                name="fecha_entrada"
                                                id="fecha_entrada"
                                                value={formatearFecha(solicitud?.fecha_entrada)}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="estado_solicitud">Estado</label>
                                            <input
                                                type="text"
                                                name="estado_solicitud"
                                                id="estado_solicitud"
                                                value={solicitud?.estado_solicitud || ''}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="id_proveedor">Proveedor</label>
                                            <input
                                                type="text"
                                                name="id_proveedor"
                                                id="id_proveedor"
                                                value={proveedores.find(prov => prov.id_proveedor === solicitud?.id_proveedor)?.nombre_proveedor || 'No disponible'}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="numero_documento">Usuario</label>
                                            <input
                                                type="text"
                                                name="numero_documento"
                                                id="numero_documento"
                                                value={usuarios.find(usuario => usuario.numero_documento === solicitud?.numero_documento)?.nombre_usuario || 'No disponible'}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="observacion">Observación</label>
                                            <textarea
                                                name="observacion"
                                                id="observacion"
                                                value={solicitud?.observacion || ''}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <h4>Productos</h4>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productos.map((prod, index) => {
                                                    const productoExistente = productosExistentes.find(p => p.id_producto === prod.id_producto);
                                                    return (
                                                        <tr key={index}>
                                                            <td>{productoExistente?.nombre_producto || 'Desconocido'}</td>
                                                            <td>{prod.cantidad}</td>
                                                            <td>${(productoExistente?.precio_compra * prod.cantidad || 0).toFixed(2)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="form-group">
                                            <h4>Total: ${solicitud.precio_total}</h4>
                                        </div>
                                        <button onClick={() => navigate('/ConsultarSoli')} className="btn btn-secondary">
                                            Volver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
};

export default DetallesSolicitud;

