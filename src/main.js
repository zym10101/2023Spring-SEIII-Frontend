import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";

import "element-plus/dist/index.css";

// require('./mock/CharmData.js');//运行mock
// require('./mock/LineCharm.js');//运行mock
createApp(App).use(store).use(router).use(ElementPlus).mount("#app");
