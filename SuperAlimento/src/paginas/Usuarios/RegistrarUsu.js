import React, { useState } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const RegistrarUsu = () => {
  const [formData, setFormData] = useState({
    numero_documento: '',
    nombre_usuario: '',
    tipo_documento: '',
    correo_usuario: '',
    telefono_usuario: '',
    clave: '',
    id_rol: '',
  });
  const navigate = useNavigate();

  // Función para generar una clave aleatoria
  const generarClaveAleatoria = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let claveGenerada = '';
    for (let i = 0; i < 10; i++) {
      claveGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return claveGenerada;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Al cargar el formulario, generar la clave automática
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    // Generar la clave aleatoria
    const claveGenerada = generarClaveAleatoria();

    try {
      const response = await fetch('http://localhost:3001/api/usuario/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol, 
        },
        body: JSON.stringify({ ...formData, clave: claveGenerada }), // Enviar la clave generada
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Enviar la clave generada por correo
        await fetch('http://localhost:3001/api/usuario/correo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol, 
          },
          body: JSON.stringify({
            email: formData.correo_usuario,
            clave: claveGenerada,
            numero_documento: formData.numero_documento,
          }),
        });

        Swal.fire({
          title: 'Éxito',
          text: 'Usuario registrado con éxito y clave enviada por correo',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/ConsultarUsu');
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al registrar usuario',
          icon: 'error',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: `Error en la solicitud: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#4CAF50',
        confirmButtonText: 'Aceptar',
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
                <h3 className="card-title">Registrar Usuario</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
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
                    <label htmlFor="nombre_usuario">Nombre de usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_usuario"
                      value={formData.nombre_usuario}
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
                      <option value="">Seleccionar...</option>
                      <option value="1">Cédula</option>
                      <option value="2">Cédula de extranjería</option>
                      <option value="3">Tarjeta de identidad</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="correo_usuario">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo_usuario"
                      value={formData.correo_usuario}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono_usuario">Teléfono</label>
                    <input
                      type="number"
                      min={'1'}
                      className="form-control"
                      id="telefono_usuario"
                      value={formData.telefono_usuario}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_rol">Rol</label>
                    <select
                      className="custom-select form-control-border border-width-2"
                      id="id_rol"
                      value={formData.id_rol}
                      onChange={handleChange}
                      required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="1">Administrador</option>
                        <option value="2">Cajero</option>
                        <option value="3">Inventarista</option>
                    </select>
                  </div>
                  <div className="form-group" hidden>
                    <label htmlFor="clave">Contraseña</label>
                    <input
                      className="form-control"
                      id="clave"
                      value={formData.clave || generarClaveAleatoria()}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/ConsultarUsu" className="btn btn-secondary mr-2">Volver</Link>
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

export default RegistrarUsu;