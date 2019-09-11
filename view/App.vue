<template>
  <div id="app">
    <app-homepage></app-homepage>
    <router-view/>
  </div>
</template>

<script>
import homepage from '@/components/homepage';

export default {
  name: 'App',
  components:{
    'app-homepage' : homepage,
  },
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
