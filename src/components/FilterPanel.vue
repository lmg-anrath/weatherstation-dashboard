<template>
  <div id="panel">
    <div id="logo-container">
      <img height="55" width="87" id="logo" src="/lmg.png" alt="logo">
    </div>
    <div id="ddown">
      <svg @click="ddown_click($event)" id="icon" xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path id="menu-svg" d="M3 12, L21 12, M3 6, L21 6, M3 18, L21 18" />
      </svg>
    </div>
    <div class="links" v-for="(item, index) in links" :key="index">
      <a target="_blank" rel="noopener noreferrer" class="src" :href="item[0]">{{ item[1] }}</a>
    </div>
    <div id="links-ddown-c">
      <div class="links-ddown" v-for="(item, index) in links" :key="index">
        <a target="_blank" rel="noopener noreferrer" class="src src-ddown" :href="item[0]">{{ item[1] }}</a>
      </div>
    </div>
    <div id="buttons">
      <div id="buttons-container">
        <div class="time-btn-container">
          <button title="Setze den anzuzeigenden Zeitraum auf 1 Tag (24h)" @click="range_click($event)" class="time-btn" val="day">TAG</button>
        </div>
        <div class="time-btn-container">
          <button title="Setze den anzuzeigenden Zeitraum auf 1 Woche" @click="range_click($event)" class="time-btn" val="week">WOCHE</button>
        </div>
        <div class="time-btn-container">
          <button title="Setze den anzuzeigenden Zeitraum auf 1 Monat" @click="range_click($event)" class="time-btn" val="month">MONAT</button>
        </div>
        <div class="time-btn-container">
          <button title="Setze den anzuzeigenden Zeitraum auf 1 Jahr" @click="range_click($event)" class="time-btn" val="year">JAHR</button>
        </div>
      </div>
    </div>
    <div id="scale">
      <div id="scale-inner">
        <!--<div id="from">
          <div class="fromtohead">VON</div>
          <input aria-label="b" id="from-date" @change="date_change($event)" class="input-time" type="datetime-local">
        </div>
        <div id="line"></div>
        <div id="to">
          <div class="fromtohead">BIS</div>
          <input aria-label="a" id="to-date" @change="date_change($event)" class="input-time" type="datetime-local">
        </div>-->
        <Datepicker v-model="date" range dark placeholder="Bereich für Daten angeben" :auto-position="false" input-class-name="date-input" menu-class-name="date-menu" @update:model-value="date_changed"></Datepicker>
        <!--<div id="from">
          <div class="fromtohead">VON</div>
          <DatePicker :display="true"></DatePicker>
        </div>
        <div id="line"></div>
        <div id="to">
          <div class="fromtohead">BIS</div>
          <DatePicker></DatePicker>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="js">
//import DatePicker from '../components/DatePicker.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

export default {
  components: {
    Datepicker,
  },
  data() {
    return {
      links: [
        ['https://apps.sentinel-hub.com/eo-browser/?zoom=13&lat=51.27781&lng=6.46859&themeId=DEFAULT-THEME&toTime=2022-10-01T14%3A56%3A50.649Z', 'SENTINEL DATEN'],
        ['https://race.esa.int/?country=DE&x=1280174.14412&y=6307726.42832&z=2.25857', 'ESA DATEN'],
        ['https://www.lmg-anrath.de/stadt-land-fluss-revisited/', 'WEITERE PROJEKTE'],
        ['https://www.dwd.de/DE/derdwd/messnetz/atmosphaerenbeobachtung/rasomon/rasomon_node.html', 'HÖHENWETTERDATEN'],
        ['https://www.dwd.de/DE/leistungen/hobbymet_hw_europa/hobbyhoehenwettereuropa.html?nn=452870', 'HÖHENWETTERMELDUNGEN']
      ]
    }
  },
  setup() {
    const date = ref();
    return {
      date
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
      if (panel.style.height == '575px') {
        document.getElementById('panel').style.height = '100px';
        icon.style.color = 'white';
        ddown.style.opacity = '0';
      }
      else if (panel.style.height == '100px' || panel.style.height == '') {
        document.getElementById('panel').style.height = '575px';
        icon.style.color = 'rgb(100,100,100)';
        ddown.style.opacity = '1';
      }
      e.srcElement.style.height = '100px'
    },
    date_change(e) {
      const all = document.getElementsByClassName('input-time');
      for (let i = 0; i < all.length; i++) {
        if (!all[i].value) {
          return;
        }
      }
      const from = document.getElementById('from-date');
      const to = document.getElementById('to-date');
      const from_time = new Date(from.value);
      from_time.setSeconds(15);
      const to_time = new Date(to.value);
      to_time.setSeconds(15);
      to.value = '';
      from.value = '';
      if (from_time > to_time) {
        alert('Das Startdatum muss vor dem Enddatum liegen!');
        return;
      }
      this.$emit('date_range', {
        min: from_time.toISOString(),
        max: to_time.toISOString()
      });
    },
    date_changed(modalData) {
      const from_time = modalData[0];
      from_time.setSeconds(15);
      const to_time = modalData[1];
      to_time.setSeconds(15);
      if (from_time > to_time) {
        alert('Das Startdatum muss vor dem Enddatum liegen!');
        return;
      }
      this.$emit('date_range', {
        min: from_time.toISOString(),
        max: to_time.toISOString()
      });
    }
  }
}
</script>

