module.exports = {
    publicPath: './',
    outputDir: 'dist',   //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    chainWebpack: config =>{
        config.plugin('html')
            .tap(args => {
                args[0].title = "清视野";
                return args;
            })
    },
    pwa: {
        iconPaths: {
            favicon32: './favicon.ico',
            favicon16: './favicon.ico',
            appleTouchIcon: './favicon.ico',
            maskIcon: './favicon.ico',
            msTileImage: './favicon.ico'
        }
    },
    devServer: {
        open: false, //是否自动弹出浏览器页面
        // host: "localhost",
        // port: '8080',
        https: false,   //是否使用https协议
        hotOnly: false, //是否开启热更新
        proxy: {
            '/api': {
                target: 'http://localhost:18766/api', //API服务器的地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },

        },
    }
}