<template>
    <footer>
        <ul class="menu">
            <li>
                <router-link to="/" class="menu__item">
                    <span class="icon-home"></span>
                    Titulinis
                </router-link>
            </li>
            <li>
                <router-link to="/search" class="menu__item">
                    <span class="icon-search"></span>
                    Paieška
                </router-link>
            </li>

            <li>
                <router-link to="/star" class="menu__item">
                    <span class="icon-star"></span>
                    Pamėgti
                </router-link>
            </li>
        </ul>
    </footer>
</template>

<script>
    export default {
        name: 'navbar',
        mounted() {
            document.body.insertBefore(
                this.$el,
                document.querySelector('main').nextSibling,
            );
        },
    };
</script>

<style lang="scss">
    footer {
        width: 100%;

        border-top: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 -8px 10px 0px rgba(0, 0, 0, 0.1);

        .menu {
            display: flex;

            justify-content: space-around;

            margin: 0;
            padding: 0;
            list-style: none;

            &__item {
                display: flex;
                flex-direction: column;

                align-items: center;

                color: rgba(175, 170, 185, 1);
                text-decoration: none;

                padding: 10px;

                :first-child {
                    margin-bottom: 5px;
                    font-size: 20px;
                }

                &.is-active {
                    color: rgba(165, 36, 61, 1);
                }

                &:hover {
                    color: rgba(165, 36, 61, 0.5);
                }
            }
        }
    }
</style>