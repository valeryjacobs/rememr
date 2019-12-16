import Vue from 'vue'
import Vuex from 'vuex'

import { nodeDataService } from '../shared/nodedata.service'

import {
  ADD_NODE,
  UPDATE_NODE,
  GET_NODE,
  DELETE_NODE,
  LOAD_TITLES,
  LOAD_PINS,
  ADD_PIN

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
  pins:[],
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
  async [DELETE_NODE](parentNode) {
    state.node = parentNode;
  },
  async [LOAD_PINS](state, pins) {
    state.pins = pins;
  },
  async [LOAD_TITLES]() {
  },
  async [ADD_PIN](state,pins) {
    state.pins = pins;
  }
};

const actions = {

  async addNodeAction({ commit }) {
    //Save   current node?
    await nodeDataService.updateNode(this.state.node);

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
    let parentNodeId = this.state.node.ins[0];
    let parentNode = await nodeDataService.deleteNode(parentNodeId); 
    await nodeDataService.deleteNode(nodeId);
    
    commit(DELETE_NODE,parentNode);
  },
  async loadPinsAction({commit}){
    let pins = await nodeDataService.getPins();
    commit(LOAD_PINS,pins)
  },
  async addPinAction({commit}){
    let pins = await nodeDataService.addPin();
    commit(ADD_PIN,pins)
  },
  async getNodeAction({ commit }, nodeId) {
    const loadedNode = await nodeDataService.getNode(nodeId);

    loadedNode.metadata.ins.forEach(async function (entry) {
      /* eslint require-atomic-updates: "off" */
      entry.title = await nodeDataService.resolveNode(entry.id);
    });

    loadedNode.metadata.outs.forEach(async function (entry) {
      /* eslint require-atomic-updates: "off" */
      entry.title = await nodeDataService.resolveNode(entry.id);
    });

    commit(GET_NODE, loadedNode);
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
  },
  async updateNodeAction({ commit }) {
    await nodeDataService.updateNode(this.state.node);
    commit(UPDATE_NODE);
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
