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

if ('Sentry' in window && process.env.NODE_ENV === 'production') {
    window.Sentry.init({ dsn: 'https://d4fcda1e38c442a2a518daf99390583e@sentry.io/1452482' });
}
