import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importación de SweetAlert

const RegistrarProd = () => {
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
    // eslint-disable-next-line no-unused-vars
    const [usuarios, setUsuarios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const numero_documento = localStorage.getItem('numero_documento');
        setFormData(prevState => ({
            ...prevState,
            numero_documento: numero_documento || ''  
        }));
    }, []); 

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
                    console.error('Error al obtener categorías:', response.statusText);
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
                    console.error('Error al obtener usuarios:', response.statusText);
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
                    console.log('Proveedores obtenidos:', data);
                    setProveedores(data);
                } else {
                    console.error('Error al obtener proveedores:', response.statusText);
                }
            } catch (error) {
                console.error("Error al obtener los proveedores:", error);
            }
        };

        fetchCategorias();
        fetchUsuarios();
        fetchProveedores();
    }, [rol, token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Validar si el archivo es una imagen comprobando su tipo MIME
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Tipos de imágenes permitidos
        if (file && !allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Tipo de archivo no permitido',
                text: 'Por favor, sube un archivo de imagen (JPEG, PNG, GIF).',
            });
            // Limpia el campo de archivo
            e.target.value = null;
            return;
        }

        setFormData({
            ...formData,
            imagen: file,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await fetch('http://localhost:3001/api/producto/registrar', {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol,
                },
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto registrado exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/ConsultarProd');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar producto',
                    text: 'Hubo un problema al registrar el producto.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                text: error.message,
            });
        }
    };

    return (
        <div>
            <Navegacion>
                <div className="card card-secondary">
                    <div className="card-body colorFondo">
                        <div className="card card-secondary">
                            <div className="card-header">
                                <h3 className="card-title">Registrar producto</h3>
                            </div>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="nombre_producto">Nombre del producto</label>
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
                                        <label htmlFor="descripcion_producto">Descripción del producto</label>
                                        <textarea
                                            className="form-control"
                                            id="descripcion_producto"
                                            value={formData.descripcion_producto}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cantidad">Cantidad</label>
                                        <input
                                            type="number"
                                            min={'1'}
                                            className="form-control"
                                            id="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group" hidden>
                                        <label htmlFor="estado">Estado</label>
                                        <select
                                            className="form-control"
                                            id="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value={1}>Activo</option>
                                            <option value={0}>Inactivo</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="id_categoria">Categoría</label>
                                        <select
                                            className="form-control"
                                            id="id_categoria"
                                            value={formData.id_categoria}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccione una categoría</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                                    {categoria.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="numero_documento">Usuario</label>
                                        <input
                                            className="form-control"
                                            id="numero_documento"
                                            required
                                            value={formData.numero_documento}
                                            readOnly
                                        />
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
                                            {proveedores.map(proveedor => (
                                            <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                                {proveedor.nombre_proveedor}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="imagen">Imagen del producto</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imagen"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to="/ConsultarProd" className="btn btn-secondary mr-2">Volver</Link>
                                    <button type="submit" className="btn btn-secondary">Registrar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
};

export default RegistrarProd;