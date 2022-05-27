<template>
  <div id="base-border" class="d-flex flex-column p-3">
    <!--채팅 내역 : chat_list-->
    <div id="chatBar" class="scroll-bar my-1" style="height:25vh; text-align:left;">
      <p
        v-for="message, idx in messages"
        class="m-1"
        :key="idx"
      >
        {{message}}
      </p>
    </div>
    <hr>
    <!--채팅 입력 : chat_input-->
    <div>
      <select
        v-model="chatSelect"
        id = "chat-select"
        class="select_list"
      >
        <option selected value="">모두</option>
        <option
          v-for="participant, idx in participants"
          :key="idx"
          :value="participant.connectionId"
        >
          {{participant.nickname}}
        </option>
      </select>
      <input
        id=""
        class="col-12 mt-2"
        type="text"
        placeholder="메세지를 입력하세요"
        v-model="chatMessage"
        style="color:#222831;"
        @keyup.enter="enterMessage"
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
const gameStore = 'gameStore'

export default {
  name: 'Chatting',
  data () {
    return {
      chatMessage : "",
      chatSelect : "",
    }
  },
  computed: {
    ...mapState(gameStore, ['messages', 'nickname','participants']),
  },
  methods: {
    ...mapActions(gameStore, ['sendMessageWhisper','sendMessage']),
    enterMessage() {
      if (this.chatMessage.trim()) {
        if(this.chatSelect==""){
          const messageData ={
            user: this.nickname,
            chatMessage: this.chatMessage,
          }
          this.sendMessage(messageData)
          this.chatMessage=""
        }else{
          const messageData ={
            user: this.nickname,
            chatMessage: this.chatMessage,
            to: this.chatSelect,
          }
          this.sendMessageWhisper(messageData)
          this.chatMessage=""
        }
      }
    },
  },
  watch:{
    messages: function(){
    var container = this.$el.querySelector("#chatBar");
    container.scrollTop = container.scrollHeight;
    }
  }
}
</script>

<style scoped>
input[type=text] {
  border: solid #30475E;
  color: #212121;
  border-radius: 4px;
}
input::placeholder {
  font-size: 0.8rem;
}

#chat-select {
    border: 3px solid #30475E;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
    text-align: center;
    font-family: CBNUJIKJI;
    background-color: #222831;
    color: #DDDDDD;
}
</style>