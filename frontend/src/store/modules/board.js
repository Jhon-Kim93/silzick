import { getRequests } from '@/api/board.js'

const board = {
  namespaced: true,
  state: {
    user_post : [],
  },
  mutations: {
    GET_REQUESTS (state, posts) {
      state.user_post = posts
    },
  },
  actions: {
    getRequests ({commit}) {
      getRequests(
        (res) => {
          commit('GET_REQUESTS', res.data)
        },
        (err) => {
          console.log(err)
          alert('요청 실패')
        }
      )
    },
  },
}

export default board;