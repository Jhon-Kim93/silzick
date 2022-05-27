<template>
  <div class="d-flex row align-content-center">
    <div class="col-1 d-flex row align-content-center">
      <button
        id="btn-color"
        class="btn btn-sm"
        @click="pageNav('previous')"
      >
        ◀
      </button>
    </div>
    <!-- 룰 설명 이미지 2장 -->
    <div class="col-10 d-flex row">
      <img class="col-6" :src="img01" alt="first_img">
      <img class="col-6" :src="img02" alt="second_img">
    </div>
    <div class="col-1 d-flex row align-content-center">
      <button
        id="btn-color"
        class="btn btn-sm"
        @click="pageNav('next')"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rule',
  data() {
    return {
      pageNo: 0,
      img01: 'https://ifh.cc/g/duF7C5.png',
      img02: 'https://ifh.cc/g/uLNS3t.png',
    }
  },
  methods: {
    // 이전 누르면 페이지 넘버 -하고 이미지 2개 보여주기
    pageNav(request) {
      if (request == 'previous' && this.pageNo > 0) {
        this.pageNo--
      } else if (request == 'next' && this.pageNo < 15) {
        this.pageNo++
      }
      switch (this.pageNo) {
        case 0: 
          this.img01='https://ifh.cc/g/FNSOxR.png'
          this.img02='https://ifh.cc/g/RsSwrY.png'
          break
        case 1: 
          this.img01='https://ifh.cc/g/UP17nv.png'
          this.img02='https://ifh.cc/g/ReVhoi.png'
          break
        case 2: 
          this.img01='https://ifh.cc/g/iypsOs.png'
          this.img02='https://ifh.cc/g/D0cFGz.png'
          break
        case 3: 
          this.img01='https://ifh.cc/g/OHUqpd.png'
          this.img02='https://ifh.cc/g/KhXhiY.png'
          break
        case 4: 
          this.img01='https://ifh.cc/g/VF3uQq.png'
          this.img02='https://ifh.cc/g/Mtbgat.png'
          break
        case 5: 
          this.img01='https://ifh.cc/g/Kev14K.png'
          this.img02='https://ifh.cc/g/JBwQRG.png'
          break
        case 6: 
          this.img01='https://ifh.cc/g/dSNQr0.png'
          this.img02='https://ifh.cc/g/dZOzMu.png'
          break
        case 7: 
          this.img01='https://ifh.cc/g/NvX5y3.png'
          this.img02='https://ifh.cc/g/PyHigW.png'
          break
        case 8: 
          this.img01='https://ifh.cc/g/uOTMJg.png'
          this.img02='https://ifh.cc/g/trtxjZ.png'
          break
        case 9: 
          this.img01='https://ifh.cc/g/xyXbQ2.png'
          this.img02='https://ifh.cc/g/r0nhe8.png'
          break
        case 10: 
          this.img01='https://ifh.cc/g/zCe85o.png'
          this.img02='https://ifh.cc/g/Q5wW0I.png'
          break
        case 11: 
          this.img01='https://ifh.cc/g/1AOdi8.png'
          this.img02='https://ifh.cc/g/NpfQQN.png'
          break
        case 12: 
          this.img01='https://ifh.cc/g/iLGSu8.png'
          this.img02='https://ifh.cc/g/JWrjjZ.png'
          break
        case 13: 
          this.img01='https://ifh.cc/g/XNKmyy.png'
          this.img02='https://ifh.cc/g/ZYhmGf.png'
          break
      }
    }
  }
}
</script>

<style scoped> 
img {
  height: 34vh;
}
</style>
