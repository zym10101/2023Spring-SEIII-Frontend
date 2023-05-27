<template>
    <nav  class="navbar">
        <ul class="navbar-menu">
            <li class="navbar-item">
                <div class="navbar-logo">
                    <img src="./assets/mylogo.png" alt="Logo" />
                </div>
            </li>
            <li class="navbar-item">
                <router-link to="/" class="navbar-link">Home</router-link>
            </li>
            <li class="navbar-item">
                <router-link to="/about" class="navbar-link">About</router-link>
            </li>
            <li class="navbar-item">
                <router-link to="/scrapy" class="navbar-link">数获获取</router-link>
            </li>
            <li class="navbar-item">
                <router-link to="/analyse" class="navbar-link">可视化分析</router-link>
            </li>
        </ul>
        <div class="profile-container">

            <router-link to="/login" class="navbar-link">
                <img src="avatar.jpg" alt="Avatar" class="avatar">
            </router-link>
        </div>
    </nav>
    <div class="context">
        <router-view />
    </div>

</template>

<style lang="scss">
#app {
    //font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
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
.context{
    margin-top: 60px;
    margin-left: 20px;
}

nav {
    padding: 10px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
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
    color: #42b983;

}
.profile-container {
    /* 头像和个人主页容器样式 */
    position: absolute;
    right: 40px;
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