<template>
    <div v-if="status === 'ready'">Paruošta!</div>
    <div v-else>
        {{ message }}
        {{ progress }}
    </div>
</template>

<script>
    const SONGS_JSON = process.env.VUE_APP_DB_URL || null;

    export default {
        data() {
            return {
                message: 'Ruošiama',
                status: '',
                total: 0,
                current: 0,
            };
        },
        async beforeMount() {
            if ((await this.$songs.count()) === 0)
                this.fetchSongs().then(songs => {
                    if (this.importSongs(songs)) this.success();
                });
            else this.success();
        },
        computed: {
            progress() {
                return this.current + '/' + this.total;
                return ((this.current * 100) / this.total || 0) + '%';
            },
        },
        methods: {
            /**
             * Fetches songs from JSON API
             *
             */
            fetchSongs() {
                if (SONGS_JSON === null) {
                    this.message = 'Klaida...';
                    console.error('URL for database is unavailable.');
                    return false;
                }

                return fetch(SONGS_JSON)
                    .then(res => {
                        return res.json();
                    })
                    .catch(err => {
                        console.error('Failed to download songs', err);
                    });
            },

            /**
             * Load songs from array into browser database using Dexie API
             *
             * @param {Dexie} table Database table
             * @param {array} songs Array of songs
             */
            importSongs(songs) {
                this.total = songs.length;
                let status = false;

                songs.forEach(song => {
                    ++this.current;
                    status = true;

                    const { songId, title, verse, body, copyright } = song;
                    this.$songs
                        .put({
                            songId,
                            title,
                            verse,
                            body,
                            copyright,
                        })
                        .catch(error => {
                            status = false;
                            console.error(error.message);
                        });
                });

                return status;
            },

            success() {
                this.status = 'ready';
                setTimeout(() => this.$router.push('/'), 750);
            },
        },
    };
</script>

<style>
</style>