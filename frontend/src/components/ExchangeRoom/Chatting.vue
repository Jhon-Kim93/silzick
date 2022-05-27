<template>
  <div class="d-flex flex-column">
    <!--채팅 내역 : chat_list-->
    <div id="chatBar" class="scroll-bar" style="height:20vh; text-align:left;">
      <p
        v-for="message, idx in messages"
        class="m-1"
        :key="idx"
      >
        {{message}}
      </p>
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