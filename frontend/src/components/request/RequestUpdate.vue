<template>
  <div>
    <img src="https://ifh.cc/g/7ruaO5.png" id="bg" alt="bgImg">
    <div class="container location " style="width:70%">
      <input
        type="text"
        v-model="title"
        style="background-color:black"
        class="my-title form-control"
      >
      <textarea
        style="background-color:black"
        class="my-content form-control my-3"
        type="text"
        v-model="content"
        cols="30" rows="10"
      ></textarea>
      <div>
        <b-button
          @click="updateRequest"
          variant="outline-light"
          class="d-flex"
          style="margin-left:auto"
        >수정</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest, updateRequest } from '@/api/board.js' 

export default {
  name: 'RequestUpdate',
  data () {
    return {
      index: this.$route.params.id,
      title: undefined,
      content: undefined,
    }
  },
  methods: {
    updateRequest () {
      const requestData = {
        title: this.title,
        content: this.content,
        boardNo: this.index,
      }
      updateRequest(
        requestData,
        (res) => {
          console.log(res.data)
          alert('수정 완료')
        },
        (err) => {
          alert(err)
        }
      )
      this.$router.push({ name: 'Request' })
    },
  },
  created () {
    getRequest(
      this.index,
      (res) => {
        this.title = res.data.title
        this.content = res.data.content
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
</style>