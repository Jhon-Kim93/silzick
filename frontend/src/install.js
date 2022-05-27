import WebSpeechRecogComponent from '@/components/Mission/Speech.vue'

const WebSpeech = {
  install (Vue) {
    Vue.component('vue-web-speech', WebSpeechRecogComponent)
  }
}

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(WebSpeech)
}

export default WebSpeech
