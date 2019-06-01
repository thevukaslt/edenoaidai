<template>
    <div v-if="status === 'ready'" class="install-message">Paruošta!</div>
    <div v-else class="install-message">
        {{ message }}
        {{ progress }}
        <div v-if="errorId">Klaidos kodas: {{ errorId }}</div>
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
                errorId: '',
            };
        },
        computed: {
            progress() {
                return `${this.current}/${this.total}`;
            },
        },
        async beforeMount() {
            if ((await this.$songs.count()) === 0)
                this.fetchSongs().then(songs => {
                    if (this.importSongs(songs)) this.success();
                });
            else this.success();
        },
        methods: {
            /**
             * Fetches songs from JSON API
             *
             */
            fetchSongs() {
                if (SONGS_JSON === null) {
                    this.message = 'URL for database is missing.';
                    return false;
                }

                return fetch(SONGS_JSON)
                    .then(res => res.json())
                    .catch(err => {
                        this.errorId = Sentry && Sentry.captureException(err);
                        this.message = `Įvyko klaida...`;
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
                    this.current += 1;
                    status = true;

                    const { songId, title, verse, body, copyright } = song;
                    this.$songs
                        .put({
                            songId,
                            title,
                            verse,
                            body,
                            copyright,
                            favorited: 0,
                        })
                        .catch(error => {
                            status = false;
                            this.errorId = Sentry && Sentry.captureException(error);
                        });
                });

                return status;
            },

            success() {
                this.status = 'ready';
                setTimeout(() => this.$router.push('/'), 1000);
            },
        },
    };
</script>

<style>
    .install-message {
        text-align: center;
    }
</style>