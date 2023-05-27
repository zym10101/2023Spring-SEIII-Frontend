import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";

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
    },
    {
        path: "/analyse",
        name: "analyse",
        component: () =>
            import("../views/AnalyseView.vue"),
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

export default router;
