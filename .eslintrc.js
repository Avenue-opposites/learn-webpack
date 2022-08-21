module.exports = {
    //解析配置
    parserOptions:{
        //指定ES版本
        ecmaVersion:6,
        //源文件文件是ECMAScript模块
        sourceType:'module',
        // project:['./.eslintrc.js']
    },
    //扩展规则或者继承
    //检查ESlint规则
    extends:['eslint:recommended'],
    //启用全局变量
    env:{
        node:true,
        browser:true,
    },
    //检查规则
    rules:{
        //off或0 关闭禁止
        //warn或1 警告,关闭禁止
        //error或2 错误,开启禁止
        "no-var":'error',//禁止使用var声明
        "no-undef":'off',
        "no-unused-vars":'warn',
    },
    
};