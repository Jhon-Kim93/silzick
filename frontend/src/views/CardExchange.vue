<template>
  <div id="background-black" class="full-screen d-flex justify-content-center">
    <div class="container pt-4 row flex-wrap justify-content-center">
      <!-- 첫번째 라인 -->
      <!-- 본인 화면 -->
      <div id="base-border" class="col-4 p-3">
        <user-video :streamManager="subPublisher"/>
      </div>
      <div class="col-4 row">
        <!-- 본인이 제시한 명함 -->
        <div class="col-5 align-self-center">
          나의 명함
          <h3>{{ selectedEtoK }}</h3>
        </div>
        <!-- 중앙의 화살표 아이콘 -->
        <b-icon
          icon="arrow-left-right"
          font-scale="3" animation="fade"
          class="col-2 align-self-center"
        ></b-icon>
        <!-- 상대방이 제시한 명함 -->
        <div class="col-5 align-self-center">
          상대방의 명함
          <h3>{{ recievedCardEtoK }}</h3>
        </div>
      </div>
      <!-- 상대방의 화면 -->
      <div id="base-border" class="col-4 p-3">
        <user-video :streamManager="subSubscribers[0]"/>
      </div>

      <!-- 두번째 라인 -->
      <div class="col-4 my-1 align-self-center">
        <h3>명함 제시</h3>
        <div>
          <h5>
          <b-form-select
            id="background-black"
            v-model="selected"
            :options="options"
            class="mx-2 select-btn"
            :disabled="confirm"
          ></b-form-select>
          <button id="btn-color" class="btn mx-2" @click="confirm=true">확정!</button>
          </h5>
        </div>
      </div>
      <div class="col-4 d-flex justify-content-center align-self-center">
        <exchange-timer/>
      </div>
      <div class="col-4 d-flex justify-content-center align-self-start my-3 align-self-center">
        <active-skill/>
      </div>

      <!-- 3번째 라인 -->
      <div id="base-border" class="col-12 mb-3 scroll-bar">
        <chatting></chatting>
      </div>
    </div>
  </div>
</template>

<script>
import UserVideo from '@/components/Attend/UserVideo.vue';
import ExchangeTimer from '@/components/ExchangeRoom/ExchangeTimer.vue';
import ActiveSkill from '@/components/MainGame/ActiveSkill.vue';
import Chatting from '@/components/ExchangeRoom/Chatting.vue';

import {mapState, mapActions, mapMutations} from 'vuex'

const gameStore = 'gameStore'

export default {
  name:'CardExchange',
  components: { 
    UserVideo,
    ExchangeTimer,
    ActiveSkill,
    Chatting,
  },
  data() {
    return {
      //가짜 명교 가능 여부
      chatMessage: '',
      timerCount:15,
      timerExit:20,
      text: '',
      selected: '',
      confirm: false,
    }
  },
  computed: {
    ...mapState(gameStore, ['subPublisher', 'subSubscribers', 'myJob', 'subSession', 'nickname',
                            'receivedCard', 'session', 'messages', 'isAlive','options','isKIRAorL']),
    selectedEtoK:function(){
      switch(this.selected){
				case 'KIRA' :{
					return '노트주인'
				}
				case 'POLICE' :{
					return '경찰'
				}
				case 'L' :{
					return '경찰총장'
				}
				case 'CRIMINAL' :{
					return '추종자'
				}
				case 'GUARD' :{
					return '보디가드'
				}
				case 'BROADCASTER' :{
					return '방송인'
				}
			}
			return '선택 중'
    },
    recievedCardEtoK:function(){
      switch(this.receivedCard){
				case 'KIRA' :{
					return '노트주인'
				}
				case 'POLICE' :{
					return '경찰'
				}
				case 'L' :{
					return '경찰총장'
				}
				case 'CRIMINAL' :{
					return '추종자'
				}
				case 'GUARD' :{
					return '보디가드'
				}
				case 'BROADCASTER' :{
					return '방송인'
				}
			}
			return '선택 중'
    }
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        } else {
          if (!this.confirm) {
            this.selected = this.myJob
            this.confirm = true
          }
        }
      },
    immediate: true
    },
    timerExit: {
      handler(val) {
        if (val > 0) {
          setTimeout(() => {
            this.timerExit--;
          }, 1000);
        } else {
          this.exitCard()
        }
      },
    immediate: true
    },
    confirm (cur) {
      const selectedCard = {
        jobName : this.selected,
        nickname : this.nickname
      }
      if (cur == true) {
        //상대방에게 보내기
        this.subSession.signal({
          type: 'exchangeCard',
          data: JSON.stringify(selectedCard),
          to: [],
        })
        let checkCardAndJob = false
        if (this.selected == this.myJob) {
          //경찰이 자기 자신 내면 히든미션 달성 +1
          if(this.myJob=='POLICE'){
            this.numberOfSkillUse(+1)
          }
          checkCardAndJob = true
        }else{
          if(!this.isKIRAorL){
            this.missionSuccess(-1)
          }
        }
        //엘한테 결과 알리기
        this.session.signal({
          type: 'game',
          data: {
            gameStatus: 5,
            skillType: 'announceToL',
            result: checkCardAndJob
          },
          to: [],
        })
      }
    },
    isAlive (cur) {
      if (cur == false) {
        this.subSession.unPublish(this.subPublisher)
        this.SET_SUB_PUBLISHER(undefined)
      }
    }

  },
  methods: {
    ...mapActions(gameStore, ['exitCard','changeOption','missionSuccess','numberOfSkillUse','changeJobNameEToK']),
    ...mapMutations(gameStore, ['RECEIVE_CARD', 'SET_SUB_PUBLISHER',]),
    setSelfNameIntoSelect(){
      this.selected = this.myJob
    }
  },

  created(){
    this.changeOption()
    this.setSelfNameIntoSelect()
  },
}
</script>

<style scoped>

</style>
