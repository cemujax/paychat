import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import moment from "moment";

import store from "./store";

Vue.use(Vuetify);
Vue.config.productionTip = false;

moment.locale("ko", {
  weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"]
});

new Vue({
  // router,
  store,
  render: h => h(App)
}).$mount("#app");
