const runtimeCaching = require('./runtimeCaching.config');

module.exports = {
    css: {
        sourceMap: true,
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => ({
                ...options,
                hotReload: false,
            }));
    },
    // Netlify should be able to handle cache invalidation
    filenameHashing: false,

    pwa: {
        workboxOptions: {
            runtimeCaching,
            offlineGoogleAnalytics: true,
        },
    },
};
