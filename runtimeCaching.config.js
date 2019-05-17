// https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin

module.exports = [
    {
        // JSON file containing hymns
        urlPattern: new RegExp('.json$'),
        handler: 'staleWhileRevalidate',
        options: {
            cacheableResponse: {
                statuses: [200],
            },
        },
    },
    {
        urlPattern: '*',
        handler: 'cacheFirst',
    },
];
