//必须在入口文件引入webpack才会打包
import './css/init.css'
import './css/style.css'
import './css/nav.css'
import './css/iconfont.css'

import alerter from "./js/alerter";
import dataService from "./js/dataService";
import {add} from "./js/math";
import ES6 from './js/ES6+';

console.log("webpack: 5.73.0,webpack-cli: 4.9.2");

if(module.hot) {
    //let hot = module.hot;不能使用变量热更新,否则无效
    console.log("支持模块热替换");
    //然后添加需要热替换的
    module.hot.accept("./js/alerter",function() {
        console.log(alerter.name);
    });
    module.hot.accept("./js/dataService",function() {
        console.log(dataService.name);
    });
}

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js').then(registration => {
//         console.log('SW registered: ', registration);
//       }).catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//     });
//   }
// console.log(alerter.name);
// console.log(dataService.name);
console.log(add(1,2));
console.log("模块热替换已启用");
ES6.test().then(val => {
    console.log(val);
})