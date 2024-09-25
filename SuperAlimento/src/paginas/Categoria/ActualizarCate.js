/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Importa SweetAlert2

const ActualizarCate = () => {
  const { id_categoria } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/categoria/${id_categoria}`, {
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
            confirmButtonColor: '#dc3545', // Cambia el color aquí
          });
        }
      } catch (error) {
        Swal.fire('Error', 'Error en la solicitud', 'error');
      }
    };

    fetchCategoria();
  }, [id_categoria, rol, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/api/categoria/actualizar/${id_categoria}`, {
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
        Swal.fire({
          title: 'Éxito',
          text: 'Categoría actualizada exitosamente',
          icon: 'success',
          confirmButtonColor: '#28a745', // Cambia el color aquí
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
                    <label htmlFor="nombre">Id de la categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={formData.id_categoria}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </div>
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
