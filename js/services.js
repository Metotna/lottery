angular.module('starter.services', [])

    //http拦截器
    .factory('httpInterceptor', [ '$q', '$injector',function($q, $injector) {

/*        var readUTF = function (arr) {
            if (typeof arr === 'string') {
                return arr;
            }
            var UTF = '', _arr = arr;
            for (var i = 0; i < _arr.length; i++) {
                var one = _arr[i].toString(2),
                    v = one.match(/^1+?(?=0)/);
                if (v && one.length == 8) {
                    var bytesLength = v[0].length;
                    var store = _arr[i].toString(2).slice(7 - bytesLength);
                    for (var st = 1; st < bytesLength; st++) {
                        store += _arr[st + i].toString(2).slice(2)
                    }
                    UTF += String.fromCharCode(parseInt(store, 2));
                    i += bytesLength - 1
                } else {
                    UTF += String.fromCharCode(_arr[i])
                }
            }
            return UTF
        }
        //转码
        var escape = function (data) {
            var b = new Base64();
            str = b.decode(data)
            for(var i=0;i<str.length;i++){
                str[i] = str[i] & 0xff;
            }
            //console.log(str);
            var gunzip = new Zlib.Gunzip(str);
            var plain = gunzip.decompress();
            //console.log(plain)
            var s = readUTF(plain);
            //console.log(s);
            return JSON.parse(s);
        }*/

        var httpInterceptor = {
            'responseError' : function(response) {
                return $q.reject(response);
            },
            //响应拦截
            'response' : function(response) {
               /* if(response.data.mix){
                    //console.log(new Date().getTime());
                    response.data = escape(response.data.data);
                    //console.log(new Date().getTime());
                }else if(response.data.mix == false){
                    response.data = response.data.data;
                }*/
                return response;
            },
            'request' : function(config) {
                return config;
            },
            'requestError' : function(config){
                return $q.reject(config);
            }
        }
        return httpInterceptor;
    }])
    //常用算法
    .factory('algorithm', [function () {
        return {
            /**
             * 十一选五冷热投注专用计算
             * @param numarr 数组
             * @param size 投注个数
             * @param h 冷--0  热--1
             * @returns {Array}
             */
            syxwhotbet:function (numarr,size,h) {
                var arry = [];
                for(var j =0;j<numarr.length;j++){
                    var key = '';
                    if(j<9){
                        key = '0'+(j+1);
                    }else{
                        key = String(parseInt(j)+1);
                    }
                    var obj = {
                        num:numarr[j],
                        no:key
                    }
                    arry.push(obj);
                }
                function sortNumbera(a,b)
                {
                    return a.num - b.num
                }
                function sortNumberb(a,b)
                {
                    return b.num - a.num
                }
                if(!h){
                    arry.sort(sortNumbera)
                }else{
                    arry.sort(sortNumberb)
                }
                var arry2 = [];
                for(var k = 0;k<size;k++){
                    arry2.push(arry[k].no);
                }
                return arry2;
            },
            //数字正序排序
            ordersort: function (arr) {
                var len = arr.length,
                    i, j, tmp;
                for (i = 1; i < len; i++) {
                    tmp = arr[i];
                    j = i - 1;
                    while (j >= 0 && parseFloat(tmp) < parseFloat(arr[j])) {
                        arr[j + 1] = arr[j];
                        j--;
                    }
                    arr[j + 1] = tmp;
                }
                console.log(arr)
                return arr;
            },
            /**
             *组合算法
             * @param arr 原始数组
             * @param size 组合个数
             * @returns {Array}
             */
            choose: function (arr, size) {
                var allResult = [];
                (function (arr, size, result) {
                    var arrLen = arr.length;
                    if (size > arrLen) {
                        return;
                    }
                    if (size == arrLen) {
                        allResult.push([].concat(result, arr))
                    } else {
                        for (var i = 0; i < arrLen; i++) {
                            var newResult = [].concat(result);
                            newResult.push(arr[i]);

                            if (size == 1) {
                                allResult.push(newResult);
                            } else {
                                var newArr = [].concat(arr);
                                newArr.splice(0, i + 1);
                                arguments.callee(newArr, size - 1, newResult);
                            }
                        }
                    }
                })(arr, size, []);
                return allResult;
            },
            /**
             * 数组去重算法
             * @param arr
             * @returns {Array}
             */
            unique: function (arr) {
                var result = [], hash = {};
                for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                    if (!hash[elem]) {
                        result.push(elem);
                        hash[elem] = true;
                    }
                }
                return result;
            }
        }
    }])

    .factory('websocket', ['$rootScope','$q','UserInfo','$log','$stomp','ApiEndpoint',function($rootScope,$q,UserInfo,$log,$stomp,ApiEndpoint) {
        //var ws;//websocket实例
        var lockReconnect = false;//避免重复连接
        var collection = [];
        // Open a WebSocket connection
        $stomp.setDebug(function (args) {
            $log.debug(args)
        })
        var connectHeaders ={
            token:UserInfo.l.token
        };

        function createWebSocket(url) {
            try {
                //ws = $websocket(url);
                 $stomp.connect(url+'/webserver', connectHeaders).then(function (frame) {
                    var subscription = $stomp.subscribe('/topic/notice', function (payload, headers, res) {
                        //$scope.payload = payload
                        console.log(payload)
                    });
                    var subscriptions = $stomp.subscribe('/user/'+UserInfo.l.token+'/message', function (payload, headers, res) {
                        //$scope.payload = payload
                        $rootScope.opensyxwnum = payload;
                    })
                    // 取消订阅
                    //subscription.unsubscribe()
                    // Send message发送消息
                   /* $stomp.send('/app/message', { priority: 9,
                        custom: 42
                    })*/
                    /*$stomp.onclose ().then(function () {
                        $log.info('断开连接')
                    })*/
                    // Disconnect断开连接
                    /* $stomp.disconnect().then(function () {s
                     $log.info('disconnecteds')
                     })*/
                })
                initEventHandle($stomp.sock);
            } catch (e) {
                reconnect(url);
            }
            return $stomp;
        }
        function initEventHandle(ws) {
            //监听消息获取
           /* ws.onmessage = function(message) {
                collection.push(message);
                //如果获取到消息，心跳检测重置
                //拿到任何消息都说明当前连接是正常的
                console.log(message)
                heartCheck.reset().start();
            };*/
            //监听服务连接
            ws.addEventListener('open', function (event) {
                //心跳检测重置
                //heartCheck.reset().start();
            });
            //监听服务断开
            ws.addEventListener('close', function (event) {
                console.log('断开')
                reconnect(ApiEndpoint.wsurl);
            });
            //监听服务报错
            ws.addEventListener('error', function (event) {
                console.log('错误')
                reconnect(ApiEndpoint.wsurl);
            });
        }

        function reconnect(url) {
            if(lockReconnect) return;
            lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            setTimeout(function () {
                createWebSocket(ApiEndpoint.wsurl);
                lockReconnect = false;
            }, 20000);
        }

        //心跳检测
        var heartCheck = {
            timeout: 60000,//60秒
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function(){
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start: function(){
                var self = this;
                this.timeoutObj = setTimeout(function(){
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    //onmessage拿到返回的心跳就说明连接正常
                    ws.send("/app/message", {}, JSON.stringify({'name': '1'}));
                    self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                        ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    }, self.timeout)
                }, this.timeout)
            }
        }
        /*//发送消息
         ws.send(JSON.stringify({ action: 'get' }));*/

        /* var methods = {
         collection: collection,
         get: function() {
         ws.send(JSON.stringify({ action: 'get' }));
         }
         };*/



        return {
            sockt:function (url) {
                var defer = $q.defer();
                $stomp.connect(url+'/webserver', connectHeaders).then(function (frame) {
                    var subscription = $stomp.subscribe('/topic/notice', function (payload, headers, res) {
                        //$scope.payload = payload
                        console.log(payload);
                        if(payload.data.gid == 10){
                            defer.resolve(payload);
                        }
                    });
                    var subscriptions = $stomp.subscribe('/user/'+UserInfo.l.token+'/message', function (payload, headers, res) {
                        //$scope.payload = payload
                        //$rootScope.opensyxwnum = payload;;
                        //defer.resolve(payload);
                    })
                    // 取消订阅
                    //subscription.unsubscribe()
                    // Send message发送消息
                    /* $stomp.send('/app/message', { priority: 9,
                     custom: 42
                     })*/
                    /*$stomp.onclose ().then(function () {
                     $log.info('断开连接')
                     })*/
                    // Disconnect断开连接
                    /* $stomp.disconnect().then(function () {s
                     $log.info('disconnecteds')
                     })*/
                })

                return defer.promise;
                //return createWebSocket(ApiEndpoint.url);
            },
            createWebSocket:function () {
                var defer = $q.defer();
                $stomp.connect(ApiEndpoint.url+'/webserver', connectHeaders).then(function (frame) {
                    console.log('open')
                    defer.resolve($stomp);
                    /*var subscription = $stomp.subscribe('/topic/notice', function (payload, headers, res) {
                        //$scope.payload = payload
                        console.log(res)
                    });*/
                    var subscriptions = $stomp.subscribe('/user/'+UserInfo.l.token+'/message', function (payload, headers, res) {
                        //$scope.payload = payload
                        //$rootScope.opensyxwnum = payload;
                    })
                    // 取消订阅
                    //subscription.unsubscribe()
                    // Send message发送消息
                    /* $stomp.send('/app/message', { priority: 9,
                     custom: 42
                     })*/
                    /*$stomp.onclose ().then(function () {
                     $log.info('断开连接')
                     })*/
                    // Disconnect断开连接
                    /* $stomp.disconnect().then(function () {s
                     $log.info('disconnecteds')
                     })*/
                })
                return defer.promise;
            }
        }
    }])
    //非空验证
    .factory('stock', [function() {
        return {
            Nonull: function(y) {
                if (y == null || y == undefined || y == '') {
                    return false;
                } else {
                    return true;
                }
            },
            //格式化yyyy-mm-dd时间
            Formattime:function (t) {
                return +new Date(t.replace(/-/g, "/"));
            },
            //获取时分
            getHM:function (t) {
                var d =  new Date(t);
                function double(num){
                    if (num<10){
                        return "0"+num;   //如果时分秒少于10，则在前面加字符串0
                    }
                    else{
                        return ""+num;        //否则，直接返回原有数字
                    }
                }
                //console.log(d.getMinutes())
                return double(d.getHours())+':'+double(d.getMinutes());
            }
        }
    }])
    //banner跳转服务
    .factory('homepage', ['$rootScope','$ionicSlideBoxDelegate','$timeout','order','UserInfo','$ionicHistory','$state','$http',function($rootScope,$ionicSlideBoxDelegate,$timeout,order,UserInfo,$ionicHistory,$state,$http) {
        return {
            banner: function(url) {
                //console.log(url)
                if(url.indexOf('http://')==-1 && url.indexOf('https://')==-1){
                    $http.get("json/data.json").success(function(data) {
                        var getbackurl = data.bannerurl;
                        var backurl = getbackurl[url];
                        //console.log(backurl);
                        UserInfo.remove(['jsondatapls', 'jsondatasyxw', 'Passdata', 'historybet']);
                        $ionicHistory.clearCache().then(function() {
                            $state.go(backurl, { type: url });
                        })
                    });
                }else{
                    if(UserInfo.l.navigator == 'android'){
                        $state.go('user.cheshipage',{url:url});
                    }else{
                        this.iframebox(url);
                    }
                    //$state.go('user.cheshipage',{url:url});
                }
            },
            iframebox:function (url) {
                var m = window.document.querySelector('meta[name="viewport"]');
                var c = m.getAttribute("content");
                $timeout(function() {
                    m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1");
                }, 0)
                var i = '<div id="sanspage" class="sanspages"><div class="pageheader"><a id="removpg" class="bar-backgo icon iconfont icon-jiantou1 pagetit" ng-click="Gohome()"></a></div><iframe id="homepageIframe" name="pagebox" data-tap-disabled="true" scrolling="no" frameborder="0"  src='+url +' style="min-height: 100%; width: 100%;margin-top: 44px"></iframe> </div>'
                $('body').append(i);
                $('body').on('click','#sanspage #removpg',function (e) {
                    m.setAttribute("content",c);
                    $('#sanspage').remove();
                    $('body').off('click', '#sanspage #removpg');
                    $ionicSlideBoxDelegate.$getByHandle('hallbanner').update();
                    return false;
                })
                $rootScope.kzshow = true;
                if(!$rootScope.addevent){
                    //console.log('ssssfsf');
                    window.addEventListener('hashchange', function(ev){
                        if(ev.oldURL.indexOf('tab/hall/')!=-1 && $rootScope.kzshow){
                            //console.log($rootScope.kzshow)
                            m.setAttribute("content",c);
                            $('#sanspage').remove();
                            $rootScope.kzshow = false;
                        }
                    });
                    $rootScope.addevent = true;
                }
            }
        }
    }])

    //http服务
    .factory('HttpServer', ['$interval', 'httpcom', '$rootScope', 'ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function($interval, httpcom, $rootScope, ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        return {
            Hpost: function(d,url) {
                var defer = $q.defer();
                //$ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + url,
                    data: d,
                }).success(function(data) {
                    //$ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    // $ionicLoading.hide();
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            Spost: function(d,url) {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + url,
                    data: d,
                }).success(function(data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    $ionicLoading.hide();
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
        }
    }])
        //彩种活动
    .factory('activity', ['showAlertMsg','$filter','$ionicHistory','$state', '$timeout', '$rootScope', '$interval', 'ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function(showAlertMsg,$filter,$ionicHistory,$state, $timeout, $rootScope, $interval, ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        var footballid ={
            '0':'1',
            '1':'4',
            '2':'3',
            '3':'5',
            '4':'2',
            //'6':'6',
        };
        var lotterydata = {};
        var parsedata = function (betStr) {
            var obj1 = {};
            var arry1 = [];
            var betstrlist = betStr.split("|");
            var bet = betstrlist[1].replace(/(.*)[,，]$/, '$1').split(",");
            var lent = bet.length;
            var pid = bet[0].split(":")[1];
            var passpalyswitch = false;
            //console.log(bet);
            for (var i = 0; i < bet.length; i++) {
                var s = bet[i].split(":");
                var obj = {}; //场次
                var num = s[1];
                if(pid != num){
                    passpalyswitch = true;
                }
                pid = num;
                //console.log(num);
                //console.log($(a[i]).find('span').first().text());
                obj.gameid = s[0];
                obj.bettingid = s[1];
                obj.resultid = s[2];
                arry1.push(obj);
                var id = s[1];
            }
            obj1.id = id;
            obj1.arry1 = arry1;
            obj1.passpalyswitch = passpalyswitch;
            return obj1;
        }
        return{
            //点击启动页选择包中投注
            baozhong : function () {
                var _this = this;
                if(lotterydata.data.length>0){
                    _this.dispose(lotterydata);
                }else{
                    return false;
                }
                /*_this.lotterylist().then(function (data) {
                    //console.log(data.data[0].betInfo.betStr);
                    _this.dispose(data);
                });*/
            },
            //包中活动图展示
            bag :function (imgurl) {
                if(sessionStorage.getItem('startpage')=='1'){
                    return false;
                }
                var _this = this;
                var timesum = 10;
                var timeing = 10;
                var d = "<div id='bzbagpop' class='comfixdd'><div class='fixedcon startpage'><img class='img' src="+imgurl+">" +
                    "<div class='continue' id='continue'></div>" +
                    "<div class='back-close'></div><div class='countdown'><i class='timeing'>"+timeing+"</i>秒</div></div></div>";
                $('body').append(d);
                $('body').on('click', '#bzbagpop .back-close', function(e) {
                    $('#bzbagpop').remove();
                    //$('body').off('click', '.back-close');
                    return false;
                })
                $('body').on('click', '#bzbagpop #continue', function(e) {
                    _this.baozhong();
                    //$state.go('user.register');
                    return false;
                })
                sessionStorage.setItem('startpage','1');
                var clearbootpage = $interval(function() {
                    timeing--;
                    $('.timeing').html(timeing);
                    if(timesum-timeing==10){
                        $('#bzbagpop').remove();
                        $interval.cancel(clearbootpage);
                    }
                }, 1000)
            },
            //包中活动启动页
            bootpage:function () {
                var _this = this;
                _this.lotterylist().then(function (data) {
                    if(data.data.length>0){
                        if(data.data[0].atype == 'BAOZHONG'){
                            $rootScope.atype = data.data[0].atype;
                            _this.bag(data.data[0].imageUrl);
                        }else{
                            $rootScope.atype = false;
                        }
                    }else{
                        $rootScope.atype = false;
                    }
                })
            },
            //包中列表
            lotterylist: function(d) {
                var defer = $q.defer();
                //$ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/act/lottery/list",
                    data: {
                        token: UserInfo.l.token,
                    },
                }).success(function(data) {
                    lotterydata = data;
                    //$ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    //$ionicLoading.hide();
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            //包中活动处理
            dispose:function (data) {
                var arry1 = [];
                var id = {};
                var betStr = data.data[0].betInfo.betStr;
                arry1 = parsedata(betStr).arry1;
                id = parsedata(betStr).id;
                var passpalyswitch = parsedata(betStr).passpalyswitch;
                var betstrlist = betStr.split("|");
                var bet = betstrlist[1].replace(/(.*)[,，]$/, '$1').split(",");
                var lent = bet.length;
                var playid = footballid[id];
                if(passpalyswitch){
                    playid = 6
                }
                if(betstrlist[0].indexOf('100') != -1){
                    playid = playid-(-6);
                }
                //obj.result = $(a[i]).find('span').first().text();
                //console.log(arry1);
                var Passdata = JSON.stringify(arry1);
                UserInfo.add('Passdata',Passdata)
                $ionicHistory.clearCache().then(function() {
                    $state.go('practice.Betting', {
                        id: playid,
                        gamenum: lent,
                        aid:data.data[0].aid,
                        atype:data.data[0].atype,
                        doubleCount:data.data[0].betInfo.doubleCount,
                        guan:betstrlist[0],
                    });
                });
            },
            //包中追投
            addto:function (data,bcontext,bdouble) {
                if(data.data.length<=0){
                    showAlertMsg.showMsgFun('温馨提示','赛事已结束');
                    return false;
                }
                var arry1 = [];
                var id = {};
                var hascom = false;
                var addtodata = parsedata(bcontext).arry1;
                var betStr = data.data[0].betInfo.betStr;
                arry1 = parsedata(betStr).arry1;
                id = parsedata(betStr).id;
                //场次对比
                for(var i = 0;i<addtodata.length;i++){
                    if(addtodata[i].gameid==arry1[0].gameid){
                        hascom = true;
                        break;
                    }
                }
                if(!hascom){
                    showAlertMsg.showMsgFun('温馨提示','赛事已结束');
                    return false;
                }
                var passpalyswitch = parsedata(betStr).passpalyswitch;
                var betstrlist = betStr.split("|");
                var bet = betstrlist[1].replace(/(.*)[,，]$/, '$1').split(",");
                var lent = bet.length;
                var playid = footballid[id];
                if(passpalyswitch){
                    playid = 6
                }
                if(betstrlist[0].indexOf('100') != -1){
                    playid = playid-(-6);
                }
                //obj.result = $(a[i]).find('span').first().text();
                //console.log(arry1);
                var Passdata = JSON.stringify(arry1);
                UserInfo.add('Passdata',Passdata)
                $ionicHistory.clearCache().then(function() {
                    $state.go('practice.Betting', {
                        id: playid,
                        gamenum: lent,
                        aid:data.data[0].aid,
                        atype:data.data[0].atype,
                        doubleCount:data.data[0].betInfo.doubleCount,
                        guan:betstrlist[0],
                    });
                });
            },
            //详情追投显隐控制
            showaddto:function (bcontext,pid) {
                var addtodata = parsedata(bcontext).arry1;
                var p = pid.split(",");
                var hascom = false;
                for(var i = 0;i<addtodata.length;i++){
                    if(addtodata[i].gameid==p[0]){
                        hascom = true;
                        break;
                    }
                }
                return hascom;
            }
        }
    }])
    /**
     * 银行卡
     *
     * @returns {Boolean}
     */
    .factory('banklist', [function() {
        var list = [{
                "bank": "中国工商银行",
                "img": "img/bank/gonghang.svg",
            },
            {
                "bank": "中国农业银行",
                "img": "img/bank/nonghang.svg",
            },
            {
                "bank": "中国建设银行",
                "img": "img/bank/jianhang.svg",
            },
            {
                "bank": "中国银行",
                "img": "img/bank/zhonghang.svg",
            },
            {
                "bank": "招商银行",
                "img": "img/bank/zhonghangcopy.svg",
            },
            {
                "bank": "交通银行",
                "img": "img/bank/jiaotong.svg",
            },
            {
                "bank": "中信银行",
                "img": "img/bank/zhongxin.svg",
            },
            {
                "bank": "中国邮政储蓄银行",
                "img": "img/bank/youzchuxu.svg",
            },
            {
                "bank": "民生银行",
                "img": "img/bank/mingshen.svg",
            },
            {
                "bank": "华夏银行",
                "img": "img/bank/huaxia.svg",
            },
            {
                "bank": "广发银行",
                "img": "img/bank/guangfa.svg",
            },
            {
                "bank": "光大银行",
                "img": "img/bank/guangda.svg",
            }
        ]
        return {
            getbanklist: list,
        }
    }])

