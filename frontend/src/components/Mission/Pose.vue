<template>
  <div>
    <!-- canvas는 안보이더라도 존재해야 나머지가 작동됨 -->
    <div v-show="false"><canvas id="canvas"></canvas></div>
    <!-- 미션이 완료되는동안 확률이 계속 표시되서 게이지가 다 차면 안보이게 수정 -->

    <!-- 미션게이지와 미션완료시 아이콘 표시 -->
    <div v-if="impormation" class="d-flex row flex-wrap justify-content-center mb-3">
      <p class="my-1 col-12">{{similiarity}}</p>
      <div class="col-12 d-flex row justify-content-around">
        <exchange-timer class="col-3"/>
        <!-- 모션 설명하는 이미지 -->
        <img
          class="col-4 my-1"
          :src="require(`@/assets/img/이모지/${impormation}.png`)"
          alt="모션"
        >
      </div>
      <!-- 달성도 표시 -->
      <b-progress class="p-0 col-10" :max="maxLoadingTime">
        <b-progress-bar :value="loadingTime" :label="`${((loadingTime / maxLoadingTime) * 100).toFixed(2)}%`"></b-progress-bar>
      </b-progress>
      <div class="col-12"></div>
    </div>
    <div v-if="!loading"> 
      
      <div v-if="success"> 
        <p class="text-success">미션 성공</p>
        <b-icon icon="check2-circle" font-scale="2.5" variant="success"></b-icon>
      </div>
      <div v-else> 
        <p class="text-danger">미션 실패</p>
        <b-icon icon="exclamation-circle" font-scale="2.5" variant="danger"></b-icon>
        </div>
    </div>
  
  </div>
</template>
<script>
// import * as tf from '@tensorflow/tfjs'
// import * as tmPose from '@teachablemachine/pose'

import { mapState, mapActions, mapMutations } from 'vuex'
import ExchangeTimer from './ExchangeTimer.vue'

const gameStore = 'gameStore'
 
export default {
  components: { ExchangeTimer },
  data () {
    return {
      loading: true,
      loadingTime: 0,
      maxLoadingTime: 50,

      impormation: '',
      similiarity: '',

      timerCount:17,
      success:false,
      timer:true,

      loop_state:false
    }
  },
  watch: {
    // 타이머의 시간이 다 되면 종료
    timerCount: {
      handler(value) {
        //미션 성공시
          //시간이 흐름.
        if (value > 0 && value < 17) {
          console.log(value)
          setTimeout(() => {
            this.timerCount--;
          }, 1000) 
        }
      }
    },    
  },
  computed: {
    ...mapState(gameStore, ['mission','random_int','isNormalMission','model','webcam','size']),
  },
  created(){
    this.randomInt({min:1,max:4})
    this.inits()
    
  },
  methods: {
    ...mapActions(gameStore, ['missionReset','randomInt','missionSuccess','numberOfSkillUse',]),
    ...mapMutations(gameStore, ['IS_NORMAL_MISSION']),
    async inits () {
      this.timerCount -=1
      window.requestAnimationFrame(this.loop)
      this.loop_state =true
    },
    async loop() {
      if(this.loop_state){
        this.webcam.update()
        await this.predict()
        window.requestAnimationFrame(this.loop)
      }
    },

    async predict() {
      const { posenetOutput } = await this.model.estimatePose(this.webcam.canvas)
      const prediction = await this.model.predict(posenetOutput)
      this.impormation = prediction[this.random_int].className
      this.similiarity = '정확도 :' + parseInt(prediction[this.random_int].probability.toFixed(2) *100) + '%'
      if (this.timerCount > 0 ){
        if( this.loadingTime < this.maxLoadingTime) {
          if (prediction[this.random_int].probability.toFixed(2) > 0.8) {
            this.loadingTime++
          }
        }else {
          this.loading = false
          this.success = true
          this.loop_state =false
          this.impormation=''
          this.similiarity = ''
          this.loadingTime = 0
          this.timerCount = 17
          //loading진행바가 true면 끝남.
          //성공한게 노멀미션이면 명교횟수 +1
          if(this.isNormalMission){
            this.missionSuccess(+1)
            //히든미션이면 스킬포인트 +1
          }else{
            this.numberOfSkillUse(+1)
          }
          console.log("포즈 테스트")
          this.IS_NORMAL_MISSION(true)
          setTimeout(()=>{
            this.missionReset()
          },2000)
        }
      }else{
        this.loading = false
        this.success = false
        this.loop_state =false
        this.impormation=''
        this.similiarity = ''
        this.loadingTime = 0
        this.timerCount = 17
        this.IS_NORMAL_MISSION(true)
        setTimeout(()=>{
          this.missionReset()
        },2000)
      }
    },
  }
}
</script>

<style>

</style>