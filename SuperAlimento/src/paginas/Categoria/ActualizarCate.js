import React, { useState, useEffect } from 'react';
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";
import { Link, useParams, useNavigate } from "react-router-dom";

const ActualizarCate = () => {
  const { id_categoria } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
  });

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/categoria/${id_categoria}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data); 
        } else {
          console.error('Error al obtener la categoría');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchCategoria();
  }, [id_categoria]);

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
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Categoría actualizada:', result);
        navigate('/ConsultarCate');
      } else {
        console.error('Error al actualizar la categoría');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div>
      <Navegacion>
        <div className="card card-success">
          <div className="card-body colorFondo">
            <div className="card card-success">
              <div className="card-header">
                <h3 className="card-title">Actualizar categoría</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="nombre">Id de la categoria</label>
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
                  <Link to="/ConsultarCate" className="btn btn-primary custom-button mr-2">Volver</Link>
                  <button type="submit" className="btn btn-primary custom-button">Actualizar</button>
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
