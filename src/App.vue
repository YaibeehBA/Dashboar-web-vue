<template>
  <div id="app">
    <AvocadoDashboard />
  </div>
</template>

<script>
import AvocadoDashboard from './components/AvocadoDashboard.vue'

export default {
  name: 'App',
  components: {
    AvocadoDashboard
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>