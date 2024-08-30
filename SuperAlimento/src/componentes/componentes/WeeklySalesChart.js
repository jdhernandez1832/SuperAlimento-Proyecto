// src/components/WeeklySalesChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

const WeeklySalesChart = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchWeeklySales = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/venta/semana');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Verifica que `result` contiene datos válidos
        console.log('Datos de ventas:', result);

        setData({
          labels: result.dates.filter(date => date),
          datasets: [
            {
              label: 'Ventas de la Última Semana',
              data: result.sales.filter(sale => sale !== null),
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching weekly sales:', error);
      }
    };

    fetchWeeklySales();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Ventas de la Última Semana</h2>
      <Line data={data} />
    </div>
  );
};

export default WeeklySalesChart;
