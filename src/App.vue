<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link>|
            <router-link to="/song/2">Song</router-link>
        </div>
        <router-view/>
    </div>
</template>

<style lang="scss">
    body {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        padding: 0 15px;
        margin: 0;
    }
    #app {
        display: grid;

        height: 100vh;

        grid-template-rows: auto 1fr;
        grid-template-columns: minmax(290px, 1fr);

        justify-items: center;
    }
    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
