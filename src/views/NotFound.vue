<script>
    export default {
        name: 'not-found',
        created() {
            const metaNoIndex = document.createElement('meta');
            metaNoIndex.name = 'robots';
            metaNoIndex.content = 'noindex';
            document.head.appendChild(metaNoIndex);
        },
        render(h) {
            return h(
                'h4',
                {
                    style: {
                        'text-align': 'center',
                    },
                },
                'Puslapis neegzistuoja...',
            );
        },
    };
</script>
