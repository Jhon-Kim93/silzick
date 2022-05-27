import VueJwtDecode from 'vue-jwt-decode'
import cookies from 'vue-cookies'

const userStore = {
    namespaced: true,
    
    state: {
        userName: null,
    },
    mutations: {
    SAVE_USER (state, userName) {
        state.userName = userName
    },
    RESET_USER (state) {
        state.userName = null
    },
    },
    actions: {
    saveUser({ commit }) {
        const userName = VueJwtDecode.decode(cookies.get('JWT-AUTHENTICATION')).sub
        commit('SAVE_USER', userName)
    },
    },
}
export default userStore;