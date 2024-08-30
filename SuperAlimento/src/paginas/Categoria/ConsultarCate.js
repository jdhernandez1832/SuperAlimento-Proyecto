import useDataTable from '../../hooks/useDataTable';
import React, { useState, useEffect, useRef } from 'react';
import Navegacion from "../../componentes/componentes/navegacion";
import "../../componentes/css/Login.css";
import { Link } from "react-router-dom";

const ConsultarCate = () => {
    const tableRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    
    // Aplicar el hook de tabla solo después de que los datos se hayan cargado
    useDataTable(tableRef, categorias); 
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('Rol');

    useEffect(() => {
      const fetchCategorias = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/categoria/todos', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol, // Agregar el token en los encabezados
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCategorias(data);
          } else {
            console.error('Error al obtener las categorías');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
      };
  
      fetchCategorias();
    }, [rol, token]);
    const handleEstado = async (id_categoria) => {
        try {
          const response = await fetch(`http://localhost:3001/api/categoria/estado/${id_categoria}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Rol': rol, 
            },
            body: JSON.stringify({ estado: 'Desactivo' }), // Cambia el estado a 'Desactivo'
          });
      
          if (response.ok) {
            // eslint-disable-next-line no-unused-vars
            const categoriaActualizado = await response.json();
            setCategorias(categorias.filter(categoria => 
                categoria.id_categoria !== id_categoria
            ));
            window.alert('Categoria eliminada:');
          } else {
            console.error('Error al cambiar el estado de la categoria');
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
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Categorías</h3>
                                    </div>
                                    <div className="card-body table-responsive p-0">
                                    {categorias.length === 0 ? (
                                        <p>No hay datos en esta tabla</p>
                                    ) : (
                                        <table ref={tableRef} className="table table-hover text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Id de Categoría</th>
                                                    <th>Nombre de Categoría</th>
                                                    <th>Estado</th>
                                                    <th>Actualizar</th>
                                                    <th>Eliminar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {categorias.map((categoria) => (
                                                categoria.estado !== 'Desactivo' && (
                                                    <tr key={categoria.id_categoria}>
                                                    <td>{categoria.id_categoria}</td>
                                                    <td>{categoria.nombre}</td>
                                                    <td>{categoria.estado}</td>
                                                    <td>
                                                        <Link to={`/ActualizarCate/${categoria.id_categoria}`} className="btn btn-warning">
                                                            Actualizar
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <button 
                                                        className="btn btn-danger"
                                                        onClick={() => handleEstado(categoria.id_categoria)}
                                                        >
                                                        Eliminar
                                                        </button>
                                                    </td>
                                                    </tr>
                                                )
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Navegacion>
        </div>
    );
}

export default ConsultarCate;
