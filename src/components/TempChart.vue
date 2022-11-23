<template>
  <div class="main-chart-container">
    <p class="heading">
      <a class="heading-link" href="/">{{heading}}</a>
    </p>
    <!--<Range @rangechange="update_range($event)" :label_name="heading" :max="max_num"/>-->
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

import { Bar, Line } from 'vue-chartjs'
//import Chart from 'chart.js/auto';

import * as ChartImport from 'chart.js';
//import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.mjs';
import Range from './Range.vue';
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
  components: { Line, Range, Bar },
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
      default: () => {
        return {
          position: 'relative',
        }
      }
    },
    data: { type: Object },
    chart_type: { type: String }
  },
  methods: {
    get_data() {
      var data_num = 0;
      var data = this.$props.data;
      const name = this.$props.chart_type;
      this.heading = (name == 'temperature') ? 'Temperatur': ((name == 'humidity') ? 'Luftfeuchtigkeit' : ((name == 'air_pressure') ? 'Luftdruck' : ((name == 'air_particle_pm25') ? 'Partikel (2.5)' : 'Partikel (10)')));
      var labels = [];
      var datasets = [];
      
      for (let i = 0; i < data.length; i++) {
        const color = `rgb(${data[i].color})`;
        var use_data = [];
        for (let x = 0; x < data[i].data.length; x++) {
          labels.push(data[i].data[x].x + 'y');
          var date = new Date(data[i].data[x].x);
          date.setSeconds(0,0);
          date.setHours(date.getHours() - 2);
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
      this.max_num = parseInt(data_num / 4);
      const res = {
        datasets: datasets,
      }

      // set labels
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
        console.log(first)
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
    shuffle(arr) {
      var res_arr = arr;
      for (let i = 0; i < res_arr.length; i++) {
        res_arr[i] += Math.floor(Math.random() * (10 + 10 + 1) - 10)
      }
      return res_arr;
    },
    update_range(e) {
      this.chart_data = this.get_data(parseInt(e));
    },
    toggle_vis(e) {
      if (this.hidden) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    }
  },
  mounted() {
    this.chart_data = this.get_data(this.data.length);
    this.chart_id = this.$props.chart_type;
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
      chart_id: '',
      hidden: false,
      max_num: 0,
      last_data: {},
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
    border-radius: 15px;
    margin-left: calc(50vw - (750px / 2));
    backdrop-filter: blur(4.1px);
    -webkit-backdrop-filter: blur(4.1px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }
  @media screen and (max-width: 776px) {
    .main-chart-container {
      width: 100%;
      height: 250px;
      border-radius: 15px;
      margin: 0;
      padding: 0;
    }
    .heading {
      width: 100%;
      padding-top: 13px;
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