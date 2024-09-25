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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');
    
    try {
      const response = await fetch('http://localhost:3001/api/usuario/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol, 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // eslint-disable-next-line no-unused-vars
        const result = await response.json();
        Swal.fire({
          title: 'Éxito',
          text: 'Usuario registrado con éxito',
          icon: 'success',
          confirmButtonColor: '#4CAF50', // Color verde
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/ConsultarUsu'); // Redirige a ConsultarUsu
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Error al registrar usuario',
          icon: 'error',
          confirmButtonColor: '#4CAF50', // Color verde
          confirmButtonText: 'Aceptar',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: `Error en la solicitud: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#4CAF50', // Color verde
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
                      <option value="2">Inventarista</option>
                      <option value="3">Cajero</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="clave">Contraseña</label>
                    <input
                      className="form-control"
                      id="clave"
                      value={formData.clave}
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
