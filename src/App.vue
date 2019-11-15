<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    
    <NodeEditor nodeContent="Some MD content"/>
  </div>
</template>

<script>
import NodeEditor from './components/NodeEditor.vue'

export default {
  name: 'app',
  components: {
    NodeEditor
  
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
