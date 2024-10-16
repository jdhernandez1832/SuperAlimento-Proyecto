import React, { useState, useEffect } from "react";
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert

const Perfil = () => {
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
    }, [numero_documento, token, rol]); // Dependencias adecuadas
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`http://localhost:3001/api/usuario/actualizar/${numero_documento}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
            'Content-Type': 'application/json', // Asegúrate de agregar este encabezado
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Usuario actualizado:', result);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Usuario actualizado correctamente',
            confirmButtonColor: '#28a745', // Color verde
          }).then(() => {
            navigate('/Index'); // Redireccionar después de la alerta
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el usuario',
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
                  <h3 className="card-title">Actualizar Perfil</h3>
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
                        disabled
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
                    <div className="form-group" hidden>
                      <label htmlFor="id_rol">Rol</label>
                      <select
                        className="custom-select form-control-border border-width-2"
                        id="id_rol"
                        value={formData.id_rol}
                        onChange={handleChange}
                        required
                        disabled
                      >
                        <option value="">Seleccionar...</option>
                        <option value="1">Administrador</option>
                        <option value="2">Cajero</option>
                        <option value="3">Inventarista</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="clave">Contraseña</label>
                      <input
                        className="form-control"
                        id="clave"
                        onChange={handleChange}
                        required
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <Link to="/Index" className="btn btn-secondary mr-2">Volver</Link>
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

export default Perfil;