/**
 * 平台类型
 *
 * @returns {Boolean}
 */
.factory('browser', ['UserInfo',function(UserInfo) {
    var u = navigator.userAgent;
    var ua = navigator.userAgent.toLowerCase();
    return {
        is_weixn: function() {
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return 'yes';
            } else {
                return 'no';
            }
        },
        navigator: function() {
            var type = '';
            var isA = ua.indexOf("android") > -1;
            var isIph = ua.indexOf("iphone") > -1;
            if (isA) {
                type = 'android'
            } else if (isIph) {
                type = 'ios'
            }
            return type;
        },
        webp: function() {
            try {
                return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
            } catch (err) {
                return false;
            }
        },
        isSafari: function() {
            if (window.openDatabase && ua.match(/version\/([\d.]+)/)) {
                return true;
            } else {
                return false;
            }
        },
        iswebapp: function() {
            if (navigator.standalone) {
                return true;
            } else {
                return false;
            }
        },
    }
}])

//保存用户信息
.factory('UserInfo', [function() {
        var userinfo = {};

        function isArray(o) {
            return o instanceof Object;
        }

        return {
            save: function(j) {
                for (var k in j) {
                    //window.localStorage[k] = userinfo[k] = j[k];
                    if (!isArray(j[k])) {
                        window.localStorage[k] = userinfo[k] = j[k];
                    } else {
                        for (var s in j[k]) {
                            window.localStorage[s] = userinfo[s] = j[k][s];
                        }
                    }
                }
                return userinfo;
            },
            remove: function(f) {
                if (f.constructor == Array) {
                    for (var i = 0; i < f.length; i++) {
                        window.localStorage.removeItem(f[i]);
                    }
                }
                window.localStorage.removeItem(f);
            },
            add: function(k, v) {
                window.localStorage[k] = userinfo[k] = v;
            },
            addLong: function(k, v) {
                window.localStorage[k] = v;
            },
            l: window.localStorage
        };
    }])
