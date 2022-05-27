<template>
  <div id="background-black" class="full-screen d-flex justify-content-center">
    <div class="container pt-4 row flex-wrap justify-content-center">
      <!-- 카메라 -->
      <div
        class="col-7 scroll-bar container mb-4 d-flex row flex-wrap align-content-start"
        style="height: 84vh"
      >
        <!--6명 이하 6분할-->
        <div id ='my'
          class="col-6"
          v-if="subscribers.length < 6 && isAlive"
        > 
          <!-- 내 비디오 -->
          <div  class="p-1 h-100">
            <user-video
              id="base-border"
              class="pt-1 px-1"
              :stream-manager="publisher"
              
            />
          </div>
        </div>
        <!-- 다른 사람 비디오 -->
        <div
          class="col-6"
          v-for="subscriber in subscribers"
          :key="subscriber.stream.connection.connectionId"
        >
          <div class="p-1 h-100">
            <user-video
              id="base-border"
              class="pt-1 px-1"
              :stream-manager="subscriber"
            />
          </div>
        </div>
      </div>

      <!-- 타이머 & 직업 & 메모 & 채팅 div -->
      <div class="col-3 flex-column">
        <!--다음 명함 교환 까지(타이머) : timer-->
        <div id="base-border" class="row d-flex justify-content-center m-1">
          <!-- 직업 이름 -->
          <h4 class="py-1" style="text-align:left;">
            직업 : {{ myJobName }}
          </h4>
          <hr class="mb-1">
          <!-- 타이머 & 메모 -->
          <div class="row justify-content-center align-items-center">
            <div
              v-if="mainGameTimerSevenOrThirty"
              class="col-4"
            >
              <exchange-timer :key="turn"/>
            </div>
            <div
              v-else
              class="col-4">
              <exchange-timer-seven-sec/>
            </div>
              <b-button class="col-4 w-50" v-b-modal.modal-1 @click="modalShow=!modalShow">MEMO</b-button>
            <div>

              
              <b-modal 
                id="modal-1" 
                title="MEMO"
                size='sm'
                body-bg-variant="secondary"
                scrollable  
                hide-header
                hide-backdrop
                hide-footer
              >

                <b-form-textarea 
                id='textArea'
                class="my-4 h-100 w-100" 
                style="border:none;" 
                placeholder="이 곳에 메모하세요"
                rows="10"
                v-model="text"
                :value="memo"
                autofocus
                >
                </b-form-textarea>
                <b-button size="sm" variant="light" @click="forget()">
                    메모지우기
                </b-button>
              </b-modal>
            </div>
            <p>명함교환 누적 횟수 : {{turn}}회</p>
          </div>
        </div>

        <!--미션 및 히든 미션 : mission-->
        <div id="base-border" class="m-1">
          <mission/>
        </div>

        <!--채팅 전체 : chat-->
        <div class="scroll-bar mx-1">
          <chatting/>
        </div>
      </div>
      <div class="col-1 d-flex row align-items-center">
        <toggle/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import UserVideo from '@/components/Attend/UserVideo.vue'
import Toggle from '@/components/MainGame/Toggle.vue'
import Chatting from '@/components/MainGame/Chatting.vue'
import ExchangeTimer from '../components/MainGame/ExchangeTimer.vue'
import ExchangeTimerSevenSec from '../components/MainGame/ExchangeTimerSevenSec.vue'
import Mission from '@/components/MainGame/Mission.vue'

const gameStore = 'gameStore'

