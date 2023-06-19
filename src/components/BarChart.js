import React, { useEffect, useRef }  from 'react';
import { Chart as ChartJS}  from 'chart.js';


const BarChart = ({ data, xField, yFields }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance) {
      // Limpiar los datos y opciones del gráfico actual
      chartInstance.data.datasets = [];
      chartInstance.update();
    }

    // Agrupar y sumarizar los valores del eje Y por campos del eje X
    const groupedData = data.reduce((accumulator, item) => {
      const xValue = item[xField];

      yFields.forEach(yField => {
        const yValue = item[yField];

        if (!accumulator[yField]) {
          accumulator[yField] = {};
        }

        if (accumulator[yField][xValue]) {
          accumulator[yField][xValue] += yValue;
        } else {
          accumulator[yField][xValue] = yValue;
        }
      });

      return accumulator;
    }, {});

    const labels = Object.keys(groupedData[yFields[0]] || {});
    const datasets = yFields.map(yField => ({
      label: yField,
      data: Object.values(groupedData[yField] || {} ),
      backgroundColor: getRandomColor(),
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }));

    // Crear el gráfico de barras agrupadas utilizando Chart.js
    chartInstance = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      // Limpiar la instancia de Chart.js al desmontar el componente
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, xField, yFields]);

  return <canvas ref={chartRef}></canvas>;
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default BarChart;
