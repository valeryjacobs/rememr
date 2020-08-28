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
        <editor mode="markdown" height="600px" :options="editorOptions" v-model="node.content" />
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
    <hr />

    <div class="columns">
      <div style="margin:5px" class="column is full">
        <div class="buttons">
          <button class="button is-primary is-medium" @click="updateNode">
            <font-awesome-icon icon="save" size="1x" />
          </button>
          <button class="button is-primary is-medium" @click="addNode">
            <font-awesome-icon icon="plus" size="1x" />
          </button>
          <button class="button is-primary is-medium" @click="deleteNode">
            <font-awesome-icon icon="trash" size="1x" />
          </button>
          <button class="button is-primary is-medium" @click="pinNode">
            <font-awesome-icon icon="thumbtack" size="1x" />
          </button>
          <button class="button is-medium is-dark" @click="prompt">Set key</button>
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

const defaultOptions = {
  minHeight: "500px",
  height: "800px",
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
      "loadTitlesAction",
      "loadPinsAction",
      "pinNodeAction"
    ]),
    prompt() {
      this.$buefy.dialog.prompt({
        message: `Enter the Shared Access Signature for your store?`,
        inputAttrs: {
          placeholder: "SAS Key...",
          maxlength: 120
        },
        trapFocus: true,
        onConfirm: value => localStorage.setItem("storageaccountsas", value)
      });
    },
    async deleteNode() {
      this.$buefy.dialog.prompt({
        message: `What's your name?`,
        inputAttrs: {
          placeholder: "e.g. Walter",
          maxlength: 10
        },
        trapFocus: true,
        onConfirm: async () => {
          this.status = "Deleting node..";
          let nodeId = this.state.node.id;
          await this.deleteNodeAction();
          this.status = "Node " + nodeId + " deleted...";
        }
      });
    },

    async init() {
      this.status = "initializing...";
      await this.getNodeAction("root");
      this.loadPinsAction();
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

    async pinNode() {
      this.status = "Pinning node...";
      await this.pinNodeAction();
      this.status = "Node pinned";
    },
    async loadTitles() {
      this.status = "Loading titles...";
      await this.loadTitlesAction();
      this.status = "titles loaded";
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
  },
  components: {
    editor: Editor
  }
};
</script>