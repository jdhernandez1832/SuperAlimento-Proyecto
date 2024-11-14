import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // Importamos SweetAlert
import 'sweetalert2/dist/sweetalert2.min.css';  // Opcional: importamos el CSS de SweetAlert

const Olvido = () => {
    const [correo_usuario, setCorreo_Usuario] = useState('');
    const navigate = useNavigate();

    // Función para validar el formato del correo
    const validarCorreo = (correo) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(correo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarCorreo(correo_usuario)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Por favor ingresa un correo válido',
                confirmButtonColor: '#28a745',
            });
            return;
        }

        try {
            const response = await fetch('https://superalimento-proyecto.onrender.com/api/olvido/recuperar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo_usuario })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Correo enviado!',
                    text: 'Se ha enviado una nueva contraseña a tu correo',
                    confirmButtonColor: '#28a745',
                }).then(() => {
                    navigate('/Login');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al enviar la nueva contraseña. Inténtalo de nuevo.',
                    confirmButtonColor: '#28a745',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.',
                confirmButtonColor: '#28a745',
            });
        }
    };

    return (
        <div className="hold-transition login-page colorFondo">
            <div className="login-box">
                <div className="login-logo logo">
                    <div
                        id="carouselExampleIndicators"
                        className="carousel slide"
                        data-ride="carousel"
                    >
                        <div className="carousel-inner caja">
                            <div className="carousel-item active">
                                <img
                                    className="d-block w-100"
                                    src="../../dist/img/Super.jpeg"
                                    alt=""
                                    width="100px"
                                    height="150px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body login-card-body bordes">
                        <center>
                            <img
                                className="bd-placeholder-img rounded-circle img-fluid"
                                src="../../dist/img/SuperAlimento.png"
                                alt="SuperAlimento logo"
                                width={100}
                                height={100}
                            />
                        </center>
                        <center>
                            <h2>Recuperar contraseña</h2>
                        </center>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <p>Por favor ingresa el correo asociado a tu cuenta</p>
                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Ingrese su correo"
                                    value={correo_usuario}
                                    onChange={(e) => setCorreo_Usuario(e.target.value)}
                                    required
                                />
                            </div>
                            <center>
                                <button type="submit" className="custom-button">Enviar</button>
                            </center>
                        </form>
                        <p className="mb-1">
                            <Link to="/Login" className="letras">Volver</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Olvido;
