import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store/index.js";

Vue.use(VueRouter)

const SessionIdCheck = (to, from, next) => {
  const sessionId = store.getters["gameStore/getSessionId"];
  const isHost = store.getters["gameStore/getIsHost"]
  if (isHost || sessionId) {
    next()
  }else{
    router.push({ name: "Invite" });
  }
};

const CatchWrongAccess = (to, from, next) => {
  const sessionId = store.getters["gameStore/getSessionId"];
  const session = store.getters["gameStore/getSession"];
  if(session && sessionId){
    next()
  }else{
    router.push({ name: "Invite" });
  }
}

const routes = [
  {
    path: '/KiraWin',
    name: 'KiraWin',
    component: () => import("@/components/MainGame/KiraWin.vue"),
  },
  {
    path: '/LWin',
    name: 'LWin',
    component: () => import("@/components/MainGame/LWin.vue"),
  },
  //hostname Attend는 필요없고 join은 필요함.
  {
    path: '/Join',
    name: 'Join',
    component: () => import("../views/Join.vue"),
    beforeEnter : SessionIdCheck,
  },
  {
    path: '/MainGame',
    name: 'MainGame',
    component: () => import("../views/MainGame.vue"),
    beforeEnter : CatchWrongAccess
  },
  {
    path: '/CardExchange',
    name : 'CardExchange',
    component: () => import('../views/CardExchange.vue'),
    beforeEnter : CatchWrongAccess
  },
  {
    path: '/GameEnd',
    name: 'GameEnd',
    component: () => import('../views/GameEnd.vue'),
    beforeEnter : CatchWrongAccess
  },
  {
    path: '/Invite',
    name: 'Invite',
    component: () => import("../views/Invite.vue"),
  },
  {
    path: '/Attend',
    name: 'Attend',
    component: () => import("../views/Attend.vue"),
  },
  {
    path: '/Rule',
    name: 'Rule',
    component: () => import('../views/Rule.vue'),
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  
  {
    path: '/Signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
  },
  {
    path: '/Notice',
    name : 'Notice',
    component: () => import('../views/Notice.vue'),
  },
  {
    path: '/Notice/Create',
    name : 'NoticeCreate',
    component: () => import('@/components/notice/NoticeCreate.vue'),
  },
  {
    path: '/Notice/Detail/:id',
    name : 'NoticeDetail',
    component: () => import('@/components/notice/NoticeDetail.vue'),
  },
  {
    path: '/Notice/Detail/:id/Update',
    name : 'NoticeUpdate',
    component: () => import('@/components/notice/NoticeUpdate.vue'),
  },
  {
    path: '/Request',
    name : 'Request',
    component: () => import('../views/Request.vue'),
  },
  {
    path: '/Request/Create',
    name : 'RequestCreate',
    component: () => import('@/components/request/RequestCreate.vue'),
  },
  {
    path: '/Request/Detail/:id',
    name : 'RequestDetail',
    component: () => import('@/components/request/RequestDetail.vue'),
  },
  {
    path: '/Request/Detail/:id/Update',
    name : 'RequestUpdate',
    component: () => import('@/components/request/RequestUpdate.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
