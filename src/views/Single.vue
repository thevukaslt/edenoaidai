<!-- eslint-disable vue/no-v-html -->
<template>
    <div v-if="song" class="song">
        <h2 class="song__title">
            {{ song.songId }} {{ song.title }}
            <button
                class="song__favorite-button"
                :title="song.favorited ? 'Išsaugota' : 'Pamėgti'"
                @click="toggleFavorite"
            >
                <svg v-if="song.favorited" class="icon">
                    <use xlink:href="#icon-star-full"></use>
                </svg>
                <svg v-else class="icon">
                    <use xlink:href="#icon-star-empty"></use>
                </svg>
            </button>
        </h2>
        <div class="song__buttons">
            <button @click="adjustFontSize(true)" class="font-size-button">Aa++</button>
            <button @click="adjustFontSize(false)" class="font-size-button">Aa--</button>
        </div>
        <p class="song__verse">
            <em>{{ song.verse }}</em>
        </p>
        <div class="song__body" v-html="song.body" :style="fontSizeStyle"></div>
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
                get fontSize() {
                    return parseInt(localStorage.getItem('fontSize')) || 16;
                },
                set fontSize(newVal) {
                    localStorage.setItem('fontSize', newVal);
                },
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
        computed: {
            fontSizeStyle: function() {
                return {
                    fontSize: `${this.fontSize}px`,
                };
            },
        },
        methods: {
            toggleFavorite() {
                this.$songs
                    .update(this.song.id, {
                        favorited: this.song.favorited ? 0 : 1,
                    })
                    .then(successfullyUpadated => {
                        if (successfullyUpadated) {
                            this.song.favorited = this.song.favorited ? 0 : 1;
                        } else {
                            console.info('Failed to toggle favorite');
                        }
                    })
                    .catch(err =>
                        console.error(`Error toggling favorite status ${err}`),
                    );
            },
            adjustFontSize(increase) {
                increase ? (this.fontSize += 1) : (this.fontSize -= 1);
            },
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

        &__favorite-button {
            display: inline-block;

            font-size: 20px;
            line-height: 1;

            vertical-align: bottom;

            padding: 0 10px;

            border: none;

            color: rgba(228, 179, 99, 1);
            background-color: transparent;
        }

        &__buttons {
            display: flex;

            padding: 10px 0;

            .font-size-button {
                font-size: 16px;
                line-height: 1.5;

                border: none;
                border-radius: 20px;
                background-color: white;
                box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.5);

                &:not(:last-child) {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
