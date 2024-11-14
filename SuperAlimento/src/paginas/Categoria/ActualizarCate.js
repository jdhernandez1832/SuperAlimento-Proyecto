import React, { useState, useEffect } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const ActualizarCate = () => {
  const { id_categoria } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [errors, setErrors] = useState({}); // Para manejar errores de validación
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await fetch(`https://superalimento-proyecto.onrender.com/api/categoria/${id_categoria}`, {
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
            title: 'Error',
            text: 'Error al actualizar la categoria',
            icon: 'Error',
            confirmButtonColor: '#dc3545',
          });
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };

    fetchCategoria();
  }, [id_categoria, rol, token]);

  // Validaciones específicas para el campo nombre (solo letras)
  const validateText = (value) => /^[a-zA-Z\s]*$/.test(value);

  // Maneja el cambio de los campos
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Validación en tiempo real
    if (id === 'nombre') {
      if (validateText(value)) {
        setErrors((prev) => ({ ...prev, nombre: '' }));
      } else {
        setErrors((prev) => ({ ...prev, nombre: 'Solo se permiten letras y espacios' }));
      }
    }

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Validación antes de enviar el formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Valida el campo nombre
    if (!validateText(formData.nombre)) {
      newErrors.nombre = 'Solo se permiten letras y espacios';
    }

    // Valida la longitud máxima (ejemplo 50 caracteres)
    if (formData.nombre.length > 50) {
      newErrors.nombre = 'El nombre no puede exceder los 50 caracteres';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire('Error', 'Por favor corrige los errores del formulario', 'error');
      return;
    }

    try {
      const response = await fetch(`https://superalimento-proyecto.onrender.com/api/categoria/actualizar/${id_categoria}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Rol': rol,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Éxito',
          text: 'Categoría actualizada exitosamente',
          icon: 'success',
          confirmButtonColor: '#28a745',
        }).then(() => {
          navigate('/ConsultarCate');
        });
      } else {
        Swal.fire('Error', 'Error al actualizar la categoría', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error en la solicitud', 'error');
    }
  };

  return (
    <div>
      <Navegacion>
        <div className="card card-secondary">
          <div className="card-body colorFondo">
            <div className="card card-secondary">
              <div className="card-header">
                <h3 className="card-title">Actualizar categoría</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="id_categoria">Id de la categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      id="id_categoria"
                      value={formData.id_categoria}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre de la categoría</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      maxLength="50"
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                </div>
                <div className="card-footer">
                  <Link to="/ConsultarCate" className="btn btn-secondary mr-2">Volver</Link>
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

export default ActualizarCate;
