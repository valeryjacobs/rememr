<template>
  <div >
    <div class="columns">
      <div class="column">
        <nav class="panel">
          <b-field label="Node">
            <b-input v-model="node.metadata.title"></b-input>
          </b-field>

          <b-taglist>
            <b-tag v-for="link in node.metadata.ins" :key="link.id" type="is-info">
              <a @click="loadNode(link.id)">{{link.title}}</a>
            </b-tag>
          </b-taglist>

          <a class="panel-block is-active" v-for="link in node.metadata.ins" :key="link.id">
            <span class="panel-icon">
              <i class="fas fa-book" aria-hidden="true"></i>
            </span>
            {{link.title}}
          </a>
        </nav>
      </div>
    </div>
    <!-- <h1>
      <input v-model="node.metadata.title" placeholder="enter title" />
    </h1>
    <h3>{{ node.id}}</h3>-->

    <!-- <ul>
      <li v-for="link in node.metadata.ins" :key="link.id">
        <a @click="loadNode(link.id)">{{link.id | shorten}} : {{link.title}}</a>
      </li>
    </ul>-->
    <div class="columns">
      <div class="column is-full">
        <editor v-model="node.content" />
      </div>
    </div>

    <!-- <ul>
      <li v-for="link in node.metadata.outs" :key="link.id">
        <a @click="loadNode(link.id)">{{link.id | shorten}} : {{link.title}}</a>
      </li>
    </ul>-->
    <div class="columns">
      <div class="column">
        <b-taglist>
          <b-tag v-for="link in node.metadata.outs" :key="link.id" type="is-info">
            <a @click="loadNode(link.id)">{{link.title}}</a>
          </b-tag>
        </b-taglist>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <a>Selected node: {{selectedNode}}</a>
      </div>
      <div class="column">
        <button class="button is-primary" @click="updateNode">Save</button>
        <button class="button is-primary" @click="loadNode">Load</button>
        <button class="button is-primary" @click="addNode">Add</button>
        <button class="button is-primary" @click="loadTitles">Load titles</button>
        <button class="button is-primary">Primary button</button>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <a>{{status}}</a>
      </div>
    </div>

  
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
      return value.substring(0, 5);
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

