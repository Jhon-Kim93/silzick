<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import cookies from 'vue-cookies'
import { mapState } from 'vuex'


const gameStore = 'gameStore'

export default {
  name: 'APP',
  data () {
    return {
      isLogin : false,
    }
  },
  computed: {
    ...mapState(gameStore, ['join'])
  },
  updated () {
    this.isLogin = cookies.isKey("JWT-AUTHENTICATION")
  },
  created () {
    this.isLogin = cookies.isKey("JWT-AUTHENTICATION")
  }
}
</script>

<style>
#app {
  font-family: CBNUJIKJI, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #DDDDDD;
  height: 100vh;
  background-color: #222831;
  z-index: -2;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #ffffff;
}

.fix {
  position: fixed;
}
</style>
