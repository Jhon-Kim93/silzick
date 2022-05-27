<template>
  <main class="form-login box-position">
    <div id="base-border" class="card">
      <div id="background-black" class="card-body p-5">
          <label style="font-size:2rem;">Log In</label>
        <div>
          <label class="d-flex align-items-start mx-2">Username</label>
          <input
            id="black-font"
            type="text"
            class="form-control form-control-lg mb-4"
            placeholder="ID"
            v-model="requestInfo.userId"
          >
        </div>
        <div class="form-group">
          <label class="d-flex align-items-start mx-2">Password</label>
          <input
            type="password"
            class="form-control form-control-lg"
            placeholder="PW"
            v-model="requestInfo.password"
            @keyup.enter="login({data:requestInfo})"
          >
        </div>
        <div class="checkbox mb-2">
          <label class="d-flex align-items-start mx-2">
            <input style="margin-top:10px; margin-right:5px;" type="checkbox" value="remember-me">
            <p class="my-1">Remember me</p>
          </label>
        </div>
        <button id="btn-color" class="w-100 btn btn-lg mb-2" @click="login({data:requestInfo})">Log In</button>
        <button id="btn-color" class="w-100 btn btn-lg mb-2" @click="mainpage">Main Page</button>
      </div>
    </div>  
  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import cookies from 'vue-cookies'
import { login } from '@/api/user.js'
import Swal from 'sweetalert2'





const userStore = 'userStore'

export default {
  name: 'Login',
  computed: {
    ...mapState(userStore, ['user'])
  },
  data() {
    return {
      requestInfo: {
        password: null,
        userId: null,
      }
    }
  },
  mounted() {
    if (cookies.isKey('JWT-AUTHENTICATION')) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions(userStore, ['saveUser']),
    login () {
      const user = this.requestInfo
      login(
        user,
        () => {
          this.saveUser()
          this.$router.push({ name: "Main" });
          Swal.fire({
            icon: 'success',
            title: '로그인 성공',
            text: '즐거운 시간 되세요~',
          })
          },
        () => {
          Swal.fire({
            icon: 'error',
            title: '로그인 실패',
            text: '올바른 아이디와 비밀번호를 입력해주세요!',
          })
        }
      )
    },
    mainpage() {
      this.$router.push({ name: "Main" });
    },
  }
}
</script>

<style scoped>
  /* body {
    display: flex;
    padding-top: 60px;
    padding-bottom: 60px;        
    align-items: center;
    background-color: #f6f6f6;
  } */
  .form-login {
    width: 100%;
    max-width: 450px;
    margin: auto;
    top: 25%;
  }
  label {
    font-weight: 600;
    color: white;
  }
  /* .box-shadow {
    box-shadow: 5px 5px 5px 5px rgb(24, 24, 24) inset;
    border-radius: 1rem;
  } */
  .box-position {
    position: absolute;
    top: 15%;
    left: 0;
    right: 0;
  }
</style>