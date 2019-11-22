<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-input v-model="node.metadata.title"></b-input>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="tags">
          <span v-for="link in node.metadata.ins" :key="link.id" class="tag is-light">
            <a @click="loadNode(link.id)">{{link.title}}</a>
          </span>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-full">
        <editor  mode="wysiwyg" height="600px" :options="editorOptions" v-model="node.content" />
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <div class="tags">
          <span v-for="link in node.metadata.outs" :key="link.id" class="tag is-light">
            <a @click="loadNode(link.id)">{{link.title}}</a>
          </span>
        </div>
      </div>
    </div>
<hr>
       <div class="columns">
      <div class="column">
        <div class="tags">
          <span v-for="link in pins" :key="link.id" class="tag is-light">
            <a @click="loadNode(link.id)">{{link.title}}</a>
          </span>
        </div>
      </div>
    </div>

    <div class="columns">
      <div style="margin:5px" class="column is full">
        <div class="buttons">
          <button class="button is-primary" @click="updateNode">
            <b-icon icon="check"></b-icon>
            <span>Save</span>
          </button>
          <button class="button is-primary" @click="loadNode">Load</button>
          <button class="button is-primary" @click="addNode">Add</button>
          <button class="button is-primary" @click="loadTitles">Load titles</button>
        </div>
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

const defaultOptions = {
  minHeight: "500px",
  height: '800px',
  language: "en_US",
  useCommandShortcut: true,
  useDefaultHTMLSanitizer: true,
  initialEditType: "wysiwyg",
  usageStatistics: true,
  hideModeSwitch: false,
  toolbarItems: [
    "heading",
    "bold",
    "italic",
    "strike",
    "divider",
    "hr",
    "quote",
    "divider",
    "ul",
    "ol",
    "task",
    "indent",
    "outdent",
    "divider",
    "table",
    "image",
    "link",
    "divider",
    "code",
    "codeblock"
  ]
};

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
      editorText: "",
      editorOptions: defaultOptions,
      status: displayDateFormat.toString(),
      selectedNode: ""
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

