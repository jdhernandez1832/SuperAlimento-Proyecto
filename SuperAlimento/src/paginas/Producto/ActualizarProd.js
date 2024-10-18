/* eslint-disable no-unused-vars */
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import Select from 'react-select'; 


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
                    const errorText = await response.text();
                    Swal.fire({
                        title: 'Error',
                        text: `Error al obtener el producto: ${errorText}`,
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Error en la solicitud: ${error}`,
                    icon: 'error',
                    confirmButtonColor: '#4caf50',
                });
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
                    const errorText = await response.text();
                    Swal.fire({
                        title: 'Error',
                        text: `Error al obtener categorías: ${errorText}`,
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Error en la solicitud: ${error}`,
                    icon: 'error',
                    confirmButtonColor: '#4caf50',
                });
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
                    const errorText = await response.text();
                    Swal.fire({
                        title: 'Error',
                        text: `Error al obtener usuarios: ${errorText}`,
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Error en la solicitud: ${error}`,
                    icon: 'error',
                    confirmButtonColor: '#4caf50',
                });
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
                    const errorText = await response.text();
                    Swal.fire({
                        title: 'Error',
                        text: `Error al obtener proveedores: ${errorText}`,
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: `Error en la solicitud: ${error}`,
                    icon: 'error',
                    confirmButtonColor: '#4caf50',
                });
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

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData({
            ...formData,
            [name]: selectedOption ? selectedOption.value : '',
        });
    };

        // Función para abrir la alerta y registrar la nueva categoría
        const handleAddCategoria = () => {
            Swal.fire({
                title: 'Agregar nueva categoría',
                input: 'text',
                inputPlaceholder: 'Nombre de la nueva categoría',
                showCancelButton: true,
                confirmButtonText: 'Registrar',
                showLoaderOnConfirm: true,
                preConfirm: async (nombreCategoria) => {
                    try {
                        const response = await fetch('http://localhost:3001/api/categoria/registrar', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                                'X-Rol': rol,
                            },
                            body: JSON.stringify({ nombre: nombreCategoria }),
                        });
    
                        if (response.ok) {
                            const result = await response.json();
                            setCategorias((prevCategorias) => [
                                ...prevCategorias,
                                result
                            ]);
                            return result;
                        } else {
                            throw new Error('Error al registrar la categoría');
                        }
                    } catch (error) {
                        Swal.showValidationMessage(`Error: ${error.message}`);
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: `Categoría ${result.value.nombre} registrada correctamente`,
                        confirmButtonColor: '#28a745',
                    });
                }
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
                Swal.fire({
                    title: 'Éxito',
                    text: 'Producto actualizado correctamente',
                    icon: 'success',
                    confirmButtonColor: '#4caf50',
                }).then(() => {
                    navigate('/ConsultarProd');
                });
            } else {
                const errorText = await response.text();
                Swal.fire({
                    title: 'Error',
                    text: `Error al actualizar producto: ${errorText}`,
                    icon: 'error',
                    confirmButtonColor: '#4caf50',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `Error en la solicitud: ${error}`,
                icon: 'error',
                confirmButtonColor: '#4caf50',
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
                                            <option value="1">Activo</option>
                                            <option value="0">Inactivo</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="id_categoria">Categoría</label>
                                        <div className="d-flex align-items-center">
                                            <Select
                                                name="id_categoria"
                                                options={categorias.map(categoria => ({
                                                    value: categoria.id_categoria,
                                                    label: categoria.nombre,
                                                }))}
                                                onChange={handleSelectChange}
                                                placeholder="Seleccione una categoría"
                                                isClearable
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-secondary ml-2"
                                                onClick={handleAddCategoria}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="id_proveedor">Proveedor</label>
                                        <Select
                                            name="id_proveedor"
                                            options={proveedores.map(proveedor => ({
                                                value: proveedor.id_proveedor,
                                                label: proveedor.nombre_proveedor,
                                            }))}
                                            onChange={handleSelectChange}
                                            placeholder="Seleccione un proveedor"
                                            isClearable
                                            isSearchable={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="imagen">Imagen</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="imagen"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to="/ConsultarProd" className="btn btn-secondary mr-2">Volver</Link>
                                    <button type="submit" className="btn btn-secondary">Actualizar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
};

export default ActualizarProd;