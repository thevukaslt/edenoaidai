<script>
    import List from '../components/List.vue';

    export default {
        name: 'Home',
        data() {
            return {
                songs: [],
            };
        },
        created() {
            this.$songs
                .orderBy('id')
                .offset(Math.round(Math.random() * 100))
                .limit(10)
                .toArray()
                .then(songs => {
                    this.songs = songs;
                });
        },
        render(h) {
            return h(List, {
                props: {
                    songs: this.songs,
                },
            });
        },
    };
</script>
