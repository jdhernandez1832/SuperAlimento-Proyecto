import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";

const DetallesVenta = () => {
    const { id_venta } = useParams(); // Obtener el ID de la venta de la URL
    const [venta, setVenta] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productosExistentes, setProductosExistentes] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [usuarios, setUsuarios] = useState([]);
    const [setTotal] = useState(0); // Estado para el valor total
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenta = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/venta/detalles/${id_venta}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos de venta:', data); // Depuración
                    setVenta(data.venta);
                    setProductos(data.productos);
                    calcularTotal(data.productos, productosExistentes);
                } else {
                    console.error('Error al obtener los detalles de la venta');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/usuario/todos');
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
                const response = await fetch('http://localhost:3001/api/producto/todos');
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

        fetchVenta();
        fetchUsuarios();
        fetchProductos();
    }, );

    const calcularTotal = (productos, productosExistentes) => {
        const totalCalculado = productos.reduce((total, producto) => {
            const productoExistente = productosExistentes.find(prod => prod.id_producto === producto.id_producto);
            return total + (productoExistente ? productoExistente.precio_venta * producto.cantidad : 0);
        }, 0);
        setTotal(totalCalculado);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return '';
        const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(fecha).toLocaleDateString(undefined, opciones);
    };

    if (loading) {
        return <div>Cargando detalles de la venta...</div>;
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
                                        <h3 className="card-title">Detalles de la Venta</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="fecha_venta">Fecha de Venta</label>
                                            <input
                                                type="text"
                                                name="fecha_venta"
                                                id="fecha_venta"
                                                value={formatearFecha(venta?.fecha_venta)}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="metodo_pago">Método de Pago</label>
                                            <input
                                                type="text"
                                                name="metodo_pago"
                                                id="metodo_pago"
                                                value={venta?.metodo_pago || ''}
                                                className="form-control"
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="id_usuario">Usuario</label>
                                            <input
                                                type="text"
                                                name="id_usuario"
                                                id="id_usuario"
                                                value={usuarios.find(usuario => usuario.numero_documento === venta?.numero_documento)?.nombre_usuario || 'No disponible'}
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
                                                            <td>${(productoExistente?.precio_venta * prod.cantidad || 0).toFixed(2)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        <div className="form-group">
                                            <h4>Total: ${venta.total_venta}</h4>
                                        </div>
                                        <button onClick={() => navigate('/ConsultarVent')} className="btn btn-secondary mr-2">
                                            Volver
                                        </button>
                                        <button onClick={() => navigate('/RegistrarVent')} className="btn btn-secondary">
                                            Registrar otra venta
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

export default DetallesVenta;
