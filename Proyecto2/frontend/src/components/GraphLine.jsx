import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraphLine = ({ title, type,  dataGraph }) => {
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
            borderColor: "blue",
            backgroundColor: "blue",
          }, 
        ],
      };

  return <Line options={options} data={data} />;
};

export default GraphLine;
