import React, { useState, useEffect } from "react"; 
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert

const Perfil = () => {
  const { numero_documento } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    tipo_documento: '',
    correo_usuario: '',
    telefono_usuario: '',
    id_rol: '',
  });
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/usuario/${numero_documento}`, {
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
            text: 'Error al obtener el usuario',
            confirmButtonColor: '#28a745',
          });
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error en la solicitud: ${error}`,
          confirmButtonColor: '#28a745',
        });
      }
    };

    fetchUsuario();
  }, [numero_documento, token, rol]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    validateField(id, value);
  };

  const validateField = (id, value) => {
    let error = '';

    switch (id) {
      case 'nombre_usuario':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'El nombre solo debe contener letras.';
        }
        break;

      case 'correo_usuario':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Ingrese un correo electrónico válido.';
        }
        break;

      case 'telefono_usuario':
        if (!/^\d+$/.test(value)) {
          error = 'El teléfono solo debe contener números.';
        }
        break;

      case 'clave':
        if (value.length < 6) {
          error = 'La contraseña debe tener al menos 6 caracteres.';
        }
        break;

      default:
        break;
    }

    setErrors({
      ...errors,
      [id]: error,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, corrige los errores antes de enviar el formulario.',
        confirmButtonColor: '#28a745',
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/usuario/actualizar/${numero_documento}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario actualizado correctamente',
          confirmButtonColor: '#28a745',
        }).then(() => {
          navigate('/Index'); // Redirigir después de la alerta
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el usuario',
          confirmButtonColor: '#28a745',
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en la solicitud: ${error}`,
        confirmButtonColor: '#28a745',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Navegacion>
        <div className="card card-secondary">
          <div className="card-body colorFondo">
            <div className="card card-secondary">
              <div className="card-header">
                <h3 className="card-title">Actualizar Perfil</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="numero_documento">Número de documento</label>
                        <input
                          type="number"
                          className="form-control"
                          id="numero_documento"
                          value={formData.numero_documento}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="nombre_usuario">Nombre de usuario</label>
                        <input
                          type="text"
                          className={`form-control ${errors.nombre_usuario ? 'is-invalid' : ''}`}
                          id="nombre_usuario"
                          value={formData.nombre_usuario}
                          onChange={handleChange}
                          required
                          maxLength={50}
                        />
                        {errors.nombre_usuario && (
                          <div className="invalid-feedback">{errors.nombre_usuario}</div>
                        )}
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
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="correo_usuario">Email</label>
                        <input
                          type="email"
                          className={`form-control ${errors.correo_usuario ? 'is-invalid' : ''}`}
                          id="correo_usuario"
                          value={formData.correo_usuario}
                          onChange={handleChange}
                          required
                          maxLength={100}
                        />
                        {errors.correo_usuario && (
                          <div className="invalid-feedback">{errors.correo_usuario}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="telefono_usuario">Teléfono</label>
                        <input
                          type="text"
                          className={`form-control ${errors.telefono_usuario ? 'is-invalid' : ''}`}
                          id="telefono_usuario"
                          value={formData.telefono_usuario}
                          onChange={handleChange}
                          required
                          maxLength={12}
                        />
                        {errors.telefono_usuario && (
                          <div className="invalid-feedback">{errors.telefono_usuario}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="clave">Contraseña</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.clave ? 'is-invalid' : ''}`}
                            id="clave"
                            onChange={handleChange}
                            required
                            maxLength={50}
                          />
                          <div className="input-group-append">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={togglePasswordVisibility}
                            >
                              <span className="fas fa-eye"></span>
                            </button>
                          </div>
                          {errors.clave && (
                            <div className="invalid-feedback">{errors.clave}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/Index" className="btn btn-secondary mr-2">Volver</Link>
                  <button type="submit" className="btn btn-secondary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Navegacion>
    </div>
  );
};

export default Perfil;
