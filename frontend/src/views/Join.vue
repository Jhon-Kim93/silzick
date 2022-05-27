<template>
  <div id="background-black" class="full-screen">
    <!-- 게스트 입장 시 상단 : hostId의 방으로! -->
    <div class="full-screen d-flex justify-content-center align-items-center flex-column" v-if="!isHost">
      <div class="my-3">
        <h1>{{ hostId }}의 방으로!</h1>
      </div>
      <div id="base-border" class="full-screen container d-flex flex-row justify-content-center align-content-center row col-7" style="height:40vh">
        <div class="col-11 row d-flex align-content-center" style="height:13vh">
          <h3 id="base-font" class="m-2">Nickname</h3>
          <input
          id="base-border"
          type="text"
          v-model="nickname"
          class="form-control m-2"
          placeholder="게임에서 사용하실 닉네임을 입력해주세요."
          required
          @keyup.enter="nicknameUpdate(nickname)"
          ref="cursor"
          >
        </div>
        <div class="col-8 row d-flex align-content-center" style="height:13vh">
          <button id="btn-color-kira" class="btn mt-4 px-5" @click="nicknameUpdate(nickname)">입장</button>
          <a style="text-decoration-line : none; font-size:20px;" href="/" class="mt-2">메인 페이지로 이동</a>
        </div>
      </div>
    </div>
    <!-- 로그인 후 방 만드는 사람 : 상단 -> 나의 방으로! -->
    <div class="full-screen d-flex justify-content-center align-items-center flex-column" v-if="isHost">
      <div class="my-3">
        <h1>나의 방으로!</h1>
      </div>
      <div id="base-border" class="container d-flex flex-row justify-content-center align-content-center row col-7" style="height:40vh">
        <div class="col-11 row d-flex align-content-center" style="height:13vh">
          <h3 id="base-font" class="m-2">Nickname</h3>
          <input
          id="base-border"
          type="text"
          v-model="nickname"
          class="form-control m-2"
          placeholder="게임에서 사용하실 닉네임을 입력해주세요."
          required
          @keyup.enter="nicknameUpdate(nickname)"
          ref="cursor"
          >
        </div>
        <div class="col-8 row d-flex align-content-center" style="height:13vh">
          <button id="btn-color-kira" class="btn mt-5 px-5" @click="nicknameUpdate(nickname)">입장</button>
          <a style="text-decoration-line : none; font-size:20px;" href="/" class="mt-2">메인 페이지로 이동</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

const gameStore = 'gameStore';

export default {
  name: 'Join',
  data () {
    return{
      nickname: '',
    }
  },
  computed: {
    ...mapState(gameStore, ['hostId', 'isHost','join'])
  },
  methods:  {
    ...mapActions(gameStore, ['nicknameUpdate']),
    ...mapMutations(gameStore, ['GAME_CHECKIN']),
    startCursor() {
      this.$refs.cursor.focus()
    },
  },
  created () {
    this.GAME_CHECKIN()
  },
  mounted() {
    this.startCursor()
  }
};
</script>

<style scoped>

</style>