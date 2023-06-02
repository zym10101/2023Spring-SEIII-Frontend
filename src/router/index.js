import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
// import store from "@/store";
// import store from '../store';




const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/about",
        name: "about",
        component: AboutView,
    },
    {
        path: "/scrapy",
        name: "scrapy",
        component: () =>
            import( "../views/ScrapyView.vue"),
        meta: {
            requiresAuth: true // 需要登录才能访问
        }
    },
    {
        path: "/analyse",
        name: "analyse",
        component: () =>
            import("../views/AnalyseView.vue"),
        meta: {
            requiresAuth: true // 需要登录才能访问
        }
    },
    {
        path: "/mark",
        name: "mark",
        component: () =>
            import("../views/MarkView.vue"),
        meta: {
            requiresAuth: true // 需要登录才能访问
        }
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            import("../views/LoginView.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
    const isLoggedIn = sessionStorage.getItem("username") !== null; // 假设你的登录信息保存在Vuex的state中，可以根据你的实际情况进行调整
    const requiresAuth = to.meta.requiresAuth;
    const isanalyse = to.name === 'analyse'

    if (requiresAuth && !isLoggedIn ) {
        // 需要登录的页面且未登录，则跳转到登录页
        alert("请登录！")
        next({ name: 'login' });
    } else if(isanalyse){
        const allow = sessionStorage.getItem("reponame")!=null
        if(!allow){
            alert("请先选择需要分析的项目！")
            next({ name: 'scrapy' });
        }else {
            next();
        }
    } else {
        // 已登录或不需要登录，则允许继续访问
        next();
    }
});





export default router;
