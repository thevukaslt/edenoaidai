<template>
    <div class="form">
        <div class="input-container">
            <input type="text" placeholder="Rašyk čia..." :value="query" @input="parseSearch">
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
        watch: {
            $route() {
                this.searchSongs();
            },
        },
        created() {
            this.parseSearch = this.debounce(this.parseSearch, 225);
            this.searchSongs();
        },
        methods: {
            debounce(func, wait, immediate = false) {
                let timeout;
                /* eslint-disable-next-line func-names */
                return function() {
                    const context = this;
                    /* eslint-disable-next-line prefer-rest-params */
                    const args = arguments;

                    /* eslint-disable-next-line func-names */
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
                    this.$songs
                        .where('songId')
                        .startsWith(search)
                        .limit(6)
                        .toArray()
                        .then(songs => {
                            this.songs = songs || [];
                        })
                        .catch(err => Sentry && Sentry.captureException(err));
                    return;
                }
                this.$songs
                    .filter(song =>
                        song.title.toLowerCase().includes(search.toLowerCase()),
                    )
                    .limit(6)
                    .toArray()
                    .then(songs => {
                        this.songs = songs || [];
                    })
                    .catch(err => Sentry && Sentry.captureException(err));
            },
        },
    };
</script>

<style lang="scss">
    .form {
        display: grid;

        margin: 0 10px;

        grid-gap: 20px;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;

        .input-container {
            display: grid;

            grid-gap: 5px;
            grid-auto-flow: row;

            font-size: 16px;

            input {
                width: 100%;

                box-sizing: border-box;
                border-radius: 10px;

                padding: 10px;

                border: 1px solid rgba(0, 0, 0, 0.01);
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
