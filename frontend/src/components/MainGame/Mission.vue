<template>
  <div class="d-flex row justify-content-center align-content-start m-1" style="height:26vh">
    <p
      v-if="isNormalMission"
      id="base-font"
      class="col-12 m-1"
      style="font-size:1.5rem"
    >MISSION</p>
    <p
      v-else
      id="base-font"
      class="col-12 m-1"
      style="font-size:1.5rem"
    >HIDDEN MISSION</p>
    <hr class="m-0 col-12">
    <!-- 미션 스타트 버튼 -->
    <div class="row d-flex justify-content-center mt-4" v-if="!mission && webcam">

      <b-button
        id="btn-color"
        class="btn btn-lg w-50 mt"
        size='sm'
        @click="missionSelect(true)"
        v-if="isKIRAorL == false"
      >start</b-button>
      <p v-else>노트주인과 경찰총장은 미션을 수행할수 없습니다</p>
      <p v-if="isKIRAorL == false">위조명함 개수:{{missionSuccessCount}}</p>

      <!-- 위조명함 개수:{{missionSuccessCount}} -->
    </div>
    <!-- 버튼 클릭 시 미션 시작 -->
    <div v-else>
      <pose v-if="mission==1"/>
      <div v-if="mission==2">
        <vue-web-speech></vue-web-speech>
      </div>
    </div>
  </div>
</template>
<script>
import pose from '../Mission/Pose.vue'

import { mapState, mapActions } from 'vuex'

const gameStore = 'gameStore';

export default {
  name: 'Mission',
  data () {
    return {
      missionShow: false,
    }
  },
  components: { 
    pose,
  },
  created(){
    this.init()
    setTimeout(()=>{
      this.missionReset()
    },2000)
  },
  computed: {
    ...mapState(gameStore, ['myJob','mission','webcam', 'isKIRAorL', 'numberOfSkillUsed', 'missionSuccessCount', 'isNormalMission',]),
    skillCnt(){
      if(this.myJob!='POLICE'){
        return this.numberOfSkillUsed;
      }else{
        return Math.floor(this.numberOfSkillUsed/2);
      }
    }
  },
  methods:{
    ...mapActions(gameStore, ['missionSelect','init','missionReset']),
  },    
}
</script>

<style scoped>
hr {
  background: #30475E;
}

</style>