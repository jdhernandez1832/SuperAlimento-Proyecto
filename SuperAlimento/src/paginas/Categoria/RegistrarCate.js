import React, { useState } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const RegistrarCate = () => {
    const [formData, setFormData] = useState({
        nombre: '',
    });

    const [errors, setErrors] = useState({}); // Estado para los errores de validación
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    // Validación de texto: solo letras y espacios
    const validateText = (value) => /^[a-zA-Z\s]*$/.test(value);

    // Manejo del cambio de los campos con validación en tiempo real
    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === 'nombre') {
            if (validateText(value)) {
                setErrors((prev) => ({ ...prev, nombre: '' }));
            } else {
                setErrors((prev) => ({ ...prev, nombre: 'Solo se permiten letras y espacios' }));
            }
        }

        setFormData({
            ...formData,
            [id]: value,
        });
    };

    // Validación completa del formulario antes de enviar
    const validateForm = () => {
        const newErrors = {};

        // Validación del campo nombre
        if (!validateText(formData.nombre)) {
            newErrors.nombre = 'Solo se permiten letras y espacios';
        }

        // Validación de longitud máxima para el nombre (50 caracteres como ejemplo)
        if (formData.nombre.length > 50) {
            newErrors.nombre = 'El nombre no puede exceder los 50 caracteres';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Si no hay errores, devuelve true
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire('Error', 'Por favor corrige los errores del formulario', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/categoria/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Categoría registrada',
                    text: `La categoría ${result.nombre} ha sido registrada exitosamente.`,
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/ConsultarCate');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar categoría',
                    text: 'Hubo un problema al intentar registrar la categoría.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                text: `Hubo un problema con la solicitud: ${error.message}`,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
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
                                <h3 className="card-title">Registrar categoría</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="nombre">Nombre de la categoría</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            maxLength="50"
                                        />
                                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to="/ConsultarCate" className="btn btn-secondary mr-2">Volver</Link>
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

export default RegistrarCate;
