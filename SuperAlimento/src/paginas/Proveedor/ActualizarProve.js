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
    const [formErrors, setFormErrors] = useState({
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

    const validateField = (name, value) => {
        let errors = { ...formErrors };

        switch (name) {
            case 'nombre_proveedor':
                // Validar que solo contenga letras
                if (!value.trim()) {
                    errors.nombre_proveedor = 'El nombre es requerido';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚÑñ\s]+$/.test(value)) {
                    errors.nombre_proveedor = 'El nombre solo debe contener letras';
                } else {
                    errors.nombre_proveedor = ''; // No borrar el mensaje, solo lo vacía
                }
                break;
            case 'numero_documento':
                if (!value || isNaN(value) || value <= 0) {
                    errors.numero_documento = 'El número de documento debe ser válido';
                } else {
                    errors.numero_documento = ''; // No borrar el mensaje, solo lo vacía
                }
                break;
            case 'telefono_proveedor':
                if (!value || isNaN(value) || value <= 0) {
                    errors.telefono_proveedor = 'El teléfono debe ser un número válido';
                } else {
                    errors.telefono_proveedor = ''; // No borrar el mensaje, solo lo vacía
                }
                break;
            case 'correo_proveedor':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    errors.correo_proveedor = 'El correo no es válido';
                } else {
                    errors.correo_proveedor = ''; // No borrar el mensaje, solo lo vacía
                }
                break;
            default:
                break;
        }

        setFormErrors(errors);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
        validateField(id, value); // Validar al cambiar el valor
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar todos los campos antes de enviar
        Object.keys(formData).forEach((key) => validateField(key, formData[key]));

        // Verificar si hay errores antes de enviar
        if (Object.values(formErrors).some((error) => error)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Corrige los errores antes de enviar el formulario.',
                confirmButtonColor: '#28a745'
            });
            return; // No enviar si hay errores
        }

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
                    <div className="row">
                      <div className="col-md-6">
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
                            className={`form-control ${formErrors.nombre_proveedor ? 'is-invalid' : ''}`}
                            id="nombre_proveedor"
                            value={formData.nombre_proveedor}
                            onChange={handleChange}
                            required
                            maxLength={50}
                          />
                          {formErrors.nombre_proveedor && (
                            <div className="invalid-feedback">{formErrors.nombre_proveedor}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="tipo_documento">Tipo de documento</label>
                          <select
                            className={`custom-select form-control-border border-width-2 ${formErrors.tipo_documento ? 'is-invalid' : ''}`}
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
                          {formErrors.tipo_documento && (
                            <div className="invalid-feedback">{formErrors.tipo_documento}</div>
                          )}
                        </div>
                      </div>
      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="numero_documento">Número de documento</label>
                          <input
                            type="number"
                            min="1"
                            className={`form-control ${formErrors.numero_documento ? 'is-invalid' : ''}`}
                            id="numero_documento"
                            value={formData.numero_documento}
                            onChange={handleChange}
                            required
                            maxLength={20}
                          />
                          {formErrors.numero_documento && (
                            <div className="invalid-feedback">{formErrors.numero_documento}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="telefono_proveedor">Teléfono</label>
                          <input
                            type="number"
                            min="1"
                            className={`form-control ${formErrors.telefono_proveedor ? 'is-invalid' : ''}`}
                            id="telefono_proveedor"
                            value={formData.telefono_proveedor}
                            onChange={handleChange}
                            required
                            maxLength={10}
                          />
                          {formErrors.telefono_proveedor && (
                            <div className="invalid-feedback">{formErrors.telefono_proveedor}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="correo_proveedor">Correo electrónico</label>
                          <input
                            type="email"
                            className={`form-control ${formErrors.correo_proveedor ? 'is-invalid' : ''}`}
                            id="correo_proveedor"
                            value={formData.correo_proveedor}
                            onChange={handleChange}
                            required
                            maxLength={50}
                          />
                          {formErrors.correo_proveedor && (
                            <div className="invalid-feedback">{formErrors.correo_proveedor}</div>
                          )}
                        </div>
                      </div>
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
};

export default ActualizarProve;
