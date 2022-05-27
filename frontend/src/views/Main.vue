<template>
  <div id="base-font" class="d-flex justify-content-center">
    <div class="d-flex row justify-content-center flex-wrap">
      <!-- <div class="col-12">
        <img
          src="https://ifh.cc/g/8B83Qk.png"
          alt="mainLogo"
          class="blink"
          style="width:20vw; height:15vh; margin-top:10vh;"
        >
      </div> -->
      <img 
      id ='sublogo'
      src="@/assets/img/이모지/asd.png" alt="">
      <img
        id="Logo"
        src="https://ifh.cc/g/HQNaf8.png"
        alt="mainLogo"
        class="col-12 mt-4"
        style="width:60vw; height:40vh; margin-top:15vh;"
      >
      <!-- 로그인 후 버튼-->
      <div class="col-5 d-flex row btn-position justify-content-center" style="height:40vh;" v-if="!isLogin">
        <div class="d-flex flex-column col-12 align-content-start">
          <router-link to="/Login">
            <button id="btn-color" class="col-12 btn font-size ">로그인</button>
          </router-link>
          <router-link to="/Signup">
            <button id="btn-color" class="col-12 btn font-size my-5">회원가입</button>
          </router-link>
          <router-link to="/Invite">
            <button id="btn-color" class="col-12 btn font-size">방 바로가기</button>
          </router-link>
        </div>
      </div>
      <!-- 로그인 전 버튼 -->
      <div class="col-5 d-flex row btn-position justify-content-center" style="height:40vh;" v-if="isLogin">
        <div class="d-flex flex-column col-12 align-content-start ">
          <button
            id="btn-color"
            class="col-12 btn font-size"
            @click="createRoomRequest(userName)"
          > 방 만들기
          </button>
          <button
            id="btn-color"
            class="col-12 btn font-size my-5"
            @click='logout'
          > 로그아웃
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import cookies from 'vue-cookies'

const gameStore = 'gameStore'
const userStore = 'userStore'

export default {
  name: 'Main',
  computed: {
    ...mapState(userStore, ['userName']),
    isLogin () {
      return cookies.isKey("JWT-AUTHENTICATION")
    }
  },
  methods: {
    ...mapMutations(userStore, ['RESET_USER']),
    ...mapMutations(gameStore, ['GAME_CHECKOUT']),
    ...mapActions(gameStore, ['createRoomRequest']),

    logout () {
      if (cookies.isKey('JWT-AUTHENTICATION')) {
        cookies.remove('JWT-AUTHENTICATION')
        this.RESET_USER()
        this.$router.go();
      }
    },
  },
  created () {
    this.GAME_CHECKOUT()
  }
}
</script>

<style scoped>
#sublogo{
  width: 150px;
  height: 150px;
  position: absolute;
  top:0%; left:32.3%;
  animation-name: drop;
  animation-duration: 2.9s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
@keyframes drop {
  from {
    display: block;
    top: 0%;
    opacity: 1;
  }

  50%{
    display: block;
    top:11.5%;
  }

  to {
    display: block;
    top:11.5%;
    opacity: 0;
  }
}

@keyframes blink-effect {
  50% {
    opacity: 0;
  }
}

.blink {
  animation: blink-effect 5s step-end infinite;
  animation-timing-function: ease-in-out;
}
.font-size {
  font-size:1.5rem;
}
#Logo{
  animation-name: slide;
  animation-duration: 4s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
}
@keyframes slide {
  from {
    opacity: 0;
  }
  10%{
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>