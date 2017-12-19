/**
 * Created by King on 2017/5/25.
 */
angular.module('starter.directive', [])
    .directive('repeatFinish', ['$timeout', function ($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, ele, attr) {
                var pass = scope.Passdata;
                if (scope.$last == true) {
                    var type = true;
                    $timeout(function () {
                        var b = $('.Bettinglist .betbtns');
                        for (var s = 0; s < pass.length; s++) {
                            var matchitem = $('#Bettinglist .match-item');
                            for (var t = 0; t < matchitem.length; t++) {
                                var data = $(matchitem[t]).data('gameid');
                                if (type && pass[s].gameid == data && (pass[s].bettingid == 3 || pass[s].bettingid == 2 || pass[s].bettingid == 1)) {
                                    type = false;
                                    if (!$(matchitem[t]).find('.game-more').hasClass('ssss')) {
                                        $(matchitem[t]).find('.game-more').addClass('ssss');
                                    }
                                    break;
                                }
                            }
                            type = true;
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
                }
            }
        }
    }])

    .directive('sessionInfo', ['$timeout', function ($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, ele, attr) {
                /*if (scope.$last == true) {
                 var _this = $('#zuqiu .match-divider');
                 var num = 0;
                 console.log(_this);
                 $timeout(function() {
                 console.log(scope.bgimg);
                 for(var i =0;i<_this.length;i++){
                 num += parseInt($(_this[i]).find('.date-num').text());
                 }
                 /!*   console.log(num);
                 if(num<=0){
                 scope.bgimg = true;
                 }else{
                 scope.bgimg = false;
                 }
                 scope.$apply(function() {
                 scope.bgimg = true;
                 })
                 console.log(scope.bgimg);*!/
                 },0)
                 }*/
            }
        }
    }])
    .directive('msgRoll', ['$timeout', '$interval', function ($timeout, $interval) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                var top = 0;
                var num = 0;
                $interval(function () {
                    //console.log(element.find('li'));
                    num++;
                    top -= 0.6;
                    if (num >= element.find('li').length) {
                        top = 0;
                        num = 0;
                        element.css({'top': top + 'rem', '-webkit-transition': 'all 0s'});
                    } else {
                        element.css({'top': top + 'rem', '-webkit-transition': 'all 2s'});
                    }
                    //console.log(num);
                }, 3000)
                if (scope.$last == true) {
                    // console.log(new Date().getTime());
                    //console.log(element.find('li')[0])
                }
            }
        }
    }])
    /*    .directive('msgCopy', ['$timeout','$interval', function($timeout,$interval) {
     return {
     restrict: 'AE',
     link: function(scope, element, attr) {
     if (scope.$last == true) {
     // console.log(new Date().getTime());
     console.log(element.parent('ul').find('li'))
     var li = element.parent('ul').find('li');
     console.log(li)
     for(var i =0;i<li.length;i++){
     console.log(element.parent('ul')[0]);
     element.parent('ul')[0].append(li[i]);
     }
     }
     }
     }
     }])*/
 /*   //倒计时
    .directive('countDown',['$interval',function ($interval) {
        return {
            restrict: "E",
            replace: true,
            template: '<span>' +
            //1还没开始阶段
            //1-0 今天
            '<span ng-if="returnState.period==1 && returnState.gap.natureDay==0" ng-show="options.showWhen.indexOf(100)!=-1">今天<span  class="timeTick">{{ returnState.date.hour}}</span> : <span class="timeTick">{{returnState.date.minute}} </span></span>' +
            //1-1 明天
            '<span  ng-if="returnState.period==1 && returnState.gap.natureDay==1"  ng-show="options.showWhen.indexOf(101)!=-1">明天<span class="timeTick"> {{returnState.date.hour}}</span> : <span class="timeTick">{{returnState.date.minute}}</span></span>' +
            // 1-2 后天
            '<span ng-if="returnState.period==1 && returnState.gap.natureDay==2"  ng-show="options.showWhen.indexOf(102)!=-1">后天<span class="timeTick"> {{returnState.date.hour}}</span> : <span class="timeTick">{{returnState.date.minute}}</span></span>' +
            //1-3 没有汉字能表达，除非你说几天后
            '<span ng-if="returnState.period==1 && returnState.gap.natureDay!=0&&returnState.gap.natureDay!=1&&returnState.gap.natureDay!=2" ng-show="options.showWhen.indexOf(99)!=-1"><span class="timeTick"> {{returnState.date.natureMonth}}</span> 月 <span class="timeTick">{{returnState.date.date}}</span>日</span>' +

            // 2 预倒计时和单时间倒计时
            '<span ng-if="returnState.period==2"  ng-show="options.showWhen.indexOf(200)!=-1" >' +
            '<span ng-if="returnState.gap.days!=0"><span class="timeTick"> {{returnState.gap.days}}</span> 天</span>' +
            '<span class="timeTick"> {{returnState.gap.hours}}</span> : ' +
            '<span class="timeTick">{{returnState.gap.minutes}} </span> : ' +
            '<span class="timeTick">{{returnState.gap.seconds}}</span>' +
            '</span>' +

            // 双时间区间中倒计时
            '<span  ng-if="returnState.period==3"  ng-show="options.showWhen.indexOf(300)!=-1" >' +
            '<span ng-if="returnState.gap.days!=0"><span class="timeTick"> {{returnState.gap.days}}</span> 天</span>' +
            '<span class="timeTick"> {{returnState.gap.hours}}</span> : ' +
            '<span class="timeTick">{{returnState.gap.minutes}}</span> : ' +
            '<span class="timeTick">{{returnState.gap.seconds}} </span>' +
            '</span>' +
            // 结束了
            '</span>',
            scope: {
                options: "=", //传入选项
                returnState: "=" //返回选项
            },
            link: function (scope, ele, attr) {

                var timer;
                //定时器
                // 这里用watch是因为有可能是在指令解析完毕后动态改变options，而此时指令惰性地不去更新 options导致无法发挥作用。
                scope.$watch('options', function (options) {
                    if (!options) return console.log("倒计时指令缺少必要参数");

                    var opt = {};
                    /!***参数过滤****!/
                    opt.startDate = validateDate(options.startDate); //开始时间，必要参数。可传入数字或者数字字符串，含义为时间戳。

                    opt.endDate = validateDate(options.endDate); // 结束时间，可选参数。同上。

                    opt.preCountMs = options.preCountMs || 2 * 3600 * 1000;  //双时间的时候可以预倒计时。

                    opt.showWhen = options.endDate ? (options.showWhen || [300]) : (options.showWhen || [200]);  // 在什么阶段显示。可能值：99表示没开始要显示x月x日，100表示要显示今天x点x分,101表示要显示明天x点x分，102表示要显示后天x点x分，200表示要显示预计倒计时的时候显示,300表示区间倒计时要显示。400结束了，传或者不传都不会显示。

                    opt.preFn = validateFn(options.preFn); //表示预倒计时开始那刻要执行的函数。

                    opt.startFn = validateFn(options.startFn); //表示预开始那刻要执行的函数。

                    opt.endFn = validateFn(options.endFn); //表示预结束那刻要执行的函数。

                    //单时间倒计时。
                    if (!opt.endDate) {
                        timer = $interval(function () {
                            if (opt.startDate > new Date().getTime()) {
                                scope.returnState = {
                                    period: 2,
                                    gap: transformDate(opt.startDate).gap
                                };
                                scope.reloadWhenStart = true;
                            }
                            else {
                                if (scope.reloadWhenStart) scope.options.startFn();
                                scope.returnState = {
                                    period: 4,
                                    date: transformDate(options.startDate).date
                                }
                            }
                        }, 1000)
                    }
                    //  双时间倒计时。
                    else {
                        timer = $interval(function () {
                            scope.returnState = shortCut(opt);

                            if (scope.returnState.period == 1 && scope.returnState.gap.natureDay == 0) scope.reloadWhenPreCount = true;
                            if (scope.returnState.period == 2) scope.reloadWhenStart = true;
                            if (scope.returnState.period == 3) scope.reloadWhenEnd = true;

                            if (scope.reloadWhenPreCount && scope.returnState.period == 2) opt.preFn();
                            if (scope.reloadWhenStart && scope.returnState.period == 3) opt.startFn();
                            if (scope.reloadWhenEnd && scope.returnState.period == 4) opt.endFn();

                        }, 1000)
                    }
                })

                scope.$on('$destroy', function () {
                    $interval.cancel(timer);
                });

                function validateDate(dateTime) {
                    dateTime = parseInt(dateTime);
                    if (typeof dateTime != "number") return console.error("需要整数作为参数");
                    dateTime = parseInt(dateTime * Math.pow(10, 13 - dateTime.toString().length));
                    return dateTime;
                }

                function validateFn(fn) {
                    if (!fn || typeof fn != "function") return function () {
                        window.location.reload()
                    }
                    else return fn;
                };
                function period(options) {
                    if (typeof options != "object" || typeof options.length == "number") {
                        console.error("countDown传入的参数错误。\n应该是一个对象,key有startDate(起始时间戳), endDate(结束时间戳), preCountMs(预倒计时阈值,单位为毫秒)");
                        console.log("返回period为整数类型,1表示未开始且未进入倒计时,2表示进入开始倒计时,3表示结束倒计时,4表示已经结束");
                        return
                    }
                    options.startDate = validateDate(options.startDate);
                    options.endDate = validateDate(options.endDate);
                    options.preCountMs = options.preCountMs || 2 * 3600 * 1000;

                    if (options.startDate > options.endDate) return console.error("时间起始值矛盾");
                    var now = new Date();
                    var nowTime = now.getTime();

                    if (nowTime > options.endDate) return 4;
                    else if (options.endDate >= nowTime && nowTime >= options.startDate) return 3;
                    else if (options.startDate > nowTime && nowTime > options.startDate - options.preCountMs) return 2;
                    else if (options.startDate - options.preCountMs >= nowTime) return 1;
                    else console.error("出错了，找少侠");
                };
                function transformDate(dateTime) {
                    dateTime = validateDate(dateTime);
                    var thisDate = new Date(dateTime);
                    var gap = {};
                    var now = new Date();
                    var zeroThisDateTime = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate()).getTime();
                    var zeroNowDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    var _toString = function (num) {
                        var str = num.toString();
                        return str.length == 1 ? "0" + str : str;
                    };
                    gap.Ms = dateTime - now.getTime();
                    gap.days = _toString(parseInt(gap.Ms / (24 * 3600 * 1000)));
                    gap.hours = _toString(parseInt((gap.Ms - gap.days * 24 * 3600 * 1000) / (3600 * 1000)));
                    gap.minutes = _toString(parseInt((gap.Ms - gap.days * 24 * 3600 * 1000 - gap.hours * 3600 * 1000) / (60 * 1000)));
                    gap.seconds = _toString(parseInt((gap.Ms - gap.days * 24 * 3600 * 1000 - gap.hours * 3600 * 1000 - gap.minutes * 60 * 1000) / 1000));
                    gap.natureDay = _toString((zeroThisDateTime - zeroNowDateTime) / (24 * 3600 * 1000));

                    return {
                        date: {
                            year: thisDate.getFullYear(),
                            month: _toString(thisDate.getMonth()),
                            natureMonth: _toString(thisDate.getMonth() + 1),
                            date: _toString(thisDate.getDate()),
                            hour: _toString(thisDate.getHours()),
                            minute: _toString(thisDate.getMinutes()),
                            second: _toString(thisDate.getSeconds())
                        },
                        gap: gap
                    }
                };
                function shortCut(options) {
                    var _period = period(options);
                    switch (_period) {
                        case 1:
                            return {
                                period: 1,
                                gap: transformDate(options.startDate).gap,
                                date: transformDate(options.startDate).date
                            };
                        case 2:
                            return {
                                period: 2,
                                gap: transformDate(options.startDate).gap
                            };
                        case 3:
                            return {
                                period: 3,
                                gap: transformDate(options.endDate).gap
                            };
                        case 4:
                            return {
                                period: 4,
                                date: transformDate(options.startDate).date
                            }
                    }
                }
            }
        }
    }])*/
    //新手礼包取消
    .directive('cancelBag', [function () {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                element.bind('click', function (event) {
                    console.log('关闭');
                })
            }
        }
    }])
    //包中比赛分析
    .directive('bzAnalyze', ['UserInfo', function (UserInfo) {
        return {
            restrict: 'EA',
            scope: false,
            replace: true,
            transclude: true,
            template: '<div class="bzanalyzebox"><ion-content ng-bind-html="matchAnalysis" style="height: 100%;width:100%;padding: .3rem;top: 0;" overflow-scroll="true"></ion-content></div>',
            controller: ['$scope', function ($scope) {
                // 控制器逻辑
            }]
        }
    }])
    //确认支付
    .directive('confirmPay', ['$state', 'PayFlow', 'ApiEndpoint', 'UserInfo', '$http', 'showAlertMsg', 'HttpStatus', '$ionicLoading', function ($state, PayFlow, ApiEndpoint, UserInfo, $http, showAlertMsg, HttpStatus, $ionicLoading) {
        return {
            restrict: 'A',
            scope: false,
            replace: false,
            link: function ($scope, element, attrs) {
                element.bind('click', function (event) {
                    var chargedata = {
                        money: $scope.Transactiondata.chargemoney,
                        busorderid: $scope.Transactiondata.betorderid,
                    }
                    var pid = 0000;
                    if($scope.type){
                    pid = $scope.type;
                    }
                    if ($scope.Transactiondata.chargemoney != 0) {
                        PayFlow.charge(chargedata,pid);
                        return false;
                    }
                    var paydata = {
                        orderid: $scope.Transactiondata.betorderid,
                        ordermoney: $scope.Transactiondata.paymoney,
                        token: UserInfo.l.token || '',
                    }
                    PayFlow.pay(paydata).then(function (data) {
                        HttpStatus.codedispose(data);
                        if (data.status == '1') {
                            if (data.data.payresult == 2) {
                                PayFlow.charge(chargedata);
                            }
                            if (data.data.payresult == 1) {
                                UserInfo.remove(['jsondatapls', 'jsondatasyxw', 'Passdata', 'historybet']);
                                $state.go('practice.paid', {
                                    id: data.data.orderid,
                                    type: $scope.type,
                                    palytype: $scope.palytype,
                                });
                            }
                        }
                    })
                    //console.log(scope.Transactiondata);
                    //console.log($scope.Transactiondata);
                })
            }
        }
    }])
    //确认支付-指引
    .directive('confirmPayguide', ['$state', 'PayFlow', 'ApiEndpoint', 'UserInfo', '$http', 'showAlertMsg', 'HttpStatus', '$ionicLoading', function ($state, PayFlow, ApiEndpoint, UserInfo, $http, showAlertMsg, HttpStatus, $ionicLoading) {
        return {
            restrict: 'A',
            scope: false,
            replace: false,
            link: function ($scope, element, attrs) {
                element.bind('click', function (event) {
                    var chargedata = {
                        money: $scope.Transactiondata.chargemoney,
                        busorderid: $scope.Transactiondata.betorderid,
                    }
                    var pid = 0000;
                    if($scope.type){
                        pid = $scope.type;
                    }
                    if ($scope.Transactiondata.chargemoney != 0) {
                        PayFlow.charge(chargedata,pid);
                        return false;
                    }
                    var paydata = {
                        orderid: $scope.Transactiondata.betorderid,
                        ordermoney: $scope.Transactiondata.paymoney,
                        token: UserInfo.l.token || '',
                    }
                    PayFlow.pay(paydata).then(function (data) {
                        HttpStatus.codedispose(data);
                        if (data.status == '1') {
                            if (data.data.payresult == 2) {
                                PayFlow.charge(chargedata);
                            }
                            if (data.data.payresult == 1) {
                                UserInfo.remove(['jsondatapls', 'jsondatasyxw', 'Passdata', 'historybet']);
                                $state.go('practice.syxwguidec', {
                                    id: data.data.orderid,
                                    type: $scope.type,
                                    palytype: $scope.palytype,
                                });
                            }
                        }
                    })
                    //console.log(scope.Transactiondata);
                    //console.log($scope.Transactiondata);
                })
            }
        }
    }])
    //取消订单
    .directive('cancelBetting', ['UserInfo', 'HttpServer', function (UserInfo, HttpServer) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                element.bind('click', function (event) {
                    //console.log(scope.Transactiondata);
                    var data = {
                        orderid: scope.Transactiondata.betorderid,
                        token: UserInfo.l.token,
                    }
                    HttpServer.Hpost(data, '/betting/bill/cancel')
                })
            }
        }
    }])
    //支付金额明细
    .directive('payMonney', ['UserInfo', function (UserInfo) {
        return {
            restrict: 'EA',
            scope: true,
            replace: false,
            transclude: true,
            template: '<div class="itemlist2" id="itemlist" style="-webkit-box-pack: justify;box-pack: justify;-webkit-justify-content: space-between;justify-content: space-between;"><span>订单金额</span><span>{{Transactiondata.betmoney|number:2}}元</span></div>' +
            '<div class="itemlist" ng-click="couponlist()"><span>优惠券</span><span ng-if="Transactiondata.props.lenght>0 || Transactiondata.propuse_id"><i class="yhq"></i>{{Transactiondata.propuse_type|mycoutype}}({{Transactiondata.propuse_name}})<i class="icon iconfont icon-jiantou"></i></span></div>' +
            '<div class="itemlist"><span>支付金额</span><span>{{Transactiondata.paymoney|number:2}}元</span></div>' +
            '<div class="itemlist" style="padding: .23rem .32rem .56rem;"><span>账户余额</span><span>{{Transactiondata.walletmoney|number:2}}元</span><div class="payxjcj">现金:{{Transactiondata.walletcash|number:2}}元 彩金:{{Transactiondata.walletvcash|number:2}}元</div></div>' +
            '<div class="itemlist" ng-if="Transactiondata.chargemoney!=0"><span>需支付差额</span><span>{{Transactiondata.chargemoney|number:2}}元</span></div>',
            controller: ['$scope', function ($scope) {
                // 控制器逻辑
                /*   console.log($scope.myData);
                 $scope.Transactiondata = $scope.myData;*/
                //console.log($scope.Transactiondata);
                $scope.couponlist = function () {
                    if ($scope.Transactiondata.props.length == 0) {
                        return false;
                    }
                    var len = $('#paymentnew #confirmationnew').length;
                    $($('#paymentnew #confirmationnew')[len-1]).css('left', '-100%');
                }
            }]
        }
    }])
    //支付优惠券选择
    .directive('payCoupon', ['ApiEndpoint', 'UserInfo', '$http', 'showAlertMsg', 'HttpStatus', '$ionicLoading', function (ApiEndpoint, UserInfo, $http, showAlertMsg, HttpStatus, $ionicLoading) {
        return {
            restrict: 'AE',
            scope: false,
            replace: false,
            transclude: true,
            template: '<div class="yhqtitle" ng-click="goleft()"><i class="icon iconfont icon-jiantou"></i>选择优惠券</div><ion-scroll overflow-scroll="false" style="height: 90%;border-top: 1px solid #ddd;" has-bouncing="false"><ul><li ng-click="paycon(0)" class="couitemlist"><div class="l_a">不使用优惠券</div><div class="r_a"><span class="set_a"><i class="d" ng-class="{rd: !Transactiondata.propuse_id}"></i></span></div></li>' +
            '<li ng-repeat="pro in Transactiondata.props" ng-click="paycon(pro)" class="couitemlist"><div class="l_a"><i class="yhq"></i>{{pro.proptypename}}</div>' +
            '<div class="r_a">{{pro.propname}}<span class="set_a" ng-class="{op: !pro.useable}"><i class="d" ng-class="{rd: Transactiondata.propuse_id==pro.propid}"></i></span></div><div class="dis" ng-if="!pro.useable"></div></li> </ul></ion-scroll>',
            controller: ['$scope', function ($scope) {
                // 控制器逻辑
                //选择返回
                $scope.paycon = function (pro) {
                    if (pro == 0) {
                        pro = {};
                        pro.propid = '';
                        pro.proptype = '';
                    } else if (!pro.useable) {
                        return false;
                    }
                    //console.log(pro);
                    $('#confirmation').css('left', '0');
                    $ionicLoading.show({template: "Loading", duration: 30000});
                    $http({
                        method: 'post',
                        url: ApiEndpoint.url + "/betting/bill/changeprop",
                        data: {
                            orderid: $scope.Transactiondata.betorderid,
                            propid: pro.propid,
                            proptype: pro.proptype,
                            token: UserInfo.l.token,
                        }
                    }).success(function (data) {
                        $ionicLoading.hide();
                        HttpStatus.codedispose(data);
                        if (data.status == '1') {
                            $scope.goleft();
                            $scope.Transactiondata = data.data;
                        }
                    }).error(function (pro) {
                        $ionicLoading.hide();
                        showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                    })
                    //console.log($scope.Transactiondata);
                }
                $scope.goleft = function () {
                    var len = $('#paymentnew #confirmationnew').length;
                    $($('#paymentnew #confirmationnew')[len-1]).css('left', '0');
                }
            }]
        }
    }])
    //支付选择
    .directive('payType', ['UserInfo', function (UserInfo) {
        return {
            restrict: 'EA',
            scope: {},
            replace: false,
            transclude: true,
            templateUrl: 'templates/common/pay.html?1207',
            controller: ['$scope', function ($scope) {
                // 控制器逻辑
                //微信h5开放
                $scope.data = {
                    ptype: UserInfo.l.sucpayway || 'WX',
                }
                if (!UserInfo.l.sucpayway) {
                    UserInfo.add('sucpayway', $scope.data.ptype);
                }
                if (UserInfo.l.is_weixn == 'yes') {
                    $scope.is_weixn = true;
                    $scope.data.ptype = 'WX';
                    UserInfo.add('sucpayway', 'WX');
                } else {
                    $scope.is_weixn = false;
                }
                //微信h5支付关闭
                //需在pay.html页面修改为<div class="WalletPay" ng-if="is_weixn">
               /* $scope.data = {};
                 if (UserInfo.l.is_weixn == 'yes') {
                 $scope.is_weixn = true;
                 UserInfo.add('sucpayway', 'WX');
                 $scope.data.ptype = 'WX';
                 } else{
                 $scope.is_weixn = false;
                 UserInfo.add('sucpayway', 'ALI');
                 $scope.data.ptype = 'ALI';
                 }*/


                $scope.pay = function () {
                    UserInfo.add('sucpayway', $scope.data.ptype);
                }
            }]
        }
    }])
    //提现银行卡列表
    .directive('moduleWithdraw', ['UserInfo', function (UserInfo) {
        return {
            restrict: 'EA',
            scope: false,
            replace: true,
            transclude: true,
            //template : '<div data="data">子指令:<input ng-model="data.name" /></div>',
            templateUrl: 'templates/common/modulewithdraw.html?0812',
            controller: ['$scope', '$state', function ($scope, $state) {
                //console.log($scope.data);
                //console.log($('.modulebankBOX'));
                // 控制器逻辑
                $scope.getbank = function (c, $event) {
                    //console.log(c);
                    if (c == 0) {
                        $scope.showmodule = false;
                    } else if (c == 1) {
                        $state.go('user.BankCardList');
                    } else {
                        $scope.showmodule = false;
                        $scope.showbank = true;
                        //console.log($scope.showmodule);
                        //console.log(c);
                        $scope.login.cant = c.cardno;
                        $scope.login.cname = c.name;
                        $scope.login.msg = c.bank;
                        //console.log($scope.login);
                    }
                    $event.stopPropagation();
                }
                $scope.$on('$ionicView.beforeEnter', function () {
                    //console.log('进入');
                    if (UserInfo.l.bank) {
                        $scope.carlist = JSON.parse(UserInfo.l.bank) || '';
                    }
                })
                if (UserInfo.l.bank) {
                    $scope.carlist = JSON.parse(UserInfo.l.bank) || '';
                }
                $('.modulebankBOX').on('touchmove', function (e) {
                    e.preventDefault();
                })
            }],

        }
    }])
    //足球标题栏
    .directive('scrollMemory', ['$ionicGesture', 'UserInfo', function ($ionicGesture, UserInfo) {
        return {
            restrict: 'A',
            scope: false,
            replace: false,
            link: function (scope, element, attr) {
                var parent = $(angular.element(element)[0]).parents('ion-view');
                var dome = '<dt style="position: absolute;top:.88rem;" class="match-divider ng-binding" scroll-memory="">170726<span class="hall-mar ng-binding">(周三)</span><em class="date-num ng-binding">27</em>场比赛可投<i class="arrow-ico trans-tf"></i></dt>';
                parent.append(dome);
                $('#zuqiu').on('scroll', function (event) {
                    scrollTop = document.getElementById('zuqiu').scrollTop;
                    scope.$apply(function () {
                        scope.scrolllen = scrollTop;
                    })
                });
            },
            /* controller: ['$scope',function($scope,$attrs,attr) {
             // 控制器逻辑
             }]*/
        }
    }])
    //阻止浏览器默认事件
    .directive('preventDefault', [function () {
        return {
            restrict: 'A',
            scope: {
                copyText: '='
            },
            link: function (scope, element, attrs) {
                element.bind('touchmove', function (event) {
                    //console.log(event);
                    event.preventDefault();
                })
            }
        }
    }])
    .directive('ngCopyable', function ($document) {
        return {
            restrict: 'A',
            scope: {
                copyText: '='
            },
            link: function (scope, element, attrs) {
                //点击事件
                element.bind('click', function () {
                    //创建将被复制的内容
                    $document.find('body').eq(0).append('<div id="ngCopyableId">' + scope.copyText + '</div>');
                    var newElem = angular.element(document.getElementById('ngCopyableId'))[0];

                    var range = document.createRange();
                    range.selectNode(newElem);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    var successful = document.execCommand('copy');

                    //执行完毕删除
                    var oldElem = document.getElementById('ngCopyableId');
                    oldElem.parentNode.removeChild(oldElem);
                    window.getSelection().removeAllRanges();

                    //提示
                    if (successful) {
                        alert('已成功复制：' + scope.copyText);
                    } else {
                        alert('浏览器不支持复制');
                    }

                });
            }

        };
    });