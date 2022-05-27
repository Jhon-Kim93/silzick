
<template>
  <div>
    <div v-if="ready" class="d-flex row justify-content-center">
      <h5 class='col-12'>{{cnt}}회 / {{s_count}}회</h5>
      <div class='col-12 d-flex row justify-content-around'>
        <exchange-timer class="col-3"/>
        <p class="col-6">{{ importmation }}</p>
      </div>
    </div>
    <div v-else>
      <div v-if="success"> 
        <p class="text-success">미션 성공</p>
        <b-icon icon="check2-circle" font-scale="2.5" variant="success"></b-icon>
      </div>
      <div v-if="!success"> 
        <p class="text-danger">미션 실패</p>
        <b-icon icon="exclamation-circle" font-scale="2.5" variant="danger"></b-icon>
        </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import { mapState, mapActions,mapMutations } from 'vuex'
import ExchangeTimer from './ExchangeTimer.vue';

const gameStore = 'gameStore';

export default {
  components: { ExchangeTimer },
  props: {
    lang: {
      type: String,
      default: 'ko-KR'
    },
    value: {
      type: Boolean
    },
    confidenceLimit: {
      type: [Number, String],
      default: 0.8
    },
    continuous: {
      type: Boolean,
      default: true
    },
    interimResults: {
      type: Boolean
    },
    maxAlternatives: {
      type: [Number, String],
      default: 1
    },
    grammar: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      text: '',
      recognition: null,
      signal: false,
      textdata: '',
      timerCount: 16,
      mission_list:['홍합', '왕밤빵', '날씨', '키라', '경찰', '미션', '스킬', '오늘', '해쩌염', '역전 석점 슛', '직업'],
      s_mission: '',
      s_count : 1,
      importmation: '',
      cnt : 0,
      success: true,
      ready:true,
      timer_state : false
    }
  },
  watch: {
    // 타이머의 시간이 다 되면 종료
    timerCount: {
      handler(value) {
        //미션 성공시
        if(this.cnt>=this.s_count){
            console.log("4")
            console.log(this.success)
            //초기화 로직
            if (this.timer_state){
              if(this.isNormalMission){
                this.missionSuccess(+1)
              }else{
                this.numberOfSkillUse(+1)
              }
              this.recognition.stop()
              this.success = true
              this.ready = false
              this.timerCount = 16
              this.cnt = 0
              this.timer_state = false
              this.IS_NORMAL_MISSION(true)
              setTimeout(() => {
                this.missionReset()
              }, 2000);
            }
            //미션을 실패하면
        }else{
          //시간이 흐름.
          if (value > 0 && value <16) {
            console.log(value)
            setTimeout(() => {
              this.timerCount--;
            }, 1000) 
          }else {
            //시간이 0인데 달성 못하면 멈추고 실패
            //미션 초기화 로직
            if (this.timer_state){
              this.recognition.stop()
              this.success = false
              this.ready = false
              this.timerCount = 16
              this.cnt = 0
              this.timer_state = false
              this.IS_NORMAL_MISSION(true)
              setTimeout(() => {
                this.missionReset()
              }, 1000);
            }       
          }
        }
      },    
    },
  },
  computed: {
    ...mapState(gameStore, ['mission','isNormalMission']),
  },
  created () {
    this.initRecognition()
    this.getmission()
    this.timer_state = true
    this.timerCount -= 1
    this.recognition.start()
  },
  methods: {
    ...mapActions(gameStore, ['missionReset','missionSuccess','numberOfSkillUse']),
    ...mapMutations(gameStore, ['IS_NORMAL_MISSION']),
    getmission () {
      this.s_mission = this.mission_list[Math.floor(Math.random()*this.mission_list.length)];
      // this.s_count = parseInt(25 / this.s_mission.length)
      this.importmation = `<${this.s_mission}>을(를) ${this.s_count}번 말하시오`
    },
    initRecognition () {
      const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
      const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
      const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

      this.recognition = new SpeechRecognition()
      const speechRecognitionList = new SpeechGrammarList()
      if (this.grammar) {
        speechRecognitionList.addFromString(this.grammar, 1)
      }
      this.recognition.grammars = speechRecognitionList

      this.recognition.lang = this.lang
      this.recognition.continuous = this.continuous
      this.recognition.interimResults = this.interimResults
      this.recognition.maxAlternatives = this.maxAlternatives

      this.recognition.onresult = (event) => {
        // const transcript = event.results[0].map(a => a.transcript)
        const textArr = Array.from(event.results).filter(srr => {
          return srr[0].confidence >= this.confidenceLimit
        }).map(srr => {
          return srr[0].transcript
        })
        this.textdata = textArr.join('\n')
        console.log(this.textdata)
        if (this.textdata.search(this.s_mission) != -1) {
          this.cnt = this.textdata.split(this.s_mission).length-1
        }
      }
    },
  }
}

</script>
