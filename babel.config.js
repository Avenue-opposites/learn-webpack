module.exports = {
    //预设
    presets:[
        //智能预设,编译ES6语法
        ['@babel/preset-env',
        {
            useBuiltIns:'usage',//使用自动按需加载
            corejs:3,//指定版本
        }],
        //帮助代码复用
    ],
    plugins:[
        '@babel/plugin-transform-runtime',
    ]
}