<script>
    import List from '../components/List.vue';

    export default {
        name: 'Favorites',
        data() {
            return {
                songs: [],
            };
        },
        created() {
            this.$songs
                .where({ favorited: 1 })
                .toArray()
                .then(songs => {
                    this.songs = songs;
                })
                .catch(err => Sentry && Sentry.captureException(err));
        },
        render(h) {
            // If exists, show favorited songs
            if (this.songs.length) {
                return h(List, {
                    props: {
                        songs: this.songs,
                    },
                });
            }

            // Else show suggestion
            return h(
                'h2',
                {
                    style: {
                        'text-align': 'center',
                    },
                },
                'Tuštoka... Pasinaudok žvaigždute ;)',
            );
        },
    };
</script>
