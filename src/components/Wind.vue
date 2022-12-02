<template>
  <div id="wind">
    <div id="wind-heading">WIND</div>
    <img height="40" width="40" src="/arrow.svg" :style="`transform: rotate(${rot}deg); color: #FFF;`" />
    <div id="wind-speed"><b>{{speed}}</b> km/h</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rot: 0,
      speed: 100.10
    }
  },
  props: {
    api_key: String
  },
  methods: {
    async get_data() {
      const res = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=51.3387609&lon=6.5853417&appid=${this.api_key}&units=metric`)).json()
      this.rot = res.wind.deg + 180;
      this.speed = toFixed(res.wind.speed * 3.6, 2);
    }
  },
  async mounted() {
    this.get_data();
  }
}
</script>

<style scoped>
  #wind {
    height: 100px;
    width: 100px;
    background-color: rgba(90, 90, 90, 0.5);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: 0 0 10px 0;
    color: white;
    z-index: 6;
    text-align: center;
  }
  #wind-heading {
    padding-top: 8px;
    font-weight: bolder;;
  }
  img {
    transform-origin: 45% 55%;
  }
  @media screen and (max-width: 1120px) {
  }
</style>
