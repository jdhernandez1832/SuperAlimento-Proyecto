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
  const [errors, setErrors] = useState({});

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
  
      case 'numero_documento':
        if (!/^\d+$/.test(value)) {
          error = 'El número de documento solo debe contener números.';
        } else if (value.length < 6) {
          error = 'El número de documento debe tener al menos 6 dígitos.';
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
      alert('Por favor, corrige los errores antes de enviar el formulario.');
      return;
    }

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
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="numero_documento">Número de documento</label>
                    <input
                      type="text" 
                      className={`form-control ${errors.numero_documento ? 'is-invalid' : ''}`}
                      id="numero_documento"
                      value={formData.numero_documento}
                      onChange={handleChange}
                      required
                      maxLength={20}
                    />
                    {errors.numero_documento && (
                      <div className="invalid-feedback">{errors.numero_documento}</div>
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