//新手礼包弹窗
    .factory('novice', ['serializeUrl', '$state', '$timeout', '$rootScope', '$interval', 'ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function(serializeUrl, $state, $timeout, $rootScope, $interval, ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        return{
            bag:function () {
                var d = "<div id='novicebag' class='Showcbf'><div class='fixedcon'><img src='http://img.778668.cn/img/newcomerbag.png'><div class='items'><p class='tit'></p></div>" +
                    "<div class='queding' id='queding'></div>" +
                    "<div class='back-close'></div></div></div>";
                $('body').append(d);
                $('body').on('click', '#novicebag .back-close', function(e) {
                    $('#novicebag').remove();
                    $('body').off('click', '#novicebag .back-close');
                    return false;
                })
                $('body').on('click', '#novicebag #queding', function(e) {
                    $('#novicebag').remove();
                    $('body').off('click', '#novicebag #queding');
                    $state.go('user.register');
                    return false;
                })
                sessionStorage.setItem('bag','1');
            }
        }
    }])
    //下载
    .factory('downloadapp', ['serializeUrl', '$state', '$timeout', '$rootScope', '$interval', 'ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function(serializeUrl, $state, $timeout, $rootScope, $interval, ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        var download = function() {
            if (UserInfo.l.is_weixn == 'yes') {
                var d = "<div class='Backdrops-new'><img src='http://img.778668.cn/img/index/android.png'><div class='back-close'><a class='icon iconfont icon-tianjia'></a></div></div>";
                $('body').append(d);
                $('body').on('click', '.back-close', function(e) {
                    $('.Backdrops-new').remove();
                    e.stopPropagation();
                    return false;
                })
            }
        }
        var iosguide = function() {
            if (UserInfo.l.is_weixn == 'no') {
                var a = navigator.userAgent;
                if (a.indexOf("iPhone") > -1 && a.indexOf("Version/") > -1 && window.openDatabase) {
                    var d = "<div class='Backdrops-new'><img src='http://img.778668.cn/img/index/safari.png' class='safaris'><div class='back-close'><a class='icon iconfont icon-tianjia'></a></div></div>";
                    $('body').append(d);
                    $('body').on('click', '.back-close', function(e) {
                        $('.Backdrops-new').remove();
                        e.stopPropagation();
                        return false;
                    })
                }
            } else {
                if (UserInfo.l.navigator == "ios") {
                    var d = "<div class='Backdrops-new'><img src='http://img.778668.cn/img/index/ios.png'><div class='back-close'><a class='icon iconfont icon-tianjia'></a></div></div>";
                } else {
                    var d = "";
                }
                $('body').append(d);
                $('body').on('click', '.back-close', function(e) {
                    $('.Backdrops-new').remove();
                    e.stopPropagation();
                    return false;
                })
            }
        }
        var isweixin = UserInfo.l.is_weixn;
        return {
            androidDow: function() {
                var jsondata = serializeUrl.url(location.href);
                var pid = jsondata.param.pid || '';
                var account = jsondata.param.account || UserInfo.l.account || '';
                if (pid) {
                    var parameter = 'pid=' + pid + '&account=' + account;
                } else {
                    var parameter = 'account=' + account;
                }
                var durl = ApiEndpoint.url + '/download/apk?' + parameter;
                return durl;
            },
            //android下载apk指引
            showdownload: function() {
                download();
            },
            //ios落地指引显示
            showioszhiyin: function() {
                    iosguide();
                }
                //$scope.download();
        }
    }])
    //公用http一般请求
    .factory('httpcom', ['$state', '$timeout', '$rootScope', '$interval', 'ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function($state, $timeout, $rootScope, $interval, ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        $rootScope.noiicemsg = [];
        var msgread = function(id, status) {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/usr/msg/read",
                data: {
                    token: UserInfo.l.token,
                    id: id,
                    status: status
                }
            }).success(function(data) {

            }).error(function() {
                $interval.cancel($rootScope.clearmsgact);
            })
        }
        var toDecimal2 = function(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(x * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return s;
        }

        function shuffle(inputArr) {
            var valArr = [],
                k = '';

            for (k in inputArr) { // Get key and value arrays
                if (inputArr.hasOwnProperty(k)) {
                    valArr.push(inputArr[k]);
                }
            }
            valArr.sort(function() {
                return 0.5 - Math.random();
            });

            return valArr;
        }
        return {
            //消息系统
            msgact: function() {
                var defer = $q.defer();
                //$ionicLoading.show({content: 'Loading', duration: 30000})
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/usr/msg/act",
                    data: {
                        token: UserInfo.l.token
                    }
                }).success(function(data) {
                    //console.log($(document.body).width() * 1.10666);
                    defer.resolve(data);
                    if(!data.data[0]){
                        return false;
                    }
                    if (data.status == 1 && data.data[0].act == 'POP') {
                        if (!data.data[0]) {
                            return false;
                        }
                        //console.log(data.data[0].items.length);
                        //console.log(data.data[0].items[0]);
                        var itemslenn = data.data[0].items.length;
                        var items = data.data[0].items;
                        var item = data.data[0].items[0];
                        if (item.mt == 'ZJ') {
                            var imgurl = 'http://img.778668.cn/img/index/zjpop.png';
                            var conten = toDecimal2(item.money) + '元';
                            var altfont = ' fontsize72';
                        } else if (item.mt == 'TP') {
                            var imgurl = 'http://img.778668.cn/img/index/TP.png';
                            var conten = '订单号:' + item.order;
                            var altfont = ' fontsize30';
                        }else if (item.mt == 'SYS') {
                            var imgurl = 'http://img.778668.cn/img/index/bagpop.png';
                            var conten = item.content;
                            var altfont = ' fontsize30';
                        }
                        if ($('#msgpop').length > 0) {
                            //$('#msgpop').remove();
                            return false;
                        }
                        var d = "<div class='Showcbf' id='msgpop'><div class='fixedcon'><img src=" + imgurl + "><div class='items'><p class='tit'>" + item.title + "</p><p class='num" + altfont + "'>" + conten + "</p></div>" +
                            "<div class='queding' id='queding'></div>" +
                            "<div class='back-close'></div></div></div>";
                        $('body').append(d);
                        $timeout(function() {
                            //console.log($('.Showcbf .fixedcon .num'));
                            $(".Showcbf .fixedcon").height($(document.body).width() * 1.10666 + 'px');
                            $(".Showcbf .items").css('top', ($(".Showcbf .fixedcon").height() - $(".Showcbf .items").height()) / 1.5);
                        }, 0);
                        $('body').on('click', '#msgpop .back-close', function(e) {
                            $('#msgpop').remove();
                            $('body').off('click', '#msgpop .back-close');
                            if (itemslenn > 1) {
                                var id = '';
                                var reg = /,$/gi;
                                for (var i = 0; i < items.length; i++) {
                                    id += items[i].id + ','
                                }
                                msgread(id.replace(reg, ""), 1);
                            } else {
                                msgread(item.id, 1);
                            }
                            return false;
                        })
                        $('body').on('click', '#msgpop #queding', function(e) {
                            $('#msgpop').remove();
                            $('body').off('click', '#msgpop #queding');
                            if (itemslenn > 1) {
                                var id = '';
                                var reg = /,$/gi;
                                for (var i = 0; i < items.length; i++) {
                                    id += items[i].id + ','
                                }
                                msgread(id.replace(reg, ""), 1);
                                if(item.mt == 'SYS'){
                                    if(item.busObj){
                                        if(item.busObj.bustype=='E_GIFT'){
                                            $state.go('practice.mycouponlist');
                                        }else{
                                            $state.go('message.classifylist',{mt:'SYS'});
                                        }
                                    }else{
                                        $state.go('message.classifylist',{mt:'SYS'});
                                    }
                                } else{
                                    $state.go('practice.detail', { id: item.order, type: 1 });
                                }
                            } else {
                                msgread(item.id, 3);
                                if(item.mt == 'SYS'){
                                    if(item.busObj){
                                        if(item.busObj.bustype=='E_GIFT'){
                                            $state.go('practice.mycouponlist');
                                        }else{
                                            $state.go('message.classifylist',{mt:'SYS'});
                                        }
                                    }else{
                                        $state.go('message.classifylist',{mt:'SYS'});
                                    }
                                } else{
                                    $state.go('practice.detail', { id: item.order, type: 1 });
                                }
                            }
                            return false;
                        })
                    } else if (data.status == 1 && data.data[0].act == 'NOTICE') {
                        //console.log(data.data[0].items);
                        if ($rootScope.noiicemsg.length > 50) {
                            $rootScope.noiicemsg = [];
                        }
                        var list = shuffle(data.data[0].items);
                        for (var g = 0; g < list.length; g++) {
                            $rootScope.noiicemsg.push(list[g]);
                        }
                        //$rootScope.noiicemsg = data.data[0].items;
                        //$interval.cancel($rootScope.clearmsgact);
                    }
                }).error(function() {
                    $interval.cancel($rootScope.clearmsgact);
                })
                return defer.promise;
            },
            msgread: function(id, status) {
                msgread(id, status)
            }
        }
    }])
    //支付调用
    .factory('PayFlow', ['$interval', 'httpcom', '$rootScope', 'ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function($interval, httpcom, $rootScope, ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        var ua = navigator.userAgent.toLowerCase();
        return {
            //计算金额
            money: function(d) {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/betting/money",
                    data: d,
                }).success(function(data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    $ionicLoading.hide();
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            //生成订单
            bill: function(d) {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/betting/bill",
                    data: d,
                }).success(function(data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    defer.resolve(false);
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            //活动订单下单
            follow: function(d) {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/act/lottery/follow",
                    data: d,
                }).success(function(data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    defer.resolve(false);
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            //订单支付
            pay: function(d) {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/wallet/pay",
                    data: d,
                }).success(function(data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                    /* if (data.status == '1') {
                         if (data.data.payresult == 2) {
                             this.charge(data.data);
                         }
                     }*/
                }).error(function() {
                    defer.resolve(false);
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            //订单充值
            charge: function(chdata,pid) {
                //$ionicLoading.show({content: 'Loading', duration: 30000});
                chdata.ctype = 'H5';
                chdata.cvalue = ua;
                chdata.ptype = UserInfo.l.sucpayway;
                if(pid == 0000){
                    chdata.backurl = ApiEndpoint.bacgurl + '/#/user/Paysuccess';
                }else{
                    chdata.backurl = ApiEndpoint.bacgurl + '/#/user/Paysuccess?pid='+pid;
                }
                    //chdata.backurl = ApiEndpoint.bacgurl + '/#/practice/newsyxw/10',
                    chdata.token = UserInfo.l.token || '';
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/wallet/charge",
                    data: chdata,
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        window.location.href = data.data.h5Charge.url + '?' + data.data.h5Charge.parmkvs;
                    }
                })
            },
            login: function(ld) {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/auth/login',
                    data: ld,
                }).success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == '1') {
                        UserInfo.add('flag', '1');
                        var n = UserInfo.l.msginterval * 1000 || '30000';
                        /*httpcom.msgact();
                        $rootScope.clearmsgact = $interval(function() {
                            httpcom.msgact();
                        }, n)*/
                        defer.resolve(data);
                    }
                }).error(function(data) {
                    defer.resolve(false);
                    $ionicLoading.hide();
                });
                return defer.promise;
            }
        }
    }])
    //正则
    .factory('regularExpression', [function() {
        var phoneReg = /^1[3456789]\d{9}$/;
        var nullReg = /(^$)|(^\s{1,}$)|(^null$)/;
        var passWordReg = /^[A-Za-z0-9_]{6,12}$/;
        var bankCardNumReg = /^(\d{16}|\d{19})$/;
        var strLengthReg = /^\d{4}$/;
        return {
            phoneRegFun: function() {
                return phoneReg;
            },
            nullRegFun: function() {
                return nullReg;
            },
            passWordRegFun: function() {
                return passWordReg;
            },
            bankCardNumRegFun: function() {
                return bankCardNumReg;
            },
            strLengthRegFun: function() {
                return strLengthReg;
            },
        };
    }])
    //http状态处理
    .factory('HttpStatus', ['$ionicLoading', '$q', 'browser', 'showAlertMsg', '$http', '$state', 'UserInfo', 'ApiEndpoint', 'serializeUrl', function($ionicLoading, $q, browser, showAlertMsg, $http, $state, UserInfo, ApiEndpoint, serializeUrl) {
        var jsondata = serializeUrl.url(location.href);
        var pid = jsondata.param.pid || '';
        if (jsondata.param.ctype) {
            var ctype = jsondata.param.ctype;
        } else if (UserInfo.l.is_weixn == 'yes') {
            var ctype = 'H5WX';
        } else {
            var ctype = 'H5';
        }
        var gate = function() {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/zq/gate",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                if (data.status == '1') {
                    var jsongate = JSON.stringify(data.data);
                    UserInfo.add('jsongate', jsongate);
                }
            })
        };
        var zqlist = function() {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/zq/list",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                if (data.status == '1') {
                    var jsondata = JSON.stringify(data.data);
                    UserInfo.add('jsondatazq', jsondata);
                }
            })
        };
        var settinggat = function() {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/setting/get",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                if (data.status == '1') {
                    UserInfo.add('guid', data.data.guid);
                    UserInfo.add('msginterval', data.data.msginterval);
                    UserInfo.add('popwin', data.data.popwin);
                    UserInfo.add('bagreg', data.data.giftopen.reg);
                    UserInfo.add('exchange', JSON.stringify(data.data.exchange));
                }
            })
        };
        return {
            codedispose: function(data) {
                var status = data.status;
                if (status == 0) {
                    if (data.msg) {
                        showAlertMsg.showMsgFun('温馨提示', data.msg);
                    } else {
                        showAlertMsg.showMsgFun('温馨提示', '网络繁忙，请稍后再试');
                    }
                } else if (status == 100) {
                    window.localStorage.removeItem('flag');
                    window.localStorage.removeItem('bank');
                    window.localStorage.removeItem('money');
                    window.localStorage.removeItem('vmoney');
                    window.localStorage.removeItem('gcoin');
                    //showAlertMsg.showMsgFun('未登录','请登录');
                    $state.go('user.login');
                } else if (status == 2) {
                    $http({
                        method: 'post',
                        url: ApiEndpoint.url + '/init',
                        data: {
                            token: UserInfo.l.token || '',
                            pid: pid,
                            ctype: ctype,
                        },
                    }).success(function(data) {
                        UserInfo.add('token', data.data);
                        //UserInfo.add('guid', data.data.guid);
                    })
                } else if (status == 200) {
                    showAlertMsg.showMsgFun('余额不足', '请充值');
                } else if (status == 3) {
                    showAlertMsg.showMsgFun('警告', 'null');
                }
            },
            getinit: function() {
                var defer = $q.defer();
                if (jsondata.param.account && jsondata.param.account != 'null') {
                    console.log(jsondata.param.account);
                    UserInfo.add('account', jsondata.param.account);
                }
                /* var sjjj = 'sss27ss982'
                 console.log(sjjj.replace(/[^0-9]/ig,""))*/
                //console.log(jsondata);
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/init',
                    data: {
                        token: UserInfo.l.token || '',
                        pid: pid,
                        ctype: ctype,
                    },
                }).success(function(data) {
                    if (data.status == '1') {
                        UserInfo.add('token', data.data);
                        if (browser.is_weixn == 'yes') {
                            UserInfo.add('sucpayway', 'WX');
                        }
                        gate();
                        settinggat();
                        //zqlist();
                    } else if (data.status == '100') {
                        showAlertMsg.showMsgFun('提示', '请重新登录');
                        //UserInfo.l.clear();
                    }
                    defer.resolve(data);
                })
                return defer.promise;
            },
            getgate: function() {
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/match/zq/gate",
                    data: {
                        token: UserInfo.l.token
                    }
                }).success(function(data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function() {
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            myinfo: function() {
                var defer = $q.defer();
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/usr/myinfo",
                    data: {
                        token: UserInfo.l.token
                    },
                }).success(function(data) {
                    defer.resolve(data);
                    if (data.status == '1') {
                        UserInfo.save(data.data);
                        if (browser.is_weixn == 'yes') {
                            UserInfo.add('sucpayway', 'WX');
                        } else {
                            UserInfo.add('sucpayway', UserInfo.l.sucpayway);
                        }
                    }
                }).error(function() {
                    defer.resolve(false);
                })
                return defer.promise;
            },
            zqlist: function(){
                var defer = $q.defer();
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/match/zq/list",
                    data: {
                        token: UserInfo.l.token
                    }
                }).success(function(data) {
                    defer.resolve(data);
                    if (data.status == '1') {
                        var jsondata = JSON.stringify(data.data);
                        UserInfo.add('jsondatazq', jsondata);
                        UserInfo.add('jsondatazqtime', new Date().getTime());
                        $ionicLoading.hide();
                    }
                })
                return defer.promise;
            },
            getsetting: function(){
                var defer = $q.defer();
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/setting/get",
                    data: {
                        token: UserInfo.l.token
                    }
                }).success(function(data) {
                    defer.resolve(data);
                    if (data.status == '1') {
                        UserInfo.add('guid', data.data.guid);
                        UserInfo.add('msginterval', data.data.msginterval);
                        UserInfo.add('popwin', data.data.popwin);
                        UserInfo.add('bagreg', data.data.giftopen.reg);
                        UserInfo.add('exchange', JSON.stringify(data.data.exchange));
                    }
                })
                return defer.promise;
            },
        }
    }])
    //弹窗
    .factory('showAlertMsg', ['$ionicPopup', '$state', '$ionicScrollDelegate', '$timeout', '$ionicPopover', function($ionicPopup, $state, $ionicScrollDelegate, $timeout, $ionicPopover) {
        return {
            showMsgFun: function(title, txt, jump) {
                //定义按钮文字
                var buttonText = [{ text: '关闭' }];
                //注册成功弹窗没有按钮，2秒自动关闭
                if (jump == 'PostAddUser') {
                    buttonText = null;
                    $timeout(function() {
                        myPopup.close();
                    }, 2000);
                }
                var myPopup = $ionicPopup.show({
                    template: txt,
                    title: title,
                    buttons: buttonText,
                    scope: ''
                });
            },
            showProject: function(txt) {
                var template = '<ion-popover-view style = "background-color:#f05244 !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
                var popover = $ionicPopover.fromTemplate(template)
                popover.show();
                $timeout(function() {
                    popover.hide();
                }, 2000);
            }
        }
    }])
    .factory('Flottery', [function() {
        return {
            //胜负平赛选
            spf: function(games) {
                var data = {};
                if (games.spf.bettingList) {
                    for (var k = 0; k < games.spf.bettingList.length; k++) {
                        if (games.spf.bettingList[k].name == '胜') {
                            data.s = games.spf.bettingList[k].rate;
                        } else if (games.spf.bettingList[k].name == '平') {
                            data.p = games.spf.bettingList[k].rate;
                        } else if (games.spf.bettingList[k].name == '负') {
                            data.f = games.spf.bettingList[k].rate;
                        }
                    }
                }
                data.spfdanOpen = games.spf.danOpen;
                data.spfmultiOpen = games.spf.multiOpen;
                return data;
            },
            //让球胜平负
            rspf: function(games) {
                var data = {};
                if (games.rspf.bettingList) {
                    for (var k = 0; k < games.rspf.bettingList.length; k++) {
                        if (games.rspf.bettingList[k].name == '胜') {
                            data.rs = games.rspf.bettingList[k].rate;
                        } else if (games.rspf.bettingList[k].name == '平') {
                            data.rp = games.rspf.bettingList[k].rate;
                        } else if (games.rspf.bettingList[k].name == '负') {
                            data.rf = games.rspf.bettingList[k].rate;
                        }
                    }
                }
                data.rspfdanOpen  = games.rspf.danOpen;
                data.rspfmultiOpen = games.rspf.multiOpen;
                data.lose = games.rspf.lose;
                return data;
            },
            //半全场
            bqc: function(games) {
                var data = {};
                if (games.bqc.bettingList) {
                    for (var k = 0; k < games.bqc.bettingList.length; k++) {
                        if (games.bqc.bettingList[k].name == '胜胜') {
                            data.ss = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '胜平') {
                            data.sp = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '胜负') {
                            data.sf = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '平胜') {
                            data.ps = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '平平') {
                            data.pp = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '平负') {
                            data.pf = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '负胜') {
                            data.fs = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '负平') {
                            data.fp = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '负负') {
                            data.ff = games.bqc.bettingList[k].rate;
                        }
                    }
                }
                data.bqcdanOpen = games.bqc.danOpen;
                data.bqcmultiOpen = games.bqc.multiOpen;
                return data;
            },
            //猜比分
            cbf: function(games) {
                var data = {};
                if (games.cbf.bettingList) {
                    var g = games.cbf.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].name) {
                            case '1:0':
                                data.ovz = g[k].rate;
                                break;
                            case '2:0':
                                data.tvz = g[k].rate;
                                break;
                            case '2:1':
                                data.tvo = g[k].rate;
                                break;
                            case '3:0':
                                data.ttvz = g[k].rate;
                                break;
                            case '3:1':
                                data.ttvo = g[k].rate;
                                break;
                            case '3:2':
                                data.ttvt = g[k].rate;
                                break;
                            case '4:0':
                                data.fvz = g[k].rate;
                                break;
                            case '4:1':
                                data.fvo = g[k].rate;
                                break;
                            case '4:2':
                                data.fvt = g[k].rate;
                                break;
                            case '5:0':
                                data.ffvz = g[k].rate;
                                break;
                            case '5:1':
                                data.ffvo = g[k].rate;
                                break;
                            case '5:2':
                                data.ffvt = g[k].rate;
                                break;
                            case '胜其它':
                                data.sqt = g[k].rate;
                                break;
                            case '0:0':
                                data.zvz = g[k].rate;
                                break;
                            case '1:1':
                                data.ovo = g[k].rate;
                                break;
                            case '2:2':
                                data.tvt = g[k].rate;
                                break;
                            case '3:3':
                                data.ttvtt = g[k].rate;
                                break;
                            case '平其它':
                                data.pqt = g[k].rate;
                                break;
                            case '0:1':
                                data.zvo = g[k].rate;
                                break;
                            case '0:2':
                                data.zvt = g[k].rate;
                                break;
                            case '1:2':
                                data.ovt = g[k].rate;
                                break;
                            case '0:3':
                                data.ovtt = g[k].rate;
                                break;
                            case '1:3':
                                data.ovtt = g[k].rate;
                                break;
                            case '2:3':
                                data.tvtt = g[k].rate;
                                break;
                            case '0:4':
                                data.zvf = g[k].rate;
                                break;
                            case '1:4':
                                data.ovf = g[k].rate;
                                break;
                            case '2:4':
                                data.tvf = g[k].rate;
                                break;
                            case '0:5':
                                data.zvff = g[k].rate;
                                break;
                            case '1:5':
                                data.ovff = g[k].rate;
                                break;
                            case '2:5':
                                data.tvff = g[k].rate;
                                break;
                            case '负其它':
                                data.fqt = g[k].rate;
                                break;
                        }
                    }
                }
                data.cbfdanOpen = games.cbf.danOpen;
                data.cbfmultiOpen = games.cbf.multiOpen;
                return data;
            },
            //进球数
            jqs: function(games) {
                var data = {};
                if (games.jqs.bettingList) {
                    var g = games.jqs.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].name) {
                            case '0球':
                                data.fzero = g[k].rate;
                                break;
                            case '1球':
                                data.fone = g[k].rate;
                                break;
                            case '2球':
                                data.ftwo = g[k].rate;
                                break;
                            case '3球':
                                data.fthree = g[k].rate;
                                break;
                            case '4球':
                                data.ffour = g[k].rate;
                                break;
                            case '5球':
                                data.ffive = g[k].rate;
                                break;
                            case '6球':
                                data.fsix = g[k].rate;
                                break;
                            case '7+球':
                                data.fseven = g[k].rate;
                                break;
                        }
                    }
                }
                data.jqsdanOpen = games.jqs.danOpen;
                data.jqsmultiOpen = games.jqs.multiOpen;
                return data;
            }
        }
    }])
    //篮球数组
    .factory('BasketbalLlist', [function() {
        return {
            //胜负平赛选
            sf: function(games) {
                var data = {};
                if (games.sf.bettingList) {
                    for (var k = 0; k < games.sf.bettingList.length; k++) {
                        if (games.sf.bettingList[k].name == '胜') {
                            data.s = games.sf.bettingList[k].rate;
                        } else if (games.sf.bettingList[k].name == '负') {
                            data.f = games.sf.bettingList[k].rate;
                        }
                    }
                }
                data.sfdanOpen = games.sf.danOpen;
                data.sfmultiOpen = games.sf.multiOpen;
                return data;
            },
            //让球胜平负
            rfsf: function(games) {
                var data = {};
                if (games.rfsf.bettingList) {
                    for (var k = 0; k < games.rfsf.bettingList.length; k++) {
                        if (games.rfsf.bettingList[k].name == '胜') {
                            data.rs = games.rfsf.bettingList[k].rate;
                        } else if (games.rfsf.bettingList[k].name == '负') {
                            data.rf = games.rfsf.bettingList[k].rate;
                        }
                    }
                }
                data.rfsfdanOpen = games.rfsf.danOpen;
                data.rfsfmultiOpen = games.rfsf.multiOpen;
                data.lose = games.rfsf.lose;
                return data;
            },
            //胜分差
            sfc: function(games) {
                var data = {};
                if (games.sfc.bettingList) {
                    var g = games.sfc.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].id) {
                            case 0:
                                data.zero = g[k].rate;
                                break;
                            case 1:
                                data.one = g[k].rate;
                                break;
                            case 2:
                                data.two = g[k].rate;
                                break;
                            case 3:
                                data.three = g[k].rate;
                                break;
                            case 4:
                                data.four = g[k].rate;
                                break;
                            case 5:
                                data.five = g[k].rate;
                                break;
                            case 6:
                                data.six = g[k].rate;
                                break;
                            case 7:
                                data.seven = g[k].rate;
                                break;
                            case 8:
                                data.eight = g[k].rate;
                                break;
                            case 9:
                                data.nine = g[k].rate;
                                break;
                            case 10:
                                data.ten = g[k].rate;
                                break;
                            case 11:
                                data.eleven = g[k].rate;
                                break;
                        }
                    }
                }
                data.sfcdanOpen = games.sfc.danOpen;
                data.sfcmultiOpen = games.sfc.multiOpen;
                data.sfcopen = games.sfc.open;
                return data;
            },
            //大小分
            dxf: function(games) {
                var data = {};
                if (games.dxf.bettingList) {
                    var g = games.dxf.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].id) {
                            case 0:
                                data.dy = g[k].rate;
                                break;
                            case 1:
                                data.xy = g[k].rate;
                                break;
                        }
                    }
                }
                data.dxfdanOpen = games.dxf.danOpen;
                data.dxfmultiOpen = games.dxf.multiOpen;
                data.zlose = games.dxf.zlose;
                return data;
            }
        }
    }])

