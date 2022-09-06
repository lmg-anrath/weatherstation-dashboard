<template>
  <div >
    <FilterPanel @range_clicked="change_range($event)" @clicked="change_visibility($event)" :inputs="keys" />
  </div>
  <div v-for="(item, index) in use_data" :key="index">
    <TempChart :id="item[0]" :data="item[1]" :chart_type="item[0]" />
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
      const data = await fetch(`https://weatherstation.jh220.de/api/get?id=2&d=${e}`).then(r => r.json());
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
      console.log(e)
    }
  }
}
</script>

<style>
</style>