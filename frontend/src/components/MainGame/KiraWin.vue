<template>
  <div id="background-black" class="full-screen d-flex justify-content-center align-items-center">
    <div
      id="red-border"
      class="container d-flex flex-row justify-content-center align-content-center row col-8"
      style="height:80vh"
    >
      <div class="col-10 row d-flex justify-content-center mb-3">
        <b-icon icon="award-fill" font-scale="7.5" class="col-3" variant="danger" />
        <h1 class="col-8 align-self-center" style="text-align:left;">노트주인 측 승리 !</h1>
      </div>
      <hr>
      <div class="col-10 d-flex row justify-content-start flex-wrap">
        <h2 class="col-12" style="text-align:left;">Winners</h2>
        <div
          class="col-6"
          v-for="Kira in KiraTeam"
          :key="Kira.job"
        >
          <span style="font-size:1rem;">{{Kira.nickname}} : {{Kira.job}}</span>
        </div>
        <h2 class="col-12 mt-2" style="text-align:left;">Losers</h2>
        <div
          class="col-6"
          v-for="L in LTeam"
          :key="L.job"
        >
          <span style="font-size:1rem;">{{L.nickname}} : {{L.job}}</span>
        </div>
      </div>
      <div class="col-8 row d-flex align-content-center" style="height:13vh">
        <button id="btn-color-kira" class="btn col" @click="gameReset">돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const gameStore = 'gameStore';

export default {
  name: 'KiraWin',
  data () {
    return {
      KiraTeam: [],
      LTeam: [],
    }
  },
  computed: {
    ...mapState(gameStore, ['participantsLog', 'finalInfo'])
  },
  methods: {
    ...mapActions(gameStore, [ 'gameReset']),
  },
  created() {
    this.participantsLog.forEach(participant => {
      // participantsLog(전체 참여자) 받아서 직업확인하고 KIRA팀이면 KiraTeam에 넣고 L팀이면 Lteam에 넣는다.
      // participantsLog에 넣는 객체 : {nickname: clientData, connectionId: connectionId}
      // finalInfo는 {connectionId:직업}
      const job = this.finalInfo[participant.connectionId]
      if (job == 'KIRA' || job == 'CRIMINAL') {
        this.KiraTeam.push({nickname:participant.nickname, job:job})
      } else {
        this.LTeam.push({nickname:participant.nickname, job:job})
      }
    })
  }
}
</script>

<style>
</style>