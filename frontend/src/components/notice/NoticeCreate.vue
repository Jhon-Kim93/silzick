<template>
  <div>
    <img src="https://ifh.cc/g/7ruaO5.png" id="bg" alt="bgImg">
    <div>
      <b-button
        @click="createNotice"
        variant="outline-light"
        class="d-flex location3"
        style="margin-left:auto"
      >공지하기</b-button>
    </div>
    <div class="container location" style="width:70%">
      <input
        style="background-color:black"
        class="form-control"
        type="text"
        v-model="title"
        placeholder="제목을 입력하세요."
      >
      <textarea
        style="background-color:black"
        class="form-control my-3 notes"
        type="text"
        v-model="content"
        cols="30" rows="10"
        placeholder="공지사항을 입력하세요."
        required
      ></textarea>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { createNotice } from '@/api/notice.js'

export default {
  name: 'NoticeCreate',
  data () {
    return {
      title: null,
      content: null,
    }
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    createNotice () {
      const noticeData = {
        title: this.title,
        content: this.content,
        userId: this.username,
      }
      createNotice(
        noticeData,
        (res) => {
          console.log(res.data)
          alert('작성 완료')
        },
        (err) => {
          alert(err)
        },
      )
      this.$router.push({ name: 'Notice' })
    },
  },
}
</script>

<style scoped>
  .location {
    position: fixed;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
  }
  input[type=text] {
    border: solid black;
    color: white
  }
  input[type=text]:focus {
    border: solid white;
    color: white
  }
  textarea[type=text] {
    border: solid black;
    color: white;
  }
  textarea[type=text]:focus {
    border: solid white;
    color: white
  }
  .enter {
    white-space: pre-line;
  }
  /* .notes {
    background-attachment: local;
    background-image:
      linear-gradient(to right, black 10px, transparent 10px),
      linear-gradient(to left, black 10px, transparent 10px),
      repeating-linear-gradient(black, black 30px, white 30px, white 31px, white 31px);
    line-height: auto;
    padding: 8px 10px;
  } */
</style>