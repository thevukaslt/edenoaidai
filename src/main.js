import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ServiceWorker from './registerServiceWorker';
import Database from './database';

Vue.use(Database);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('main');

/**
 * Start Sentry error tracking,
 * if loaded and production
 */
if ('Sentry' in window && process.env.NODE_ENV === 'production') {
    const config = {
        dsn: 'https://d4fcda1e38c442a2a518daf99390583e@sentry.io/1452482',
    };
    config.integrations = [
        new window.Sentry.Integrations.Vue({
            Vue,
            attachProps: true,
        }),
    ];
    window.Sentry.init(config);
}

ServiceWorker();
