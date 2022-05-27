<template>
  <main class="form-login box-position">
    <div id="base-border" class="card">
      <div id="background-black" class="card-body p-5">
        <!-- <div class="form-group">
            <label>Email address</label>
            <input type="email" class="form-control form-control-lg" placeholder="Email address" />
        </div> -->
          <label style="font-size:2rem;">Sign Up</label>
        <div>
          <label class="d-flex align-items-start mx-2">Username</label>
          <input
            id="black-font"
            type="text"
            class="form-control form-control-lg mb-3"
            placeholder="ID"
            v-model="userId"
          >
        </div>
        <div class="form-group">
          <label class="d-flex align-items-start mx-2">Password</label>
          <input
            type="password"
            class="form-control form-control-lg mb-3"
            placeholder="PW"
            v-model="password"
            @change="checkPwd"
          >
        </div>
        <div class="form-group">
          <label class="d-flex align-items-start mx-2">Confirm Password</label>
          <input
            type="password"
            class="form-control form-control-lg mb-3"
            placeholder="PW"
            v-model="passwordConfirmation"
            @change="checkPwd"
          >
        </div>
        <div class="d-flex flex-row-reverse">
          <p v-if="ableToUsePwd" class="text-success">{{msgPwd}}</p>
          <p v-if="!ableToUsePwd" class="text-danger">{{msgPwd}}</p>
        </div>
        <div class="form-group">
          <label class="d-flex align-items-start mx-2">E-mail address</label>
          <input
            type="e-mail"
            class="form-control form-control-lg mb-4"
            placeholder="E-mail"
            v-model="email"
          >
        </div>
        <button id="btn-color" class="w-100 btn btn-lg" @click="signup">Sign Up</button>
        <button id="btn-color" class="w-100 btn btn-lg mt-3" @click="mainpage">Main Page</button>
      </div>
    </div>  
  </main>
</template>

<script>
import { signup } from '@/api/user.js';
import { mapState } from 'vuex'

export default {
  name: 'Signup',
  computed: {
    ...mapState(['isLogin', 'user'])
  },
  data() {
    return {
      userId: null,
      password: null,
      passwordConfirmation: null,
      email: null,
      msgPwd: null,
      ableToUsePwd: false,
    }
  },
  mounted() {
    if (this.isLogin) {
      this.$router.push('/')
    }
  },
  methods: {
    signup : function() {
      const credentials = {
        userId : this.userId,
        password : this.password,
        email : this.email,
      }
      signup(credentials,
        () => {
          alert("회원가입 성공");
          this.$router.push({ name : "Login" })
        },
        () => {
          alert("회원가입 실패");
        }
      )
    },
    checkPwd() {
      if (this.password.length < 6) {
        this.msgPwd = "비밀번호를 6자 이상 입력해주세요.";
        this.ableToUsePwd = false;
      } else if (this.password === this.passwordConfirmation) {
        this.msgPwd = "비밀번호가 일치합니다.";
        this.ableToUsePwd = true;
      } else {
        this.msgPwd = "비밀번호가 일치하지 않습니다."
        this.ableToUsePwd = false;
      }
    },
    mainpage() {
      this.$router.push({ name: "Main" });
    }
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
    top: 10%;
  }
  label {
    font-weight: 600;
    color: white;
  }
  .box-position {
    position: absolute;
    top: 7.5%;
    left: 0;
    right: 0;
  }
</style>