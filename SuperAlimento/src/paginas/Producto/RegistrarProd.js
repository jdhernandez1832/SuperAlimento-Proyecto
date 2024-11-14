import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import Select from 'react-select'; 

const RegistrarProd = () => {
    const [formData, setFormData] = useState({
        nombre_producto: '',
        codigo_barras: '',
        precio_compra: '',
        precio_venta: '',
        descripcion_producto: '',
        estado: 1,
        id_categoria: '',
        numero_documento: '',
        id_proveedor: '',
        imagen: null,
    });
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
    const [errors, setErrors] = useState({});

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
                    // Filtrar categorías activas
                    const categoriasActivas = data.filter(categoria => categoria.estado !== 'Desactivo');
                    setCategorias(categoriasActivas);
                } else {
                    console.error('Error al obtener categorías:', response.statusText);
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
                // Filtrar proveedores activos
                const proveedoresActivos = data.filter(proveedor => proveedor.estado !== 'Desactivo');
                setProveedores(proveedoresActivos);
              } else {
                console.error('Error al obtener proveedores:', response.statusText);
              }
            } catch (error) {
              console.error("Error al obtener los proveedores:", error);
            }
          };

        fetchCategorias();
        fetchProveedores();
    }, [rol, token]);

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

    const validateField = (name, value) => {
        let error = '';

        if (name === 'nombre_producto' || name === 'descripcion_producto') {
            // Permitir solo letras y números
            const regex = /^[A-Za-z0-9\s]+$/;
            if (!regex.test(value)) {
                error = 'Solo se permiten letras y números.';
            } else if (value.length > 50) {
                error = 'El campo no puede superar los 50 caracteres.';
            }
        } else if (['codigo_barras', 'precio_compra', 'precio_venta'].includes(name)) {
            // Validar solo números
            const regex = /^\d+$/;
            if (!regex.test(value)) {
                error = 'Solo se permiten números.';
            }
        }
        return error;
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData({
            ...formData,
            [name]: selectedOption ? selectedOption.value : '',
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
    
        // Verificar si el archivo tiene un tipo permitido
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file && !allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Tipo de archivo no permitido',
                text: 'Por favor, sube un archivo de imagen (JPEG, PNG, GIF).',
            });
            e.target.value = null;
            return;
        }
    
        // Previsualizar la imagen localmente (esto es solo para mostrar la imagen en la interfaz)
        const imageUrl = URL.createObjectURL(file);
        setFormData(prevFormData => ({
            ...prevFormData,
            imagen: imageUrl,  // Almacena la URL temporal para previsualización
        }));
    
        try {
            // Subir la imagen a Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "h6i1y3x1");  // Asegúrate de usar tu upload_preset de Cloudinary
    
            const response = await fetch('https://api.cloudinary.com/v1_1/dtuawjvux/image/upload', {
                method: 'POST',
                body: formData,
            });
    
            const data = await response.json();
    
            if (data.secure_url) {
                // Si la imagen se sube correctamente, obtienes la URL segura
                setFormData(prevFormData => ({
                    ...prevFormData,
                    imagen: data.secure_url,  // Establecer la URL en el formulario
                }));
            } else {
                throw new Error('Error al obtener la URL de la imagen');
            }
        } catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al subir la imagen',
                text: 'Hubo un problema al intentar subir la imagen.',
            });
        }
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
    
        // Si la imagen está vacía (no se subió nada), devolver un error
        if (!formData.imagen) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, sube una imagen para el producto.',
            });
            return;
        }
    
        // Si es válido, envía los datos
        const postData = {
            nombre_producto: formData.nombre_producto,
            codigo_barras: formData.codigo_barras,  // Asegúrate de que este es un número
            precio_compra: Number(formData.precio_compra),  // Asegúrate de que es un número
            precio_venta: Number(formData.precio_venta),  // Asegúrate de que es un número
            descripcion_producto: formData.descripcion_producto,
            estado: formData.estado,
            id_categoria: formData.id_categoria,
            numero_documento: formData.numero_documento,
            id_proveedor: formData.id_proveedor,
            imagen: formData.imagen,  // Aquí va la URL de la imagen que obtuviste de Cloudinary
        };
    
        try {
            const response = await fetch('http://localhost:3001/api/producto/registrar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
    
            const result = await response.json();
    
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
                    text: result.message || 'Hubo un problema al registrar el producto.',
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

    const postData = {
        nombre_producto: formData.nombre_producto,
        codigo_barras: formData.codigo_barras,
        precio_compra: formData.precio_compra,
        precio_venta: formData.precio_venta,
        descripcion_producto: formData.descripcion_producto,
        estado: formData.estado,
        id_categoria: formData.id_categoria,
        numero_documento: formData.numero_documento,
        id_proveedor: formData.id_proveedor,
        imagen: formData.imagen, // Si la imagen se cargó correctamente
    };

    console.log(postData)
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
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="nombre_producto">Nombre de producto</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nombre_producto ? 'is-invalid' : ''}`}
                                            id="nombre_producto"
                                            value={formData.nombre_producto}
                                            onChange={handleChange}
                                            required
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
                                        />
                                        {errors.precio_venta && <span className="text-danger">{errors.precio_venta}</span>}
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
                                    {formData.imagen && (
                                        <div className="form-group">
                                            <label>Vista previa de la imagen:</label>
                                            {/* Si es una URL de Cloudinary, no usamos createObjectURL */}
                                            <img 
                                                src={formData.imagen} 
                                                alt="Vista previa" 
                                                style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="descripcion_producto">Descripción</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.descripcion_producto ? 'is-invalid' : ''}`}
                                            id="descripcion_producto"
                                            value={formData.descripcion_producto}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.descripcion_producto && <span className="text-danger">{errors.descripcion_producto}</span>}
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
                                            options={proveedores.map(proveedor => ({
                                                value: proveedor.id_proveedor,
                                                label: proveedor.nombre_proveedor,
                                            }))}
                                            onChange={handleSelectChange}
                                            name="id_proveedor"
                                            placeholder="Seleccione un proveedor"
                                            isClearable
                                            isSearchable={true}
                                        />
                                    </div>
                                </div>
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
