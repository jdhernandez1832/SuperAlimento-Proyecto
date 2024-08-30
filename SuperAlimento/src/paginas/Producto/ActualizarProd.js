import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

const ActualizarProd = () => {
    const { id_producto } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre_producto: '',
        codigo_barras: '',
        precio_compra: '',
        precio_venta: '',
        descripcion_producto: '',
        cantidad: '',
        estado: 1,
        id_categoria: '',
        numero_documento: '',
        id_proveedor: '',
        imagen: null,
    });
    const [categorias, setCategorias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/producto/${id_producto}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    console.error('Error al obtener el producto', await response.text());
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

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
                    console.error('Error al obtener categorías:', await response.text());
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/usuario/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsuarios(data);
                } else {
                    console.error('Error al obtener usuarios:', await response.text());
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        const fetchProveedores = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/proveedor/todos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Rol': rol,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProveedores(data);
                } else {
                    console.error('Error al obtener proveedores:', await response.text());
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchProducto();
        fetchCategorias();
        fetchUsuarios();
        fetchProveedores();
    }, [id_producto, rol, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            imagen: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await fetch(`http://localhost:3001/api/producto/actualizar/${id_producto}`, {
                method: 'PUT',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol,
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Producto actualizado:', result);
                navigate('/ConsultarProd');
            } else {
                console.error('Error al actualizar producto', await response.text());
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        <div>
            <Navegacion>
                <div className="card card-secondary">
                    <div className="card-body colorFondo">
                        <div className="card card-secondary">
                            <div className="card-header">
                                <h3 className="card-title">Actualizar producto</h3>
                            </div>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="id_producto">Id de producto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="id_producto"
                                            value={formData.id_producto}
                                            onChange={handleChange}
                                            required
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nombre_producto">Nombre de producto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre_producto"
                                            value={formData.nombre_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="codigo_barras">Código de barras</label>
                                        <input
                                            type="number"
                                            min={'1'}
                                            className="form-control"
                                            id="codigo_barras"
                                            value={formData.codigo_barras}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precio_compra">Precio de compra</label>
                                        <input
                                            type="number"
                                            min={'50'}
                                            className="form-control"
                                            id="precio_compra"
                                            value={formData.precio_compra}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precio_venta">Precio de venta</label>
                                        <input
                                            type="number"
                                            min={'50'}
                                            className="form-control"
                                            id="precio_venta"
                                            value={formData.precio_venta}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="descripcion_producto">Descripción</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="descripcion_producto"
                                            value={formData.descripcion_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cantidad">Cantidad</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            id="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="estado">Estado</label>
                                        <select
                                            className="custom-select form-control-border border-width-2"
                                            id="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un estado</option>
                                            <option value="1">Activo</option>
                                            <option value="0">Desactivo</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="id_categoria">Categoría</label>
                                        <select
                                            className="custom-select form-control-border border-width-2"
                                            id="id_categoria"
                                            value={formData.id_categoria}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona una categoría</option>
                                            {categorias.length > 0 ? (
                                                categorias.map(categoria => (
                                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                                        {categoria.nombre}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>Cargando categorías...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="numero_documento">Usuario</label>
                                        <select
                                            className="custom-select form-control-border border-width-2"
                                            id="numero_documento"
                                            value={formData.numero_documento}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un usuario</option>
                                            {usuarios.length > 0 ? (
                                                usuarios.map(usuario => (
                                                    <option key={usuario.numero_documento} value={usuario.numero_documento}>
                                                        {usuario.nombre_usuario}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>Cargando usuarios...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="id_proveedor">Proveedor</label>
                                        <select 
                                            className="custom-select form-control-border border-width-2" 
                                            id="id_proveedor" 
                                            value={formData.id_proveedor} 
                                            onChange={handleChange} 
                                        >
                                            <option value="">Seleccione un proveedor</option>
                                            {proveedores.length > 0 ? (
                                                proveedores.map(proveedor => (
                                                    <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                                        {proveedor.nombre_proveedor}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>Cargando proveedores...</option>
                                            )}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="imagen">Subir imagen</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imagen"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <div className="card-footer">
                                        <Link to="/ConsultarProd" className="btn btn-secondary mr-2">Volver</Link>
                                        <button type="submit" className="btn btn-secondary">Actualizar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
}

export default ActualizarProd;
