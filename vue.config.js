module.exports = {
    // ...
    devServer: {
        port: 5000, // 将此处的数字替换为你想要的端口号
        proxy: {
            '/api': { // 这里是匹配的路径前缀
                target: 'http://localhost:8080', // Spring Boot应用的实际地址
                changeOrigin: true, // 允许跨域
                pathRewrite: {
                    '^/api': '' // 将/api从请求路径中去掉，如果Spring Boot接口不需要此前缀则可添加此项
                }
            }
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto', // 或者 'module'
                },
            ],
        },
    },
};