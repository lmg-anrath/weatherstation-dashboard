<template>
  <div >
    <FilterPanel @range_clicked="change_range($event)" @clicked="change_visibility($event)" :inputs="keys" />
  </div>
  <div v-for="(item, index) in use_data" :key="index">
    <TempChart :id="item.type" :data="item.station_data" :chart_type="item.type" />
  </div>
</template>

<script>
import TempChart from '../components/TempChart.vue';
import FilterPanel from '../components/FilterPanel.vue';

export default {
  components: {
    TempChart,
    FilterPanel
  },
  props: {
    data: Object,
    keys: Array
  },
  data() {
    return {
      use_data: {}
    }
  },
  mounted() {
    this.use_data = this.data;
  },
  methods: {
    change_visibility(x) {
      const id = x.replaceAll(' ', '');
      const element = document.getElementById(id);
      element.hidden = !element.hidden;
    },
    async change_range(e) {
      var error = {
        error: false,
        error_string: ''
      };
      var station_keys;
      try {
        station_keys = await (await fetch('https://weatherstation.jh220.de/api/stations')).json();
        console.log(station_keys)
      } catch (err) {
        error.error = true;
        error.error_string = err;
      }
      const temp_chart = { type: 'temperature', station_data: [] };
      const humi_chart = { type: 'humidity', station_data: [] };
      const pres_chart = { type: 'air_pressure', station_data: [] };
      const part_25_chart = { type: 'air_particle_pm25', station_data: [] };
      const part_10_chart = { type: 'air_particle_pm10', station_data: [] };
      for (let i = 1; i <= station_keys.length; i++) {
        try {
          const res = await (await fetch(`https://weatherstation.jh220.de/api/get?id=${i}&d=day`)).json();
          temp_chart.station_data?.push({ station: station_keys[i-1], data: res.temperature });
          humi_chart.station_data?.push({ station: station_keys[i-1], data: res.humidity });
          pres_chart.station_data?.push({ station: station_keys[i-1], data: res.air_pressure });
          part_25_chart.station_data?.push({ station: station_keys[i-1], data: res.air_particle_pm25 });
          part_10_chart.station_data?.push({ station: station_keys[i-1], data: res.air_particle_pm10 });
        } catch (err) {
          error.error = true;
          error.error_string = err;
        }
      }
      this.use_data = [temp_chart,humi_chart,pres_chart,part_25_chart,part_10_chart];
      /*const data = await fetch(`https://weatherstation.jh220.de/api/get?id=2&d=${e}`).then(r => r.json());
      var keys = Object.keys(data);
      var keys_and_id = [];
      var formatted = [];
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const id = (key == 'temperature') ? 'Temperatur': ((key == 'humidity') ? 'Luftfeuchtigkeit' : ((key == 'air_pressure') ? 'Luftdruck' : ((key == 'air_particle_pm25') ? 'Partikel (2.5)' : 'Partikel (10)')));
        keys_and_id.push([key, id]);
        formatted[i] = [keys[i],data[keys[i]]];
      }
      this.use_data = formatted;
      console.log(e)*/
    }
  }
}
</script>

<style>
</style>