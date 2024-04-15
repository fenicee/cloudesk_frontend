import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import ArgonDashboard from "./argon-dashboard";
const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ElementPlus);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
