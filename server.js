const path = require('path');
//引入webpack模块
const Webpack = require('webpack');
//引入服务器插件
// const WebpackDevServer = require('webpack-dev-server');
//引入服务器
const express = require('express');
const app = express();
//引入webpack配置文件
const webpackConfig = require('./config/webpack.dev.js');

//为webpack绑定配置
const compiler = Webpack(webpackConfig);
// webpack-serve-dev的中间件
const devMiddleWare = require('webpack-dev-middleware')(compiler,{
    publicPath:webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
});
//启动服务
app.use(devMiddleWare);
//设置路由
app.get('/:viewname?',function(req, res, next) {
    let viewname = req.params.viewname 
        ? req.params.viewname + '.html' 
        : 'index.html';
    let filepath = path.join(compiler.outputPath, viewname);
    // 使用webpack提供的outputFileSystem
    compiler.outputFileSystem.readFile(filepath, function(err, result) {
        if (err) {
            // something error
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});
app.listen(3000,function () {
    console.log('Example app listening on port 3000!\n');
});
//保存服务器配置
// const devServerOptions = {webpackConfig.devServer};
//设置服务器的的配置,以及webpack配置
// const server = new WebpackDevServer(devServerOptions, compiler);
//开启服务
// server.start();
//服务开启回调
// server.startCallback(() => {
//     console.log(`服务器开始运行...端口:${webpackConfig.devServer.post}`);
//   });
// //服务关闭回调
// server.stopCallback(() => {
//     console.log(`服务器正在关闭...端口:${webpackConfig.devServer.post}`);
// });