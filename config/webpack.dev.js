//引入文件路径模块
const path = require('path');
//引入webpack自带的插件
// const webpack = require('webpack');
//引入js语法检查插件
const ESLintPlugin = require('eslint-webpack-plugin');
//引入HTML打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const  PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const coreNumber = require('os').cpus().length;
//引入压缩js的插件(默认webpack自带,如果想要额外配置还是需要下载)
const base = require('./wepack.base');
if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
  }
//暴露配置
module.exports = {
    //入口(一般使用相对路径)
    //是相对执行打包命令的目录
    // entry: './src/main.js',//单入口
    entry:{//多入口
        app:'./src/app.js',
        main:'./src/main.js'
    },
    //输出
    output: {
      //文件目录(一般使用绝对路径)
      //__dirname是node.js的变量,代表当前文件夹目录
      //开发模式下是使用开发服务器查看,所以不用输出
      path: path.resolve(__dirname,'../dist'),//打包目录
      //文件名称
      filename: 'static/js/[name].bundle.js',//打包的js入口文件位置
      chunkFilename:'static/js/[name].chunk.js',
      //清空上次打包结果 原理:清空dist文件夹内容,然后再打包
      publicPath:'/',
    //   clean:true
    },
    //加载器
    module:{
        rules:[
            //加载器的配置
            {
                //只匹配第一个符合处理的加载器
                oneOf:[
                    //处理css
            {
                //设置loader处理的文件类型
                test:/\.css$/,
                //设置使用执行顺序loader(从右到左,从下到上)
                include:path.resolve(__dirname,'../src/css'),
                use:[
                    'style-loader',//将js中的css通过创建style标签添加到HTML中
                    'css-loader',//把ccs资源编译成commonJS的模块到js中
                    'postcss-loader'
                ],
            },
            //处理图片
            {
                // test:/\.(jpg|jpeg|tif|tga|bmp|dds|svg|eps|pdf|hdr|png|gif|raw|exr|webp)$/,
                test:/\.(jpe?g|png|svg|webp|ico)$/,
                //小于一定空间转换为base64
                type:'asset',
                //解析
                parser:{
                    //图片转为base64的格式
                    dataUrlCondition:{
                      //小于10kb的转换
                      //好处:减少http请求
                      //坏处:体积会更大
                      maxSize: 10 * 1024 // 10kb
                    }
                },
                //修改指定类型文件位置
                generator:{
                    //文件位置 hash是唯一标识符[hash:number]可以设置只去哈希值的前几位,
                    //ext是扩展名,query是一些额外参数
                    filename:'static/imges/[hash:10][ext][query]'
                }
            },
            //一般文件
            {   
                //对于一些不用修改类型的文件
                test:/\.(ttf|woff2?|mp3|mp4|avi)$/,
                //默认输出原文件类型
                type:'asset/resource',
                generator:{
                    filename:'static/fonts/[hash:10][ext][query]'
                }
            },
            //babel配置
            {
                test:/\.js$/,
                //排除转换的文件夹
                // exclude:/node_modules/,
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
                    //可以在webpack配置文件里配置,也可以写一个配置文件
                    options:{
                        // presets:['@babel/preset-env']
                        cacheDirectory:true,//开启缓存
                        cacheCompression:false,//关闭缓存的压缩
                        }
                    },
                ]
            },
                ]
            }
        ]
    },
    //插件
    plugins:[
        //插件的配置
        new ESLintPlugin({
            //设置检查文件路径
            context:path.resolve(__dirname,'../src'),
            exclude:"node_modules",
            cache:true,//开启缓存
            cacheLocation:path.resolve(__dirname,'../node_modules/.cache/ESlint'),//设置缓存路径
            threads:coreNumber,
        }),
        ...base.chunkName.map(option => {
            return new HtmlWebpackPlugin({
                template:path.resolve(__dirname,`../public/${option.name}.html`),
                filename:`${option.name}.html`,
                chunks:[option.entryName],
            });
        }),
        new PreloadWebpackPlugin({
            rel:'prefetch',
        }),
        // new HtmlWebpackPlugin({
        //     //以这个模板创建新的HTML文件
        //     template:path.resolve(__dirname,'../public/index.html')
        // }),
        //载入热替换插件
        // new webpack.HotModuleReplacementPlugin(),
    ],
    //开发服务器配置 开发服务器不会输出资源,而是在内存中编译打包的
    devServer:{
            // static:'../dist',
            //域名
            host:'localhost',
            //端口号
            port:8080,
            //自动打开浏览器
            open: true,
            //开启css模块热替换(在开发devServer中默认开启,使用HMR插件也会自动调用)
            hot:true,
    },
    optimization:{
        minimize:true,
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
        }
    },
    //模式
    //development 开发模式
    //production 生产模式
    mode: 'development',
    devtool:'cheap-module-source-map',
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