export default {
  name : 'MainGame',
  components: {
    UserVideo,
    Toggle,
    Chatting,
    ExchangeTimer,
    ExchangeTimerSevenSec,
    Mission,
  },
  data () {
    return {
      chatMessage: '',
      restart : 30,
      modalShow : false,
      text:'',
    }
  },
  watch:{
    modalShow(value){
      console.log(value)
      setTimeout(()=>{
        this.modalPosition()
        this.modalShow = false
      },10)
    },
    text(value){
      this.getMemo(value)
      
    }
  },

  computed: {
    ...mapState(gameStore, [
      'myJob',
      'nickname',
      'subscribers', 
      'publisher', 
      'subSession', 
      'session', 
      'messages', 
      'mainGameTimerSevenOrThirty', 
      'turn', 
      'isKIRAorL',
      'isAlive',
      'memo']),
    myJobName : function(){
			switch(this.myJob){
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
			return 'Error'
		}
  },
  methods : {
    ...mapMutations(gameStore, ['SET_MAINGAME_TIMER', 'COUNT_TURN']),
    ...mapActions(gameStore, ['sendMessage', 'numberofSkillUse','getMemo']),
    enterCard () {
      this.session.signal({
        type: 'autoSystem',
        data: JSON.stringify({ action: 'exchangeNameStart' }),
        target: [this.publisher.stream.connection.connectionId, this.subscribers[0].stream.connection.connectionId]
      })
    },
    forget(){
      this.text = ''
    },
    modalPosition(){
      const modal_position = document.querySelector('.modal-content')
      modal_position.style = 'margin-left: 320px; opacity:70%;'
      const textArea = document.querySelector('#textArea')
      textArea.style="opacity:100%"  
    },
    enterMessage() {
      if (this.chatMessage.trim()) {
        this.sendMessage(this.chatMessage)
        this.chatMessage=""
      }
    },
  },
  created() {
    this.text = this.memo
    if (this.mainGameTimerSevenOrThirty === false) {
      setTimeout(() => {
        this.SET_MAINGAME_TIMER(true)
      }, 10000)
    }
    
  },
}
</script>

<style scoped>
hr {
  background: #30475E;
}
/* custom css */
  .private_cam_6 {
    border-style: solid;
    border-color: white;
    width: 33%;
    height: 50%;
  }
  .private_cam_9 {
    border-style: solid;
    border-color: white;
    width: 33%;
    height: 33%;
  }


/* braught css */
.textarea_position {
  position: absolute;
  top: 5%;
  left: 8%;
  width: 85%;
  height: 90%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background: transparent;
  border: none;
  resize: none;
  outline: none;
}

/* 신경X */
input[id*="popup"] {
  display:none;
}
/* 메모하기 버튼 */
input[id*="popup"] + label {
  display: inline-block;
  background-color: #30475E;
	border-radius:5px;
	border:solid #30475E;
	display:inline-block;
	cursor:pointer;
	color:#DDDDDD;
	font-family:'CBNUJIKJI';
	/* font-size:17px; */
	font-weight:bold;
	padding:10px 23px;
	text-decoration:none;
}
/* 버튼 클릭 후 div 전체화면인듯?*/
input[id*="popup"] + label + div {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
/* 모달창 배경 위에 fixed로 설정해서 absolute가 그 영향 받음 - 메모창 위치*/
input[id*="popup"] + label + div > div {
  position: absolute;
  top: 50%;
  left: 75%;
  transform:translate(-50%, -50%);
  width: 30%;
  height: 30%;
  background: #222831;
  opacity: 80%;
  border: solid #DDDDDD;
  border-radius: 15px;
  z-index: 2;
}
/* 메모창 닫기버튼 */
input[id*="popup"] + label + div > div > label {
  position: absolute;
  top: 0%;
  right: 0%;
  transform:translate(40%, -40%);
  padding: 2%;
  background: #DDDDDD;
  border-radius: 100%;
  z-index: 1;
  border: solid #DDDDDD;
}
/* 필요X */
/* input[id*="popup"] + label + div > label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: blue;
  z-index: 1;
} */
input[id*="popup"] + label + div {
  display:none;
}
input[id*="popup"]:checked + label + div {
  display:block;
}
/* input[id*="popup"] + label + div:hover {
  background-color:transparent;
} */
/* .input[id*="popup"] + label :active {
	position:relative;
	top:1px;
} */
.buttons {
  position: fixed;
  top: 79%;
  right: 5%;
  width: 20%
}
.skill_button {
	background-color:#44c767;
	border-radius:28px;
	border:1px solid #18ab29;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	font-weight:bold;
	padding:16px 31px;
	text-decoration:none;
	text-shadow:0px 1px 0px #2f6627;
}
.skill_button:hover {
	background-color:#5cbf2a;
}
.skill_button:active {
  position:relative;
	top:1px;
}
.skill_button_police {
	background-color:#1186cf;
	border-radius:28px;
	border:1px solid #4e6096;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	padding:16px 31px;
	text-decoration:none;
	text-shadow:0px 1px 0px #283966;
}
.skill_button_police:hover {
  background-color:#476e9e;
}
.skill_button_police:active {
	position:relative;
	top:1px;
}
.skill_button_note {
	background-color:#fc5230;
	border-radius:28px;
	border:1px solid #d02718;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	padding:16px 31px;
	text-decoration:none;
	text-shadow:0px 1px 0px #810e05;
}
.skill_button_note:hover {
	background-color:#d65246;
}
.skill_button_note:active {
	position:relative;
	top:1px;
}
.memo_button {
	background-color:transparent;
	border-radius:28px;
	border:1px solid white;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	font-weight:bold;
	padding:16px 31px;
	text-decoration:none;
	text-shadow:0px 1px 0px #2f6627;
}
.memo_button:hover {
	background-color:rgb(46, 48, 47);
}
.memo_button:active {
	position:relative;
	top:1px;
}
.total_cam {
  position: fixed;
  top: 18%;
  left: 5%;
  border-style: solid;
  border-color: white;
  width: 50%;
  height: 50%;
  flex-wrap: wrap;
}
.private_cam_4 {
  border-style: solid;
  border-color: white;
  width: 50%;
  height: 50%;
}
.timer {
  position: fixed;
  top: 15%;
  left: 57.5%;
  border-style: solid;
  border-color: white;
  width: 15%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* text-align: center; */
}
.chat {
  position: fixed;
  top: 15%;
  right: 5%;
  border-style: solid;
  border-color: white;
  width: 20%;
  height: 60%;
}
.chat_list {
  position: absolute;
  top: 5%;
  left: 5%;
  border-style: solid;
  border-color: white;
  width: 90%;
  height: 70%
}
.chat_input {
  position: absolute;
  top: 80%;
  left: 5%;
  border-style: solid;
  border-color: white;
  background-color: transparent;
  width: 90%;
  height: 15%;
}

.explain {
  position: fixed;
  top: 29%;
  left: 57.5%;
  border-style: solid;
  border-color: white;
  width: 15%;
  height: 27%;
  /* text-align: center; */
}
.dotted_line {
  border-bottom-style: dotted;
  border-color: white;
}
.doubt {
  position: fixed;
  top: 72%;
  left: 5%;
  border-style: solid;
  border-color: white;
  width: 38%;
  height: 15%;
  flex-wrap: wrap;
}

.counts {
  position: fixed;
  top: 72%;
  left: 45%;
  border-style: solid;
  border-color: white;
  width: 10%;
  height: 15%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.explain_job {
  font-size: 120%;
  height: 15%;
}
.explain_job_description {
  height: 30%;
}
.explain_skill {
  height: 25%;
}
.explain_victory {
  height: 30%;
}
</style>
