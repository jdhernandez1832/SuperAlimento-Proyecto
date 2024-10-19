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
    const [errors, setErrors] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
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

    const validateField = (name, value) => {
        let error = '';

        if (name === 'nombre_producto' || name === 'descripcion_producto') {
            const regex = /^[A-Za-z0-9\s]+$/;
            if (!regex.test(value)) {
                error = 'Solo se permiten letras y números.';
            } else if (value.length > 50) {
                error = 'El campo no puede superar los 50 caracteres.';
            }
        } else if (['codigo_barras', 'precio_compra', 'precio_venta', 'cantidad'].includes(name)) {
            const regex = /^\d+$/;
            if (!regex.test(value)) {
                error = 'Solo se permiten números.';
            }
        }
        return error;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const error = validateField(id, value);
        
        setFormData({
            ...formData,
            [id]: value,
        });

        setErrors({
            ...errors,
            [id]: error,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        let newErrors = {};

        // Validar todos los campos antes de enviar
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        if (!isValid) {
            setErrors(newErrors);
            Swal.fire({
                title: 'Error',
                text: 'Por favor corrige los errores en el formulario.',
                icon: 'error',
                confirmButtonColor: '#4caf50',
            });
            return;
        }

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
    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData({
            ...formData,
            [name]: selectedOption ? selectedOption.value : '',
        });
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
                                            className={`form-control ${errors.nombre_producto ? 'is-invalid' : ''}`}
                                            id="nombre_producto"
                                            value={formData.nombre_producto}
                                            onChange={handleChange}
                                            required
                                            maxLength={50}
                                        />
                                        {errors.nombre_producto && <span className="text-danger">{errors.nombre_producto}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="codigo_barras">Código de barras</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.codigo_barras ? 'is-invalid' : ''}`}
                                            id="codigo_barras"
                                            value={formData.codigo_barras}
                                            onChange={handleChange}
                                            required
                                            maxLength={13}
                                        />
                                        {errors.codigo_barras && <span className="text-danger">{errors.codigo_barras}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precio_compra">Precio de compra</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.precio_compra ? 'is-invalid' : ''}`}
                                            id="precio_compra"
                                            value={formData.precio_compra}
                                            onChange={handleChange}
                                            required
                                            min={50}
                                            maxLength={10}
                                        />
                                        {errors.precio_compra && <span className="text-danger">{errors.precio_compra}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="precio_venta">Precio de venta</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.precio_venta ? 'is-invalid' : ''}`}
                                            id="precio_venta"
                                            value={formData.precio_venta}
                                            onChange={handleChange}
                                            required
                                            min={50}
                                            maxLength={10}
                                        />
                                        {errors.precio_venta && <span className="text-danger">{errors.precio_venta}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="descripcion_producto">Descripción</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.descripcion_producto ? 'is-invalid' : ''}`}
                                            id="descripcion_producto"
                                            value={formData.descripcion_producto}
                                            onChange={handleChange}
                                            required
                                            maxLength={255}
                                        />
                                        {errors.descripcion_producto && <span className="text-danger">{errors.descripcion_producto}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cantidad">Cantidad</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                                            id="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            required
                                            min={0}
                                            maxLength={6} 
                                        />
                                        {errors.cantidad && <span className="text-danger">{errors.cantidad}</span>}
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
