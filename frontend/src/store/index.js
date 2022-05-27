import Vue from 'vue'
import Vuex from 'vuex'

import userStore from './modules/userStore'
import board from './modules/board'
import notice from './modules/notice'
import gameStore from './modules/gameStore'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    userStore,
    board,
    notice,
    gameStore,
  }
});

export default store;