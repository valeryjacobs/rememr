<template>
  <div class="editor">
    <h1>
      <input v-model="node.metadata.title" placeholder="enter title" />
    </h1>
    <h3>{{ node.id}}</h3>
    <ul>
      <li v-for="link in node.metadata.ins" :key="link.id">
        <a @click="loadNode(link.id)">{{link.id | shorten}} : {{link.title}}</a>
      </li>
    </ul>

    <editor v-model="node.content" />
    <ul>
      <li v-for="link in node.metadata.outs" :key="link.id">
        <a @click="loadNode(link.id)">{{link.id | shorten}} : {{link.title}}</a>
      </li>
    </ul>

    <a>Selected node: {{selectedNode}}</a>
    <button @click="updateNode">Save</button>
    <button @click="loadNode">Load</button>
    <button @click="addNode">Add</button>
    <button @click="loadTitles">Load titles</button>
     <button class="button is-primary">
              Primary button
            </button>
    <a>{{status}}</a>
  </div>
</template> 

<script>
import { mapActions, mapState } from "vuex";
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
import { Editor } from "@toast-ui/vue-editor";
import { displayDateFormat } from "../shared/constants.js";
//import { nodeDataService } from '../shared/nodedata.service';

export default {
  name: "NodeEditor",
  components: {
    editor: Editor
  },
  async created() {
    await this.init();
  },
  data() {
    return {
      editorText: "some text",
      status: displayDateFormat.toString(),
      selectedNode: "",
      temp: displayDateFormat.toString()
    };
  },
  methods: {
    ...mapActions([
      "getNodeAction",
      "deleteNodeAction",
      "addNodeAction",
      "updateNodeAction",
      "loadTitlesAction"
    ]),
    async init() {
      this.status = "initializing...";
      await this.getNodeAction("root");
      this.status = "loaded.";
    },
    async loadNode(nodeId) {
      this.status = "loading node...";
      await this.getNodeAction(nodeId);
      this.status = "loaded.";
    },
    async updateNode() {
      this.status = "updating node...";
      await this.updateNodeAction();
      this.status = "updated.";
    },
    async addNode() {
      this.status = "adding node";
      await this.addNodeAction();
    },
    async loadTitles() {
      this.status = "loading titles...";
      await this.loadTitlesAction();
       this.status = "titles loaded";
    },
    save() {
      this.status = "saved";
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    shorten: function(value) {
      

      return value.substring(0,5);
    }
  },
  computed: {
    ...mapState(["node"])
  }

  //   ,
  //   props: {
  //     nodeContent: String
  //   }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
