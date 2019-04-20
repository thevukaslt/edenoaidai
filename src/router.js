import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Single from './views/Single.vue';
import Search from './views/Search.vue';
import Install from './views/Install.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            name: 'list',
            component: Home,
        },
        {
            path: '/song/:songId',
            name: 'single',
            component: Single,
            props: true,
        },
        {
            path: '/search/:query?',
            name: 'search',
            component: Search,
            props: true,
        },
        {
            path: '/install',
            name: 'install',
            component: Install,
        },
    ],
});
