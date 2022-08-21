//引入文件路径模块
const path = require('path');
//引入OS系统模块
const os = require('os');
//引入js语法检查插件
const ESLintPlugin = require('eslint-webpack-plugin');
//引入HTML打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
//引入创建单独的css文件插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//引入压缩css的插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
//引入压缩js的插件(默认webpack自带,如果想要额外配置还是需要下载)
const TerserWebpackPlugin = require('terser-webpack-plugin');
//引入图片压缩插件
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//扩展默认故障
const { extendDefaultPlugins } = require("svgo");
//引入preload/prefetch插件
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
//引入离线服务插件
// const WorkboxPlugin = require('workbox-webpack-plugin');

//获取CPU的核心数
const coreNumber = os.cpus().length;


const base = require('./wepack.base');

const cssTreat = {
    //设置loader处理的文件类型
    test:/\.css$/,
    include:path.resolve(__dirname,'../src/css'),
    //设置使用执行顺序loader(从右到左,从下到上)
    use:getStyleLoader(),

};
const imgTreat = {
    test:/\.(jpe?g|png|svg|webp|ico)$/,
    type:'asset',
    //解析
    parser:{
        dataUrlCondition:{
          maxSize: 10 * 1024 // 10kb
        }
    },
    generator:{
        filename:'static/imges/[hash:10][ext][query]'
    }
};
const usuallyTreat = {   
    test:/\.(ttf|woff2?|mp3|mp4|avi)$/,
    type:'asset/resource',
    generator:{
        filename:'static/fonts/[hash:10][ext][query]'
    }
};
const jsTreat = {
    test:/\.js$/,
    include:path.resolve(__dirname,'../src'),
    use:[
            {
            loader:"thread-loader",
            options:{
                 works:coreNumber
                }
            },
            {
            loader:'babel-loader',
            options:{
                cacheDirectory:true,//开启缓存
                cacheCompression:false,//关闭缓存的压缩
                
            }
            },
        ]
};

//封装处理css样式的方法,可以使得代码复用
function getStyleLoader(pre,last) {
    //设置使用执行顺序loader(从右到左,从下到上)
    return [
        last,
        //'style-loader',//将js中的css通过创建style标签添加到HTML中
        MiniCssExtractPlugin.loader,//提取ccs创建单独的文件
        'css-loader',//把ccs资源编译成commonJS的模块到js中
        'postcss-loader',////兼容性处理,为css加上不同浏览器的兼容前缀
        pre,//接收处理less,sass之类的loader
    ].filter(Boolean);//没有就过滤
}



//暴露配置
module.exports =  {
    //入口(一般使用相对路径)
    // entry: './src/main.js',
    entry:{//多入口
        app:'./src/app.js',
        main:'./src/main.js'
    },
    //输出
    output: {
      //文件目录(一般使用绝对路径)
      //__dirname是node.js的变量,代表当前文件夹目录
      path:path.resolve(__dirname,'../dist'),//打包目录
      //文件名称
      filename: 'static/js/[name].[contenthash:10].js',//打包的js入口文件位置
      //给打包输出的其他文件命名
      chunkFilename:'static/js/[name].chunk.[contenthash:10].js',
      //清空上次打包结果 原理:清空dist文件夹内容,然后再打包
      clean:true
    },
    //加载器
    module:{
        rules:[
            base.setOneOfRules(cssTreat,imgTreat,usuallyTreat,jsTreat)
        ],
    },
    //插件
    plugins:[
        //插件的配置
        new ESLintPlugin({
            //设置检查文件路径
            context:path.resolve(__dirname,'../src'),
            exclude:"node_modules",
            //以线程池方式运行 lint 
            cache:true,//开启缓存
            cacheLocation:path.resolve(__dirname,'../node_modules/.cache/ESlint'),//设置缓存路径
            threads:coreNumber,
        }),
        ...base.chunkName.map(option => {
            //记得返回
            return new HtmlWebpackPlugin({
                template:path.resolve(__dirname,`../public/${option.name}.html`),
                filename:`${option.name}.html`,
                chunks:[option.entryName],
                // favicon:
            })
        }),
        // new HtmlWebpackPlugin({
        //     //以这个模板创建新的HTML文件
        //     template:path.resolve(__dirname,'../public/index.html'),
        // }),
        new MiniCssExtractPlugin({
            //默认加载文件名
            filename:'static/css/[name].[contenthash:10].css',
            //动态加载文件名
            chunkFilename:'static/css/[name].chunk.[contenthash:10].css',
        }),
        new PreloadWebpackPlugin({
            rel:'prefetch',
            // rel:'preload',//预加载
            // as:'script',
        }),
        // new WorkboxPlugin.GenerateSW({
        //     // 这些选项帮助快速启用 ServiceWorkers
        //     // 不允许遗留任何“旧的” ServiceWorkers
        //     cacheId:'webpack-PWA',
        //     swDest:'service-worker.js',
        //     clientsClaim: true,
        //     skipWaiting: true,
        //   }),
    ],
    //优化
    //在production模式下webpack默认开启HTML和JS压缩
    optimization:{
        minimize:true,
        //极小化
        minimizer:[
            //载入插件优化
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin({
                parallel:coreNumber,
            }),
            new ImageMinimizerPlugin({
                minimizer:{
                    implementation:ImageMinimizerPlugin.imageminGenerate,
                    options:{
                        plugins:[
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            ["svgo",{
                                plugins:extendDefaultPlugins([
                                    "preset-default",
                                    'prefixIds',
                                    {
                                        name:"sortAttrs",
                                        params:{
                                            xmlnsOrder:"alphabetical"
                                        }
                                    }
                                ])
                            }]
                        ]
                    }
                },
            }),
        ],
        //代码分割配置
        splitChunks:{
            chunks:"all",
            cacheGroups:{
                default:{
                    // minSize:0,//分割代码的最小大小 默认20000kb
                    minChunks:2,//至少被引用的次数
                    priority:-20,
                    reuseExistingChunk:true
                }
            }
        },
        //创建runtime文件,存储每个文件的哈希,使得修改文件时不会影响到其他文件
        runtimeChunk:{
            name:(entrypoint) => `runtime~${entrypoint.name}`,
        }
    },
    cache:{
        type:'filesystem',
    },
    //模式
    //development 开发模式
    //production 生产模式
    mode: 'production',
    devtool:'source-map',
    //启用监视模式,
    // watch:true,
    // //监听配置
    // watchOptions: {
    //     //设置构建延迟
    //     aggregateTimeout: 300,
    //     //指定毫秒为单位进行轮询。
    //     poll: 1000,
    //     //排除文件
    //     ignored:'/node_modules/'
    //   }
  };