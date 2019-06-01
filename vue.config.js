const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
    devServer: {
        clientLogLevel: 'info',
    },
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

    configureWebpack: config => ({
        plugins: [
            //
            new InjectManifest({
                swSrc: 'src/service-worker.js',
                swDest: path.join(config.output.path, 'sw.js'),
                precacheManifestFilename: `sw-manifest.js?=[manifestHash]`,
                exclude: [
                    /\.map$/,
                    /^manifest.*\.js$/,
                    // exlude netlify files
                    /^_\w/,
                ],
            }),
        ],
    }),
};
