// src/componentes/componentes/GananciasMensuales.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Table from 'react-bootstrap/Table';

const GananciasMensuales = () => {
  const [datos, setDatos] = useState([]);
  const [grafica, setGrafica] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/api/venta/todos')
      .then(response => response.json())
      .then(data => {
        if (data) {
          const meses = Object.keys(data);
          const ganancias = Object.values(data);

          setDatos(meses.map((mes, index) => ({
            mes,
            ganancia: ganancias[index]
          })));

          setGrafica({
            labels: meses,
            datasets: [
              {
                label: 'Ganancias Mensuales',
                data: ganancias,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
            ],
          });
        }
      })
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  return (
    <div>
      <h2>Ganancias Mensuales</h2>
      <Line data={grafica} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Ganancias Mensuales' } } }} />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ganancia</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? datos.map((item, index) => (
            <tr key={index}>
              <td>{item.mes}</td>
              <td>${item.ganancia.toFixed(2)}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="2">No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default GananciasMensuales;
