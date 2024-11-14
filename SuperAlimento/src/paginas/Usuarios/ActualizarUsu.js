import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'; // Importar SweetAlert

const ActualizarUsuario = () => {
  const { numero_documento } = useParams();
  const navigate = useNavigate();
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
        const response = await fetch(`https://superalimento-proyecto.onrender.com/api/usuario/${numero_documento}`, {
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
            confirmButtonColor: '#28a745', // Color verde
          });
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error en la solicitud: ${error}`,
          confirmButtonColor: '#28a745', // Color verde
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
    validateField(id, value); // Validar el campo en tiempo real
  };

  // Validaciones para cada campo
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
    
    // Validar todo el formulario antes de enviarlo
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      alert('Por favor, corrige los errores antes de enviar el formulario.');
      return;
    }

    try {
      const response = await fetch(`https://superalimento-proyecto.onrender.com/api/usuario/actualizar/${numero_documento}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Usuario actualizado:', result);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario actualizado con éxito',
          confirmButtonColor: '#28a745', // Color verde
        }).then(() => {
          navigate('/ConsultarUsu');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar usuario',
          confirmButtonColor: '#28a745', // Color verde
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error en la solicitud: ${error}`,
        confirmButtonColor: '#28a745', // Color verde
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
            <h3 className="card-title">Actualizar Usuario</h3>
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
                </div>

                <div className="col-md-6">
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
                </div>
              </div>
            </div>
            <div className="card-footer">
              <Link to="/ConsultarUsu" className="btn btn-secondary mr-2">Volver</Link>
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

export default ActualizarUsuario;
