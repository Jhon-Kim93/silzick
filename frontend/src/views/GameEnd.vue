<template>
  <div id="background-black" class="full-screen d-flex justify-content-center align-items-center">
    <kira-win
      v-if="winner=='KIRA'"
    />
    <l-win
      v-else
    />
  </div>
</template>

<script>
import KiraWin from '@/components/MainGame/KiraWin.vue'
import LWin from '@/components/MainGame/LWin.vue'
import { mapState } from 'vuex'

const gameStore = 'gameStore'

export default {
  name: 'GameEnd',
  components: {
    KiraWin,
    LWin,
  },
  computed: {
    ...mapState(gameStore, ['winner'])
  },
  created () {
  }
}
</script>

<style>

</style>