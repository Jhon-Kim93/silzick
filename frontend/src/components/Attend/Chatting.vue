<template>
  <div id="base-border" class="d-flex flex-column p-3">
    <!--채팅 내역 : chat_list-->
    <div id="chatBar" class="scroll-bar my-1" style="height:63vh; text-align:left;">
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
      <input
        id="asd"
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
      chatMessage : ""
    }
  },
  computed: {
    ...mapState(gameStore, ['messages', 'nickname']),
  },
  methods: {
    ...mapActions(gameStore, ['sendMessage',]),
    enterMessage() {
      if (this.chatMessage.trim()) {
        const message ={
          user: this.nickname,
          chatMessage: this.chatMessage
        }
        this.sendMessage(message)
        this.chatMessage=""
      }
    },
  },
   watch:{
      messages: function(){
      var container = this.$el.querySelector("#chatBar");
      container.scrollTop = container.scrollHeight
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
</style>