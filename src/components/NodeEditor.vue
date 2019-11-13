<template>
  <div class="editor">
    Node editor:
    <h1>{{ node.content }}</h1>
    <ul>
      <li v-for="link in node.ins" :key="link.id">
        <a @click="selectedNode = link.id">{{link.id}} : {{link.title}}</a>
      </li>
    </ul>
    <input class="input" v-model="node.content" />
    <editor v-model="node.content" />
    <ul>
      <li v-for="link in node.outs" :key="link.id">
        <a @click="selectedNode = link.id">{{link.id}} : {{link.title}}</a>
      </li>
    </ul>

    <a>Selected node: {{selectedNode}}</a>
    <button @click="save">Save</button>

     <button @click="loadNode">Load</button>
    <a>{{status}}</a>
  </div>
</template> 

<script>
import "tui-editor/dist/tui-editor.css";
import "tui-editor/dist/tui-editor-contents.css";
import "codemirror/lib/codemirror.css";
import { Editor } from "@toast-ui/vue-editor";
import { displayDateFormat } from '../shared/constants.js';
import { nodeData } from '../shared/nodedata.js'; 


export default {
  name: "NodeEditor",
  components: {
    editor: Editor
  },
  async created() {
    await this.loadNode();
  },
  data() {
    return {
      editorText: "some text",
      node: {
        id: "id 1",
        title: "some node",
        content: "some content",
        ins: [
          { id: "a", title: "some title" },
          { id: "b", title: "some title for b" },
          { id: "c", title: "some title for c" }
        ],
        outs: [
          { id: "d", title: "some title" },
          { id: "e", title: "some title for e" },
          { id: "f", title: "some title for f" }
        ]
      },
      status: displayDateFormat.toString(),
      selectedNode: "",
      nodes:"",
      temp: displayDateFormat.toString()
    };
  },
  methods: {
    async loadNode() {
     this.nodes = await nodeData.getNodeData();
    },
    save() {
      this.status = "saved";
    }
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
