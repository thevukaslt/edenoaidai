import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import Database from './database';

Vue.use(Database);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('main');
