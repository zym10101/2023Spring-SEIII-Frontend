<template>
  <div id="App">
    <div class="wrapper">
      <div class="wrapper__box">
        <div class="wrapper__box__hero"></div>
        <div class="wrapper__box__body">
          <el-form v-if="isLoginForm" :model="loginForm" @submit.prevent="login" style="margin-top: 50px">
            <h1 style="margin-bottom: 20px">{{ isLoginForm ? 'Login in' : 'Create new account' }}</h1>

            <p class="input_title">username</p>
            <input v-model="loginForm.username" type="text" placeholder="enter your username or email"
                   v-validator="usernameOption"/>
            <p v-if="usernameBlank && isBlankUser" class="errorText">用户名不能为空</p>

            <p class="input_title">password</p>
            <input v-model="loginForm.password" type="password" placeholder="enter your username"
                   v-validator="passwordOption"/>
            <p v-if="passwordBlank && isBlankpassword" class="errorText">密码不能为空</p>

            <p v-if="!matched" class="errorText">用户名或密码错误</p>

            <div class="verification-code">
              <button type="submit">登录</button>
              <button :disabled="isCounting" @click="toggleForm">{{
                  isLoginForm ? '没有账号，立即注册' : '返回登录'
                }}
              </button>
            </div>
          </el-form>

          <el-form v-else :model="registerForm" @submit.prevent="register">
            <h1 style="margin-bottom: 20px">Create new account</h1>
            <p class="input_title">email</p>
            <input v-model="registerForm.email" type="text" placeholder="enter your email"/>
            <p v-if="!isvaildemail" class="errorText">邮箱格式不正确</p>

            <p class="input_title">username</p>
            <input v-model="registerForm.username" type="text" placeholder="enter your username"/>

            <p class="input_title">password</p>
            <input v-model="registerForm.password" type="password"
                   placeholder="enter your password：密码必须大于8位且包含数字、大写字母、小写字母和特殊字符中的三种"
                   v-validator="passwordOption"/>
            <p v-if="!isvaildpwd" class="errorText">密码必须大于8位且包含数字、大写字母、小写字母和特殊字符中的三种</p>

            <p class="input_title">repeat password</p>
            <input v-model="registerForm.repeatpwd" type="password" placeholder="enter password again"
                   v-validator="passwordOption"/>
            <p v-if="!issamepwd" class="errorText">前后输入密码不一致</p>

            <div class="verification-code">
              <input type="text" v-model="code" placeholder="请输入验证码">
              <button :disabled="isCounting" @click="getCode">获取验证码</button>
            </div>

            <div class="verification-code">
              <button type="submit">立即注册</button>
              <button :disabled="isCounting" @click="toggleForm" class="changeButton">
                {{ isLoginForm ? '没有账号，立即注册' : '已有账号，返回登录' }}
              </button>
            </div>
          </el-form>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {required, minLength} from 'vuelidate/lib/validators';

export default {
  validations: {
    loginForm: {
      username: {
        required,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
  },
  data() {
    return {
      isLoginForm: true,
      isLoading: false,
      loading: "loading please wait...",
      loggedIn: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        repeatpwd: '',
        email: ''
      },
      usernameBlank: false,
      passwordBlank: false,
      matched: true,

    };
  },
  computed: {
    isInputValid() {
      // 进行表单验证的逻辑，根据实际需求修改
      return this.loginForm.password.length >= 6 | this.loginForm.password.length == 0;
    },
    isBlankUser() {
      return this.loginForm.username.length == 0;
    },
    isBlankpassword() {
      return this.loginForm.password.length == 0;
    },
    isvaildemail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return this.registerForm.email.length == 0 || emailRegex.test(this.registerForm.email);
    },
    isvaildpwd() {
      const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return pwdRegex.test(this.registerForm.password) || this.registerForm.password.length == 0;
    },
    issamepwd() {
      if (this.registerForm.password == '') {
        return true;
      }
      return this.registerForm.password == this.registerForm.repeatpwd;
    }
  },


  methods: {
    toggleForm() {
      this.isLoginForm = !this.isLoginForm;
      this.usernameBlank = false;
      this.passwordBlank = false
    },
    login() {
      if (this.loginForm.username == "") {
        this.usernameBlank = true;
      }
      // 处理登录逻辑
      console.log('Logging in...', this.loginForm);
      try {
        const response = axios.post('/api/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        });
        // 处理登录成功的响应
        console.log(response.data);
      } catch (error) {
        // 处理登录失败的错误
        console.error(error);
      }

    },
    register() {
      // 处理注册逻辑
      console.log('Registering...', this.registerForm);
    }
    // async login() {
    //     console.log("hello");
    //     this.isLoading = true;
    //     await this.$validator.validate("email", "username");
    //
    //     if (!this.$validator.isValid("password")) {
    //         this.$validator.showError("password");
    //     }
    //     this.isLoading = false;
    // }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

body {
  font-size: 15px;
}

*,
*::before,
*::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.wrapper {
  background: #f7f7f8;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  &__box {
    width: 76%;
    height: 600px;
    border-radius: 15px;
    background: white;
    overflow: hidden;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    display: flex;

    &__hero {
      width: 270px;
      background: rgb(223, 223, 223) url("https://mir-s3-cdn-cf.behance.net/project_modules/1400/c0bdd180548905.5ce57356e95e2.jpg") center;
      background-size: cover;
    }

    &__body {
      flex: 1;
      padding: 50px;
      overflow: auto;
    }
  }
}

input {
  width: 100%;
  height: 50px;
  border: 1px solid white;
  background: rgb(226, 226, 226);
  padding: 0 20px;
  border-radius: 15px;
  outline: none;
  font-weight: 400;
  font-size: 14px;
  transition: all 0.5s ease;
}

.verification-code {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
}


.verification-code button {
  height: 50px;
  border: 1px solid white;
  background: #4ea397;
  padding: 0 20px;
  border-radius: 15px;
  outline: none;
  font-weight: 400;
  font-size: 14px;
  transition: all 0.5s ease;
}

.errorText {
  text-align: left;
  color: red;
  font-size: 12px;
  margin-left: 2px;
}

button {
  width: 100%;
  background: #4ea397;
  color: white;
  border-radius: 15px;
  border: none;
  outline: none;
  padding: 23px 0;
  //margin-top: 10px;
  cursor: pointer;

  &:hover {
    background: #42b983;
  }
}


.activeLink {
  color: #42b983 !important;
}

.input_title {
  margin-top: 5px;
}
</style>
