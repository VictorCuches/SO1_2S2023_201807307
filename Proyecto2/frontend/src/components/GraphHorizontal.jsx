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

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Curso vs Cant de Alumnos',
    },
  },
};

const labels = ['Sistemas Operativos 1', 'Bases de Datos 1', 'Lenguajes Formales', 'Software Avanzado', 'Analisis y Diseno 1'];



const GraphHorizontal = ({courses, noStudents}) => {

    const labels = courses;

    const data = {
        labels: labels,
        datasets: [
            {
            label: 'Alumnos',
            data: noStudents,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

  return <Bar options={options} data={data} />;
};

export default GraphHorizontal;
