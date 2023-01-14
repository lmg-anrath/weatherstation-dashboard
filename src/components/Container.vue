<template>
  <div id="main">
    <div>
      <FilterPanel @date_range="change_range($event, 'true')" @range_clicked="change_range($event)" @clicked="change_visibility($event)" />
    </div>
    <div id="bg" style="">
    </div>
    <div id="charts" v-if="use_data.length > 0">
      <div v-for="(item, index) in use_data" :key="index" class="chart-spawner">
        <div v-if="item != undefined">
          <TempChart class="transition-in scale-in" :id="item.type" :data="item.station_data" :chart_type="item.type" />
        </div>
      </div>
    </div>
    <div id="loading" v-else><h2>Loading Data...</h2></div>
    <div id="map-container" v-if="show_map">
      <MapContainer :keyi="keyy" :current_data="use_data" />
    </div>
  </div>
  <div id="footer">
    <div id="oweather">
      <p>
        Weather data provided by OpenWeather (Wind data)<br>
        <a href="https://openweathermap.org/">(https://openweathermap.org/)</a>
      </p>
      <img height="50" width="80" id="ow-img" src="/OpenWeather-Master-LogoRGB.png" />
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
    keyy: String
  },
  data() {
    return {
      use_data: {},
      show_map: false,
      station_keys: {}
    }
  },
  mounted() {
    this.change_range('day');
  },
  methods: {
    change_visibility(x) {
      const id = x.replaceAll(' ', '');
      const element = document.getElementById(id);
      element.hidden = !element.hidden;
    },
    async change_range(e, date_range=null) {
      if (VueCookie.get(`data_${e}`) == 'true' && !date_range) {
        const c_data = JSON.parse(localStorage.getItem(`data_${e}`));
        if (c_data) {
          this.use_data = c_data;
          this.show_map = true;
          return;
        }
      }
      //var now = new Date();
      var error = {
        error: false,
        error_string: ''
      };
      //new api
      /*let err = undefined;
      let station_keys;
      try {
        station_keys = await (await fetch("https://api.wetterstation-lmg.de/v2/stations")).json();
      } catch (error) {
        err = new Error(error);
      }
      let time_start, time_end, step;
      if (!date_range) {
        time_start = now.getTime() - (24 * 60 * 60 * 1000);
        time_end = new.getTime();
        step = 15;
      }
      const data = await (await fetch(`https://api.wetterstation-lmg.de/v2/stations/aggregate?ids=${e.ids}&start=${e.start}&end=${e.end}%step`)).json();*/
      try {
        document.getElementById("charts").classList.add("transition-out")
      } catch (error) {
        
      }
      
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

      if (!date_range) {
        for (let i = 1; i <= station_keys.length; i++) {
          try {
            const res = await (await fetch(`https://api.wetterstation-lmg.de/get?id=${i}&d=${e}`)).json();
            temp_chart.station_data?.push({ station: station_keys[i-1].name, data: res.temperature, color: station_keys[i-1].color });
            humi_chart.station_data?.push({ station: station_keys[i-1].name, data: res.humidity, color: station_keys[i-1].color });
            pres_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_pressure, color: station_keys[i-1].color });
            part_25_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_particle_pm25, color: station_keys[i-1].color });
            part_10_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_particle_pm10, color: station_keys[i-1].color });
          } catch (err) {
            error.error = true;
            error.error_string = err;
          }
        }
      } else {
        for (let i = 1; i <= station_keys.length; i++) {
          try {
            const res = await (await fetch(`https://api.wetterstation-lmg.de/get?id=${i}&min=${e.min}&max=${e.max}`)).json();
            temp_chart.station_data?.push({ station: station_keys[i-1].name, data: res.temperature, color: station_keys[i-1].color });
            humi_chart.station_data?.push({ station: station_keys[i-1].name, data: res.humidity, color: station_keys[i-1].color });
            pres_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_pressure, color: station_keys[i-1].color });
            part_25_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_particle_pm25, color: station_keys[i-1].color });
            part_10_chart.station_data?.push({ station: station_keys[i-1].name, data: res.air_particle_pm10, color: station_keys[i-1].color });
          } catch (err) {
            error.error = true;
            error.error_string = err;
          }
        }
      }
      this.use_data = [temp_chart,humi_chart,pres_chart,part_25_chart,part_10_chart];
      try {
        document.getElementById("charts").classList.remove("transition-out")
        document.getElementById("charts").classList.add("transition-in")
      } catch (error) {
        
      }
      if (date_range) {
        this.show_map = true;
        return;
      };
      const save = JSON.stringify(this.use_data);
      localStorage.setItem(`data_${e}`, save)
      var now = new Date();
      var to = new Date(Math.ceil(now.getTime() / (1000 * 60 * 15)) * 1000 * 60 * 15);
      to.setSeconds(15,0);
      VueCookie.set(`data_${e}`, true, { expires: to });
      this.show_map = true;
    }
  }
}
</script>

<style scoped>
  #main {
    padding-bottom: 50px;
    min-height: 100vh;
    position: relative;
  }
  #charts {
    z-index: 10;
  }
  #bg {
    width: 100%;
    height: 100vh;
    position: absolute;
  }
  #loading {
    width: 100vw;
    text-align: center;
    position: absolute;
  }
  
  @keyframes scale-in {
    0% {
      height: 0px;
    }
  }
  @keyframes transition-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes transition-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  #map-container {
    overflow: hidden;
    height: 350px;
    width: 750px;
    margin-left: calc(50vw - (750px / 2));
    margin-top: 30px;
    transition: all 0.5s;
    background-color: rgb(242,243,224);
    border-radius: 15px;
    opacity: 0;
    animation-name: transition-in;
    animation-delay: 1s;
    animation-fill-mode: forwards;
    animation-duration: 1s;
  }
  .transition-in {
    animation-name: transition-in;
    animation-fill-mode: forwards;
    animation-duration: 1s;
  }
  .transition-out {
    animation-name: transition-out;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
  }
  .scale-in {
    animation-name: scale-in;
    animation-duration: 2s;
  }
  @media screen and (min-width: 776px) {
    #map-container:hover {
      width: 95vw;
      height: 70vh;
      margin-left: calc(50vw - (95vw / 2));
      position: sticky;
      border-radius: 15px;
    }
  }
  @media screen and (max-width: 776px) {
    #map-container {
      width: 100%;
      height: 100vw;
      border-radius: 15px;
      margin-left: 0;
    }
    #main {
      padding-bottom: 0px;
      position: relative;
    }
    #footer {
      background-color: transparent !important;
      backdrop-filter: blur(0px);
    }
  }
  #footer {
    height: 110px;
    background-color: rgba(60, 60, 60, 0.3);
    text-align: center;
    border-radius: 15px 15px 0 0;
    backdrop-filter: blur(100px);
  }
  #oweather {
    padding-top: 10px;
    font-size: 10px;
    color: rgb(118, 118, 118);
  }
  a {
    color: rgb(164, 164, 164);
  }
</style>