<template>
  <div class="main-chart-container">
    <p class="heading" style="padding-top: 30px;">
      <a class="heading-link" :href="chart_id">{{heading}}</a>
    </p>
    <Range @rangechange="update_range($event)" :label_name="heading" :max="max_num"/>
    <div class="chart-container">
      <Line
        :chart-options="chartOptions"
        :chart-data="chart_data"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
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
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import Range from './Range.vue';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

export default {
  name: 'TempChart',
  components: { Line, Range, Bar },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
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
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object
    },
    chart_type: {
      type: String
    }
  },
  methods: {
    get_data(len) {
      var data = this.$props.data;
      const name = this.$props.chart_type;
      this.heading = (name == 'temperature') ? 'Temperatur': ((name == 'humidity') ? 'Luftfeuchtigkeit' : ((name == 'air_pressure') ? 'Luftdruck' : ((name == 'air_particle_pm25') ? 'Partikel (2.5)' : 'Partikel (10)')));
      var labels = [];
      var datasets = [];
      for (let i = data.length - len; i < data.length; i++) {
        const label = data[i].x.split('.')[0];
        labels.push(label.split('T')[0] + '    ' + label.split('T')[1]);
        var y = data[i].y;
        datasets.push(y);
      }
      this.max_num = parseInt(data.length / 4);
      const res = {
        labels: labels,
        datasets: [
          {
            label: name,
            backgroundColor: 'rgb(151, 155, 209)',
            data: datasets,
            borderColor: 'rgb(151, 155, 209)',
            fill: false,
            cubicInterpolationMode: 'monotone',
          }
        ]
      }
      return res;
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
    setInterval(() => {
      if (this.data != this.last_data) {
        console.log('NEW')
        this.last_data = this.data;
        this.chart_data = this.get_data(this.data.length);
      }
    }, 1000);
  },
  data() {
    return {
      chartOptions: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: false
        },
        interaction: {
          intersect: false,
        },
        scales: {
            y: {
                display: true,
                beginAtZero: (this.$props.chart_type == 'humidity') ? true : false,
                max: (this.$props.chart_type == 'humidity') ? 100 : undefined,
                grace: (this.$props.chart_type == 'temperature' || this.$props.chart_type == 'air_pressure') ? '15%' : '0'
            },
            x: {
                display: false
            },
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
  }
}
</script>

<style>
  .heading {
    color: rgb(185, 185, 196);
    text-align: center;
    width: 750px;
    font-size: 1.5rem;
    font-weight: 600;
  }
  .heading-link {
    color: white;
  }
  .chart-container {
    width: 50vw;
    padding: 0;
    margin: 0;
  }
  #line-chart {
    margin-left: calc(100px / 2);
  }
  .main-chart-container {
    background-color: rgb(51, 54, 72);
    width: 750px;
    height: 350px;
    border-radius: 15px;
    margin-left: calc(50vw - (750px / 2));
  }
  @media screen and (max-width: 775px) {
    .main-chart-container {
      background-color: rgb(51, 54, 72);
      width: 100vw;
      height: calc(70vw);
      border-radius: 15px;
      margin-left: 1px;
    }
    body,html {
      overflow-x: hidden;
    }
    .heading {
      width: 100vw;
    }
    .chart-container {
      width: 100vw;
      overflow: hidden;
    }
    #line-chart {
      margin: 10px;
    }
    canvas {
      max-width: 96vw;
      max-height: calc(0.3 * 96vw);
    }
  }
</style>