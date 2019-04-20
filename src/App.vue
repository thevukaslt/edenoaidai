<template>
    <main>
        <router-view/>
        <navbar></navbar>
    </main>
</template>

<script>
    import Navbar from './components/Navbar.vue';
    export default {
        components: {
            Navbar,
        },
    };
</script>


<style lang="scss">
    html,
    body {
        height: 100%;
    }
    body {
        display: flex;
        flex-direction: column;

        align-items: center;

        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        margin: 0;
    }
    main {
        flex: 1;
        display: flex;

        padding: 0 15px;
        padding-top: 30px;
    }
</style>
