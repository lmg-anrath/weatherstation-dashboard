<template>
  <div id="panel">
    <div id="logo-container">
      <img id="logo" src="/lmg.png" alt="logo">
    </div>
    <div id="ddown">
      <svg @click="ddown_click($event)" id="icon" xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </div>
    <div class="links" v-for="(item, index) in links" :key="index">
      <a target="_blank" rel="noopener noreferrer" class="src" :href="item[0]">{{ item[1] }}</a>
    </div>
    <div id="links-ddown-c">
      <div class="links-ddown" v-for="(item, index) in links" :key="index">
        <a target="_blank" rel="noopener noreferrer" class="src src-ddown" :href="item[0]">{{ item[1] }}</a>
      </div>
    </div>
    <!--<div id="hide-show-ctrl">
      <div id="data" v-for="(item, index) in inputs" :key="index">
        <div class="check">
          <input v-on:change="check($event)" :item_id="item[0]" type="checkbox" checked="true">{{item[1]}}
        </div>
      </div>
    </div>-->
    <!--<div id="station-ctrl">
      <div id="data" v-for="(item, index) in inputs" :key="index">
        <div class="check">
          <input v-on:change="check($event)" :item_id="item[0]" type="checkbox" checked="true">{{item[1]}}
        </div>
      </div>
    </div>-->
    <!--<div id="buttons">
      <div id="buttons-container">
        <div class="time-btn-container">
        <button @click="range_click($event)" class="time-btn" val="day">TAG</button>
        </div>
        <div class="time-btn-container">
        <button @click="range_click($event)" class="time-btn" val="week">WOCHE</button>
        </div>
        <div class="time-btn-container">
        <button @click="range_click($event)" class="time-btn" val="month">MONAT</button>
        </div>
        <div class="time-btn-container">
        <button @click="range_click($event)" class="time-btn" val="year">JAHR</button>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
export default {
  props: {
    inputs: Array
  },
  data() {
    return {
      links: [
        ['https://apps.sentinel-hub.com/eo-browser/?zoom=13&lat=51.27781&lng=6.46859&themeId=DEFAULT-THEME&toTime=2022-10-01T14%3A56%3A50.649Z', 'SENTINEL DATEN'],
        ['https://race.esa.int/?country=DE&x=1280174.14412&y=6307726.42832&z=2.25857', 'ESA DATEN'],
        ['https://www.lmg-anrath.de/stadt-land-fluss-revisited/', 'WEITERE PROJEKTE']
      ]
    }
  },
  methods: {
    check(e) {
      this.$emit('clicked', e.srcElement.getAttribute('item_id'));
    },
    range_click(e) {
      this.$emit('range_clicked', e.srcElement.getAttribute('val'));
    },
    ddown_click(e) {
      const panel = document.getElementById('panel');
      const icon = document.getElementById('icon');
      const ddown = document.getElementById('links-ddown-c');
      if (panel.style.height == '350px') {
        document.getElementById('panel').style.height = '100px';
        icon.style.color = 'white';
        ddown.style.opacity = '0';
      }
      else if (panel.style.height == '100px' || panel.style.height == '') {
        document.getElementById('panel').style.height = '350px';
        icon.style.color = 'rgb(100,100,100)';
        ddown.style.opacity = '1';
      }
      e.srcElement.style.height = '100px'
    }
  }
}
</script>

<style>
  @media screen and (min-width: 775px) {
    #ddown {
      display: none;
    }
    #links-ddown-c {
      display: none;
    }
  }
  @media screen and (max-width: 775px) {
    .links {
      display: none;
    }
    #ddown {
      display: flex;
      align-items: center;
      float: right;
      height: 100px;
    }
  }
  #icon {
    margin: 0 auto;
    display: block;
    width: 50px;
    height: 50px;
    padding-right: 30px;
    transition: color 0.19s;
  }
  .links {
    float: right;
    height: 100px;
    text-align: center;
    vertical-align: middle;
    line-height: 100px;
    padding-right: 30px;
  }
  .links-ddown {
    padding-top: 40px;
    align-content: center;
    text-align: center;
  }
  #links-ddown-c {
    opacity: 0;
    transition: opacity 0.2s;
  }
  .src-ddown {
    font-size: 18px;
  }
  .src {
    color: white;
    text-underline-offset: 5px;
    transition: color 0.19s;
  }
  .src:hover {
    color: rgba(255, 255, 255, 0.436);
  }
  #panel {
    overflow: hidden;
    width: 100vw;
    padding: 0;
    margin: 0;
    height: 100px;
    /*background-color: #33325930;*/
    background-color: #1B263B;
    border-radius: 0 0 10px 10px;
    transition: height 0.2s;
  }
  #logo {
    height: 55px;
    margin-top: 22px;
    margin-left: 22px;
    display: inline-block;
  }
  #data {
    width: 140px;
    padding-top: 4px;
  }
  .check {
    width: 140px;
  }
  #logo-container {
    height: 100px;
    width: 160px;
    display: inline-block;
    vertical-align: middle;
  }
  #hide-show-ctrl {
    height: 100px;
    width: 140px;
    display: inline-block;
    vertical-align: middle;
  }
  input {
    padding: 0;
    margin: 0;
  }
  #buttons {
    display: inline-block;
    vertical-align: middle;
    height: 100px;
    width: 70px;
  }
  .time-btn-container {
    background-color: rgba(126, 134, 167, 0.2);
    border-radius: 5px;
    height: 30px;
    display: inline-block;
    margin-bottom: 5px;
    margin-right: 5px;
  }
  .time-btn {
    text-align: start;
    height: 30px;
    width: 70px;
  }
  #buttons-container {
    max-height: 140px;
    width: 150px;
    padding-top: 25px;
  }
</style>