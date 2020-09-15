import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const BAR_HEIGHT = 50;

export const drawChart = (statisticCtx, data) => {

  const labels = [];
  const dataset = [];

  data.forEach((entry) => {
    labels.push(entry.genre);
    dataset.push(entry.moviesCount);
  });

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * dataset.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [
        {
          data: dataset,
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 24,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};
