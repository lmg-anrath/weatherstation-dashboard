<template>
  <div id="overlay">
    <div id="content">
      <h2>{{name}}</h2>
      <a>Temperatur: {{(data.temp != -999) ? data.temp : '---'}} °C</a>
      <p>Luftfeuchtigkeit: {{(data.humidity != -999) ? data.humidity : '---'}}%</p>
      <p>Luftdruck: {{(data.pressure != -999) ? data.pressure : '---'}} hPa</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  props: {
    data: Object,
    name: String
  }
}
</script>

<style scoped>

#overlay {
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.2px);
  -webkit-backdrop-filter: blur(7.2px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  text-align: center;
}
#content {
  padding: 20px;
  font-size: 20px;
}
a,p {
  text-shadow: 0px 0px 6px #000000;;
}
h2 {
  padding: 0;
  margin-top: 0px;
  text-decoration: underline;
  font-size: 22px;
}

@media screen and (max-width: 775px) {
  #overlay {
    font-size: 12px;
  }
  #content {
    font-size: 14px;
  }
}
</style>