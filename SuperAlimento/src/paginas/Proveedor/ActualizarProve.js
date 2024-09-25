import React, { useState, useEffect } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; // Importa el componente correctamente
import "../../componentes/css/Login.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Importación de SweetAlert

const ActualizarProve = () => {
    const { id_proveedor } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre_proveedor: '',
        numero_documento: '',
        tipo_documento: '',
        telefono_proveedor: '',
        correo_proveedor: '',
    });
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
        const fetchProveedor = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/proveedor/${id_proveedor}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'X-Rol': rol, 
                    },
                  });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al obtener el proveedor',
                        confirmButtonColor: '#28a745' 
                    });
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error en la solicitud: ' + error.message,
                    confirmButtonColor: '#28a745' 
                });
            }
        };

        fetchProveedor();
    }, [id_proveedor, token, rol]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/proveedor/actualizar/${id_proveedor}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Proveedor actualizado:', result);
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedor actualizado',
                    text: 'El proveedor se actualizó exitosamente',
                    confirmButtonColor: '#28a745', // Color verde para el botón
                });
                navigate('/ConsultarProve');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al actualizar el proveedor',
                    confirmButtonColor: '#28a745' // Color verde para el botón
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error en la solicitud',
                text: error.message,
                confirmButtonColor: '#28a745' // Color verde para el botón
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
                                <h3 className="card-title">Actualizar proveedor</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="nombre">Id del proveedor</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            value={formData.id_proveedor}
                                            onChange={handleChange}
                                            required
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nombre_proveedor">Nombre de proveedor</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre_proveedor"
                                            value={formData.nombre_proveedor}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="numero_documento">Número de documento</label>
                                        <input
                                            type="number"
                                            min={'1'}
                                            className="form-control"
                                            id="numero_documento"
                                            value={formData.numero_documento}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="tipo_documento">Tipo de documento</label>
                                        <select
                                            className="custom-select form-control-border border-width-2"
                                            id="tipo_documento"
                                            value={formData.tipo_documento}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            <option value="Cédula">Cédula</option>
                                            <option value="RUC">RUC</option>
                                            <option value="Pasaporte">Pasaporte</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telefono_proveedor">Teléfono</label>
                                        <input
                                            type="number"
                                            min={'1'}
                                            className="form-control"
                                            id="telefono_proveedor"
                                            value={formData.telefono_proveedor}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="correo_proveedor">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="correo_proveedor"
                                            value={formData.correo_proveedor}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to="/ConsultarProve" className="btn btn-secondary mr-2">Volver</Link>
                                    <button type="submit" className="btn btn-secondary">Actualizar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
}

export default ActualizarProve;
