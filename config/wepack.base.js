const path = require('path');
function setOneOfRules(...rest) {
    const rules = {
        oneOf:rest,
    };
    return rules;
}
//HTML设置对象
const indexHTML = {name:"index",entryName:"main",favicon:path.resolve(__dirname,'../dist/static/imges/favicon.ico')};
const indexVueHTML = {name:"indexVue",entryName:"app"};
//设置输出的HTML要加载的入口
const chunkName = [indexHTML,indexVueHTML];
module.exports = {setOneOfRules,chunkName};
// const oneOf = {
    //     oneOf:[
    // //处理css
    // {
    //     //设置loader处理的文件类型
    //     test:/\.css$/,
    //     //设置使用执行顺序loader(从右到左,从下到上)
    //     use:getStyleLoader(),

    // },
    // //处理图片
    // {
    //     // test:/\.(jpg|jpeg|tif|tga|bmp|dds|svg|eps|pdf|hdr|png|gif|raw|exr|webp)$/,
    //     test:/\.(jpe?g|png|svg|webp|ico)$/,
    //     //小于一定空间转换为base64
    //     type:'asset',
    //     //解析
    //     parser:{
    //         //图片转为base64的格式
    //         dataUrlCondition:{
    //           //小于10kb的转换
    //           //好处:减少http请求
    //           //坏处:体积会更大
    //           maxSize: 10 * 1024 // 10kb
    //         }
    //     },
    //     //修改指定类型文件位置
    //     generator:{
    //         //文件位置 hash是唯一标识符[hash:number]可以设置只去哈希值的前几位,
    //         //ext是扩展名,query是一些额外参数
    //         filename:'static/imges/[hash:10][ext][query]'
    //     }
    // },
    // //一般文件
    // {   
    //     //对于一些不用修改类型的文件
    //     test:/\.(ttf|woff2?|mp3|mp4|avi)$/,
    //     //默认输出原文件类型
    //     type:'asset/resource',
    //     generator:{
    //         filename:'static/fonts/[hash:10][ext][query]'
    //     }
    // },
    // //处理js文件
    // {
    //     test:/\.js$/,
    //     //排除转换的文件夹
    //     include:path.resolve(__dirname,'../src'),
    //     use:[
    //             {
    //             loader:"thread-loader",
    //             options:{
    //                 //设置开启worker的数量
    //                  works:coreNumber
    //                 }
    //             },
    //             {
    //             loader:'babel-loader',
    //             //可以在webpack配置文件里配置,也可以写一个配置文件
    //             // options:{
    //             //     presets:['@babel/preset-env']
    //             // }
    //             },
    //         ]
    // },

    //     ]
    // };