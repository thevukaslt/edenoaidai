<!-- eslint-disable vue/no-v-html -->
<template>
    <div v-if="song" class="song">
        <h2 class="song__title">{{ song.songId }} {{ song.title }}</h2>
        <p class="song__verse">
            <em>{{ song.verse }}</em>
        </p>
        <div class="song__body" v-html="song.body"></div>
        <small class="song__copyright" v-html="song.copyright"></small>
    </div>
</template>

<script>
    export default {
        name: 'Single',
        props: {
            songId: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                song: {},
            };
        },
        created() {
            this.$songs
                .get({
                    songId: this.songId,
                })
                .then(song => {
                    this.song = song;
                })
                .catch(err => {
                    console.error(err.message);
                });
        },
    };
</script>

<style lang="scss">
    .song {
        &__title {
            font-size: 20px;

            width: auto;

            margin: 0;
            margin-bottom: 10px;

            border-bottom: 1px solid black;
        }

        &__verse {
            font-size: 16px;

            margin: 0;
            margin-bottom: 20px;
        }

        &__body {
            font-size: 16px;

            margin-bottom: 20px;
        }
    }
</style>
