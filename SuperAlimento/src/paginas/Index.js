// src/components/VentaList.js
import React, { useEffect, useState } from 'react';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/plugins/jquery/jquery.min.js';
import 'admin-lte/dist/js/adminlte.min.js';
import Navegacion from './../componentes/componentes/navegacion';
import WeeklySalesChart from './../componentes/componentes/WeeklySalesChart';
const VentaList = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/venta/todos'); // Asegúrate de que esta ruta sea la correcta en tu backend
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVentas(data);
      } catch (error) {
        console.error('Error fetching ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  return (
  <Navegacion>
       <WeeklySalesChart />
    <div className="wrapper">
      <div className="content-wrapper">
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Lista de Ventas</h3>
                  </div>
                  <div className="card-body">
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>ID Venta</th>
                          <th>Fecha Venta</th>
                          <th>Método de Pago</th>
                          <th>Caja</th>
                          <th>Total Venta</th>
                          <th>Documento Usuario</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ventas.map((venta) => (
                          <tr key={venta.id_venta}>
                            <td>{venta.id_venta}</td>
                            <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                            <td>{venta.metodo_pago}</td>
                            <td>{venta.caja}</td>
                            <td>{venta.total_venta}</td>
                            <td>{venta.numero_documento}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </Navegacion>
  );
};

export default VentaList;
