<template>
  <nav class="navbar" style="z-index: 9999">
    <ul class="navbar-menu">
      <li class="navbar-item">
        <div class="navbar-logo">
          <img src="./assets/mylogo.png" alt="Logo"/>
        </div>
      </li>
      <li class="navbar-item">
        <router-link to="/" class="navbar-link">Home</router-link>
      </li>
      <li class="navbar-item">
        <router-link to="/scrapy" class="navbar-link">数据获取</router-link>
      </li>
      <li class="navbar-item">
        <router-link to="/analyse" class="navbar-link">可视化分析</router-link>
      </li>
      <li class="navbar-item">
        <router-link to="/mark" class="navbar-link">数据标注</router-link>
      </li>
    </ul>
      <div class="profile-container">
          <template v-if="isLoggedIn">
              <span class="navbar-link user-element" @click="toggleLogoutMenu">{{ username }}</span>
              <div v-if="isLogoutMenuVisible" class="logout-menu" ref="logoutMenu">
                  <p>确定要登出吗？</p>
                  <button @click="logout">登出</button>
                  <button @click="cancel">取消</button>
              </div>
          </template>
          <template v-else>
              <router-link to="/login" class="navbar-link ">登录</router-link>
          </template>
      </div>
  </nav>
  <div class="context">
    <router-view/>
  </div>

</template>

<script>

export default {
    data() {
        return {
            isLoggedIn: sessionStorage.getItem('username')!=null, // 假设用户未登录
            username: sessionStorage.getItem('username'), // 假设已登录用户名为JohnDoe
            isLogoutMenuVisible: false // 控制登出菜单的显示状态
        };
    },

    methods: {
        toggleLogoutMenu() {
            this.isLogoutMenuVisible = !this.isLogoutMenuVisible; // 切换登出菜单的显示状态
        },
        logout() {
            // 执行登出操作，例如清除用户登录状态、重置用户名等
            this.isLogoutMenuVisible = false; // 登出后隐藏登出菜单
            sessionStorage.removeItem('username')
            this.isLoggedIn=false
            this.$router.push('/');
        },
        cancel(){
            this.isLogoutMenuVisible = false; // 登出后隐藏登出菜单
        },
        handleStorageChange(event) {
            if (event.key === 'username') {
                // 会话存储中的用户名发生变化时，更新组件中的数据
                this.username = event.newValue || '';
                this.isLoggedIn = !!this.username;
            }
        }
    },
    // computed: {
    //     setusername(){
    //         return sessionStorage.getItem('username')
    //     }
    // }
};
</script>

<style lang="scss">
#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logout-menu {
  position: fixed;
  height: 100px;
  width: 150px;
  margin-top: 50px;
  right: 10px;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #252525;
  z-index: 999;
  display: flex;
  align-items: center;
  color: #ffffff;

}

.context {
  margin-top: 60px;
  margin-left: 20px;
}

nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #4ea397;
    }
  }
}


.navbar-logo {
  margin-right: 20px;
}

.navbar-logo img {
  height: 40px;
  width: auto;
}

.navbar-menu {
  list-style: none;
  display: flex;
  margin: 10px;
  padding: 10px;
}

.navbar-item {
  position: relative;
  margin-top: 10px;
  margin-right: 20px;
}

.navbar-link {
  text-decoration: none;
  color: #ffffff;
  font-weight: bold;
  transition: color 0.3s ease;
  font-size: 22px;
  margin-top: 10px;
}

.navbar-link:hover {
  color: #4ea397;

}

.profile-container {
  /* 头像和个人主页容器样式 */
  position: absolute;
  right: 40px;
}
.user-element{
  position: fixed;
  right: 10px;
  top: 10px;
}

.avatar {
  /* 头像样式 */
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.profile-link {
  /* 个人主页链接样式 */
  margin-left: 10px;
}
</style>
<script setup>
</script>
