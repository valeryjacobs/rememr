import Vue from 'vue'
import Vuex from 'vuex'

import { nodeDataService } from '../shared/nodedata.service'

import {
  ADD_NODE,
  UPDATE_NODE,
  GET_NODE,
  DELETE_NODE,
 
} from './mutation-types';

Vue.use(Vuex)

const state = () => ({
  node: {},
  storageClient: {}
});

const mutations = {
  async [ADD_NODE](state, addedNode) {
    state.node = addedNode;
  },
  async [UPDATE_NODE](state, updatedNode) {
    state.node = updatedNode;
  },
  async [GET_NODE](state, loadedNode) {
    state.node = loadedNode;
  },
  async [DELETE_NODE]() {
    state.node = {};
  }
};

const actions = {

 
  async addNodeAction({ commit }, node) {
    const addedNode = await nodeDataService.addNode(node);
    commit(ADD_NODE, addedNode);
  },
  async deleteNodeAction({ commit }, nodeId) {
     await nodeDataService.deleteNode(nodeId);
    commit(DELETE_NODE);
  },
  async getNodeAction({ commit }, nodeId) {
    const loadedNode = await nodeDataService.getNode(nodeId);
    commit(GET_NODE, loadedNode);
  },
  async updateNodeAction({ commit }, node) {
    const updatedNode = await nodeDataService.updateNode(node);
    commit(UPDATE_NODE, updatedNode);
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
