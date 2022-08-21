# webpack5学习
* 五大概念
    - 入口:应用程序入口,webpack处理的入口
    - 输出 打包的文件放置的位置
    - loader(加载器) 编译哪些文件和内容的工具
    - plugins(插件) 
    - mode(模式) 开发或者生产
* webpack.config.js(配置文件)
    - entry 应用入口文件路径
    - output 输出目录和文件路径
    - rules 匹配规则和使用loader
        * test 匹配规则(正则表达式)
        * use 使用的loader(顺序从右到左,从下到上)
        * type 文件输出类型
        * parser 解析格式
        * include 
        * exclude 排除某些文件或者文件夹
        * generator 指定类型文件位置
            - filename:"static/imges/[hash:10][ext][query]"
    - plugins 插件
    - mode 模式
# webpack高级优化
* deVtool(开发者工具)-sourceMap(源映射)
    - 可以让源代码和打包生产的代码,一条条一一对应,生成一个XXX.map文件,凭借这个文件可以在代码出错时,可以从构建之后的代码中查找到源代码出错的位置,然后让浏览器提醒我们,方便开发时在许多代码中查找错误.
    - 开发模式下,一般使用cheap-module-source-map
       - 优点：打包编译速度快，只包含行映射
       - 缺点：没有列映射
    - 生产模式下,一般使用source-map
       - 优点：包含行和列映射
       - 缺点：打包编译速度更慢  
* hot-module-replacement(模块热替换[HMR])
    - 它可以在打包过程中只修改源代码改动过的地方,不去修改源代码没有改动的地方,可以节约打包使用的时间
    - 在开发模式中和devServer中默认开启,不过只会对css生效,对JS不会生效
    - 想要JS也实现的话,需要判断浏览器是否支持JS模块热替换(一般用于生产模式)
        if(module.hot){//判断是否支持
            //如果支持的话
            module.hot.accept("需要模块热替换的文件路径",function() {
                //使用更新过的模块执行某些操作.
            })
        }
* OneOf
    - 当rules匹配规则时，只使用第一个匹配到的规则。
* include(包括)和exclude(排除)
    - 因为在我们使用第三方库和别人的包时,它们都是打包编译好放在node_modules文件夹下,在我们打包编译时不需要对下载的包进行解析
    这时就要用到exclude排除文件夹
    - include设置则和exclude相反,就是只对指定的文件和文件夹进行编译打包
    - 这两者同时只能设置一个
* cache(缓存)
    * 第一次打包编译都比较慢,所以我们可以存储之前的ESlint的检测和Babel的编译结果作为缓存，这样第二次打包使用缓存,速度就会更快
    - cache.cacheDirectory设置缓存目录,cache.cacheDirectory 选项仅当 cache.type 被设置成 'filesystem' 才可用。
    默认路径:默认为 node_modules/.cache/webpack
    - cache.cacheLocation设置缓存的路径。默认值为 path.resolve(cache.cacheDirectory, cache.name)
    -cache.compression,设置缓存压缩类型 development 模式下默认为 false，production 模式下默认为 'gzip'。
    cache.compression 配置项仅在 cache.type 设为 'filesystem' 时可用。
* Thread(多线程打包)
    - 如果是构建大项目的话,生产模式下打包就会变得很慢,所以我们可以使用多个线程打包编译
    - 使用thread-loader可以实现多线程,使用时,需将此 loader 放置在其他 loader 之前,放置在此 loader 之后的 loader 会在一个独立的线程中运行。
    - 每个线程都是一个独立的 node.js 进程，其开销大约为 600ms 左右。同时会限制跨进程的数据交换
* Tree shaking(树摇晃)
    - 可以减少代码体积,移除没有使用的js代码,它依赖ES module
    - 生产模式下默认开启
    - webpack已经默认开启该功能,无需其他配置
    - 对babel使用插件@babel/plugin-transform-runtime,一个插件，可以重用 Babel 的注入帮助代码以节省代码大小。
    - 它禁用了Babel自动对每个文件的runtime注入，而是引入并且使所有辅助代码从这里引用。
* Code Split(代码分割)
    - 打包代码是将js全部打包到一个文件中,体积太大了,当我们进入一个页面时,会全部加载,比较耗时间,我们希望我们进入哪个页面,
    就加载哪个页面的js,所以我们要将代码分割为多个js文件,这样加载资源少,速度就会更快
    - 代码分割主要做两件事:
        1. 分割文件 
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
        2. 按需加载
            - 可以使用内联注释使这一特性得以实现。通过在 import 中添加注释，我们可以进行诸如给 chunk 命名或选择不同模式的操作。
            - 单个目标设置
                /* webpackChunkName: "my-chunk-name" */
                /* webpackMode: "lazy" */
                /* webpackExports: ["default", "named"] */
            - 多个目标设置
                /* webpackInclude: /\.json$/ */
                /* webpackExclude: /\.noimport\.json$/ */
                /* webpackChunkName: "my-chunk-name" */
                /* webpackMode: "lazy" */
                /* webpackPrefetch: true */
                /* webpackPreload: true */ [无法使用]
            import()函数实现动态加载,webpack会把动态加载的代码,分割为单独的模块,使用时载入
                 import(/*webpackChunkName:"my-chunk-name"*/'./js/math').then(math => {
                console.log(math.mul(5,5));
            }).catch(reason => {
                console.error(reason);
            })
* Preload(预加载)/Prefetch(预获取)
    - preload(预加载):告诉浏览器立即加载
    - prefetch(预获取):告诉浏览器在空闲时开始加载
        * 它们的共同点:
            1. 都只会加载资源,不会执行
            2. 都有缓存
        * 它们的不同点:
            1. preload加载优先级高,prefetch加载优先级低
            2. Proload只加载当前页面需要使用的资源,prefetch加载当前页面的资源,以及下一个页面的的资源
        * 它们的问题:兼容性较差
* Core.js(解决所有ES6+以上的代码兼容性问题)
    - core-js是专门用来做ES6以及以上API的polyfill。
    - po1yf111翻译过来叫做垫片/补丁。就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性。
    - 如果自己在入口文件中引入core.js,他会把所有的兼容代码引入,即使用不到,这样就使得文件空间大
    所有我们可以使用按需加载
    - core.js里有许多兼容,可以单个引入,比如引入ES的就可以 import'core-js/ES';
    不过这样会有一个问题,如果我们使用的东西太多了,我们忘记引入某个文件,就会很麻烦
    - 所以我们希望他自动检测我们使用的语法,来引入相应的core.js
* PWA(渐进式网络应用程序)
    - 可以让我们在离线时程序继续运行,内部是通过Service Workers技术实现的
    - 使用workbox-webpack-plugin来实现 $ npm install workbox-webpack-plugin --save-dev




           

