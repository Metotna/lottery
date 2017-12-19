angular.module('starter.siteonoff', [])

//全局变量
    .constant('ApiEndpoint', {
        url: 'http://192.168.1.200:8080', //测试请求地址
        //bacgurl: 'http://192.168.1.200:8080',
        //url: 'http://192.168.1.159:8080', //测试请求地址
        //url:'http://192.168.1.159:8080',
        //bacgurl: 'http://192.168.1.135:8100', //测试地址
        //url: 'http://b170f53896.51mypc.cn:8080', //测试请求地址
        //bacgurl:'http://b170f53896.51mypc.cn:8866',//测试地址
        //bacgurl:'http://192.168.1.201:8866',//测试地址
        //url: 'http://ssl.778668.cn:8080', //测试请求地址
        //url: 'http://wcwcwc.net:8080',
        //bacgurl:'http://wcwcwc.net:8866',
        //url: 'https://m.778668.cn:8080',
        //url: 'https://scscscsc.cn:8080',
        //url:'https://api.778668.cn:8080',
        bacgurl: 'http://m.778668.cn',
        //wsurl:'ws://192.168.1.159:8080/webserver/136/5lrlm3c1/websocket',
        version: '1206',
    })