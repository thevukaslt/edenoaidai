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
                .orderBy('id')
                .offset(Math.round(Math.random() * 100))
                .limit(1)
                .toArray()
                .then(songs => {
                    this.songs = songs;
                });
        },
        render(h) {
            return h(
                'div',
                {
                    style: {
                        'text-align': 'center',
                    },
                },
                [
                    'In Development',
                    h(List, {
                        props: {
                            songs: this.songs,
                        },
                    }),
                ],
            );
        },
    };
</script>
