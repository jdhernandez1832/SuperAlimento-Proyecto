// SalesChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const data = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    datasets: [{
      label: 'Ventas',
      backgroundColor: 'rgba(60,141,188,0.9)',
      borderColor: 'rgba(60,141,188,0.8)',
      data: [10, 20, 40, 50, 20, 10, 5], // Valores de ejemplo
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas por últimos 7 días',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default SalesChart;