//数据保存
.factory('myFactory', [function() {
        //定义参数对象
        var myObject = {};

        /**
         * 定义传递数据的setter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _setter = function(data) {
            myObject = data;
        };

        /**
         * 定义获取数据的getter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _getter = function() {
            return myObject;
        };

        // Public APIs
        // 在controller中通过调setter()和getter()方法可实现提交或获取参数的功能
        return {
            setter: _setter,
            getter: _getter
        };
    }])
    /*赛事筛选,及赛事数据处理*/
    .factory('Match', ['$q','HttpStatus','UserInfo', 'Flottery', '$timeout', 'Chats', 'BasketbalLlist', function($q,HttpStatus,UserInfo, Flottery, $timeout, Chats, BasketbalLlist) {
        //按时间分类赛事
        var TimeSort = function(arr) {
            var map = new Object();
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                // /console.log(item.gameid);
                if(item.gameid.substring(0, 2)==20){
                    var time = item.gameid.substring(0, 8);
                }else{
                    var time = item.gameid.substring(0, 6);
                }
                //console.log(item.gametime);
                if (!map[time]) {
                    var array = new Array();
                    array.push(item);
                    map[time] = { time: time, file: array };
                } else {
                    var temp = map[time];
                    temp.file.push(item);
                    map[time] = temp;
                }
            }
            var resultArray = new Array();
            for (var key in map) {
                resultArray.push(map[key]);
            }
            resultArray = resultArray.sort(function(a, b) {
                return Date.parse(a.time) - Date.parse(b.time); //时间正序
            });
            var resultArray1 = [];
            for (var j in resultArray) {
                resultArray[j].file.sort(function(a, b) {
                    return a.gameid - b.gameid; //时间正序
                });
            }
            return resultArray;
        };
        return {

            //type选号页面数据标识-足球
            MatchFilter: function(index, type) {
                if (typeof Object.assign != 'function') {
                    Object.assign = function(target) {
                        'use strict';
                        if (target == null) {
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        target = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source != null) {
                                for (var key in source) {
                                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                                        target[key] = source[key];
                                    }
                                }
                            }
                        }
                        return target;
                    };
                }
                var list = JSON.parse(UserInfo.l.jsondatazq);
                var Mannerlist = [];
                //console.log(list);
                for (var i = 0; i < list.length; i++) {
                    var games = list[i].games;
                    var arry1 = {};
                    for (var j = 0; j < games.length; j++) {
                        //console.log(games[j]);
                        arry1 = {
                            gameid: games[j].gameid,
                            gname: games[j].gname,
                            hname: games[j].hname,
                            matchname: games[j].matchname,
                            gameid: games[j].gameid,
                            endsale: games[j].endsale.substring(11, 16),
                            gametime: games[j].gametime,
                            gamename: games[j].gamename,
                        }
                        //console.log(games[j].moregateopen);
                        if (index == 1 || index == 7) {
                            arry1 = Object.assign(arry1, Flottery.spf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 2 || index == 8) {
                            arry1 = Object.assign(arry1, Flottery.rspf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 3 || index == 9) {
                            arry1 = Object.assign(arry1, Flottery.bqc(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 4 || index == 10) {
                            arry1 = Object.assign(arry1, Flottery.cbf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 5 || index == 11) {
                            arry1 = Object.assign(arry1, Flottery.jqs(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 6 || index == 12) {
                            arry1 = Object.assign(arry1, Flottery.spf(games[j]), Flottery.rspf(games[j]), Flottery.bqc(games[j]), Flottery.cbf(games[j]), Flottery.jqs(games[j]));
                            Mannerlist.push(arry1);
                        }
                    }
                }
                if (type == 2) {
                    return Mannerlist;
                } else {
                    return TimeSort(Mannerlist);
                }
            },

            //type投注付款页面数据标识-足球
            MatchFilterpay: function(index, type) {
                var defer = $q.defer();
                if (typeof Object.assign != 'function') {
                    Object.assign = function(target) {
                        'use strict';
                        if (target == null) {
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        target = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source != null) {
                                for (var key in source) {
                                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                                        target[key] = source[key];
                                    }
                                }
                            }
                        }
                        return target;
                    };
                }
                var zqbet = function () {
                    var list = JSON.parse(UserInfo.l.jsondatazq);
                    var Mannerlist = [];
                    //console.log(list);
                    for (var i = 0; i < list.length; i++) {
                        var games = list[i].games;
                        var arry1 = {};
                        for (var j = 0; j < games.length; j++) {
                            //console.log(games[j]);
                            arry1 = {
                                gameid: games[j].gameid,
                                gname: games[j].gname,
                                hname: games[j].hname,
                                matchname: games[j].matchname,
                                gameid: games[j].gameid,
                                endsale: games[j].endsale.substring(11, 16),
                                gametime: games[j].gametime,
                                gamename: games[j].gamename,
                            }
                            //console.log(games[j].moregateopen);
                            if (index == 1 || index == 7) {
                                arry1 = Object.assign(arry1, Flottery.spf(games[j]));
                                Mannerlist.push(arry1);
                            } else if (index == 2 || index == 8) {
                                arry1 = Object.assign(arry1, Flottery.rspf(games[j]));
                                Mannerlist.push(arry1);
                            } else if (index == 3 || index == 9) {
                                arry1 = Object.assign(arry1, Flottery.bqc(games[j]));
                                Mannerlist.push(arry1);
                            } else if (index == 4 || index == 10) {
                                arry1 = Object.assign(arry1, Flottery.cbf(games[j]));
                                Mannerlist.push(arry1);
                            } else if (index == 5 || index == 11) {
                                arry1 = Object.assign(arry1, Flottery.jqs(games[j]));
                                Mannerlist.push(arry1);
                            } else if (index == 6 || index == 12) {
                                arry1 = Object.assign(arry1, Flottery.spf(games[j]), Flottery.rspf(games[j]), Flottery.bqc(games[j]), Flottery.cbf(games[j]), Flottery.jqs(games[j]));
                                Mannerlist.push(arry1);
                            }
                        }
                    }
                    if (type == 2) {
                        return Mannerlist;
                    } else {
                        return TimeSort(Mannerlist);
                    }
                }
                if(UserInfo.l.jsondatazq && new Date().getTime()-UserInfo.l.jsondatazqtime<10*60*1000){
                    defer.resolve(zqbet());
                }else{
                    HttpStatus.zqlist().then(function () {
                        defer.resolve(zqbet());
                    });
                }
                return defer.promise;
            },
            //type投注页面数据标识-篮球
            Matchbasball: function(index, type) {
                if (typeof Object.assign != 'function') {
                    Object.assign = function(target) {
                        'use strict';
                        if (target == null) {
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        target = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source != null) {
                                for (var key in source) {
                                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                                        target[key] = source[key];
                                    }
                                }
                            }
                        }
                        return target;
                    };
                }
                var list = JSON.parse(UserInfo.l.jsondatalq);
                var Mannerlist = [];
                for (var i = 0; i < list.length; i++) {
                    var games = list[i].games;
                    var arry1 = {};
                    for (var j = 0; j < games.length; j++) {
                        //console.log(games[j]);
                        arry1 = {
                            gameid: games[j].gameid,
                            gname: games[j].gname,
                            hname: games[j].hname,
                            matchname: games[j].matchname,
                            gameid: games[j].gameid,
                            endsale: games[j].endsale.substring(11, 16),
                            gametime: games[j].gametime,
                            gamename: games[j].gamename,
                            moregateopen: games[j].moregateopen,
                            onegateopen: games[j].onegateopen,
                        }
                        if (index == 1 || index == 7) {
                            arry1 = Object.assign(arry1, BasketbalLlist.sf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 2 || index == 8) {
                            arry1 = Object.assign(arry1, BasketbalLlist.rfsf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 3 || index == 9) {
                            arry1 = Object.assign(arry1, BasketbalLlist.sfc(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 4 || index == 10) {
                            arry1 = Object.assign(arry1, BasketbalLlist.dxf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 5 || index == 11) {
                            arry1 = Object.assign(arry1, BasketbalLlist.sf(games[j]), BasketbalLlist.rfsf(games[j]), BasketbalLlist.sfc(games[j]), BasketbalLlist.dxf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 6 || index == 12) {}
                        //console.log(Mannerlist);
                    }
                }
                //console.log(Mannerlist)
                if (type == 2) {
                    return Mannerlist;
                } else {
                    return TimeSort(Mannerlist);
                }
            },
            //提交赛事数据拼接
            datatreatment: function(Pass) {
                var p = Pass;
                var str = ''
                for (var i = 0; i < Pass.length; i++) {
                    str += Pass[i].gameid + ':' + Pass[i].bettingid + ':' + Pass[i].resultid + ',';
                }
                return str;
            },
            //数组去重
            unique: function(arr) {
                var re = [arr[0]];
                for (var i = 1; i < arr.length; i++) {
                    if (arr[i] !== re[re.length - 1]) {
                        re.push(arr[i]);
                    }
                }
                return re;
            },
            //hash数组去重
            hashunique: function(array) {
               var unique = {};
                array.forEach(function (item) {
                   unique[JSON.stringify(item)] = item;//重复的对象会被覆盖
               })
                array = Object.keys(unique).map(function (data) {
                    return JSON.parse(data);
                })
                return array;
            },
            //猜比分投注页面数据展示
            result: function(list, data) {
                var l = list;
                var d = data;
                var arry1 = [];
                for (var i = 0; i < l.length; i++) {
                    var result = '';
                    for (var j = 0; j < d.length; j++) {
                        if (l[i].gameid == d[j].gameid) {
                            result += d[j].result + " ";
                        }
                    }
                    l[i].result = result;
                    arry1.push(l[i]);
                }
                return arry1;
            },
            //猜比分已选赛事计算
            countsession: function(array, indextype) {
                var len = array.length;
                var a = '';
                for (var i = 0; i < array.length - 1; i++) {
                    for (var j = i + 1; j < array.length; j++) {
                        var num = array[i];
                        if (array[j].gameid == num.gameid) {
                            // 重复，数组总长度减1
                            len--;
                            i++;
                        }
                    }
                }
                if (len < 2 && indextype <= 6) {
                    a = '请至少选择两场比赛';
                } else if (len < 1 && indextype > 6) {
                    a = '请至少选择一场比赛';
                } else {
                    a = '已选择' + len + '场比赛';
                }
                return a;
            },
            //选择页面猜比分已选奖项渲染
            cbfselected: function(cbf) {
                var a = $('.betbtns');
                for (var i = 0; i < a.length; i++) {
                    if (cbf.result.indexOf($(a[i]).find('span').first().text()) != -1) {
                        $(a[i]).toggleClass('ssss');
                    }
                }
            },
            //投注页面猜比分已选奖项渲染
            cbfbetting: function(pass) {
                var b = $('.Showcbf .betbtns');
                $timeout(function() {
                    for (var s = 0; s < pass.length; s++) {
                        for (var k = 0; k < b.length; k++) {
                            if (pass[s].gameid == b[k].getAttribute('data-gameid') && pass[s].resultid == b[k].getAttribute('data-resultid') && pass[s].bettingid == b[k].getAttribute('data-bettingid')) {
                                if (!$(b[k]).hasClass('ssss')) {
                                    $(b[k]).addClass('ssss');
                                }
                                break;
                            }
                        }
                    }
                }, 0)
            },
            //混合投注弹出窗已选奖项渲染
            hhselected: function(hh) {
                var pass = hh;
                var c = Chats.rtrim(pass.result);
                var d = Chats.rtrim(pass.resbettingid);
                var e = Chats.rtrim(pass.resresultid);
                $timeout(function() {
                    var b = $('.Showcbf .betbtns');
                    for (var s = 0; s < c.length; s++) {
                        for (var k = 0; k < b.length; k++) {
                            if (pass.gameid == b[k].getAttribute('data-gameid') && e[s] == b[k].getAttribute('data-resultid') && d[s] == b[k].getAttribute('data-bettingid')) {
                                $(b[k]).addClass('ssss');
                                break;
                            }
                        }
                    }
                }, 2)
            },
            //混合页面已选奖项渲染
            hhpageselected: function(hh) {
                var pass = hh;
                var d = [];
                var e = [];
                var gameid = [];
                for (var s = 0; s < pass.length; s++) {
                    for (var g = 0; g < pass[s].file.length; g++) {
                        if (pass[s].file[g].resbettingid != undefined && pass[s].file[g].resbettingid != '') {
                            d.push(pass[s].file[g].resbettingid);
                            e.push(pass[s].file[g].resresultid);
                            gameid.push(pass[s].file[g].gameid);
                        }
                    }
                }
                var dd = [];
                var ee = [];
                var gg = [];
                for (var i = 0; i < d.length; i++) {
                    dd.push(Chats.rtrim(d[i]));
                    ee.push(Chats.rtrim(e[i]));
                }
                $timeout(function() {
                    var b = $('.betbtns');
                    for (var kk = 0; kk < b.length; kk++) {
                        $(b[kk]).removeClass('ssss');
                    }
                    for (var ii = 0; ii < dd.length; ii++) {
                        for (var gim = 0; gim < dd[ii].length; gim++) {
                            for (var k = 0; k < b.length; k++) {
                                if (gameid[ii] == b[k].getAttribute('data-gameid') && ee[ii][gim] == b[k].getAttribute('data-resultid') && dd[ii][gim] == b[k].getAttribute('data-bettingid')) {
                                    $(b[k]).addClass('ssss');
                                    break;
                                }
                            }
                        }
                    }

                }, 2)
            },
            //混合投注已选赛事提取
            fructus: function(hh) {
                var pass = hh;
                var d = [];
                var e = [];
                var r = [];
                var gameid = [];
                for (var s = 0; s < pass.length; s++) {
                    for (var g = 0; g < pass[s].file.length; g++) {
                        if (pass[s].file[g].resbettingid != undefined && pass[s].file[g].resbettingid != '') {
                            d.push(pass[s].file[g].resbettingid);
                            e.push(pass[s].file[g].resresultid);
                            gameid.push(pass[s].file[g].gameid);
                            r.push(pass[s].file[g].result);
                        }
                    }
                }
                var dd = [];
                var ee = [];
                var gg = [];
                for (var i = 0; i < d.length; i++) {
                    dd.push(Chats.rtrim(d[i]));
                    ee.push(Chats.rtrim(e[i]));
                    gg.push(Chats.rtrim(r[i]));
                }
                var arry1 = [];
                for (var ii = 0; ii < dd.length; ii++) {
                    for (var gim = 0; gim < dd[ii].length; gim++) {
                        var obj = {}; //场次
                        obj.gameid = gameid[ii];
                        obj.bettingid = dd[ii][gim];
                        obj.resultid = ee[ii][gim];
                        obj.result = gg[ii][gim];
                        arry1.push(obj);
                    }
                }
                //console.log(arry1);
                return arry1;
            },
            //猜比分已选结果数据获取
            resultacquire: function(list) {
                var l = list;
                for (var i in l) {
                    for (var j = 0; j < l[i].file.length; j++) {
                        if (l[i].file[j].result != undefined && l[i].file[j].result != '') {
                            //console.log(l[i].file[j]);
                        }
                    }
                }
            },
            //猜比分提交数据获取处理
            splicearry1: function(spcbf) {
                var data = spcbf;
                var resultobj = {};
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].length; j++) {
                        resultobj[data[i][j]['gameid']] = data[i];
                    }
                }
                var values = []; //定义一个数组用来接受value
                for (var key in resultobj) {
                    values.push(resultobj[key]); //取得value
                }
                var arry1 = [];
                for (var j = 0; j < values.length; j++) {
                    for (var g = 0; g < values[j].length; g++) {
                        arry1.push(values[j][g]);
                    }
                }
                return arry1;
            },
            //混合投注投注选择
            hhjsondata: function(t, list) {
                var a = t.parents('.match-list').index();
                var b = t.parents('.match-item').index() - 1;
                if (list[a].file[b].result == undefined || list[a].file[b].result == '') {
                    var c = [];
                    var d = [];
                    var e = [];
                } else {
                    var c = Chats.rtrim(list[a].file[b].result);
                    var d = Chats.rtrim(list[a].file[b].resbettingid);
                    var e = Chats.rtrim(list[a].file[b].resresultid);
                }
                var f = t.data('bettingid');
                var g = t.data('resultid');
                var h = $(t).find('span').first().text();
                var tf = false;
                var cc = '';
                var dd = '';
                var ee = '';
                if (!t.hasClass('ssss')) {
                    for (var i = 0; i < c.length; i++) {
                        if (d[i] == f && e[i] == g) {
                            tf = true;
                            c.splice(i, 1);
                            d.splice(i, 1);
                            e.splice(i, 1);
                            break;
                        }
                    }
                    //console.log(c,d,e);
                } else {
                    c.push(h);
                    d.push(f);
                    e.push(g);
                }
                for (var j = 0; j < c.length; j++) {
                    cc += c[j] + " ";
                    dd += d[j] + " ";
                    ee += e[j] + " ";
                }
                list[a].file[b].result = cc;
                list[a].file[b].resbettingid = dd;
                list[a].file[b].resresultid = ee;
                //console.log(list);
                return list;
            }
        }
    }])
    //投注页面处理
    .factory('Bettingpage', [function() {
        //获取选择过关方式
        var bianli = function() {
            var span = $('.methods-con span');
            var arry = [];
            for (var i = 0; i < span.length; i++) {
                var a = {};
                if ($(span[i]).hasClass('ott-img')) {
                    a.id = $(span[i]).data('connect');
                    a.gatename = $(span[i]).text();
                    arry.push(a);
                };
            }
            return arry;
        }
        return {
            traverse: function() {
                var a = bianli();
                return a;
            },
            passway: function(a) {
                var s = '';
                for (var j = 0; j < a.length; j++) {
                    s += a[j].id + ',';
                }
                return s;
            }
        }

    }])
    .factory('Chats', [function() {
        function overlap(arr, arr2) {
            var arr3 = new Array();
            var index = 0,
                i = 0,
                j = 0;
            for (i = 0; i < arr.length; i++) {
                var has = false;
                if (arr[i].gameid == arr2.gameid) {
                    has = true;
                }
                if (!has) {
                    arr3[index++] = arr[i];
                }
            }
            return arr3;
        };
        return {
            //删除赛事投注方案处理
            deletPassdata: function(l, p) {
                return overlap(p, l);
            },

            //删除赛事list数组处理
            remove: function(chat, chats) {
                chats.splice(chats.indexOf(chat), 1);
                return chats;
            },
            removeindex: function(chat, chats) {
                chats.splice(chat, 1);
                return chats;
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            rtrim: function(s) {
                var arry1 = [];
                var i = s.replace(/(\s*$)/g, "");
                arry1 = i.split(" ");
                return arry1;
            },
            gamefilter: function(l) {
                var obj = '';
                var arry1 = [];
                for (var i = 0; i < l.length; i++) {
                    for (var j = 0; j < l[i].file.length; j++) {
                        if (obj.indexOf(l[i].file[j].matchname) == -1) {
                            obj += l[i].file[j].matchname;
                            arry1.push(l[i].file[j].matchname)
                        }
                    }
                }
                return arry1;
            },
            gamenameQD: function() {
                var li = $('.gamename li');
                var s = '';
                for (var i = 0; i < li.length; i++)
                    if (li[i].className.indexOf('ott-img') != -1) {
                        s += $(li[i]).text() + ',';
                    }
                return s;
            }
        }
    }])
    .factory('History', ['$ionicHistory', '$state', function($ionicHistory, $state) {
        return {
            clear: function(type) {
                if (type == 'zq') {
                    $ionicHistory.clearCache(['practice.Soccerhall', 'practice.basketballhall']).then(function() {
                        $state.go('practice.Soccerhall')
                    })
                } else if (type == 'lq') {
                    $ionicHistory.clearCache(['practice.Soccerhall', 'practice.basketballhall']).then(function() {
                        $state.go('practice.basketballhall');
                    })
                }
            },
            passwayss: function(p, g) {
                var Passway = [];
                if (p > 6) {
                    Passway = [{
                        gatename: "仅支持单关",
                        id: 100
                    }];
                } else {
                    switch (g) {
                        case 1:
                            Passway = [{
                                gatename: "2串1",
                                id: 200
                            }];
                            break;
                        case 2:
                            Passway = [{
                                gatename: "2串1",
                                id: 200
                            }];
                            break;
                        case 3:
                            Passway = [{
                                gatename: "3串1",
                                id: 300
                            }];
                            break;
                        case 4:
                            Passway = [{
                                gatename: "4串1",
                                id: 400
                            }];
                            break;
                        case 5:
                            Passway = [{
                                gatename: "5串1",
                                id: 500
                            }];
                            break;
                        case 6:
                            Passway = [{
                                gatename: "6串1",
                                id: 600
                            }];
                            break;
                        case 7:
                            Passway = [{
                                gatename: "7串1",
                                id: 700
                            }];
                            break;
                        case 8:
                            Passway = [{
                                gatename: "8串1",
                                id: 800
                            }];
                            break;
                        default:
                            Passway = [{
                                gatename: "8串1",
                                id: 800
                            }];
                    }
                }
                return Passway;
            }
        }
    }])
    /*反序列化*/
    .factory('serializeUrl', [function() {
        return {
            url: function(str) {
                var param = {},
                    hash = {},
                    anchor;
                var url = str || location.href;
                var arr = /([^?]*)([^#]*)(.*)/.exec(url);
                var ar1 = /(.*:)?(?:\/?\/?)([\.\w]*)(:\d*)?(.*?)([^\/]*)$/.exec(arr[1]);
                var ar2 = arr[2].match(/[^?&=]*=[^?&=]*/g);
                var ar3 = arr[3].match(/[^#&=]*=[^#&=]*/g);

                if (ar2) {
                    for (var i = 0, l = ar2.length; i < l; i++) {
                        var ar22 = /([^=]*)(?:=*)(.*)/.exec(ar2[i]);
                        param[ar22[1]] = ar22[2];
                    }
                }

                if (ar3) {
                    for (var i = 0, l = ar3.length; i < l; i++) {
                        var ar33 = /([^=]*)(?:=*)(.*)/.exec(ar3[i]);
                        hash[ar33[1]] = ar33[2];
                    }
                }

                if (arr[3] && !/[=&]/g.test(arr[3])) {
                    anchor = arr[3];
                }

                function getUrl() {
                    var that = this,
                        url = [],
                        param = [],
                        hash = [];

                    url.push(that.protocol, that.protocol && '//' || ' ', that.host, that.port, that.path, that.file);

                    for (var p in that.param) {
                        param.push(p + '=' + that.param[p]);
                    }

                    for (var p in that.hash) {
                        hash.push(p + '=' + that.hash[p]);
                    }

                    url.push(param.length && '?' + param.join('&') || ' ');

                    if (that.anchor) {
                        url.push(that.anchor);
                    } else {
                        url.push(hash.length && '#' + hash.join('&') || '');
                    }

                    return url.join(' ');
                }

                return {
                    href: arr[0],
                    protocol: ar1[1],
                    host: ar1[2],
                    port: (ar1[3] || ' '),
                    path: ar1[4],
                    file: ar1[5],
                    param: param,
                    hash: hash,
                    anchor: anchor,
                    getUrl: getUrl
                };
            }
        }
    }])
    /*订单处理*/
    .factory('order', [function() {
        var lotteryid = {
            '1': 'practice.Soccerhall',
            '2': 'practice.basketballhall',
            '3': 'practice.lottery-seven',
            '4': 'practice.plshall',
            '5': 'practice.lottery-seven',
            '6': 'practice.lottery-super',
            '7': 'practice.syxwhall',
            '8': 'practice.syxwhall',
            '9': 'practice.syxwhall',
            '10': 'practice.syxwhall',
            '11': 'practice.lottery-super',
            '12': 'practice.lottery-super',
            '13': 'practice.plshall',
            '20': 'practice.syxwhall',
        }
        var zqarry = {
            SPF: {
                '3': '胜',
                '1': '平',
                '0': '负',
            },
            RSPF: {
                '3': '让胜',
                '1': '让平',
                '0': '让负',
            },
            BQC: {
                '3-3': '胜胜',
                '3-1': '胜平',
                '3-0': '胜负',
                '1-3': '平胜',
                '1-1': '平平',
                '1-0': '平负',
                '0-3': '负胜',
                '0-1': '负平',
                '0-0': '负负',
            },
            JQS: {
                '0': '0球',
                '1': '1球',
                '2': '2球',
                '3': '3球',
                '4': '4球',
                '5': '5球',
                '6': '6球',
                '7': '7+球',
            },
            SF: {
                '3': '胜',
                '0': '负',
            },
            RFSF: {
                '3': '胜',
                '0': '负',
            },
            SFC: {
                '01': '1-5',
                '02': '6-10',
                '03': '11-15',
                '04': '16-20',
                '05': '21-25',
                '06': '26+',
                '11': '1-5',
                '12': '6-10',
                '13': '11-15',
                '14': '16-20',
                '15': '21-25',
                '16': '26+',
            },
            DXF: {
                '3': '大于',
                '0': '小于',
            },
        }
        var bj = function(o, s) {
            var t = '';
            t = zqarry[o][s[0]];
            return t;
        }
        var Format = {
            '3': {
                '1': '七星彩'
            },
            '4': {
                '1': '直选三',
                '2': '组三',
                '3': '组六',
            },
            '5': {
                '1': '排列五',
            },
            '6': {
                '1': '普通',
                '2': '追加',
            },
            '7': {
                '1': '前一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '8': {
                '1': '前一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '9': {
                '1': '前一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '10': {
                '1': '前一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '11': {
                '1': '普通',
            },
            '12': {
                '1': '普通',
            },
            '13': {
                '1': '直选',
                '2': '组三',
                '3': '组六',
            },'20': {
                '1': '前一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
        }
        var Firstsd = {
            '1': '单式',
            '2': '复式',
            '3': '包号',
            '4': '和值',
            '5': '胆拖',
        }
        return {
            //详情过关方式
            Passway: function(i) {
                var arry = [];
                arry = i.split(",")
                var arry1 = [];
                for (var j = 0; j < arry.length; j++) {
                    if (arry[j].length == 3) {
                        arry1.push(arry[j]);
                    }
                }
                return arry1;
            },
            ccodeslist: function(t) {
                s = t.ccodes;
                var arry = [];
                var arry1 = [];
                var arry2 = [];
                var arry3 = [];
                var obj = {};
                arry = s.split(',');
                for (var i = 0; i < arry.length; i++) {
                    arry1 = arry[i].split('=');
                    arry2 = arry1[1].split('_');
                    switch (arry1[0]) {
                        case "SPF":
                            arry2[0] = bj('SPF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '胜平负'
                            break;
                        case "BQC":
                            arry2[0] = bj('BQC', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '半全场'
                            break;
                        case "JQS":
                            arry2[0] = bj('JQS', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '进球数'
                            break;
                        case "CBF":
                            if (arry2[0] == '9:0') {
                                arry2[0] = '胜其它'
                            } else if (arry2[0] == '9:9') {
                                arry2[0] = '平其它'
                            } else if (arry2[0] == '0:9') {
                                arry2[0] = '负其它'
                            }
                            arry1[2] = arry1[0];
                            arry1[0] = '猜比分'
                            break;
                        case "RSPF":
                            arry2[0] = bj('RSPF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '让胜平负' + '(' + t.lose + ')';
                            break;
                        case "SF":
                            arry2[0] = bj('SF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '胜负'
                            break;
                        case "RFSF":
                            arry2[0] = bj('RFSF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '让分胜负'
                            break;
                        case "SFC":
                            arry2[0] = bj('SFC', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '胜分差'
                            break;
                        case "DXF":
                            arry2[0] = bj('DXF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '大小分'
                            break;
                    }
                    obj = {
                        bettype: arry1[0],
                        betresult: arry2[0],
                        winrate: arry2[1],
                        bettypeID: arry1[2]
                    }
                    arry3.push(obj);
                }
                return arry3;
            },
            zjpd: function(l) {
                var objlist = {};
                l = l.bbets;
                for (var i = 0; i < l.length; i++) {
                    var q = '';
                    var w = '';
                    var obj1 = {};
                    if (!l[i].hs) {
                        objlist[l[i].pid] = obj1;
                        continue;
                    }
                    if (l[i].hs > l[i].gs) {
                        obj1.SPF = '胜';
                    } else if (l[i].hs == l[i].gs) {
                        obj1.SPF = '平';
                    } else if (l[i].hs < l[i].gs) {
                        obj1.SPF = '负';
                    }
                    if (l[i].hs - (-l[i].lose) > l[i].gs) {
                        obj1.RSPF = '让胜';
                    } else if (l[i].hs - (-l[i].lose) == l[i].gs) {
                        obj1.RSPF = '让平';
                    } else if (l[i].hs - (-l[i].lose) < l[i].gs) {
                        obj1.RSPF = '让负';
                    }
                    if (l[i].hhs > l[i].hgs) {
                        q = '胜'
                    } else if (l[i].hhs == l[i].hgs) {
                        q = '平'
                    } else if (l[i].hhs < l[i].hgs) {
                        q = '负'
                    }
                    if (l[i].hs > l[i].gs) {
                        w = '胜'
                    } else if (l[i].hs == l[i].gs) {
                        w = '平'
                    } else if (l[i].hs < l[i].gs) {
                        w = '负'
                    }
                    if (l[i].hs - (-l[i].gs) < 7) {
                        obj1.JQS = l[i].hs - (-l[i].gs) + '球';
                    } else {
                        obj1.JQS = '7+球';
                    }
                    if (l[i].hs > 5 && l[i].gs > 2) {
                        obj1.CBF = '胜其它';
                    } else if (l[i].hs > 2 && l[i].gs > 5) {
                        obj1.CBF = '负其它';
                    } else if (l[i].hs == l[i].gs && l[i].hs > 3) {
                        obj1.CBF = '平其他';
                    } else {
                        obj1.CBF = l[i].hs + ':' + l[i].gs;
                    }
                    obj1.BQC = q + w;
                    objlist[l[i].pid] = obj1;
                }
                return objlist;
            },
            /*数字彩拆分*/
            NumberGame: function(list) {
                y = list.bcontext;
                var str = '';
                var str1 = '';
                var obj = {};
                var arry = [];
                var arry1 = [];
                var arry2 = [];
                arry = y.split("|")
                arry1 = arry[1].split(";")
                for (var j = 0; j < arry1.length - 1; j++) {
                    str = '';
                    obj = {};
                    var arry3 = [];
                    arry3 = arry1[j].split(':')
                    for (var k = 0; k < arry3.length - 2; k++) {
                        var arry4 = [];
                        arry4 = arry3[k].split(',')
                        for (var f = 0; f < arry4.length; f++) {
                            str += arry4[f] + ',';
                        }
                        str1 = Format[list.lotteryid][arry3[arry3.length - 2]] + Firstsd[arry3[arry3.length - 1]];
                    }
                    obj.bets = str;
                    obj.play = str1;
                    arry2.push(obj);
                }
                return arry2;
            },
            //彩种id解析对应地址
            getbackurl: lotteryid,
            //彩种玩法解析
            playanalysis:function (a,b) {
                console.log(Format[a],Firstsd[b])
            }
        }
    }])
    //摇一摇代码
    /*
     var SHAKE_THRESHOLD = 3000;
     var last_update = 0;
     var x = y = z = last_x = last_y = last_z = 0;
     !(function init() {
     if (window.DeviceMotionEvent) {
     window.addEventListener('devicemotion', deviceMotionHandler, false);
     } else {
     alert('not support mobile event');
     }
     })()
     function deviceMotionHandler(eventData) {
     var acceleration = eventData.accelerationIncludingGravity;
     var curTime = new Date().getTime();
     if ((curTime - last_update) > 100) {
     var diffTime = curTime - last_update;
     last_update = curTime;
     x = acceleration.x;
     y = acceleration.y;
     z = acceleration.z;
     var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

     if (speed > SHAKE_THRESHOLD) {
     alert(x);
     }
     last_x = x;
     last_y = y;
     last_z = z;
     }
     }*/

// 随机数获取
.factory('MathRnum', [function() {
    return {
        norepeatNum: function(max, num, min) {
            min == undefined ? min = 0 : 1;
            var nary = [],
                temp;
            var x = max - min + 1;

            function rs(a) {
                return Math.floor(Math.random() * a + min);
            };
            Prefix = function(num) {
                return (Array(2).join(0) + num).slice(-2);
            }
            nary.push(rs(x));

            function cli() {
                temp = rs(x);
                if (nary.length == num) return;
                if (nary.indexOf(temp) < 0) {
                    nary.push(temp);
                }
                cli();
            }

            cli();
            if (min == 1) {
                for (var x in nary) {
                    nary[x] = Prefix(nary[x]);
                }
            }
            return nary;
        },
        repeatNum: function(max, num, min) {
            min == undefined ? min = 0 : 1;
            var nAry = [],
                temp;
            var x = max - min + 1;

            function rs(a) {
                return Math.floor(Math.random() * a + min);
            }

            Prefix = function(num) {
                return (Array(2).join(0) + num).slice(-2);
            }
            for (var i = 0; i <= num - 1; i++) {
                nAry.push(rs(x));
            }
            return nAry;
        },
        roundNum: function(max) {
            return Math.round(Math.random() * (max));
        }
    }
}])

// 排列三
.factory('pls', ['MathRnum', function(MathRnum) {
        var plsfs = function(p, f) {
            var s = '';
            switch (p) {
                case 'zx3':
                    if (!f) {
                        s = ':1:1';
                    } else {
                        s = ':1:2';
                    }
                    break;
                case 'z3_ds':
                    s = ':2:1';
                    break;
                case 'z3_fs':
                    s = ':2:1';
                    break;
                case 'z6_fs':
                    if (!f) {
                        s = ':3:1';
                    } else {
                        s = ':3:2';
                    }
                    break;
                case 'zx_hz':
                    s = ':1:4';
                    break;
                case 'z3_hz':
                    s = ':2:4';
                    break;
                case 'z6_hz':
                    s = ':3:4';
                    break;
            }
            return s;
        }
        return {
            tzs: function(t, e) {
                var r;
                switch (t) {
                    case "zx_hz":
                        r = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
                        m = 0;
                        break;
                    case "z3_fs":
                        r = [0, 0, 2, 6, 12, 20, 30, 42, 56, 72, 90];
                        break;
                    case "z3_hz":
                        r = [1, 2, 1, 3, 3, 3, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 3, 3, 3, 1, 2, 1];
                        m = 1;
                        break;
                    case "z6_fs":
                        r = [0, 0, 0, 1, 4, 10, 20, 35, 56, 84, 120];
                        break;
                    case "z6_hz":
                        r = [1, 1, 2, 3, 4, 5, 7, 8, 9, 10, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 1];
                        m = 3
                }
                if ("zx_hz" == t || "z3_hz" == t || "z6_hz" == t) {
                    var a = 0;
                    for (var s = 0; s < e.length; s++) a += r[parseInt(e[s] - m)]
                } else if ("z3_fs" == t || "z6_fs" == t) {
                    a = r[e.length];
                } else if ('zx3' == t) {
                    var f = 1;
                    for (var n = 0; n < e.length; n++) {
                        f *= e[n].length;
                    }
                    a = f;
                }
                return a
            },
            toggleplay: function(id) {
                var n = 1;
                switch (id) {
                    case "zx3":
                        n = 3;
                        break;
                    case "z3_ds":
                        n = 2;
                        break;
                    case "z3_fs":
                        n = 1;
                        break;
                    case "z6_fs":
                        n = 1;
                        break;
                }
                return n;
            },
            sjs: function(p, m, n) {
                var i = 0;
                switch (p) {
                    case "zx3":
                        i = MathRnum.repeatNum(m, n);
                        break;
                    case "z3_ds":
                        i = MathRnum.norepeatNum(m, n);
                        break;
                    case "z3_fs":
                        i = MathRnum.norepeatNum(m, 2);
                        break;
                    case "z6_fs":
                        i = MathRnum.norepeatNum(m, 3);
                        break;
                    case "zx_hz":
                        i = MathRnum.repeatNum(27, 1);
                        break;
                    case "z3_hz":
                        i = MathRnum.repeatNum(26, 1, 1);
                        break;
                    case "z6_hz":
                        i = MathRnum.repeatNum(24, 1, 3);
                        break;
                }
                return i;
            },
            ts: function(p, t) {
                var s = {};
                if (t == 4) {
                    switch (p) {
                        case "zx3":
                            s.o = '猜中开奖数且一一对应，即奖';
                            s.f = '1040元';
                            s.t = '每位至少选1个号码';
                            break;
                        case "z3_ds":
                            s.o = '猜中开奖号码且为组三形态，即奖';
                            s.f = '346元';
                            s.t = '每位只能选1个号';
                            break;
                        case "z3_fs":
                            s.o = '猜中开奖号码且为组三形态，即奖';
                            s.f = '346元';
                            s.t = '至少选2个号';
                            break;
                        case "z6_fs":
                            s.o = '猜中开奖数且每位数均不相同，即奖';
                            s.f = '346元';
                            s.t = '至少选3个号';
                            break;
                        case "zx_hz":
                            s.o = '猜中开奖号码之和，即奖';
                            s.f = '346元';
                            s.t = '至少选1个号';
                            break;
                    }
                } else if (t == 13) {
                    switch (p) {
                        case "zx3":
                            s.o = '按位猜中全部3个号码,即中';
                            s.f = '1040元';
                            s.t = '每位至少选1个号码';
                            break;
                        case "z3_ds":
                            s.o = '猜中开奖号码，顺序不限，即中';
                            s.f = '346元';
                            s.t = '选择1个重号和1个单号';
                            break;
                        case "z3_fs":
                            s.o = '猜中开奖号码，顺序不限，即中';
                            s.f = '346元';
                            s.t = '至少选2个号';
                            break;
                        case "z6_fs":
                            s.o = '猜中开奖号码，顺序不限，即中';
                            s.f = '173元';
                            s.t = '至少选3个号';
                            break;
                        case "zx_hz":
                            s.o = '猜中开奖号码之和，即中';
                            s.f = '1040元';
                            s.t = '至少选1个号';
                            break;
                        case "z3_hz":
                            s.o = '猜中开奖号码之和，即中';
                            s.f = '346元';
                            s.t = '至少选1个号';
                            break;
                        case "z6_hz":
                            s.o = '猜中开奖号码之和，即中';
                            s.f = '173元';
                            s.t = '至少选1个号';
                            break;
                    }
                }
                return s;
            },
            //排列三投注数据处理
            tz: function(t, z) {
                var obj = {};
                obj = {
                    playid: t,
                    plsarry: z,
                }
                return obj;
            },
            handle: function(p) {
                var n = false;
                var s = '';
                var ss = ''
                for (var i = 0; i < p.length; i++) {
                    s = '';
                    n = false;
                    if (p[i].playid == 'zx3') {
                        for (var j1 in p[i].plsarry) {
                            for (var g in p[i].plsarry[j1]) {
                                if (p[i].plsarry[j1].length > 1) {
                                    n = true;
                                }
                                s += p[i].plsarry[j1][g];
                            }
                            s += ',';
                        };
                    } else if (p[i].playid == 'z3_ds') {
                        s = '';
                        for (var j2 in p[i].plsarry) {
                            for (var g in p[i].plsarry[j2]) {
                                if (j2 == 1) {
                                    s += p[i].plsarry[j2][0];
                                } else {
                                    s += p[i].plsarry[j2][g] + ',' + p[i].plsarry[j2][g];
                                }
                            }
                            s += ',';
                        };
                    } else if (p[i].playid == 'z3_fs') {
                        var arry = '';
                        var sss = '';
                        for (var j3 in p[i].plsarry) {
                            for (var g = 0; g < p[i].plsarry.length; g++) {
                                if (j3 != g) {
                                    sss = p[i].plsarry[j3] + ',' + p[i].plsarry[g] + ',' + p[i].plsarry[g] + plsfs(p[i].playid, n) + ';';
                                    arry += sss;
                                }
                            }
                        }
                        ss += arry;
                    } else if (p[i].playid == 'z6_fs') {
                        var sss = '';
                        var arry1 = '';
                        var array = p[i].plsarry;
                        for (var f = 0, len1 = array.length; f < len1; f++) {
                            var a2 = array.concat();
                            a2.splice(0, f + 1);
                            for (var j = 0, len2 = a2.length; j < len2; j++) {
                                var a3 = a2.concat();
                                a3.splice(0, j + 1);
                                for (var k = 0, len3 = a3.length; k < len3; k++) {
                                    arry1 += array[f] + ',' + a2[j] + ',' + a3[k] + plsfs(p[i].playid, n) + ';'
                                }
                            }
                        }
                        ss += arry1;
                    } else if (p[i].playid == "zx_hz" || p[i].playid == "z3_hz" || p[i].playid == "z6_hz") {
                        s = '';
                        for (var ll = 0; ll < p[i].plsarry.length; ll++) {
                            if (p[i].plsarry.length > 1) {
                                n = true;
                            }
                            s += p[i].plsarry[ll] + plsfs(p[i].playid, n) + ';';
                        };
                        ss += s;
                    }
                    if (p[i].playid !== 'z3_fs' && p[i].playid !== 'z6_fs' && p[i].playid !== 'zx_hz' && p[i].playid != "z3_hz" && p[i].playid != "z6_hz") {
                        ss += s.replace(/(.*)[,，]$/, '$1') + plsfs(p[i].playid, n) + ';';
                    }
                    //console.log(ss);
                }
                return ss;
            },
            //页面显示数据处理
            zs: function(p) {
                var s = [];
                for (var i = 0; i < p.length; i++) {
                    s = [];
                    if (p[i].playid != 'zx3' && p[i].playid != 'z3_ds') {
                        for (var j = 0; j < p[i].plsarry.length; j++) {
                            s[j] = p[i].plsarry[j];
                        }
                        p[i].plsarry = [];
                        p[i].plsarry[0] = s;
                    }
                }
                return p;
            }
        }
    }])
    // 十一选五
    .factory("syxw", ['MathRnum','Match','HttpServer','UserInfo','order', function(MathRnum,Match,HttpServer,UserInfo,order) {
        var syn_tempary = [{
            syxw: 'rx2_pt',
            payid: '2',
            rx: '2',
            type: '任选二',
            trs: '奖金6元',
            f:'12',
            NO:0,
        }, {
            syxw: 'rx3_pt',
            payid: '3',
            rx: '3',
            type: '任选三',
            trs: '奖金19元',
            f:'12',
            NO:1,
        }, {
            syxw: 'rx4_pt',
            payid: '4',
            rx: '4',
            type: '任选四',
            trs: '奖金78元',
            f:'12',
            NO:2,
        }, {
            syxw: 'rx5_pt',
            payid: '5',
            rx: '5',
            type: '任选五',
            trs: '奖金540元',
            f:'12',
            NO:3,
        }, {
            syxw: 'rx6_pt',
            payid: '6',
            rx: '6',
            type: '任选六',
            trs: '奖金90元',
            f:'12',
            NO:4,
        }, {
            syxw: 'rx7_pt',
            payid: '7',
            rx: '7',
            type: '任选七',
            trs: '奖金26元',
            f:'12',
            NO:5,
        }, {
            syxw: 'rx8_pt',
            payid: '8',
            rx: '8',
            type: '任选八',
            trs: '奖金9元',
            f:'12',
            NO:6,
        }, {
            syxw: 'rx1_pt',
            payid: '1',
            rx: '1',
            type: '前一',
            trs: '奖金13元',
            f:'12',
            NO:7,
        }, {
            syxw: 'q2_pt',
            payid: '9',
            rx: '2',
            type: '前二直选',
            trs: '奖金130元',
            f:'12',
            NO:8,
        }, {
            syxw: 'q2zx_pt',
            payid: '11',
            rx: '2',
            type: '前二组选',
            trs: '奖金65元',
            f:'12',
            NO:9,
        }, {
            syxw: 'q3_pt',
            payid: '10',
            rx: '3',
            type: '前三直选',
            trs: '奖金1170元',
            f:'12',
            NO:10,
        }, {
            syxw: 'q3zx_pt',
            payid: '12',
            rx: '3',
            type: '前三组选',
            trs: '奖金195元',
            f:'12',
            NO:11,
        }, {
            syxw: 'rx2_dt',
            payid: '2',
            rx: '2',
            type: '任选二-胆拖',
            trs: '奖金6元',
            f:'5',
            NO:12,
        }, {
            syxw: 'rx3_dt',
            payid: '3',
            rx: '3',
            type: '任选三-胆拖',
            trs: '奖金19元',
            f:'5',
            NO:13,
        }, {
            syxw: 'rx4_dt',
            payid: '4',
            rx: '4',
            type: '任选四-胆拖',
            trs: '奖金78元',
            f:'5',
            NO:14,
        }, {
            syxw: 'rx5_dt',
            payid: '5',
            rx: '5',
            type: '任选五-胆拖',
            trs: '奖金540元',
            f:'5',
            NO:15,
        }, {
            syxw: 'rx6_dt',
            payid: '6',
            rx: '6',
            type: '任选六-胆拖',
            trs: '奖金90元',
            f:'5',
            NO:16,
        }, {
            syxw: 'rx7_dt',
            payid: '7',
            rx: '7',
            type: '任选七-胆拖',
            trs: '奖金26元',
            f:'5',
            NO:17,
        }, {
            syxw: 'q2zx_dt',
            payid: '11',
            rx: '2',
            type: '前二组选-胆拖',
            trs: '奖金1170元',
            f:'5',
            NO:18,
        }, {
            syxw: 'q3zx_dt',
            payid: '12',
            rx: '3',
            type: '前三组选-胆拖',
            trs: '奖金195元',
            f:'5',
            NO:19,
        } ];
        var syxwfs = function(p, f) {
            var s = '';
            switch (p) {
                case 'zx3':
                    if (!f) {
                        s = ':1:1';
                    } else {
                        s = ':1:2';
                    }
                    break;
                case 'z3_ds':
                    s = ':2:1';
                    break;
                case 'z3_fs':
                    s = ':2:1';
                    break;
                case 'z6_fs':
                    if (!f) {
                        s = ':3:1';
                    } else {
                        s = ':3:2';
                    }
                    break;
                case 'zx_hz':
                    s = ':1:4';
                    break;
            }
            return s;
        }
        var A = function(num) {
            if (num < 0) {
                return -1;
            } else if (num === 0 || num === 1) {
                return 1;
            } else {
                for (var i = num - 1; i >= 1; i--) {
                    num *= i;
                }
            }
            return num;
        };
        var Anm = function(n, m) {
            for (var i = 1; i <= (n - m + 1); i++) {
                n *= n - i;
            }
            return n;
        };
        //各玩法单注奖金
        var dBonus = {//玩法方式(1〜8任选，9〜10直选，11〜12组选)
            1:'13',
            2:'6',
            3:'19',
            4:'78',
            5:'540',
            6:'90',
            7:'26',
            8:'9',
            9:'130',
            10:'1170',
            11:'65',
            12:'195',
        };
        /**
         *组合算法
         * @param arr 原始数组
         * @param size 组合个数
         * @returns {Array}
         */
        function choose(arr, size) {
            var allResult = [];
            (function (arr, size, result) {
                var arrLen = arr.length;
                if (size > arrLen) {
                    return;
                }
                if (size == arrLen) {
                    allResult.push([].concat(result, arr))
                } else {
                    for (var i = 0 ; i < arrLen; i++) {
                        var newResult = [].concat(result);
                        newResult.push(arr[i]);

                        if (size == 1) {
                            allResult.push(newResult);
                        } else {
                            var newArr = [].concat(arr);
                            newArr.splice(0, i + 1);
                            arguments.callee(newArr, size - 1, newResult);
                        }
                    }
                }
            })(arr, size, []);
            return allResult;
        }

        /**
         * 数组去重算法
         * @param arr
         * @returns {Array}
         */
        function unique(arr) {
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }
        /**
         * 多个一维数组排例组合的所有可能
         * @param arr1
         * @param arr2
         * @returns {*}
         */
        function js(arr1,arr2){
            var arr = Array();
            for(var i=0;i<arr1.length;i++){
                for(var j=0;j<arr2.length;j++){
                    arr.push(arr1[i]+","+arr2[j]);
                }
            }
            return arr;
        }
        /**
         * 对比开奖号码计算中奖金额--单复式任选
         * @param zh 所选号码组合
         * @param e 开奖号码
         * @param size 中奖所需个数
         * @param type 玩法类型
         * @constructor
         */
        var Expiry = function (zh,e,size,type) {
            var zjhm = e.split(",");
            var Hit = 0;//中奖金额统计
            var hitnum = [];//中奖号码统计
            for(var i = 0;i<zh.length;i++){
                var num = 0;
                if(zh[i].constructor!=Array){
                    zh[i] = zh[i].split(",");
                }
                for(var k = 0;k<zh[i].length;k++){
                    for(var j = 0;j<zjhm.length;j++){
                        if(zh[i][k]==zjhm[j]){
                            num++;
                            hitnum.push(zjhm[j]);
                        }
                    }
                }
                if(num==size){
                    Hit -= -dBonus[type];
                }
            }
            var obj = {
                amoney:Hit,
                acode:unique(hitnum)
            }
            return obj;
        }
        /**
         * 对比开奖号码计算中奖金额--直选
         * @param zh 所选号码组合
         * @param e 开奖号码
         * @param size 中奖所需个数
         * @param type 玩法类型
         * @constructor
         */

        var Expiryzx = function (zh,e,size,type) {
            var zjhm = e.split(",");
            var Hit = 0;//中奖金额统计
            var hitnum = [];//中奖号码统计
            for(var i = 0;i<zh.length;i++){
                var num = 0;
                var zha = zh[i].split(",");
                for(var k = 0;k<zha.length;k++){
                        if(zha[k]==zjhm[k]){
                            num++;
                            hitnum.push(zjhm[k]);
                        }
                }
                if(num==size){
                    Hit -= -dBonus[type];
                }
            }
            var obj = {
                amoney:Hit,
                acode:unique(hitnum)
            }
            return obj;
        }
        /**
         * 对比开奖号码计算中奖金额--组选
         * @param zh 所选号码组合
         * @param e 开奖号码
         * @param size 中奖所需个数
         * @param type 玩法类型
         * @constructor
         */
        var Expiryzux = function (zh,e,size,type) {
            var zjhm = e.split(",");
            var Hit = 0;//中奖金额统计
            var hitnum = [];//中奖号码统计
            for(var i = 0;i<zh.length;i++){
                var num = 0;
                for(var k = 0;k<zh[i].length;k++){
                    for(var j = 0;j<size;j++){
                        if(zh[i][k]==zjhm[j]){
                            num++;
                            hitnum.push(zjhm[j]);
                        }
                    }
                }
                if(num==size){
                    Hit -= -dBonus[type];
                }
            }
            var obj = {
                amoney:Hit,
                acode:unique(hitnum)
            }
            return obj;
        }
        /**
         *直选注数拆分
         * @param r
         */
        var fszuhe = function (r) {
            var p = [];
            for(var i =0;i<r.length;i++){
                p.push(r[i].split(","))
            }
            var arr = js(p[0],p[1])
            var b = true
            var index = 2;
            while(b){
                if(p[index]){
                    arr = js(arr,p[index])
                    index ++;
                }else{
                    break;
                }
            }
            return arr;
        }
        /**
         *胆拖组选拆分
         * @param r 数组
         * * @param size 每注个数
         */
        var dantuozx = function (r,size) {
            var arr=[];
            var p = r[0].split(",");
            var b = r[1].split(",");
            var len = p.length
            var s = choose(b,size-len);
            for(var i = 0;i<s.length;i++){
                var arry = [];
                arry = arry.concat(p,s[i])
                arr.push(arry);
            }
            return arr;
        }

        //奖金总计算
        /**
         *
         * @param r 所选号码
         * @param e 中奖号码
         * @param t 所选玩法
         */
        var  calculation =function(r,e,t){
            var Hit = 0;//中奖金额统计
            if(r.tzfs!=5){
                if(t>=1 && t<=8){
                    var reg = /(.*)[,，]$/;
                    var p = r.hm.replace(reg, '$1').split(",")
                }else if(t==9 || t==10){
                    var reg = /(.*)[,，]$/;
                    var p = r.hm.replace(reg, '$1').split("@")
                }else if(t==11 || t==12){
                    var reg = /(.*)[,，]$/;
                    var p = r.hm.replace(reg, '$1').split(",")
                }
            }else{
                if(t>=2 && t<=8){
                    var reg = /(.*)[,，]$/;
                    var p = r.hm.replace(reg, '$1').split("$")
                }else if(t==9 || t==10){
                    var reg = /(.*)[,，]$/;
                    var p = r.hm.replace(reg, '$1').split("$")
                }else if(t==11 || t==12){
                    var reg = /(.*)[,，]$/;
                    var p = r.hm.replace(reg, '$1').split("$")
                }
            }
            switch (t) {
                case "1":
                    var zh = choose(p,1);
                    Hit = Expiryzux(zh,e,1,1);
                    break;
                case "2":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,2);
                    }else{
                        var zh = choose(p,2);
                    }
                    Hit = Expiry(zh,e,2,2);
                    break;
                case "3":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,3);
                    }else{
                        var zh = choose(p,3);
                    }
                    Hit = Expiry(zh,e,3,3);
                    break;
                case "4":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,4);
                    }else{
                        var zh = choose(p,4);
                    }
                    Hit = Expiry(zh,e,4,4);
                    break;
                case "5":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,5);
                    }else{
                        var zh = choose(p,5);
                    }
                    Hit = Expiry(zh,e,5,5);
                    break;
                case "6":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,6);
                    }else{
                        var zh = choose(p,6);
                    }
                    Hit = Expiry(zh,e,5,6);
                    break;
                case "7":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,7);
                    }else{
                        var zh = choose(p,7);
                    }
                    Hit = Expiry(zh,e,5,7);
                    break;
                case "8":
                    var zh = choose(p,8);
                    Hit = Expiry(zh,e,5,8);
                    break;
                case "9":
                    var zh = fszuhe(p);
                    Hit = Expiryzx(zh,e,2,9)
                    break;
                case "10":
                    var zh = fszuhe(p);
                    Hit = Expiryzx(zh,e,3,10)
                    break;
                case "11":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,2);
                    }else{
                        var zh = choose(p,2);
                    }
                    Hit = Expiryzux(zh,e,2,11);
                    break;
                case "12":
                    if(r.tzfs==5){
                        var zh = dantuozx(p,3);
                    }else{
                        var zh = choose(p,3);
                    }
                    Hit = Expiryzux(zh,e,3,12);
                    break;
                }
                return Hit;
        }
        return {
            sjs: function(p, n) {
                var i = 0;
                var m = 11;
                var min = 1;
                i = MathRnum.norepeatNum(m, n, min);
                return i;
            },
            C: function(n, m) {
                if (m <= n) {
                    return A(n) / (A(m) * A(n - m));
                } else {
                    return 0;
                }
            },
            tz: function(t, z, r, u) {
                var obj = {};
                obj = {
                        playid: t,
                        plsarry: z,
                        rx: r,
                        payluid: u,
                    }
                    //console.log(obj.plsarry[0]);
                return obj;
            },
            //页面显示数据处理
            zs: function(p) {
                var s = [];
                for (var i = 0; i < p.length; i++) {
                    s = [];
                    if (p[i].playid.indexOf('dt') == -1 && p[i].playid != 'q2_pt' && p[i].playid != 'q3_pt') {
                        for (var j = 0; j < p[i].plsarry.length; j++) {
                            s[j] = p[i].plsarry[j];
                        }
                        p[i].plsarry = [];
                        p[i].plsarry[0] = s;
                    }
                }
                //console.log(p);
                return p;
            },
            handle: function(p) {
                var n = false;
                var A = /(.*)[,，]$/;
                var s = '';
                var str = '';
                var str1 = '';
                var str2 = '';
                var ss = ''
                for (var i = 0; i < p.length; i++) {
                    s = '';
                    str = '';
                    str1 = '';
                    str2 = '';
                    n = false;
                    if (p[i].playid.indexOf('dt') != -1) {
                        for (var j = 0; j < p[i].plsarry[0].length; j++) {
                            str += p[i].plsarry[0][j] + ',';
                        }
                        for (var j = 0; j < p[i].plsarry[1].length; j++) {
                            str1 += p[i].plsarry[1][j] + ',';
                        }
                        s = str.replace(A, '$1') + '$' + str1.replace(A, '$1') + ':' + p[i].payluid + ':' + '5';
                    } else if (p[i].playid == 'q2_pt' || p[i].playid == 'q3_pt') {
                        var h = '1';
                        for (var j = 0; j < p[i].plsarry[0].length; j++) {
                            str += p[i].plsarry[0][j] + ',';
                        }
                        for (var j = 0; j < p[i].plsarry[1].length; j++) {
                            str1 += p[i].plsarry[1][j] + ',';
                        }
                        if (p[i].plsarry[0].length > 1 || p[i].plsarry[1].length > 1) {
                            h = '2';
                        }
                        if (p[i].plsarry.length >= 3) {
                            for (var j = 0; j < p[i].plsarry[2].length; j++) {
                                str2 += p[i].plsarry[2][j] + ',';
                            }
                            if (p[i].plsarry[2].length > 1) {
                                h = '2';
                            }
                            s = str.replace(A, '$1') + '@' + str1.replace(A, '$1') + '@' + str2.replace(A, '$1') + ':' + p[i].payluid + ':' + h;
                        } else {
                            s = str.replace(A, '$1') + '@' + str1.replace(A, '$1') + ':' + p[i].payluid + ':' + h;
                        }
                    } else {
                        var h = '1';
                        for (var j = 0; j < p[i].plsarry.length; j++) {
                            str += p[i].plsarry[j] + ',';
                        }
                        if (p[i].plsarry.length > p[i].rx) {
                            h = '2';
                        }
                        s = str.replace(A, '$1') + ':' + p[i].payluid + ':' + h;
                    }
                    ss += s + ';';
                    //console.log(ss);
                }
                return ss;
            },
            /**
             *  十一选五提示语
             * @param p
             * @returns {{}}
             */
            ts: function(p) {
                var s = {};
                switch (p) {
                    case "rx1_pt":
                        s.o = '猜中开奖的第1位，即奖';
                        s.f = '13元';
                        s.t = '至少选择1个号';
                        break;
                    case "rx2_pt":
                        s.o = '猜中开奖的任意2个号码，即奖';
                        s.f = '6元';
                        s.t = '至少选择2个号';
                        break;
                    case "rx3_pt":
                        s.o = '猜中开奖的任意3个号码，即奖';
                        s.f = '19元';
                        s.t = '至少选择3个号';
                        break;
                    case "rx4_pt":
                        s.o = '猜中开奖的任意4个号码，即奖';
                        s.f = '78元';
                        s.t = '至少选择4个号';
                        break;
                    case "rx5_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '540元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx6_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '90元';
                        s.t = '至少选择6个号';
                        break;
                    case "rx7_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '26元';
                        s.t = '至少选择7个号';
                        break;
                    case "rx8_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '9元';
                        s.t = '至少选择8个号';
                        break;
                    case "q2_pt":
                        s.o = '猜中开奖前2位一一对应，即奖';
                        s.f = '130元';
                        s.t = '每位至少选择1个号';
                        break;
                    case "q2zx_pt":
                        s.o = '猜中开奖前2位顺序不限，即奖';
                        s.f = '65元';
                        s.t = '至少选2个号';
                        break;
                    case "q3_pt":
                        s.o = '猜中开奖前3位一一对应，即奖';
                        s.f = '1170元';
                        s.t = '每位至少选择1个号';
                        break;
                    case "q3zx_pt":
                        s.o = '猜中开奖前3位顺序不限，即奖';
                        s.f = '195元';
                        s.t = '至少选择3个号';
                        break;
                    case "rx2_dt":
                        s.o = '猜中开奖的任意2个号码，即奖';
                        s.f = '6元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx3_dt":
                        s.o = '猜中开奖的任意3个号码，即奖';
                        s.f = '19元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx4_dt":
                        s.o = '猜中开奖的任意4个号码，即奖';
                        s.f = '78元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx5_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '540元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx6_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '90元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx7_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '26元';
                        s.t = '至少选择5个号';
                        break;
                    case "q2zx_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '65元';
                        s.t = '至少选择5个号';
                        break;
                    case "q3zx_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '195元';
                        s.t = '至少选择5个号';
                        break;
                }
                return s;
            },
            /**
             *11选5中奖奖金计算
             * @param arr 投注号码
             * @param rowsm 开奖号码
             * return obj = {
                acode:array,--------中奖号码
                amoney: string------中奖奖金
             }
             */
            bounstotal:function (arr,rowsm) {
                var A = /(.*)[;；]$/;//匹配末尾分好
                //arr = '1|01,02,03,04$05,06,07,08,09:5:5;';
                //rowsm = '01,02,03,04,05';
                var s = '1';
                //console.log(dBonus[s]);
                var tz = arr.split("|");
                var zs = tz[1].replace(A, '$1').split(";");
                var arr1 = [];
                for(var i = 0;i<zs.length;i++){
                    var obj1 = {};//单注拆分
                    var cf = zs[i].split(":");
                    obj1.hm = cf[0];//所选号码
                    obj1.wf = cf[1];//玩法方式(1〜8任选，9〜10直选，11〜12组选):
                    obj1.tzfs = cf[2];//投注方式(1单式，2复式，5胆拖)
                    arr1.push(obj1);
                    var bonus = calculation(obj1,rowsm,arr1[i].wf);
                }
                //console.log(bonus);
                return bonus;
            },
            /**
             * s 十一选五参数配置
             * @returns {[*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*]}
             */
            syntempary: function(){
                return syn_tempary;
            },
            /**
             * 十一选五追投数据拆分
             * @param bdesc
             * @returns {Array}
             */
            resolvebdesc:function (bdesc) {
                var A = /(.*)[;；]$/;//匹配末尾分好
                var B = /(.*)[:：]$/;//匹配末尾分好
                var C = /(.*)[,，]$/;//匹配末尾分好
                //bdesc = '1|01,02$03,04,05,06:4:5;';
                var tz = bdesc.split("|");
                var zs = tz[1].replace(A, '$1').split(";");
                var num = zs[0].replace(B, '$1').split(":");
                if(num[0].indexOf("@")!=-1){
                    var arr=[];
                    var arr1 = num[0].replace(C, '$1').split("@");
                    for(var i=0;i<arr1.length;i++){
                        arr.push(arr1[i].split(','));
                    }
                }else if(num[0].indexOf("$") != -1){
                    var arr = [];
                    var arr1 = num[0].replace(C, '$1').split("$");
                    for(var i=0;i<arr1.length;i++){
                        arr.push(arr1[i].split(','));
                    }
                }else{
                    var arr = num[0].replace(C, '$1').split(',');
                }
                //order.playanalysis(4,5);
                var obj = {
                    playid:num[1],
                    playtype:num[2]
                }
                obj.arr = arr;
                return obj;
            },
            //十一选五彩种玩法查询
            querylotplaycfg:function () {
                var myhotdate = {
                    token: UserInfo.l.token,
                    type: 10,
                }
                HttpServer.Hpost(myhotdate, '/betting/querylotplaycfg').then(function (data) {
                    if (data.status == 1 && data.data) {
                        UserInfo.add('syxwplaycfg', data.data.playcfg);
                    }
                })
            },
            /**
             * 十一选五初始化
             * @param playid
             * @returns {{syxw: string, payid: string, rx: string, type: string, trs: string, f: string}}
             */
            syxwint:function (playid) {
                var _this =syn_tempary;
                var strarr = {"syxw":"rx2_pt","payid":"2","rx":"2","type":"任选二","trs":"奖金6元","f":"12"};
                for (var i = 0; i < _this.length; i++) {
                    if (_this[i].syxw == playid) {
                        strarr = _this[i];
                        break;
                    }
                }
                //console.log(JSON.stringify(strarr))
                return strarr;
            },
            preloadimages:function (arr) {
                var newimages=[], loadedimages=0
                var postaction=function(){}  //此处增加了一个postaction函数
                var arr=(typeof arr!="object")? [arr] : arr
                function imageloadpost(){
                    loadedimages++
                    if (loadedimages==arr.length){
                        postaction(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
                    }
                }
                for (var i=0; i<arr.length; i++){
                    newimages[i]=new Image()
                    newimages[i].src=arr[i]
                    newimages[i].onload=function(){
                        imageloadpost()
                    }
                    newimages[i].onerror=function(){
                        imageloadpost()
                    }
                }
                return { //此处返回一个空白对象的done方法
                    done:function(f){
                        postaction=f || postaction
                    }
                }
            }
        }
    }])
    // 字符串拼接&&计数
    .factory("qxc", [function() {
        return {
            Mosaicchar: function(ary) {
                var copy = ary.slice();
                var str = "";
                var a = 1;
                for (var x in copy) {
                    if (typeof(ary[x]) == 'object') {
                        a = 2;
                        copy[x] = copy[x].sort().join("");
                    }
                }
                return copy.join(",") + ':' + 1 + ":" + a + ";";
            },
            countNuma: function(ary) {
                var ns = 1;
                for (var i in ary) {
                    if (typeof(ary[i]) == 'object')
                        ns = ns * ary[i].length;
                }
                return ns;
            }
        }
    }])
    // 数学运算C(排列)
    .factory("cAp", [function() {
        return {
            comNumber: function(a, b) {
                var arya = [];
                var aryb = [];
                var acot = bcot = 1;
                for (var i = 0; i <= b - 1; i++) {
                    arya.push(a - i);
                    aryb.push(b - i);
                }
                for (var x in arya) {
                    acot = acot * arya[x];
                    bcot = bcot * aryb[x];
                }
                return acot / bcot;
            },
            perNumber: function(a, b) {

            }
        }
    }])
    //走势图
    .factory('Trend', ['ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function(ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        return {
            trends: function(obj, falg) {
                var defer = $q.defer();
                if (falg == undefined) {
                    $ionicLoading.show({ content: 'Loading', duration: 30000 });
                }
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/trade/zs/code',
                    data: obj,
                }).success(function(data) {
                    if (falg == undefined) {
                        $ionicLoading.hide();
                    }
                    defer.resolve(data);
                }).error(function(data) {
                    defer.resolve(false);
                    if (falg == undefined) {
                        $ionicLoading.hide();
                    }
                    showAlertMsg.showMsgFun('数据请求失败', '请检查网络连接');
                })
                return defer.promise;
            }
        }
    }])

// 快三
.factory('fastthree', ['cAp', function(cAp) {
        return {
            lotcot: function(a) {
                var o = {};
                switch (a) {
                    case 'pt_hz':
                        o.t = '猜中开奖号码相加和';
                        o.a = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
                        o.b = ['奖金80元', '奖金40元', '奖金25元', '奖金16元', '奖金12元', '奖金10元', '奖金9元', '奖金9元', '奖金10元', '奖金12元', '奖金16元', '奖金25元', '奖金40元', '奖金80元'];
                        o.ary = [];
                        break;
                    case 'pt_sth':
                        o.t = '猜豹子号（3个相同）';
                        o.a = [111, 222, 333, 444, 555, 666];
                        o.b = ['奖金240元', '奖金240元', '奖金240元', '奖金240元', '奖金240元', '奖金240元'];
                        o.ary = [
                            [],
                            []
                        ];
                        break;
                    case 'pt_eth':
                        o.t = '猜对子号（有2个相同）';
                        o.ta = '选择同号和不同号的组合，奖金80元';
                        o.c = [11, 22, 33, 44, 55, 66];
                        o.d = [1, 2, 3, 4, 5, 6];
                        o.tb = '猜开奖的2个指定的相同号码，奖金15元';
                        o.e = ['11*', '22*', '33*', '44*', '55*', '66*'];
                        o.ary = [
                            [
                                [],
                                []
                            ],
                            []
                        ];
                        break;
                    case 'pt_sbth':
                        o.ta = '猜开奖的三个不同号码，奖金40元';
                        o.c = [1, 2, 3, 4, 5, 6];
                        o.tb = '123,234,345,456,任一开出即中10元';
                        o.ary = [
                            [],
                            []
                        ];
                        break;

                    case 'pt_ebth':
                        o.t = '猜开奖号码中2个指定的不同号码,奖8元';
                        o.a = [1, 2, 3, 4, 5, 6];
                        o.ary = [];
                        break;
                }
                return o;
            },
            lotnum: function(a, ary) {
                if (a == 'pt_hz') {
                    return ary.length;
                }
                if (a == 'pt_sth') {
                    return ary[0].length + ary[1].length;
                }
                if (a == 'pt_eth') {
                    var a = 0;
                    if (ary[0][0] != "") { a = cAp.comNumber(ary[0][0].length, 1); }
                    var b = 0;
                    if (ary[0][1] != "") { b = cAp.comNumber(ary[0][1].length, 1); }
                    return a * b + ary[1].length;
                }
                if (a == 'pt_sbth') {
                    var a = 0;
                    if (ary[0].length >= 3) { a = cAp.comNumber(ary[0].length, 3) };
                    return a + ary[1].length;
                }
                if (a = 'pt_ebth') {
                    var a = 0;
                    if (ary.length >= 2) { a = cAp.comNumber(ary.length, 2) };
                    return a;
                }
            },
            lottype: function() {
                var o = [
                    { a: '和值', b: '奖金9-80元', c: 'pt_hz', d: [1, 2, 3] },
                    { a: '三同号', b: '奖金40-240元', c: 'pt_sth', d: [1, 1, 1] },
                    { a: '二同号', b: '奖金15-80元', c: 'pt_eth', d: [1, 1, 3] },
                    { a: '三不同号', b: '奖金10-40元', c: 'pt_sbth', d: [2, 3, 5] },
                    { a: '二不同号', b: '奖金8元', c: 'pt_ebth', d: [3, 5] }
                ];
                return o;
            }
        }
    }])
    .factory('listcot', [function() {
        return {
            texts: function(a) {
                switch (a) {
                    case 3:
                        var textcot = "七星彩";
                        break;
                    case 4:
                        var textcot = "排列三";
                        break;
                    case 5:
                        var textcot = "排列五";
                        break;
                    case 6:
                        var textcot = "大乐透";
                        break;
                    case 7:
                        var textcot = "江西11选5";
                        break;
                    case 8:
                        var textcot = "山东11选5";
                        break;
                    case 9:
                        var textcot = "上海11选5";
                        break;
                    case 10:
                        var textcot = "浙江11选5";
                        break;
                    case 20:
                        var textcot = "浙江11选5";
                        break;
                }
                return textcot;
            },
            gold: function(a) {
                switch (a) {
                    case 3:
                        var goldn = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖"];
                        break;
                    case 4:
                        var goldn = ["直选", "组三", "组六"];
                        break;
                    case 5:
                        var goldn = ["一等奖"];
                        break;
                    case 6:
                        var goldn = ["一等奖", "一等奖-追加", "二等奖", "二等奖-追加", "三等奖-追加", "三等奖", "四等奖-追加", "四等奖", "五等奖-追加", "五等奖", "六等奖"];
                        break;
                    case 11:
                        var goldn = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖"];
                        break;
                    case 12:
                        var goldn = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "七等奖"];
                        break;
                    case 13:
                        var goldn = ["直选", "组三", "组六"];
                        break;
                }
                if (a >= 7 && a <= 10 || a==20) {
                    var goldn = ["前二", "前二组选", "前三", "前三组选", "前一", "任选二", "任选三", "任选四", "任选五", "任选六", "任选七", "任选八"];
                }
                return goldn;
            }
        }
    }])
    .factory('helpcontent', [function() {
        return {
            cot: function(a, b) {
                var listobj = [{
                        title: "充值提现",
                        nums: 1,
                        cot: [
                            { question: "支付宝提现什么时候可以到账？", answer: "以支付宝通知为准，一般情况下为1-2小时。" },
                            { question: "银行卡提现什么时候可以到账？", answer: "我们会在1个工作日（周末和法定假日除外）之内将钱转入您在我猜彩票上填写的银行账号，一般情况下：工作日期间在17：50之前发出的提现申请，将在下个工作日进行打款操作；17：50之后发出的提现申请，将同下个工作日的申请一并处理，具体到账时间以银行到账时间为准。" },
                            { question: "提现是否有限额？", answer: "本平台单次每笔提现限额为100万元。" },
                            { question: "提现会收取手续费吗？", answer: "提现金额满100元免手续费，不足100元每笔收取1元手续费，每日不限提现次数。" },
                            /* { question: "提现失败怎么办？", answer: "请先确认您输入的支付宝账号和姓名是否有误，如果仍旧失败，请您拨打我们的客服电话咨询：0571-86981383。" },*/
                            /* { question: "提现时姓名与账户不符？", answer: "请耐心稍等一下，姓名与账户不符时，我们会将资金退回至您的账户余额内。" },*/
                        ]
                    },
                    {
                        title: "购彩兑奖",
                        nums: 2,
                        cot: [
                            { question: "在销售时间外购买竞彩足球，什么时候出票？", answer: "竞彩足球的销售时间为：周一至周五 9:00—00:00，周六至周日 9:00—次日01：00，在销售时间外购买的彩票会在销售时间开始时陆续出票，请您耐心等待。" },
                            { question: "已到开奖时间为什么没有显示开奖？", answer: "本平台将在官方官网开奖公告发布1小时内进行开奖，请您耐心等待。" },
                            { question: "快彩的开奖信息不全？", answer: "获取数据时有一定的延时，请耐心等待。" },
                            { question: "如果中了大奖要如何领取？", answer: "A 、 单笔中奖金额1万元（包含一万元）以下，仅支持平台提现； B 、 单笔中奖金额1万元-100万元（包含100万元）仅支持平台提现，如有需求可与客服联系，在核对中奖信息和身份信息后，平台将以微信或彩信的形式提供相关中奖彩票照片； C 、单笔中奖金额100万元以上，我们客服将会在一个工作日内与您取得联系，与您沟通兑奖相关事宜，客服热线：0571-86981383。" },
                            { question: "什么时候开奖？", answer: "在官方官网开奖公告发布后本平台会在1个小时内进行开奖，如果您对开奖有任何疑问，可以拨打我们的客服电话咨询：0571-86981383。" },
                            /*{ question: "提取走势数据失败（走势图获开奖信息获取失败）？", answer: "请您拨打我们的客服电话咨询：0571-86981383。" },*/
                            { question: "开奖后多久会派奖？", answer: "本平台将在开奖后1小时内，将奖金派发到您的账户中，如果您对派奖有任何疑问，可以拨打我们的客服电话咨询：0571-86981383。" },
                            /*{ question: "什么是追号？", answer: "预定您看好的一注或一组号码，连续购买几十或上百期，这样可以预防在某一期忘记购彩，而错过中奖。" },*/
                            { question: "什么是胆拖？", answer: "在购买高频彩和数字彩时选出一个或几个号码为胆码，固定以这一个或几个号码与其他号码分别组成单式或者复式号码进行投注，固定不变的号码为胆码，其他变化的号码为拖码，简称胆拖。" },
                            { question: "奖金如何扣税？", answer: "根据国家相关规定，中奖彩票单注奖金超过1万元时，中奖人需要交纳奖金的20%作为个人所得税，税金由彩票中心代扣代缴，本平台派发到账户内的奖金是根据国家相关规定自动扣除个人所得税后的金额。" }
                        ]
                    },
                    {
                        title: "账号安全",
                        nums: 3,
                        cot: [
                            { question: "你们的平台正规吗？可以保证我的资金安全吗？", answer: "本平台会保证您的资金安全，如果您对资金有任何疑问，可以拨打我们的客服电话咨询：0571-86981383。" },
                            { question: "如何提高账户的安全性？", answer: "在设置密码时有如下建议：（1）组成密码的字符最好在8位以上，字符内容包含大写字母、小写字母和数字。（2）不用常用字符，常用字符包括生日，学号，身份证号，这些字符容易被猜到并被破解。" },
                            { question: "账号是否可以注销？", answer: "不支持注销账户，本平台会保留您的账户记录，方便您的下次登录。" },
                            { question: "如何找回密码？", answer: "点击个人中心----点击登录----点击忘记密码----输入您注册的手机号，再输入您所获取的验证码----设置您的新密码。" }
                        ]
                    },
                    {
                        title: "注册登录",
                        nums: 4,
                        cot: [
                            { question: "注册账号可以修改吗？", answer: "注册账号不支持修改。" },
                            { question: "登录时忘记账号用户名怎么办？", answer: "可能是网络或地域的问题，会造成验证信息存在延时，请您耐心等待。如果读秒完成后再次重试失败，您可以拨打我们的客服电话咨询：  0571-86981383。" }
                        ]
                    },
                ];
                if (a == undefined || b == undefined) return listobj;
                else {
                    return listobj[a].cot[b];
                }
            }

        }
    }])

// 选择提示语
.factory('prompts', [function() {
    return {
        textord: function(a, ary) {
            var texts = "";
            if (a == 6) {
                m = 5;
                n = 2;
            }
            if (a == 11) {
                m = 6;
                n = 1;
            }
            if (a == 12) {
                m = 7;
                n = 0;
            }
            if (ary[0].length >= 0 && ary[0].length < m) {
                if (a == 12) texts = "请至少选择" + m + "个号码";
                else texts = "请至少选择" + m + "个红球";
                return texts;
            } else if (ary[1].length >= 0 && ary[1].length < n) {
                texts = "请至少选择" + n + "个蓝球";
                return texts;
            } else return texts;

        },
        textdan: function(a, ary) {
            var texts = "";
            if (a == 6) {
                if (ary[0].length <= 0) {
                    texts = "请至少选择1个前区胆码";
                } else if (ary[2].length < 2) {
                    texts = "请至少选择2个前区拖码";
                } else if (ary[0].length + ary[2].length < 6) {
                    texts = "请至少选择6个前区号码";
                } else if (ary[3].length < 2) {
                    texts = "请至少选择2个后区拖码";
                }

            }
            if (a == 11) {
                if (ary[0].length <= 0) {
                    texts = "请至少选择1个胆码区红球";
                } else if (ary[2].length < 1) {
                    texts = "请至少选择2个胆码区红球";
                } else if (ary[0].length + ary[2].length < 7) {
                    texts = "请至少选择7个红球";
                } else if (ary[1].length < 1) {
                    texts = "请至少选择1个拖码区蓝球";
                }
            }
            if (a == 12) {
                if (ary[0].length <= 0) {
                    texts = "请至少选择1个胆码";
                } else if (ary[2].length < 2) {
                    texts = "请至少选择2个拖码";
                } else if (ary[0].length + ary[1].length < 8) {
                    texts = "胆码和拖码之和至少为8个";
                }

            }
            return texts
        }
    }
}])

// json配置
    .factory('deploy', [function() {
        return {
        }
    }])