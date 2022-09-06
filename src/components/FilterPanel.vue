<template>
  <div id="panel">
    <div id="logo-container">
      <img id="logo" src="/lmg.png" alt="logo">
    </div>
    <div id="hide-show-ctrl">
      <div id="data" v-for="(item, index) in inputs" :key="index">
        <div class="check">
          <input v-on:change="check($event)" :item_id="item[0]" type="checkbox" checked="true">{{item[1]}}
        </div>
      </div>
    </div>
    <!--<div id="station-ctrl">
      <div id="data" v-for="(item, index) in inputs" :key="index">
        <div class="check">
          <input v-on:change="check($event)" :item_id="item[0]" type="checkbox" checked="true">{{item[1]}}
        </div>
      </div>
    </div>-->
    <div id="buttons">
      <div>
        <button @click="range_click($event)" class="time-btn" val="day">TAG</button>
        <button @click="range_click($event)" class="time-btn" val="week">WOCHE</button>
        <button @click="range_click($event)" class="time-btn" val="month">MONAT</button>
        <button @click="range_click($event)" class="time-btn" val="year">JAHR</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputs: Array
  },
  methods: {
    check(e) {
      this.$emit('clicked', e.srcElement.getAttribute('item_id'));
    },
    range_click(e) {
      this.$emit('range_clicked', e.srcElement.getAttribute('val'));
    }
  }
}
</script>

<style>
  #panel {
    width: 100vw;
    padding: 0;
    margin: 0;
    height: 120px;
    background-color: rgba(38, 60, 57, 0.2);
  }
  #logo {
    height: 70px;
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
    height: 120px;
    width: 160px;
    display: inline-block;
    vertical-align: middle;
  }
  #hide-show-ctrl {
    height: 120px;
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
    height: 120px;
    width: 70px;
    padding-left: 5px;
  }
  .time-btn {
    text-align: start;
    height: 30px;
    width: 70px;
  }
</style>