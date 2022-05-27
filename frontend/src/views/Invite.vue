<template>
  <div id="background-black" class="full-screen d-flex justify-content-center align-items-center flex-column">
    <div class="my-3">
      <h1>누구의 방으로?</h1>
    </div>
    <div id="base-border" class="container d-flex flex-row justify-content-center align-content-center row col-7" style="height:40vh">
      <div class="col-11 row d-flex align-content-center" style="height:13vh">
        <h3 id="base-font" class="m-2">Host Id</h3>
        <input
        id="base-border"
        type="text"
        v-model="hostId"
        class="form-control m-2"
        placeholder="호스트의 회원 아이디를 입력해주세요."
        required
        @keyup.enter="guestJoinRoom(hostId)"
        ref="cursor"
        >
      </div>
      <div class="col-8 row d-flex align-content-center" style="height:13vh">
        <button id="btn-color" class="btn mt-5 px-5" @click="guestJoinRoom(hostId)">입장</button>
        <a style="text-decoration-line : none; font-size:20px;" href="/" class="mt-2">메인 페이지로 이동</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

const gameStore = 'gameStore';

export default {
  name: 'Invite',
  data () {
    return{
      hostId : '',
    }
  },
  methods:  {
    ...mapActions(gameStore, ['setSessionID', 'guestJoinRoom']),
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
input[type=text] {
  border: solid #30475E;
  color: #212121;
  border-radius: 8px;
}
#card-bg {
  background: #222831;
  padding-top: 9%;
}
.card {
  border: solid 3px #30475E;
  height: auto;
  width: 60vw;
}

</style>