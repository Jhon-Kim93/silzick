<template>
  <div>
    <img src="https://ifh.cc/g/7ruaO5.png" id="bg" alt="bgImg">
    <div>
      <h1 class="location2" style="color:white">REQUEST</h1>
    </div>
    <div class="location3">
      <b-button
        variant="outline-primary"
        class="d-inline mx-3"
        style="margin-left:auto"
        @click="moveToUpdate"
      >수정</b-button>
      <b-button
        variant="outline-danger"
        class="d-inline"
        style="margin-left:auto"
        @click="deleteRequest"
      >삭제</b-button>
    </div>
    <div class="container location1 flex-wrap" style="width:70%; color:white; text-align:left">
      <h5 class="col-12">제목 : {{ post.title }}</h5>
      <hr>
      <h5 class="col-12">작성자 : {{ post.userId }}</h5>
      <hr>
      <h5 class="col-12">조회수 : {{ post.hit }}</h5>
      <hr>
      <h5 class="col-12">내용</h5>
      <p class="col-12" style="height:25vh;">{{ post.content }}</p>
      <hr class="col-12" style="border:solid 3px white;">
      <div class="col-12 d-flex align-items-end flex-column">
        <p>
          작성/수정 : {{ post.createdAt.slice(0,10) }} / {{ post.modifiedAt.slice(0,10) }}
        </p>
      </div>
    </div>
    <div class="d-flex justify-content-center location5">
      <b-button
        variant="outline-light"
        @click="moveToRequest"
      >목록으로</b-button>
    </div>
  </div>
</template>

<script>
import { getRequest, deleteRequest } from '@/api/board.js'

export default {
  name: 'RequestDetail',
  data () {
    return {
      index: this.$route.params.id,
      post: undefined,
    }
  },
  methods: {
    moveToUpdate () {
      this.$router.push({
        name:'RequestUpdate',
        params:{
          id: this.index,
          title: this.post.title,
          content: this.post.content,
        }
      })
    },
    deleteRequest () {
      deleteRequest(
        this.index,
        () => {
          alert('삭제 완료')
        },
        (err) => {
          console.log(err)
          alert('삭제 실패')
        }
      )
      this.$router.push({ name: 'Request' })
    },
    moveToRequest () {
      this.$router.push({ name: 'Request' })
    }
  },
  created () {
    getRequest(
      this.index,
      (res) => {
        console.log(res.data)
        this.post = res.data
      },
      (err) => {
        alert(err)
      }
    )
  }
}
</script>

<style scoped>
  .location1 {
    position: fixed;
    top: 30%;
    left: 16%
  }
  .location2 {
    position: fixed;
    top: 20%;
    left: 16%
  }
  .location5 {
    position: fixed;
    top: 85%;
    left: 47%
  }
</style>