<template>
  <div>
    <img src="https://ifh.cc/g/7ruaO5.png" id="bg" alt="bgImg">
    <div>
      <h1 class="location2" style="color:white">NOTICE</h1>
    </div>
    <div class="location3">
      <b-button
        variant="outline-primary"
        class="d-inline mx-3"
        style="margin-left:auto"
      >
      수정
      </b-button>
      <b-button
        @click="deleteNotice"
        variant="outline-danger"
        class="d-inline"
        style="margin-left:auto"
      >
      삭제
      </b-button>
    </div>
    <div class="container location" style="width:70%; color:white; text-align:left">
      <!-- <p>d : {{ post.id }}</p> -->
      <hr>
      <h5>{{ post.createdAt }}</h5>
      <hr>
      <h5>{{ post.title }}</h5>
      <hr>
      <p class="enter">{{ post.content }}</p>
      <hr>
      <div class="d-flex justify-content-center location5">
        <b-button
          variant="outline-light"
          @click="moveToNotice"
        >
        목록으로
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotice, deleteNotice } from '@/api/notice.js'

export default {
  name: 'NoticeDetail',
  data: function () {
    return {
      index: this.$route.params.id
    }
  },
  methods: {
    moveToUpdate () {
      this.$router.push({
        name:'NoticeUpdate',
        params: { id: this.index }
      })
    },
    deleteNotice () {
      deleteNotice(
        this.index,
        () => {
          alert('삭제 완료')
        },
        (err) => {
          console.log(err)
          alert('삭제 실패')
        }
      )
      this.$router.push({ name: 'Notice' })
    },
    moveToNotice () {
      this.$router.push({ name: 'Notice' })
    }
  },
  created () {
    getNotice(
      this.index,
      (res) => {
        alert(res)
        this.post = res
      },
      (err) => {
        alert(err)
      }
    )
  }
}
</script>

<style scoped>
  .location {
    position: fixed;
    top: 60%;
    left: 50%;
    /* transform: translate(-50%, -50%); */
    width: 80%;
  }
  .line {
    border-bottom-color: white;
  }
  .location2 {
    position: fixed;
    top: 20%;
    left: 16%
  }
  .location3 {
    position: fixed;
    top: 20%;
    right: 16%
  }
</style>