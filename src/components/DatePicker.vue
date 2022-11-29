<template>
  <div id="input">
  </div>
  <div id="dates" v-if="display">
    <div class="selection" @mousedown="mouse_down($event)" id="years">
      <div class="bar-item" v-for="index in 22" :key="index">
        20{{(index < 10) ? `0${index}` : index}}
      </div>
    </div>
    <div class="selection" @mousedown="mouse_down($event)" id="month">
      <div class="bar-item" v-for="(item, index) in months" :key="index">
        {{item}}
      </div>
    </div>
    <div id="days">
      <div class="bar-item-day" v-for="index in 30" :key="index">
        {{(index < 10) ? `0${index}` : index}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  data() {
    return {
      pos: { top: 0, left: 0, x: 0, y: 0 },
      months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    };
  },
  props: {
    display: {
      type: Boolean
    }
  },
  methods: {
    clicked() {

    },
    mouse_down(e) {
      this.scrollelem = e.srcElement.parentElement;
      this.pos = {
        left: this.scrollelem.scrollLeft,
        top: this.scrollelem.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };
      document.addEventListener('mousemove', this.mouse_move);
      document.addEventListener('mouseup', this.mouse_up);
    },
    mouse_move(e) {
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;

      this.scrollelem.scrollTop = this.pos.top - dy;
      this.scrollelem.scrollLeft = this.pos.left - dx;
    },
    mouse_up(e) {
      this.mouse_start = 0;
      this.is_down = false;
      this.moved = 0;
      document.removeEventListener('mousemove', this.mouse_move);
      document.removeEventListener('mouseup', this.mouse_up);
    }
  },
}
</script>

<style>
#input {
  background-color: rgba(100,100,100,0.2);
  height: 25px;
  width: 135px;
  transition: all 0.2s;
}
#input:hover {
  border-radius: 5px;
  background-color: rgba(100,100,100,0.4);
}
#dates {
  position: absolute;
  z-index: 10;
  background-color: transparent;
  backdrop-filter: blur(20px);
  height: 280px;
  width: 300px;
  overflow: hidden;
  box-shadow: 0px 0px 20px #888888;;
  border-radius: 10px;
}
.bar-item {
  background-color: rgba(100,100,100,0.2);
  width: 20%;
  height: 100%;
  display: inline-block;
  margin-right: 2px;
  line-height: 42.59px;
  text-align: center;
  vertical-align: middle;
  border-radius: 5px;
}
.bar-item-day {
  display: inline-block;
  width: 15%;
  height: 17%;
  text-align: center;
  vertical-align: middle;
  background-color: #5858584b;
  line-height: 31.41px;
  border-radius: 8px;
  margin: 2px;
}
.selection {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  cursor: grab;
  user-select: none
}
#years {
  width: 100%;
  height: 17%;
  background-color: transparent;
}
.selection::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    position: absolute;
  }
.selection::-webkit-scrollbar-track {
  background: transparent;
  position: absolute;
}
.selection::-webkit-scrollbar-thumb {
  background-color: #909090;
  border-radius: 10px;
  position: absolute;
}
#month {
  width: 100%;
  height: 17%;
  background-color: transparent;
}
#days {
  width: 100%;
  height: 66%;
  margin-left: 3px;
  margin-top: 4px;
  background-color: transparent;
}
</style>