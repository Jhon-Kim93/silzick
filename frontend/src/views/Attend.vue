<template>
  <div id="background-black" class="full-screen">
    <div class="container d-flex justify-content-center">
      <!-- 작성 후 세션의 대기방 -->
      <div class="row d-flex justify-content-center align-content-center">
        <h3 class="col-4 pt-3">
          [ {{hostId}}의 방 ]
        </h3>
        <!-- ready / start button -->
        <!-- 방장이면 스타트버튼도 있어야함 -->
        <div
          class="offset-4 col-4 row mt-3"
          v-if="isHost"
        >
          <!-- 레디 토글 -->
          <button
            id="btn-color"
            class="btn col-5 m-1"
            @click="setReady"
            v-if="!publisher.ready"
          >
          READY
          </button>
          <button 
            id="btn-color"
            class="btn col-5 m-1"
            @click="setReady"
            v-else
          >
          CANCEL
          </button>
          <!-- 전원(6명 이상) 레디되면 활성화 -->
          <button
            id="btn-color"
            class="btn col-5 m-1"
            @click="gameStart"
            :disabled="!readyStatus"
          >
          START
          </button>
        </div>
        <!-- 게스트인 경우 레디만 띄움 -->
        <div
          
          class="offset-4 col-3 row mt-3"
          v-else
        >
          <button
            id="btn-color"
            class="offset-1 col-10 btn m-1"
            @click="setReady"
            v-if="!publisher.ready"
          >
          READY
          </button>
          <button
            id="btn-color"
            class="offset-1 col-10 btn m-1"
            @click="setReady"
            v-else
          >
          CANCEL
          </button>
        </div>  
        <hr>

        <!-- div3개 -->
        <div class="row d-flex justify-content-center">
          <div class="col-9 d-flex-wrap row d-flex justify-content-center">
            <!-- 참가자 리스트 -->
            <div id="base-border" class="col-3 m-1 align-self-start scroll-bar" style="height:40vh">
              <div v-if="publisher">
                <ready :streamManager="publisher"/>
                <div
                  v-for="sub in subscribers"
                  :key="sub.stream.session.streamId"
                >
                  <ready :stream-manager="sub" />
                </div>
              </div>
            </div>

            <!-- 직업 선택 리스트 -->
            <div v-if="isHost" id="base-border" class="col-4 m-1 align-self-start align-items-center flex-column scroll-bar" style="height:40vh">
              <jobs :job="job" v-for="job in jobs" :key="job.jobName"/>          
            </div>
            <div v-else id="base-border" class="col-4 m-1 align-self-start align-items-center flex-column scroll-bar px-2 attend" style="height:40vh">
              <div>직업 선택은 HOST만 할 수 있습니다.</div>
            </div>

            <!-- 결과 리스트 -->
            <div id="base-border" class="col-4 m-1 align-self-start align-items-center flex-column scroll-bar px-2" style="height:40vh">
              <job-select :job="job" v-for="job in jobs" :key="job.jobName"/>
            </div>

            <!-- 룰 또는 영상 -->
            <div id="base-border" class="col-11 mx-2 d-flex row" style="height:40vh">
              <rule class="mt-1 d-flex row justify-content-center"/>
            </div>
          </div>
          <!-- 채팅 -->
          <div class="col-3 row">
            <div class="scroll-bar mx-1">
              <chatting/>
            </div>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import Ready from '@/components/Attend/Ready.vue';
import Jobs from  '@/components/Attend/Jobs.vue';
import JobSelect from '@/components/Attend/JobSelect.vue';
import Chatting from '@/components/Attend/Chatting.vue';
import Rule from '@/components/Attend/Rule.vue'


import { mapState, mapActions, mapMutations } from 'vuex'


const gameStore = 'gameStore';

export default {
  name: "Attend",
  components: {
    Ready,
    Jobs,
    JobSelect,
    Chatting,
    Rule,

  },
  data () {
    return {
      message: "init",
    }
  },
  computed: {
    ...mapState(gameStore, ['sessionId', 'subscribers', 'publisher', 'jobs', 'messages', 'isHost', 'session', 'readyStatus','hostId']),
  },
  methods: {
    ...mapActions(gameStore, [ 'sendMessage', 'leaveSession', 'setReady', 'getReadyStatus', 'getJobsState',]),
    ...mapMutations(gameStore, ['SET_MY_READY']),
    
    gameStart() {
      let countSum = 0
      this.jobs.forEach(job => {
        countSum = job.count + countSum
      })
      if (this.subscribers.length + 1 === countSum) {
        this.session.signal({
          type: 'game',
          data: {
            gameStatus: 7
          },
          to: [],
        }) 
        this.session.signal({
          type: 'game',
          data: {
            gameStatus: 4
          },
          to: [],
        }) 
      } else {
        alert('직업을 인원수에 맞게 설정해주세요.')
      }
    },

    clickSendMessage() {
      if (this.message.trim()) {
        this.sendMessage(this.message)
        this.message=""
      }
    },
    
    videoOff(subscriber){
      subscriber.subscribeToAudio(false);  // true to unmute the audio track, false to mute it
      subscriber.subscribeToVideo(false);  // true to enable the video, false to disable it
    },
  },
  created () {
    this.getReadyStatus()
    this.getJobsState()
  }
}
</script>

<style scoped>
.status{
  border: 5px  solid black;
  margin: 2px;
  border-radius: 5%;
  height: 400px;
  
}
.attend{
  display: flex;
  justify-content: center;
  align-content: center;
}
/* .chat{
  border: 5px  solid black;
  margin: 2px;
  border-radius: 5% / 8%;
  height: 150px;
  flex-direction : column;
} */

</style>