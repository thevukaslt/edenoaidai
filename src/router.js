import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Install from './views/Install.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'list',
            component: Home,
        },
        {
            path: '/install',
            name: 'install',
            component: Install,
        },
    ],
});
