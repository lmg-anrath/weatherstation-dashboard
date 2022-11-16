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
  TimeSeriesScale
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
        console.log(data[i].color)
        const color = `rgb(${data[i].color})`;
        var use_data = [];
        for (let x = 0; x < data[i].data.length; x++) {
          labels.push(data[i].data[x].x + 'y');
          var date = new Date(data[i].data[x].x);
          date.setSeconds(0,0);
          use_data[x] = {
            "x": date,//Math.round((new Date(data[i].data[x].x)).getTime() / 1000),
            "y": data[i].data[x].y,
          }
        }
        const station = data[i].station;
        datasets.push({
          label: station,
          backgroundColor: color,
          data: use_data,
          borderColor: color,
          fill: false,
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
      console.log(e)
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
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        pointRadius: 1,
        pointHoverRadius: 4,
        plugins: {
            legend: false,
        },
        interaction: {
          mode: 'x',
          intersect: false,
        },
        scales: {
          x: {
            type: "time",
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
      last_data: {}
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
    height: 240px;
    padding-left: 50px;
  }
  .heading {
    color: rgb(185, 185, 196);
    text-align: center;
    width: 750px;
    font-size: 1.5rem;
    font-weight: 600;
    padding-top: 30px;
  }
  .heading-link {
    color: white;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .chart-container {
    position: relative;
    padding: 0;
    margin: 0;
  }
  .main-chart-container {
    background-color: rgba(51, 54, 72, 0.689);
    width: 750px;
    height: 350px;
    border-radius: 15px;
    margin-left: calc(50vw - (750px / 2));
  }
  @media screen and (max-width: 700px) {
    .main-chart-container {
      background-color: rgba(51, 54, 72, 0.689);
      width: 100vw;
      height: 250px;
      border-radius: 15px;
      margin-left: 1px;
    }
    .heading {
      width: 100vw;
      padding-top: 13px;
    }
    .chart-container {
      width: 100vw;
      overflow: hidden;
    }
    canvas {
      max-width: 96vw;
      max-height: calc(0.6 * 96vw);
    }
    .chart {
      width: 80vw;
      height: 160px;
      padding-left: calc(7vw);
    }
  }
</style>