import React, { useState } from "react";
import Navegacion from "../../componentes/componentes/navegacion"; // Importa el componente correctamente
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";

const RegistrarCate = () => {
    const [formData, setFormData] = useState({
        nombre: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/categoria/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Rol': rol, //
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                window.alert('Categoría registrada:', result);
                navigate('/ConsultarCate');
                // Redirige o muestra mensaje de éxito
            } else {
                window.alert('Error al registrar categoría');
                // Manejo de error
            }
        } catch (error) {
            window.alert('Error en la solicitud:', error);
            // Manejo de error
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
                                            className="form-control"
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                        />
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
}

export default RegistrarCate;
