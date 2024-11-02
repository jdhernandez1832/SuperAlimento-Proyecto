import React, { useEffect, useState } from "react";
import Navegacion from "../../componentes/componentes/navegacion"; 
import "../../componentes/css/Login.css";

const ConsultarInci = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);
  const [paginaActual, setPaginaActual] = useState(1);
  
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('Rol');

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/incidencia/todos", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Rol': rol,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        setIncidencias(data);
      } catch (error) {
        console.error("Error fetching incidencias:", error);
      }
    };

    fetchIncidencias();
  }, [token, rol]);

  // Filtramos incidencias por búsqueda
  const incidenciasFiltradas = incidencias.filter(incidencia => 
    incidencia.descripcion_incidencia.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtramos incidencias por fecha seleccionada
  const incidenciasPorFecha = fechaSeleccionada ? incidenciasFiltradas.filter(incidencia =>
    new Date(incidencia.fecha_incidencia).toLocaleDateString() === new Date(fechaSeleccionada).toLocaleDateString()
  ) : incidenciasFiltradas; // Si no hay fecha, mostramos todas las incidencias filtradas por búsqueda

  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const incidenciasMostradas = incidenciasPorFecha.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(incidenciasPorFecha.length / registrosPorPagina);
  const totalFiltrados = incidenciasPorFecha.length;

  return (
    <div>
      <Navegacion>
        <div className="card card-success">
          <div className="card-body colorFondo">
            <div className="row">
              <div className="col-12 mb-2">
                <h2>Incidencias</h2>
                <div className="input-group mb-3 w-100">
                  <input 
                    type="text" 
                    className="form-control form-control-sm rounded-pill flex-grow-1"
                    placeholder="Buscar incidencia"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="col-12 mb-2 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <label htmlFor="registrosPorPagina" className="d-inline">Registros por página:</label>
                    <select 
                      id="registrosPorPagina" 
                      className="form-control form-control-sm d-inline-block w-auto ml-2"
                      value={registrosPorPagina} 
                      onChange={(e) => setRegistrosPorPagina(Number(e.target.value))}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="d-flex align-items-center ml-auto">
                    <label htmlFor="fechaSeleccionada" className="d-inline">Filtrar por fecha:</label>
                    <input 
                      type="date" 
                      className="form-control form-control-sm w-auto ml-2"
                      value={fechaSeleccionada}
                      onChange={(e) => setFechaSeleccionada(e.target.value)}
                    />
                    <button 
                      className="btn btn-secondary ml-2"
                      onClick={() => setPaginaActual(1)} // Reinicia la paginación al buscar por fecha
                    >
                      Filtrar
                    </button>
                  </div>
                </div>
              </div>
              {incidenciasMostradas.length === 0 ? (
                <p>No hay datos en esta vista</p>
              ) : (
                <div className="row w-100">
                  {incidenciasMostradas.map((incidencia) => (
                    <div className="col-12 col-sm-6 col-md-4 mb-4 p-2" key={incidencia.id_incidencia}>
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{incidencia.descripcion_incidencia}</h5>
                          <img src={incidencia.producto.imagen ? `http://localhost:3001/uploads/${incidencia.producto.imagen}` : ''} 
                            style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} 
                            className="card-img-top" 
                            alt="Imagen Productos" />
                          <p>
                            Fecha: {new Date(incidencia.fecha_incidencia).toLocaleDateString()}
                          </p>
                          <p>Cantidad Afectada: {incidencia.cantidad_afectada}<br />
                            Producto: {incidencia.producto.nombre_producto}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <nav aria-label="Page navigation" className="text-center">
              <div className="text-left">
                <p className="col-12">Mostrando de {indicePrimerRegistro + 1} a {Math.min(indiceUltimoRegistro, totalFiltrados)} registros de {totalFiltrados}</p>
              </div>
              <div className="btn-group" role="group" aria-label="Paginación">
                <button 
                  className="btn btn-secondary mr-2" 
                  onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                >
                  Anterior
                </button>
                {[...Array(totalPaginas)].map((_, index) => (
                  <button 
                    key={index} 
                    className={`btn btn-secondary ${paginaActual === index + 1 ? 'active' : ''}`} 
                    onClick={() => setPaginaActual(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  className="btn btn-secondary ml-2" 
                  onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                >
                  Siguiente
                </button>
              </div>
            </nav>
          </div>
        </div>
      </Navegacion>
    </div>
  );
}

export default ConsultarInci;