<style>
  .date-input {
    background-color: transparent;
    height: 66px;
  }
  .dp__overlay_row {
    background-color: #272727;
  }
  .dp__button {
    background-color: #313a40
  }
  .dp__range_between {
    background-color: #9393933b;
  }
  .dp__theme_dark {
    --dp-background-color: #17171700;
    --dp-text-color: #ffffff;
    --dp-hover-color: #484848;
    --dp-hover-text-color: #ffffff;
    --dp-hover-icon-color: #959595;
    --dp-primary-color: #315452;
    --dp-primary-text-color: #ffffff;
    --dp-secondary-color: #a9a9a981;
    --dp-border-color: #00000035;
    --dp-menu-border-color: #00000035;
    --dp-border-color-hover: #aaaeb7;
    --dp-disabled-color: #737373;
    --dp-scroll-bar-background: #212121;
    --dp-scroll-bar-color: #484848;
    --dp-success-color: #00701a;
    --dp-success-color-disabled: #428f59;
    --dp-icon-color: #959595;
    --dp-danger-color: #e53935;
    --dp-highlight-color: rgba(0, 92, 178, 0.2);
  }
  .date-menu {
    background-color: rgba(0, 0, 0, 0.153);
    border-radius: 10px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  @media screen and (min-width: 1120px) {
    #ddown {
      display: none;
    }
    #links-ddown-c {
      display: none;
    }
    #panel {
      height: 100px !important;
    }
  }
  @media screen and (max-width: 1120px) {
    .links {
      display: none;
    }
    /*#scale {
      display: none !important;
    }*/
    /*#buttons {
      display: none !important;
    }*/
    #buttons {
      padding-top: 35px;
      padding-left: calc(50vw - (245px / 2) + 2.5px);
      width: 242.5px !important;
      height: 88px !important;
    }
    #ddown {
      display: flex;
      align-items: center;
      float: right;
      height: 100px;
    }
    .date-input {
      background-color: transparent;
      height: 50px;
    }
    #scale-inner {
      height: 50px !important;
      width: 240px;
      margin-top: 0 !important;
      border-radius: 5px !important;
    }
    #scale {
      height: 50px !important;
      width: 240px;
      padding-top: 0px;
      padding-left: calc(50vw - (240px / 2)) !important;
    }
    #buttons-container {
      width: 245px !important;
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
      text-align: center;
      line-height: 31px;
      height: 30px;
      width: 117.5px !important;
      padding: 0;
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
    padding-top: 30px;
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
    width: 100%;
    padding: 0;
    margin: 0;
    height: 100px;
    background: transparent;
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
    width: 140px;
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
    width: 145px;
  }
  button {
    cursor:pointer;
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
    text-align: center;
    line-height: 31px;
    height: 30px;
    width: 70px;
    padding: 0;
  }
  #buttons-container {
    max-height: 145px;
    width: 150px;
    padding-top: 18px;
  }
  #scale {
    display: inline-block;
    vertical-align: middle;
    height: 100px;
    width: 320px;
    padding-left: 20px;
  }
  #from {
    padding: 12px 0 0px 10px;
    height: 100px;
    width: 140px;
    float: left;
  }
  #to {
    padding-left: 20px;
    padding: 12px 10px 0px 0px;
    height: 100px;
    width: 140px;
    float: right;
  }
  #line {
    height: 50px;
    width: 2px;
    border-radius: 1px;
    background-color: rgba(255, 255, 255, 0.313);
    position: absolute;
    margin-left: 157px;
    margin-top: 8px;
  }
  .input-time {
    width: 140px;
    background-color: transparent;
    color: black;
    border: 0;
    filter: invert(1);
    font-size: 18px;
    text-overflow: ellipsis;
  }
  .input-time:focus {
    border: 0;
  }
  #scale-inner {
    height: 66px;
    border-radius: 10px;
    margin-top: 18px;
    background-color: rgba(126, 134, 167, 0.2);
  }
  .fromtohead {
    font-weight: bold;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  button {
    background-color: transparent;
    border: 0;
    outline: 0;
    color: white;
    transition: color 0.2s;
  }
  button:hover {
    color: gray;
  }
</style>