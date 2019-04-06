<template>
    <div class="form">
        <div class="input-container">
            <input type="text" placeholder="Ieškoti..." @input="parseSearch" :value="query">
        </div>
        <list :songs="songs"/>
    </div>
</template>

<script>
    import List from '../components/List.vue';

    export default {
        components: {
            List,
        },
        props: {
            query: {
                type: String,
                default: null,
            },
        },
        data() {
            return {
                songs: [],
            };
        },
        created() {
            this.parseSearch = this.debounce(this.parseSearch, 400);
            this.searchSongs();
        },
        watch: {
            $route(to, from) {
                this.searchSongs();
            },
        },
        methods: {
            debounce(func, wait, immediate = false) {
                let timeout;
                return function() {
                    const context = this;
                    const args = arguments;

                    const later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };

                    const callNow = immediate && !timeout;

                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            },
            parseSearch({ target: { value } }) {
                if (value.trim()) {
                    this.updateSearchUri(value.trim());
                }
            },
            updateSearchUri(query) {
                this.$router.push({
                    path: `/search/${query}`,
                });
            },
            searchSongs() {
                const search = this.query;
                if (!!search === false) return;

                if (Number.isInteger(Number(search))) {
                    return this.$songs
                        .where('songId')
                        .startsWith(search)
                        .limit(3)
                        .toArray()
                        .then(songs => {
                            this.songs = songs || [];
                        })
                        .catch(err => {
                            console.error(err.message);
                        });
                }
                return this.$songs
                    .where('title')
                    .anyOfIgnoreCase(search)
                    .toArray()
                    .then(songs => {
                        this.songs = songs || [];
                    })
                    .catch(err => {
                        console.error(err.message);
                    });
            },
        },
    };
</script>

<style lang="scss">
    .form {
        display: grid;

        // height: 100vh;
        min-width: 300px;

        grid-gap: 20px;
        grid-template-columns: 1fr;
        grid-auto-rows: auto 1fr;

        .input-container {
            display: grid;
            grid-gap: 5px;
            grid-auto-flow: row;
            font-size: 16px;

            input {
                width: 100%;
                box-sizing: border-box;
                border-radius: 10px;
                border: 1px solid rgba(0, 0, 0, 0.01);
                padding: 10px;
                box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
