import Vue from 'vue'
import Vuex from 'vuex'

import { nodeDataService } from '../shared/nodedata.service'

import {
  ADD_NODE,
  UPDATE_NODE,
  GET_NODE,
  DELETE_NODE,
  LOAD_TITLES

} from './mutation-types';

class Node {
  constructor(id) {
    this.id = id;
    this.title = "";
    this.content = "";
    this.metadata = { "title": "", "ins": {}, "outs": {} };
  }

}

Vue.use(Vuex)

const state = () => ({
  node: new Node('dummy'),
  titles: { id: "value1" },
  status: "",
  storageClient: {}
});

const mutations = {
  async [ADD_NODE](state, addedNode) {
    state.node = addedNode;
  },
  async [UPDATE_NODE]() {

  },
  async [GET_NODE](state, loadedNode) {
    state.node = loadedNode;
  },
  async [DELETE_NODE]() {
    state.node = {};
  },
  async [LOAD_TITLES]() {

  }
};

const actions = {

  async addNodeAction({ commit }) {
    //Save current node?
    let parentNodeId = this.state.node.id;

    let newNode = new Node(createNewNodeId());
    newNode.content = "empty";
    newNode.metadata = JSON.parse('{"title":"empty title","ins":[{"id":"' + parentNodeId + '","title":"' + this.state.node.metadata.title + '"}],"outs":[]}');

    await nodeDataService.addNode(newNode);

    let parentMetadata = await nodeDataService.getMetadata(parentNodeId)

    if (parentMetadata.outs) {
      parentMetadata.outs.push({ "id": newNode.id, "title": "" });
    }

    await nodeDataService.setMetadata(parentNodeId, parentMetadata);

    commit(ADD_NODE, newNode);
  },
  async deleteNodeAction({ commit }, nodeId) {
    await nodeDataService.deleteNode(nodeId);
    commit(DELETE_NODE);
  },
  async getNodeAction({ commit }, nodeId) {
    const loadedNode = await nodeDataService.getNode(nodeId);

    await this.loadTitlesAction();
    commit(GET_NODE, loadedNode);
  },
  async updateNodeAction({ commit }) {
    await nodeDataService.updateNode(this.state.node);
    commit(UPDATE_NODE);
  },
  async loadTitlesAction({ commit }) {
    this.state.node.metadata.ins.forEach(async function (entry) {
      /* eslint require-atomic-updates: "off" */
      entry.title = await nodeDataService.resolveNode(entry.id);
    });

    this.state.node.metadata.outs.forEach(async function (entry) {
      /* eslint require-atomic-updates: "off" */
      entry.title = await nodeDataService.resolveNode(entry.id);
    });

    commit(LOAD_TITLES);
  }
};
const getters = {
  //getNodeById: state=> id=> return
};
const setters = {};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  setters
})

function createNewNodeId() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
