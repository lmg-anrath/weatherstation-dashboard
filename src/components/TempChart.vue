<template>
  <div class="main-chart-container">
    <div class="heading">
      <div class="heading-link">{{heading}}</div>
    </div>
    <div class="chart-container">
      <Line
        :chart-options="chartOptions"
        :chart-data="chart_data"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script>
import { Bar, Line } from 'vue-chartjs';
import * as ChartImport from 'chart.js';
const {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
} = ChartImport.default ? ChartImport.default : ChartImport;
Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale);
import 'chartjs-adapter-date-fns';

export default {
  components: { Line, Bar },
  props: {
    width: {
      type: Number,
      default: 650
    },
    height: {
      type: Number,
      default: 200
    },
    cssClasses: {
      default: 'chart',
      type: String
    },
    styles: {
      type: Object,
      default: () => {return {position: 'relative'}}
    },
    data: { type: Object },
    chart_type: { type: String }
  },
  methods: {
    get_data() {
      var data_num = 0;
      var data = this.$props.data;
      const name = this.$props.chart_type;
      const map = {
        'temperature': 'Temperatur',
        'humidity': 'Luftfeuchtigkeit',
        'air_pressure': 'Luftdruck',
        'air_particle_pm25': 'Partikel (2.5)',
        'air_particle_pm10': 'Partikel (10)'
      }
      this.heading = map[name];
      var datasets = [];
      for (let i = 0; i < data.length; i++) {
        const color = `rgb(${data[i].color})`;
        var use_data = [];
        for (let x = 0; x < data[i].data.length; x++) {
          var date = new Date(data[i].data[x].x);
          date.setSeconds(0,0);
          date.setHours(date.getHours());
          use_data[x] = {
            "x": date,
            "y": data[i].data[x].y,
          }
        }
        const station = data[i].station;
        datasets.push({
          label: station,
          backgroundColor: color,
          data: use_data,
          borderColor: color,
          fill: true,
          cubicInterpolationMode: 'monotone',
        });
        if (use_data.length > data_num) {
          data_num = use_data.length;
        }
      }
      const res = {
        datasets: datasets,
      }
      if (this.data.length > 0) {
        var most = -1;
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].data.length > most) {
            most = i;
          }
        }
        if (most == 0) {
          this.hours_given = 0;
          return res;
        }
        var first = new Date(this.data[most].data[0].x);
        var last = new Date(this.data[most].data[this.data[most].data.length - 1].x);
        var hours = Math.abs(first - last) / 36e5;
        this.hours_given = hours;
      }
      if (this.hours_given > 24) {
        this.chartOptions.scales.x.time.displayFormats.hour = 'MMM dd';
      } else {
        this.chartOptions.scales.x.time.displayFormats.hour = 'HH:mm';
      }
      return res;
    },
  },
  mounted() {
    this.chart_data = this.get_data(this.data.length);
  },
  data() {
    return {
      hours_given: 0,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        pointRadius: 0.01,
        pointHoverRadius: 4,
        spanGaps: false,
        clip: false,
        plugins: {
          legend: false,
          tooltip: {
            mode: 'x',
            displayColors: true,
            intersect: false,
            filter: function (tooltipItem, currentIndex, tooltipItems) {
              return tooltipItems[currentIndex].datasetIndex !== tooltipItems[currentIndex - 1]?.datasetIndex
            },
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy',
              }
            }
          }
        },
        interaction: {
          mode: 'x',
          intersect: false,
        },
        scales: {
          x: {
            type: "time",
            time: {
              displayFormats: {
                'hour': 'HH:mm',
                'week': 'MMM dd',
              }
            },
            distribution: 'series',
            position: "bottom",
            display: true,
          },
          y: {
            type: "linear",
            position: "left",
            display: true,
            beginAtZero: (this.$props.chart_type == 'humidity') ? true : false,
            max: (this.$props.chart_type == 'humidity') ? 100 : undefined,
            grace: (this.$props.chart_type == 'temperature' || this.$props.chart_type == 'air_pressure') ? '15%' : '0'
          }
        },
        animation: true
      },
      heading: ' ',
      chart_data: {},
    }
  },
  watch: {
    data: {
      handler() {
        this.chart_data = this.get_data(this.data.length);
      },
      deep: true
    }
  },
}
</script>

<style>
  .chart {
    width: 650px;
    height: 255px;
    padding-left: 40px;
  }
  .heading {
    text-align: center;
    width: 750px;
    font-size: 26px;
    font-weight: 600;
    padding-top: 30px;
    margin-bottom: 15px;
  }
  .heading-link {
    color: rgb(198, 211, 236);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .chart-container {
    position: relative;
    padding: 0;
    margin: 0;
  }
  .main-chart-container {
    background-color: rgba(91, 95, 96, 0.1);
    width: 750px;
    height: 350px;
    margin-top: 23px;
    border-radius: 15px;
    margin-left: calc(50vw - (750px / 2));
    backdrop-filter: blur(4.1px);
    -webkit-backdrop-filter: blur(4.1px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.2s;
  }
  .main-chart-container:nth-of-type(2) {
    border-radius: 0;
  }
  @media screen and (max-width: 776px) {
    .main-chart-container {
      width: 100%;
      height: 275px;
      border-radius: 0px;
      box-shadow: none;
      /*margin: 13px 0 0 0;*/
      margin: 0;
      padding: 0;
    }
    .heading {
      width: 100%;
      font-size: 23px;
    }
    .chart-container {
      width: 100%;
    }
    canvas {
      max-width: 96vw;
      max-height: calc(0.6 * 96vw);
    }
    .chart {
      width: 80vw;
      height: 185px;
      padding-left: calc(7vw);
    }
  }
</style>