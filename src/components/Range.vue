<template>
  <div class="container">
    <label :for="label_name">&#x200B;</label>
    <input :id="label_name" :name="label_name" type="text" v-model="value" :placeholder="'max. ' + max + 'h'">
    <button aria-label="button" v-on:click="clicked"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'range',
      value: ''
    }
  },
  props: {
    label_name: String,
    max: Number
  },
  methods: {
    clicked() {
      this.$emit('rangechange', this.value * 4)
    }
  },
}
</script>

<style>
  .container {
    width: 750px;
    align-content: center;
    align-items: center;
    justify-content: center;
    display: flex;
    padding-bottom: 1vh;
  }
  input[type="text"] {
    border: 0;
    outline: 0;
    background: transparent;
    padding: 2px 0;
    color: white;
    transition: border-color 0.2s;
    border-bottom: 2px solid;
    border-color: gray;
  }
  input[type="text"]:focus {
    border-color: green;
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
  @media screen and (max-width: 1120px) {
    .container {
      width: 100vw;
    }
  }
</style>