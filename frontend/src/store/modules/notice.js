import { getNotices } from '@/api/notice.js'

const notice = {
  namespaced: true,
  state: {
    admin_post : [],
  },
  mutations: {
    GET_NOTICES (state, posts) {
      state.admin_post = posts
    },
  },
  actions: {
    getNotices ({commit}) {
      getNotices(
        (res) => {
          commit('GET_NOTICES', res.data)
        },
        (err) => {
          console.log(err)
          alert('요청 실패')
        }
      )
    },
  },
}

export default notice;