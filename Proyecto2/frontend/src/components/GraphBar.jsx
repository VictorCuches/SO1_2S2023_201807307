import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraphBar = ({ title, type,  dataGraph }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: title,
            },
        },
    };

    const labels = (type === 'count' ) ? dataGraph.map(item => item.cod_curso) : dataGraph.map(item => item.carnet);

    const data = {
    labels,
    datasets: [
        {
        label: 'Valor',
        data: (type === 'count' ) ? dataGraph.map(item => item.cantidad) : dataGraph.map(item => parseInt(item.promedio)),
        backgroundColor: 'rgba(54, 162, 235, 1)',
        },
    ],
    };

  return <Bar options={options} data={data} />;
}

export default GraphBar;

