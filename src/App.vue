<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->

    
        <NodeEditor nodeContent="" />
      
  </div>
</template>

<script>
import NodeEditor from "./components/NodeEditor.vue";
import './customstyle.scss'




export default {
  name: "app",
  components: {
    NodeEditor
  
  }
};
</script>

