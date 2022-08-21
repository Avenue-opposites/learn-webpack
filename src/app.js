//css
import './css/init.css'
import './css/style.css'
import './css/nav.css'
import './css/iconfont.css'
import './css/Vue_css/Vue_style.css'
//js
// import {mul} from './js/math';
import Vue from '../libs/vue';
new Vue({
    el:"#container",
    data:{
        message:"Vue 3.0"
    },
    methods:{
        click() {
            import(
            /* webpackChunkName:"math" */ 
            './js/math').then(math => {
                console.log(math.mul(5,5));
            }).catch(reason => {
                console.error(reason);
            })
        },
    }
});

