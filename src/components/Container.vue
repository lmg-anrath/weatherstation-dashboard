<template>
  <div style="padding-bottom: 50px; position: relative;">
    <div>
      <FilterPanel @range_clicked="change_range($event)" @clicked="change_visibility($event)" :inputs="keys" />
    </div>
    <div id="charts">
      <div v-for="(item, index) in use_data" :key="index">
        <div v-if="item != undefined">
          <TempChart :id="item.type" :data="item.station_data" :chart_type="item.type" />
        </div>
      </div>
    </div>
    <div id="x">
      <MapContainer />
    </div>
  </div>
</template>

<script>
import TempChart from '../components/TempChart.vue';
import FilterPanel from '../components/FilterPanel.vue';
import MapContainer from '../components/MapContainer.vue';
import VueCookie from 'vue-cookie';

export default {
  components: {
    TempChart,
    FilterPanel,
    MapContainer
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
    this.change_range('day');
    //this.use_data = this.data;
  },
  methods: {
    change_visibility(x) {
      const id = x.replaceAll(' ', '');
      const element = document.getElementById(id);
      element.hidden = !element.hidden;
    },
    async change_range(e) {
      if (VueCookie.get(`data_${e}`) == 'true') {
        console.log('cached');
        const c_data = JSON.parse(localStorage.getItem(`data_${e}`));
        if (c_data) {
          this.use_data = c_data;
          return;
        }
      }
      var error = {
        error: false,
        error_string: ''
      };
      var station_keys;
      try {
        station_keys = await (await fetch('https://api.wetterstation-lmg.de/stations')).json();
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
          const res = await (await fetch(`https://api.wetterstation-lmg.de/get?id=${i}&d=${e}`)).json();
          temp_chart.station_data?.push({ station: station_keys[i-1].name, data: res.temperature });
          humi_chart.station_data?.push({ station: station_keys[i-1].name, data: res.humidity });
          pres_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_pressure });
          part_25_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_particle_pm25 });
          part_10_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_particle_pm10 });
        } catch (err) {
          error.error = true;
          error.error_string = err;
        }
      }
      this.use_data = [temp_chart,humi_chart,pres_chart,part_25_chart,part_10_chart];
      const save = JSON.stringify(this.use_data);
      localStorage.setItem(`data_${e}`, save)
      var now = new Date();
      var to = new Date(Math.ceil(now.getTime() / (1000 * 60 * 15)) * 1000 * 60 * 15);
      to.setSeconds(15,0);
      VueCookie.set(`data_${e}`, true, { expires: to });
    }
  }
}
</script>

<style>
/*#charts {
  position: absolute;
}*/
#x {
  height: 350px;
  width: 750px;
  margin-left: calc(50vw - (750px / 2));
  margin-top: 30px;
  transition: all 0.1s;
}

@media screen and (min-width: 775px) {
  #x:hover {
    width: 80vw;
    height: 90vh;
    margin-left: calc(50vw - (80vw / 2));
    position: sticky;
  }
}
@media screen and (max-width: 775px) {
    #x {
      width: 100vw;
      height: 60vw;
      border-radius: 15px;
      margin-left: 1px;
    }
  }
</style>