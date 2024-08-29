import React, { useState } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";

const RegistrarProve = () => {
    const [formData, setFormData] = useState({
        nombre_proveedor: '',
        numero_documento: '',
        tipo_documento: '',
        telefono_proveedor: '',
        correo_proveedor: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/proveedor/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.alert('Proveedor registrado exitosamente');
                navigate('/ConsultarProve');
            } else {
                window.alert('Error al registrar proveedor');
            }
        } catch (error) {
            window.alert('Error en la solicitud:', error.message);
        }
    };

    return (
        <div>
            <Navegacion>
                <div className="card card-success">
                    <div className="card-body colorFondo">
                        <div className="card card-success">
                            <div className="card-header">
                                <h3 className="card-title">Registrar proveedor</h3>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
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
                                            <option value="Cedula">Cédula</option>
                                            <option value="Cedula de extranjeria">Cédula de extranjería</option>
                                            <option value="Tarjeta de identidad">Tarjeta de identidad</option>
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
                                    <Link to="/ConsultarProve" className="btn btn-primary custom-button mr-2">Volver</Link>
                                    <button type="submit" className="btn btn-primary custom-button">Registrar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
}

export default RegistrarProve;
