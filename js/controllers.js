angular.module('starter.controllers', [])

/*//全局变量
.constant('ApiEndpoint', {
        url: 'http://192.168.1.201:8080', //测试请求地址
        bacgurl: 'http://192.168.1.135:8100', //测试地址
        //url: 'http://b170f53896.51mypc.cn:8080', //测试请求地址
        //bacgurl:'http://b170f53896.51mypc.cn:8866',//测试地址
        //bacgurl:'http://192.168.1.201:8866',//测试地址
        //url: 'http://ssl.778668.cn:8080', //测试请求地址
        //url: 'http://wcwcwc.net:8080',
        //bacgurl:'http://wcwcwc.net:8866',
        //url: 'https://m.778668.cn:8080',
        //bacgurl: 'http://m.778668.cn',
        version: '0812',
    })*/

    .controller('HallCtrl', ['homepage','$ionicSlideBoxDelegate','HttpServer','novice','$timeout','activity','downloadapp', '$interval', '$rootScope', '$stateParams', 'browser', "$scope", "$state", "$http", "showAlertMsg", "ApiEndpoint", "UserInfo", "$ionicLoading", "$ionicHistory", "serializeUrl", "HttpStatus", function(homepage,$ionicSlideBoxDelegate,HttpServer,novice,$timeout,activity,downloadapp, $interval, $rootScope, $stateParams, browser, $scope, $state, $http, showAlertMsg, ApiEndpoint, UserInfo, $ionicLoading, $ionicHistory, serializeUrl, HttpStatus) {
        //初始化完成回调
        //alert(navigator.userAgent);
/*        $rootScope.initpost.then(function(data) {
            var dl = {
                token: UserInfo.l.token
            }
            HttpServer.Hpost(dl, '/act/banner').then(function (data) {
                if (data.status == 1) {
                    $scope.bannerlist = data.data;
                }
                //console.log($scope.bannerlist)
                $ionicSlideBoxDelegate.$getByHandle('hallbanner').update();
            })
        })*/
       /* var dl = {
            token: UserInfo.l.token
        }*/
        /*HttpServer.Hpost(dl, '/act/banner').then(function (data) {
            if (data.status == 1) {
                $scope.bannerlist = data.data;
            }
            //console.log($scope.bannerlist)
            $ionicSlideBoxDelegate.$getByHandle('hallbanner').update();
        })*/
        //banner跳转
        $scope.Goagainpay = function(url) {
            homepage.banner(url);
        }
       /* $http({
            method: 'post',
            url: 'http://192.168.1.159:8080/initziptest'
        }).success(function(data) {
            console.log(data);
        })*/

        $timeout(function () {
            var time = new Date().getDate();
            if(UserInfo.l.logintime && UserInfo.l.logintime!= time){
                //console.log(time)
                UserInfo.add('logintime',time);
                HttpStatus.getinit()
            }else{
                UserInfo.add('logintime',time);
                //HttpStatus.getinit()
            }
        },3000);
        //注册礼包弹窗控制
        if(sessionStorage.getItem('bag')!='1' && !UserInfo.l.account){
            $scope.bagreg = $interval(function() {
                if(UserInfo.l.bagreg=='true'){
                    novice.bag();
                    $interval.cancel($scope.bagreg);
                }else if(UserInfo.l.bagreg=='false'){
                    $interval.cancel($scope.bagreg);
                }
            }, 1000)
        }
        $scope.flagt = $stateParams.flag;
        //HttpStatus.zqlist();
        if ($scope.flagt == 'zjdl' && UserInfo.l.guid == 'true' && !browser.iswebapp()) {
            downloadapp.showioszhiyin();
        }
        $scope.lotteryfalg = false;
            //['img/banner1.webp?0818','img/banner2.webp?0818','img/banner3.webp?0818'];
        //apk下载
        if (UserInfo.l.navigator == 'android') {
            $scope.navigator = 'android'
        } else {
            $scope.navigator = 'ios';
            $scope.iswebapp = browser.iswebapp();
            $scope.isSafari = browser.isSafari();
        }
        var account = UserInfo.l.account || '';
        $scope.isweixin = UserInfo.l.is_weixn;
        if (UserInfo.l.guid == 'true' && UserInfo.l.navigator == 'android') {
            $scope.guid = true;
            $scope.durl = downloadapp.androidDow();
        } else {
            $scope.guid = false;
        }
        $scope.guide = function() {
            if (UserInfo.l.navigator == 'android') {
                downloadapp.showdownload();
            } else if (UserInfo.l.navigator == 'ios') {
                downloadapp.showioszhiyin();
            }
            //$state.go('practice.appdownload',{account:account});
        }
       /* if(UserInfo.l.token){
            activity.lotterylist().then(function (data) {
                if(data.data.length>0){
                    if(data.data[0].atype == 'BAOZHONG'){
                        $rootScope.atype = data.data[0].atype;
                    }else{
                        $rootScope.atype = false;
                    }
                }else{
                    $rootScope.atype = false;
                }
            })
        }*/
        //console.log(n);
        //包中活动
        $scope.baozhong = function () {
            activity.lotterylist().then(function (data) {
                //console.log(data.data[0].betInfo.betStr);
                    activity.dispose(data);
            })
        }
        //路由跳转
        $scope.Gopaid = function() {
            $state.go('practice.paid');
        }
        $scope.goLotterylist = function() {
            $state.go('practice.Lotterylist');
        }
        $scope.goUser = function() {
            $ionicHistory.clearCache().then(function() {
                $state.go('tab.account');
            })
        };
        $scope.goqxc = function(a) {
            window.localStorage.removeItem("historybet");
            $ionicHistory.clearCache().then(function() {
                $state.go('practice.lottery-seven', { type: a });
            })
        }
        $scope.goSuperlot = function(a) {
            window.localStorage.removeItem("historybet");
            $ionicHistory.clearCache().then(function() {
                $state.go('practice.lottery-super', { type: a });
            })
        }
        $scope.gotrend = function() {
            $ionicHistory.clearCache().then(function() {
                $state.go('practice.trend');
            })
        }
        $scope.gohall = function(url, type) {
            UserInfo.remove(['jsondatapls', 'jsondatasyxw', 'Passdata', 'historybet']);
            $ionicHistory.clearCache().then(function() {
                $state.go(url, { type: type });
            })
        }

        $scope.$on('$destroy', function() {
            if ($scope.activitylist) {
                $interval.cancel($scope.activitylist);
            }
        })
        //进入当前视图
        $scope.$on('$ionicView.beforeEnter', function() {
            $ionicSlideBoxDelegate.$getByHandle('hallbanner').update();
            $timeout(function() {
 /*               var worker = new Worker("js/my_task.js");
                worker.onmessage = function(evt){
                    console.log('消息收到啦：'+ evt.data);
                    worker.terminate();
                };
                worker.onerror = function(e){
                    alert('demo出错了！出错原因是：' + e.message);
                    worker.terminate();
                };
                worker.postMessage('这是webworker的demo！');*/

            }, 500)
            //拉取包中活动数据
            var n = UserInfo.l.msginterval * 1000 || '30000';
            $scope.activitylist = $interval(function() {
                activity.lotterylist().then(function (data) {
                    if(data.data.length>0){
                        if(data.data[0].atype == 'BAOZHONG'){
                            $rootScope.atype = data.data[0].atype;
                        }else{
                            $rootScope.atype = false;
                        }
                    }else{
                        $rootScope.atype = false;
                    }
                })
            }, n)
        });
        //离开当前视图
        $scope.$on('$ionicView.leave', function() {
            if ($scope.activitylist) {
                $interval.cancel($scope.activitylist);
            }
        });
    }])

//我的
.controller('AccountCtrl', ["browser", "$scope", "$state", "stock", "UserInfo", "$http", "ApiEndpoint", "$ionicLoading", "showAlertMsg", "$ionicHistory", "HttpStatus", "$ionicScrollDelegate", function(browser, $scope, $state, stock, UserInfo, $http, ApiEndpoint, $ionicLoading, showAlertMsg, $ionicHistory, HttpStatus, $ionicScrollDelegate) {
        $scope.flag = UserInfo.l.flag;
        $scope.loginTYPE = false;
        var account = UserInfo.l.account || '';
        if (UserInfo.l.guid == 'true' && UserInfo.l.navigator == 'android') {
            $scope.guid = true;
            $scope.mytop = { 'top': '4.8rem' };
        } else {
            $scope.guid = false;
            $scope.mytop = { 'top': '4.27rem' };
        }
        $scope.guide = function() {
            $state.go('practice.appdownload', { account: account });
        }
        $scope.userinfo = {
            head: UserInfo.l.head,
            phone: UserInfo.l.phone,
            nick: UserInfo.l.nick,
            money: UserInfo.l.money||0,
            vmoney: UserInfo.l.vmoney||0,
            gcoin: UserInfo.l.gcoin||0,
        };
        if (!$scope.userinfo.head) {

        } else {
            $scope.imghead = { 'background': 'url(' + $scope.userinfo.head + ')', 'background-size': '100% 100%' }
        }

        //登录状态获取用户个人信息
        if (stock.Nonull($scope.flag)) {
            $scope.loginTYPE = true;
            $http({
                method: 'post',
                url: ApiEndpoint.url + '/usr/myinfo',
                data: {
                    token: UserInfo.l.token
                },
            }).success(function(data) {
                if (data.status == '1') {
                    UserInfo.save(data.data);
                    $scope.userinfo = {
                        head: UserInfo.l.head,
                        phone: UserInfo.l.phone,
                        nick: UserInfo.l.nick,
                        money: UserInfo.l.money,
                        vmoney: UserInfo.l.vmoney,
                        gcoin: UserInfo.l.gcoin,
                    };
                    if (browser.is_weixn == 'yes') {
                        UserInfo.add('sucpayway', 'WX');
                    } else {
                        UserInfo.add('sucpayway', UserInfo.l.sucpayway);
                    }
                } else if (data.status == '100') {
                    window.localStorage.removeItem('flag');
                    $scope.loginTYPE = false;
                    //showAlertMsg.showMsgFun('提示', '请重新登录');
                    //UserInfo.l.clear();
                }
            })
        }
        $scope.Param = {
            token: UserInfo.l.token,
        }

        // var jsondata = JSON.stringify(Chats.all());
        //  console.log(jsondata.length*33);
        //  UserInfo.add('jsondata',jsondata);
        //  console.log(JSON.parse(jsondata));

        //绑定上传
        angular.element(document.querySelector('#img-head')).on("click", function() {
                document.querySelector('#file-head').click();
            })
            //上传头像
        $scope.doPostimg = function() {
                $ionicLoading.show({ content: 'Loading', duration: 30000 });
                var fd = new FormData();
                var file = document.querySelector('input[type=file]').files[0];
                var postData = {
                        token: $scope.Param.token,
                        picture: file
                    }
                    //console.log(file);
                angular.forEach(postData, function(val, key) {
                    fd.append(key, val);
                });
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/usr/set/head",
                    data: fd,
                    headers: {
                        'Content-Type': undefined,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
                    },
                    transformRequest: angular.identity
                }).success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == 0) {
                        showAlertMsg.showMsgFun('提示', data.msg);
                    } else {
                        showAlertMsg.showMsgFun('提示', '上传成功');
                        $scope.imghead = { 'background': 'url(' + data.data + ')' };
                    }
                }).error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('温馨提示', '网络连接失败，请检查网络连接');
                });
            }
            //列表查询
      /*  $scope.changeTab = function(evt) {
            $ionicScrollDelegate.$getByHandle('orderlist').scrollTop();
            var elem = evt.currentTarget;
            $scope.vle = elem.getAttributeNode('data-active').value;
            $scope.goods_load_over = true;
            $scope.search.page = 1;
            if ($scope.search.page == 1) {
                $scope.list = [];
            }
            $scope.doPost();
        }
        $scope.list = new Array();
        $scope.goods_load_over = true;
        $scope.maxData = '';
        $scope.data = '';
        $scope.search = {
            page: 1,
            token: UserInfo.l.token || '',
        };
        $scope.doPost = function() {
            if (!UserInfo.l.flag) {
                $scope.goods_load_over = false;
                $scope.$broadcast('scroll.refreshComplete');
                return false;
            }
            if ($scope.vle == 1) {
                var url = '/wallet/item/list';
                $scope.search.type = 0;
            } else if ($scope.vle == 4) {
                var url = '/betting/order/list'
                $scope.search.flag = 0;
            } else if ($scope.vle == 2) {
                var url = '/betting/order/list'
                $scope.search.flag = 1;
            }
            //$ionicLoading.show({content: 'Loading', duration: 30000})
            $http({
                    method: 'post',
                    url: ApiEndpoint.url + url,
                    data: $scope.search,
                }).success(function(data) {
                    //$ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        $scope.maxData = data.data.items;
                        $scope.data = data.data;
                        if ($scope.search.page >= $scope.data.totalpage) {
                            $scope.goods_load_over = false;
                            $ionicScrollDelegate.$getByHandle('orderlist').resize();
                        }
                        if (!$scope.maxData) {
                            $scope.bgimg = true;
                            return false;
                        } else {
                            $scope.bgimg = false;
                        }
                        for (var i = 0; i < $scope.maxData.length; i++) {
                            $scope.list.push($scope.maxData[i]);
                        }
                    } else {
                        $scope.goods_load_over = false;
                    }
                }).error(function() {
                    $ionicLoading.hide();
                    $scope.goods_load_over = false;
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                    $scope.$broadcast('scroll.refreshComplete');
                })
                //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //下拉刷新
        $scope.bomdoPost = function() {
                $scope.goods_load_over = true;
                $scope.search.page = 1;
                if ($scope.search.page == 1) {
                    $scope.list = [];
                }
                $scope.doPost();
            }
            //翻页
        $scope.loadParticulars = function() {
                $scope.search.page++;
                if ($scope.search.page > $scope.data.totalpage) {
                    $scope.goods_load_over = false;
                    return false;
                }
                $scope.doPost();
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //$ionicScrollDelegate.scrollTop(true);
            }
            //查看订单
        $scope.godetaail = function(list) {
                if ($scope.vle == 1) {
                    return false;
                }
                $state.go('practice.detail', { id: list, type: 1 });
            }*/
            //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            //window.history.back();
            $state.go('tab.hall');
        }
        $scope.Gohome = function() {
                $state.go('tab.hall');
            }
            //退出登录
        $scope.goOutLogin = function() {
            UserInfo.l.clear();
            location.replace(ApiEndpoint.bacgurl);
        }
    $scope.gourlquery = function(url,vle) {
        $state.go(url,{vle:vle});
    };
        $scope.filehear = function() {
            $scope.doPostimg();
        }
        $scope.goSetting = function() {
            $state.go('user.Setting');
        };
        $scope.gomsglist = function() {
            $state.go('message.msglist');
        };
        $scope.goLogin = function() {
            $state.go('user.login');
        };
        $scope.goRegister = function() {
            $state.go('user.register');
        };
        $scope.goLostPWD = function() {
            $state.go('user.LostPWD');
        };
        $scope.goChangePWD = function() {
            $state.go('user.ChangePWD');
        };
        $scope.goWalletPay = function() {
            $state.go('user.WalletPay');
        };
        $scope.goWithdraw = function() {
            $ionicHistory.clearCache(['user.Withdraw']).then(function() {
                $state.go('user.Withdraw');
            })
        };
        $scope.gopaysuccess = function() {
            $state.go('user.Paysuccess');
        };
    $scope.gourl = function(url) {
        $state.go(url);
    };
        $scope.gozq = function() {
                $ionicHistory.clearCache(['practice.Soccerhall', 'practice.basketballhall']).then(function() {
                    $state.go('practice.Soccerhall')
                })
            }
            /* $scope.$on('popstate', function () {
                 console.log('返回上一页');
             })*/
            /* window.addEventListener("popstate", function(e) {
                 alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
             }, false);*/
    }])
    //现金记录
    .controller('CashContactsCtrl', ["$stateParams","browser", "$scope", "$state", "stock", "UserInfo", "$http", "ApiEndpoint", "$ionicLoading", "showAlertMsg", "$ionicHistory", "HttpStatus", "$ionicScrollDelegate", function($stateParams,browser, $scope, $state, stock, UserInfo, $http, ApiEndpoint, $ionicLoading, showAlertMsg, $ionicHistory, HttpStatus, $ionicScrollDelegate) {
        $scope.vle = $stateParams.vle;//5金币交易明细，6彩金交易明细,40金币购彩记录
        $scope.bgimg = false;
        $scope.list = '';
        $scope.text = {
            '4':'购彩记录',
            '2':'中奖记录',
            '1':'账户明细',
            '5':'金币明细',
            '6':'账户明细',
            '40':'购彩记录'
        }
        $scope.tabtop = function () {
            if($scope.vle==1 || $scope.vle==6){
                $scope.mytop = { 'top': '1.6rem' };
            }else{
                $scope.mytop = { 'top': '0.88rem' };
            }
        }
        $scope.tabtop();
        //列表查询
        $scope.changeTab = function(evt) {
            var elem = evt.currentTarget;
            $scope.vle = elem.getAttributeNode('data-active').value;
            $scope.goods_load_over = true;
            $scope.search.page = 1;
            $scope.list = [];
            $scope.doPost();
            $ionicScrollDelegate.$getByHandle('checklist').scrollTop();
        }
        $scope.list = new Array();
        $scope.goods_load_over = true;
        $scope.maxData = '';
        $scope.data = '';
        $scope.search = {
            page: 1,
            token: UserInfo.l.token || '',
        };
        $scope.doPost = function() {
            /*if (!UserInfo.l.flag) {
                $scope.goods_load_over = false;
                $scope.$broadcast('scroll.refreshComplete');
                return false;
            }*/
            if ($scope.vle == 1) {
                var url = '/wallet/item/list';
                $scope.search.type = 0;
            } else if ($scope.vle == 4) {
                var url = '/betting/order/list'
                $scope.search.flag = 0;
            } else if ($scope.vle == 2) {
                var url = '/betting/order/list'
                $scope.search.flag = 1;
            }else if ($scope.vle == 5) {
                var url = '/wallet/currency/list'
                $scope.search.currencytype = 'GCOIN';
                $scope.search.type = 0;
            }else if ($scope.vle == 6) {
                var url = '/wallet/currency/list'
                $scope.search.currencytype = 'VCASH';
                $scope.search.type = 0;
            }else if ($scope.vle == 40) {
                $scope.bgimg = true;
                //登录状态验证
                HttpStatus.myinfo().then(function (data) {
                    //console.log(data);
                    HttpStatus.codedispose(data);
                })
                return false;
            }
            $ionicLoading.show({content: 'Loading', duration: 30000})
            $http({
                method: 'post',
                url: ApiEndpoint.url + url,
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.maxData = data.data.items;
                    $scope.data = data.data;
                    if ($scope.search.page >= $scope.data.totalpage) {
                        $scope.goods_load_over = false;
                        $ionicScrollDelegate.$getByHandle('checklist').resize();
                    }
                    if (!$scope.maxData) {
                        $scope.bgimg = true;
                        return false;
                    } else {
                        $scope.bgimg = false;
                    }
                    for (var i = 0; i < $scope.maxData.length; i++) {
                        $scope.list.push($scope.maxData[i]);
                    }
                } else {
                    $scope.goods_load_over = false;
                }
            }).error(function() {
                $ionicLoading.hide();
                $scope.goods_load_over = false;
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                $scope.$broadcast('scroll.refreshComplete');
            })
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //下拉刷新
        $scope.bomdoPost = function() {
            if ($scope.vle == 40) {
                $scope.$broadcast('scroll.refreshComplete');
            }
            $scope.goods_load_over = true;
            $scope.search.page = 1;
            if ($scope.search.page == 1) {
                $scope.list = [];
            }
            $scope.doPost();
        }
        //翻页
        $scope.loadParticulars = function() {
            $scope.search.page++;
            if ($scope.search.page > $scope.data.totalpage) {
                $scope.goods_load_over = false;
                return false;
            }
            $scope.doPost();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            //$ionicScrollDelegate.scrollTop(true);
        }
        //明细判定
        $scope.detailpd = function(d) {
            if (d.type == 1 || d.type == 2 || d.type == 5) {
                return true;
            } else if (d.type == 3 || d.type == 4 || d.type == 6) {
                return false;
            }
        }
        //查看订单
        $scope.godetaail = function(list) {
            if ($scope.vle == 1 || $scope.vle == 5 || $scope.vle == 6) {
                return false;
            }
            $state.go('practice.detail', { id: list, type: 1 });
        }
        //明细判定
        $scope.detailpd = function(d) {
            if (d.type == 1 || d.type == 2 || d.type == 5 || d.type == 8) {
                return true;
            } else if (d.type == 3 || d.type == 4 || d.type == 6 || d.type==7) {
                return false;
            }
        }
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
            //$state.go('tab.hall');
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //设置
    .controller('SettingCtrl', ["showAlertMsg","HttpServer","$http","$ionicLoading","$scope", "$state", "$ionicHistory", "UserInfo", function(showAlertMsg,HttpServer,$http,$ionicLoading,$scope, $state, $ionicHistory, UserInfo) {
        $scope.idcard = '暂未开通';
        $scope.banknunm = '';
        $scope.goBankCardBinding = function() {
            //return false;
            $state.go('user.BankCardList');
        };
        $scope.goIDcard = function() {
            return false;
            $state.go('user.IDcard');
        };
        $scope.goRegister = function() {
            $state.go('user.register');
        };
        $scope.goLostPWD = function() {
            $state.go('user.LostPWD');
        };
        $scope.goChangePWD = function() {
            $state.go('user.ChangePWD');
        };
        $scope.goAbout = function() {
            $state.go('user.about');
        };
        $scope.gohelp = function() {
            $state.go('user.helpcenter');
        };
        if (UserInfo.l.idcard) {
            $scope.idcard = '已实名认证'
        }
        if (UserInfo.l.bank && UserInfo.l.flag) {
            $scope.banknunm = '已绑定' + JSON.parse(UserInfo.l.bank).length + '张银行卡';
            //console.log($scope.banknunm);
        }
        //退出登录
        $scope.goOutLogin = function() {
            var dl = {token: UserInfo.l.token || '',}
            HttpServer.Spost(dl,'/auth/logout').then(function (data) {
                if (data.status == '1') {
                    window.localStorage.removeItem('flag');
                    //showAlertMsg.showProject( '退出成功');
                    window.localStorage.removeItem('bank');
                    window.localStorage.removeItem('money');
                    window.localStorage.removeItem('vmoney');
                    window.localStorage.removeItem('gcoin');
                    $scope.Gohome();
                }else if(data.status == '100'){
                    $scope.Gohome();
                }
            })
                //UserInfo.l.clear();
                //window.location.replace(location.origin);
            }
            //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            $ionicHistory.clearCache(['tab.account']).then(function() {
                window.history.back();
            })
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //登录
    .controller('loginCtrl', ['$interval', 'httpcom', '$rootScope', 'order', 'browser', '$stateParams', "$scope", "$ionicHistory", "$http", "ApiEndpoint", "$ionicLoading", "$state", "stock", "UserInfo", "showAlertMsg", "HttpStatus", function($interval, httpcom, $rootScope, order, browser, $stateParams, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, HttpStatus) {
        $scope.type = $stateParams.type;
        $scope.logintype = false;
        var reph = /^1[3456789]\d{9}$/;
        $scope.login = {
            token: UserInfo.l.token,
            account: UserInfo.l.account,
        };
        /*    if (stock.Nonull($scope.login.account) && stock.Nonull($scope.login.pwd)) {
                $scope.logintype = false;
            } else {
                $scope.logintype = true;
            }*/
        $scope.changelogin = function() {
            if ($scope.login.pwd && $scope.login.account) {
                $scope.logintype = true;
            } else {
                $scope.logintype = false;
            }
        }
        $scope.doLogin = function() {
                if (!reph.test($scope.login.account)) {
                    showAlertMsg.showMsgFun('提示', '手机号格式错误');
                    return false;
                };
                if (!$scope.login.pwd) {
                    showAlertMsg.showMsgFun('提示', '密码不能为空');
                    return false;
                };
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $scope.login.token = UserInfo.l.token;
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/auth/login',
                    data: $scope.login,
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        $http({
                            method: 'post',
                            url: ApiEndpoint.url + '/usr/myinfo',
                            data: {
                                token: UserInfo.l.token
                            },
                        }).success(function(data) {
                            if (data.status == '1') {
                                UserInfo.save(data.data);
                                UserInfo.add('flag', '1');
                                if (browser.is_weixn == 'yes') {
                                    UserInfo.add('sucpayway', 'WX');
                                }
                                $ionicHistory.clearCache(['tab.account']).then(function() {
                                    var n = UserInfo.l.msginterval * 1000 || '30000';
                                  /*  httpcom.msgact();
                                    $rootScope.clearmsgact = $interval(function() {
                                        httpcom.msgact();
                                    }, n)*/
                                  //console.log($scope.type);
                                    if ($scope.type >= 1 && $scope.type <= 20) {
                                        $scope.backGo();
                                        //$state.go(order.getbackurl[$scope.type], { type: $scope.type })
                                    } else if ($scope.type == 0) {
                                        $scope.Gohome();
                                    } else {
                                        $ionicHistory.clearCache().then(function() {
                                            $scope.backGo();
                                        })
                                    }
                                })
                            }
                        })
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('温馨提示', '网络连接失败，请检查网络连接');
                });
            }
            //显示密码
        $scope.ShowPassword5 = function() {
                if (document.getElementById("regpw5").type == 'text') {
                    document.getElementById("regpw5").type = "password";
                } else {
                    document.getElementById("regpw5").type = "text";
                }
            }
            //注册
        $scope.goRegister = function() {
            $state.go('user.register', { type: $scope.type });
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.goLostPWD = function() {
            $state.go('user.LostPWD', { type: $scope.type });
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //注册
    .controller('registerCtrl', ['$stateParams', "PayFlow", "$scope", "$ionicHistory", "$http", "$interval", "regularExpression", "$ionicLoading", "ApiEndpoint", "showAlertMsg", "$state", "UserInfo", "HttpStatus", 'order', function($stateParams, PayFlow, $scope, $ionicHistory, $http, $interval, regularExpression, $ionicLoading, ApiEndpoint, showAlertMsg, $state, UserInfo, HttpStatus, order) {
        //注册按钮状态(默认同意注册协议)
        var typefalg = $stateParams.type || 'zjdl';
        $scope.s = {};
        $scope.s.isAgree_val = true;
        //输入状态
        $scope.inputstate = false;
        $scope.logintype = false;
        $scope.setPWDType = false;
        $scope.sonfirmPWDType = false;
        $scope.register = {
            phone: '',
            vcode: '',
            pwd: '',
            confirmPWD: '',
            chnid: '',
            token: UserInfo.l.token
        };
        //短信发送验证码倒计时
        var countdown = 60;
        var codeTime;
        $scope.codeTxt = '获取验证码';
        $scope.sendCountDown = function() {
            if ($scope.cellPhone()) {
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                    //请求发送的验证码
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/verifycode/reg',
                    data: {
                        key: $scope.register.phone,
                        type: "sms",
                        token: UserInfo.l.token
                    },
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        showAlertMsg.showMsgFun('发送成功', '验证码已发送，注意查收！');
                        $interval.cancel(codeTime);
                        codeTime = $interval(function() {
                            countdown--;
                            $scope.removeEvents = {
                                'line-height': '.68rem',
                                'padding': '.1rem 0rem'
                            };
                            $scope.codeTxt = '重新获取 (' + countdown + ')';
                            if (countdown < 0) {
                                $interval.cancel(codeTime);
                                $scope.codeTxt = '重新获取';
                                $scope.removeEvents = {
                                    'line-height': '.68rem',
                                    'padding': '.1rem 0rem'
                                };
                                countdown = 60;
                            }
                            //$scope.$digest(); // 通知视图模型的变化
                        }, 1000);
                    }
                }).error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('发送失败', '网络异常,请稍后再试!');
                });
            } else {

            }
        };
        //正则验证
        var userNameReg = regularExpression.phoneRegFun();
        var nullReg = regularExpression.nullRegFun();
        var passWordReg = regularExpression.passWordRegFun();
        var strLengthReg = regularExpression.strLengthRegFun();
        //
        //注册手机号验证
        $scope.cellPhone = function() {
                if (!userNameReg.test($scope.register.phone)) {
                    $scope.cellPhoneError = true;
                    $scope.cellPhoneErrorMsg = '手机号为空或填写错误';
                    $scope.inputstate = false;
                    return false;
                } else {
                    $scope.register.MobilePhone = $scope.register.UserName;
                    $scope.cellPhoneError = false;
                    $scope.inputstate = true;
                    return true;
                }
            }
            //验证码清除
        $scope.SmsCodeclean = function() {
                $scope.register.vcode = "";
            }
            //获得焦点错误信息消失
        $scope.cellPhoneErrorOff = function() {
            $scope.cellPhoneError = false;
        };
        //获得焦点错误信息消失
        $scope.setPWDErrorOff = function() {
            $scope.setPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //获得焦点错误信息消失
        $scope.confirmPWDErrorOff = function() {
            $scope.confirmPWDError = false;
            $scope.setPWDPrompt = true;
        };
        // 购彩协议
        $scope.agreementGo = function() {
                $state.go('betinfo.lotage');
            } //显示密码
        $scope.ShowPassword = function() {
            if (document.getElementById("regpw1").type == 'text') {
                document.getElementById("regpw1").type = "password";
            } else {
                document.getElementById("regpw1").type = "text";
            }
        }
        $scope.ShowPassword2 = function() {
                if (document.getElementById("regpw2").type == 'text') {
                    document.getElementById("regpw2").type = "password";
                } else {
                    document.getElementById("regpw2").type = "text";
                }
            }
            //注册密码设置验证
        $scope.setPWD = function() {
            $scope.setPWDPrompt = false;
            if (!passWordReg.test($scope.register.pwd)) {
                $scope.setPWDError = true;
                $scope.setPWDType = false;
                $scope.setPWDErrorMsg = '密码为空或格式错误！';
                return false;
            } else {
                $scope.setPWDError = false;
                $scope.setPWDType = true;
                return true;
            }
        };
        //注册确认密码验证
        $scope.confirmPWD = function() {
            if ($scope.register.pwd != $scope.register.confirmPWD || $scope.register.confirmPWD == '') {
                $scope.confirmPWDError = true;
                $scope.sonfirmPWDType = false;
                $scope.confirmPWDErrorMsg = '两次密码输入不一致！';
                return false;
            } else {
                $scope.confirmPWDError = false;
                $scope.sonfirmPWDType = true;
                return true;
            }
        };
        //注册总验证
        $scope.doRegister = function() {
            //console.log($scope.s.isAgree_val);
            if ($scope.s.isAgree_val == false) {
                return false;
            }
            if ($scope.cellPhone() && $scope.setPWD() && $scope.confirmPWD()) {
                if (nullReg.test($scope.register.vcode)) {
                    showAlertMsg.showMsgFun('注册提示', '请输入验证码！');
                } else {
                    $ionicLoading.show({ content: 'Loading', duration: 30000 })
                    $scope.register.agreement = $scope.s.isAgree_val;
                    $scope.register.token = UserInfo.l.token;
                    //请求数据验证
                    $http({
                        method: 'POST',
                        url: ApiEndpoint.url + '/auth/reg',
                        data: $scope.register
                    }).success(function(data) {
                        $ionicLoading.hide();
                        HttpStatus.codedispose(data);
                        if (data.status == 1) {
                            //注册成功写入安全验证token
                            //UserInfo.save(data.data);
                            console.log(JSON.stringify(data.data.actApplyResult));
                            if(data.data.actApplyResult){
                                var actApplyResult = JSON.stringify(data.data.actApplyResult);
                            }else{
                                var actApplyResult =false;
                            }
                            var dd = {
                                account: $scope.register.phone,
                                pwd: $scope.register.pwd,
                                token: UserInfo.l.token
                            }
                            //showAlertMsg.showMsgFun('提示', '注册成功', 'PostAddUser');
                            PayFlow.login(dd).then(function(ds) {
                                HttpStatus.codedispose(ds);
                                if (ds.status == '1') {
                                    if (typefalg == 'zjdl') {
                                        //$scope.Gohome();
                                        if(actApplyResult){
                                            $ionicHistory.clearCache().then(function() {
                                                $state.go('practice.syxwguidea', { type: 10 ,actApplyResult:actApplyResult});//注册成功跳转11选五界面
                                            })
                                        }else{
                                            $ionicHistory.clearCache().then(function() {
                                                $state.go('practice.syxwhall', { type: 10 });//注册成功跳转11选五界面
                                            })
                                        }
                                    } else if (typefalg != "") {
                                        $state.go(order.getbackurl[typefalg], { type: typefalg });
                                    } else {
                                            $scope.backGo();
                                    }
                                    UserInfo.save(ds.data);
                                }
                            })
                        }
                    }).error(function() {
                        $ionicLoading.hide();
                        showAlertMsg.showMsgFun('注册失败', '网络异常,请稍后再试!');
                    });
                }
            }
        };
        //直接登录
        $scope.goLogin = function() {
            $state.go('user.login', { type: typefalg });
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall', { flag: typefalg });
        }
        $scope.$on('$destroy', function() {
            if (codeTime) {
                $interval.cancel(codeTime);
            }
        })
    }])
    //忘记密码
    .controller('LostPWDCtrl', ['$stateParams', "HttpStatus", "$scope", "$ionicHistory", "$http", "$interval", "regularExpression", "$ionicLoading", "ApiEndpoint", "showAlertMsg", "$state", "UserInfo", 'myFactory', function($stateParams, HttpStatus, $scope, $ionicHistory, $http, $interval, regularExpression, $ionicLoading, ApiEndpoint, showAlertMsg, $state, UserInfo, myFactory) {
        $scope.type = $stateParams.type;
        $scope.isAgree_val = false;
        //输入状态
        $scope.inputstate = false;
        $scope.logintype = false;
        $scope.setPWDType = false;
        $scope.sonfirmPWDType = false;
        $scope.register = {
            phone: '',
            vcode: '',
            pwd: '',
            confirmPWD: '',
            chnid: ''
        };
        //短信发送验证码倒计时
        var countdown = 60;
        var codeTime;
        $scope.codeTxt = '获取验证码';
        $scope.sendCountDown = function() {
            if ($scope.cellPhone()) {
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                    //请求发送的验证码
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/verifycode/backpwd',
                    data: {
                        account: $scope.register.phone,
                        type: "sms",
                        token: UserInfo.l.token,
                    },
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        showAlertMsg.showMsgFun('发送成功', '验证码已发送，注意查收！');
                        $interval.cancel(codeTime);
                        codeTime = $interval(function() {
                            countdown--;
                            $scope.removeEvents = {
                                'line-height': '.68rem',
                                'padding': '.1rem 0'
                            };
                            $scope.codeTxt = '重新获取 (' + countdown + ')';
                            if (countdown < 0) {
                                $interval.cancel(codeTime);
                                $scope.codeTxt = '重新获取';
                                $scope.removeEvents = {
                                    'line-height': '.68rem',
                                    'padding': '.1rem 0'
                                };
                                countdown = 60;
                            }
                            //$scope.$digest(); // 通知视图模型的变化
                        }, 1000);
                    }
                }).error(function(data, status, headers, config) {
                    $ionicLoading.hide();
                    //console.log(config);
                    showAlertMsg.showMsgFun('发送失败', '网络异常,请稍后再试!');
                });
            }
        };
        //正则验证
        var userNameReg = regularExpression.phoneRegFun();
        var nullReg = regularExpression.nullRegFun();
        var passWordReg = regularExpression.passWordRegFun();
        var strLengthReg = regularExpression.strLengthRegFun();
        //
        //手机号验证
        $scope.cellPhone = function() {
            if (!userNameReg.test($scope.register.phone)) {
                $scope.cellPhoneError = true;
                $scope.cellPhoneErrorMsg = '手机号为空或填写错误';
                $scope.inputstate = false;
                return false;
            } else {
                $scope.register.MobilePhone = $scope.register.UserName;
                $scope.cellPhoneError = false;
                $scope.inputstate = true;
                return true;
            }
        }
        $scope.SmsCode = function() {
                if ($scope.register.vcode != '' && $scope.register.phone != '') {
                    $scope.isAgree_val = true;
                }
            }
            //验证码清除
        $scope.SmsCodeclean = function() {
                $scope.register.vcode = "";
            }
            //获得焦点错误信息消失
        $scope.cellPhoneErrorOff = function() {
            $scope.cellPhoneError = false;
        };
        //获得焦点错误信息消失
        $scope.setPWDErrorOff = function() {
            $scope.setPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //获得焦点错误信息消失
        $scope.confirmPWDErrorOff = function() {
            $scope.confirmPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //密码设置验证
        $scope.setPWD = function() {
            $scope.setPWDPrompt = false;
            if (!passWordReg.test($scope.register.pwd)) {
                $scope.setPWDError = true;
                $scope.setPWDType = false;
                $scope.setPWDErrorMsg = '密码为空或格式错误！';
                return false;
            } else {
                $scope.setPWDError = false;
                $scope.setPWDType = true;
                return true;
            }
        };
        //确认密码验证
        $scope.confirmPWD = function() {
            if ($scope.register.pwd != $scope.register.confirmPWD || $scope.register.confirmPWD == '') {
                $scope.confirmPWDError = true;
                $scope.sonfirmPWDType = false;
                $scope.confirmPWDErrorMsg = '两次密码输入不一致！';
                return false;
            } else {
                $scope.confirmPWDError = false;
                $scope.sonfirmPWDType = true;
                return true;
            }
        };
        //总验证
        $scope.doRegister = function() {
            if ($scope.cellPhone()) {
                if (nullReg.test($scope.register.vcode)) {
                    showAlertMsg.showMsgFun('注册提示', '请输入验证码！');
                } else if ($scope.register.vcode.length < 4) {
                    showAlertMsg.showMsgFun('注册提示', '验证码为4位数字！');
                } else {
                    $ionicLoading.show({ content: 'Loading', duration: 30000 })
                    $scope.register.agreement = $scope.isAgree_val;
                    //请求数据验证
                    $http({
                        method: 'POST',
                        url: ApiEndpoint.url + '/auth/backpwd/verifycode',
                        data: {
                            account: $scope.register.phone,
                            verifycode: $scope.register.vcode,
                            token: UserInfo.l.token || '',
                        }
                    }).success(function(data) {
                        $ionicLoading.hide();
                        if (data.status == 0) {
                            showAlertMsg.showMsgFun('错误提示', data.msg);
                        } else {
                            myFactory.setter(data.data.token);
                            $state.go('user.RetrievePWD', { type: $scope.type });
                        }
                    }).error(function() {
                        $ionicLoading.hide();
                        showAlertMsg.showMsgFun('验证失败', '网络异常,请稍后再试!');
                    });
                }
            }
        };
        //直接登录
        $scope.goLogin = function() {
            $state.go('user.login');
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {
            $interval.cancel(codeTime);
        })
    }])

//找回密码
.controller('RetrievePWDCtrl', ['$stateParams', "$scope", "$ionicHistory", "$http", "$interval", "regularExpression", "$ionicLoading", "ApiEndpoint", "showAlertMsg", "$state", "myFactory", "UserInfo", "HttpStatus", function($stateParams, $scope, $ionicHistory, $http, $interval, regularExpression, $ionicLoading, ApiEndpoint, showAlertMsg, $state, myFactory, UserInfo, HttpStatus) {
        //注册按钮状态(默认同意注册协议)
        $scope.type = $stateParams.type;
        $scope.isAgree_val = true;
        //输入状态
        $scope.inputstate = false;
        $scope.logintype = false;
        $scope.setPWDType = false;
        $scope.setPWDError = false;
        $scope.sonfirmPWDType = false;
        $scope.register = {
            phone: '',
            vcode: '',
            pwd: '',
            confirmPWD: '',
            chnid: '',
            token: UserInfo.l.token
        };
        //正则验证
        var userNameReg = regularExpression.phoneRegFun();
        var nullReg = regularExpression.nullRegFun();
        var passWordReg = regularExpression.passWordRegFun();
        var strLengthReg = regularExpression.strLengthRegFun();
        //获得焦点错误信息消失
        $scope.cellPhoneErrorOff = function() {
            $scope.cellPhoneError = false;
        };
        //获得焦点错误信息消失
        $scope.setPWDErrorOff = function() {
            $scope.setPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //获得焦点错误信息消失
        $scope.confirmPWDErrorOff = function() {
            $scope.confirmPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //显示密码
        $scope.ShowPassword7 = function() {
            if (document.getElementById("regpw7").type == 'text') {
                document.getElementById("regpw7").type = "password";
            } else {
                document.getElementById("regpw7").type = "text";
            }
        }
        $scope.ShowPassword8 = function() {
                if (document.getElementById("regpw8").type == 'text') {
                    document.getElementById("regpw8").type = "password";
                } else {
                    document.getElementById("regpw8").type = "text";
                }
            }
            //注册密码设置验证
        $scope.setPWD = function() {
            $scope.setPWDPrompt = false;
            if (!passWordReg.test($scope.register.newpwd)) {
                $scope.setPWDError = true;
                $scope.setPWDType = false;
                $scope.setPWDErrorMsg = '密码为空或格式错误！';
                return false;
            } else {
                $scope.setPWDError = false;
                $scope.setPWDType = true;
                return true;
            }
        };
        //重复密码验证
        $scope.confirmPWD = function() {
            if ($scope.register.newpwd != $scope.register.confirmPWD || $scope.register.confirmPWD == '') {
                $scope.confirmPWDError = true;
                $scope.sonfirmPWDType = false;
                $scope.confirmPWDErrorMsg = '两次密码输入不一致！';
                return false;
            } else {
                $scope.confirmPWDError = false;
                $scope.sonfirmPWDType = true;
                return true;
            }
        };
        //找回密码验证
        $scope.doRegister = function() {
            if ($scope.setPWD() && $scope.confirmPWD()) {
                $ionicLoading.show({ content: 'Loading', duration: 30000 })
                $scope.register.agreement = $scope.isAgree_val;
                //请求数据验证
                $http({
                    method: 'POST',
                    url: ApiEndpoint.url + '/auth/backpwd/newpwd',
                    data: {
                        newpwd: $scope.register.newpwd,
                        token: myFactory.getter(),
                    }
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        showAlertMsg.showProject(data.msg + '，请重新登录');

                        if ($scope.type == undefined) {
                            $state.go('user.login', { type: 0 });
                        } else {
                            $state.go('user.login', { type: $scope.type });
                        }
                    }
                }).error(function() {
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('修改失败', '网络异常,请稍后再试!');
                });

            }
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //修改密码
    .controller('ChangePWDCtrl', ["$scope", "$ionicHistory", "$http", "$interval", "regularExpression", "$ionicLoading", "ApiEndpoint", "showAlertMsg", "$state", "UserInfo", "HttpStatus", function($scope, $ionicHistory, $http, $interval, regularExpression, $ionicLoading, ApiEndpoint, showAlertMsg, $state, UserInfo, HttpStatus) {
        $scope.inputstate = false;
        $scope.setPWDType = false;
        $scope.sonfirmPWDType = false;
        $scope.register = {
            oldpwd: '',
            newpwd: '',
            confirmPWD: '',
            token: UserInfo.l.UserInfo || ''
        };
        //正则验证
        var passWordReg = regularExpression.passWordRegFun();
        //
        //获得焦点错误信息消失
        $scope.cellPhoneErrorOff = function() {
            $scope.cellPhoneError = false;
        };
        //获得焦点错误信息消失
        $scope.setPWDErrorOff = function() {
            $scope.setPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //获得焦点错误信息消失
        $scope.confirmPWDErrorOff = function() {
            $scope.confirmPWDError = false;
            $scope.setPWDPrompt = true;
        };
        //显示密码
        $scope.ShowPassword3 = function() {
            if (document.getElementById("regpw3").type == 'text') {
                document.getElementById("regpw3").type = "password";
            } else {
                document.getElementById("regpw3").type = "text";
            }
        }
        $scope.ShowPassword4 = function() {
                if (document.getElementById("regpw4").type == 'text') {
                    document.getElementById("regpw4").type = "password";
                } else {
                    document.getElementById("regpw4").type = "text";
                }
            }
            //注册密码设置验证
        $scope.setPWD = function() {
            $scope.setPWDPrompt = false;
            if (!passWordReg.test($scope.register.pwd)) {
                $scope.setPWDError = true;
                $scope.setPWDType = false;
                $scope.setPWDErrorMsg = '密码为空或格式错误！';
                return false;
            } else {
                $scope.setPWDError = false;
                $scope.setPWDType = true;
                return true;
            }
        };
        //注册确认密码验证
        $scope.confirmPWD = function() {
            if ($scope.register.newpwd != $scope.register.confirmPWD || $scope.register.confirmPWD == '') {
                $scope.confirmPWDError = true;
                $scope.sonfirmPWDType = false;
                $scope.confirmPWDErrorMsg = '两次密码输入不一致！';
                return false;
            } else {
                $scope.confirmPWDError = false;
                $scope.sonfirmPWDType = true;
                return true;
            }
        };
        //修改密码
        $scope.doRegister = function() {
            console.log('1');
            if (!$scope.confirmPWD()) {
                return false;
            }
            var Updata = {};
            Updata.newpwd = $scope.register.newpwd;
            Updata.oldpwd = $scope.register.oldpwd;
            $ionicLoading.show({ content: 'Loading', duration: 30000 })
            Updata.token = UserInfo.l.token;
            //请求数据验证
            $http({
                method: 'POST',
                url: ApiEndpoint.url + '/auth/resetpwd',
                data: Updata,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    showAlertMsg.showProject('修改成功,请重新登录');
                    //修改成功直接调用用户信息
                    $state.go('user.login', { type: '0' });
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('提示', '网络异常,请稍后再试!');
            });
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {})
    }])
    //银行卡绑定列表
    .controller('BankCardListCtrl', ["$ionicPopup", "$scope", '$state', '$ionicHistory', 'stock', 'UserInfo', '$http', 'ApiEndpoint', 'regularExpression', 'showAlertMsg', '$ionicLoading', 'HttpStatus', function($ionicPopup, $scope, $state, $ionicHistory, stock, UserInfo, $http, ApiEndpoint, regularExpression, showAlertMsg, $ionicLoading, HttpStatus) {
        $scope.carlist = [];
        $scope.redact = true;
        $scope.buttontext = '编辑';
        $scope.bianji = function() {
            if ($scope.redact == true) {
                $scope.redact = false;
                $scope.buttontext = '确定';
            } else {
                $scope.redact = true;
                $scope.buttontext = '编辑';
            }
        }
        $ionicLoading.show({ content: 'Loading', duration: 30000 });
        $http({
            method: 'post',
            url: ApiEndpoint.url + '/usr/myinfo',
            data: {
                token: UserInfo.l.token
            },
        }).success(function(data) {
            $ionicLoading.hide();
            HttpStatus.codedispose(data);
            if (data.status == '1') {
                UserInfo.save(data.data);
                if (data.data.bank) {
                    $scope.carlist = JSON.parse(data.data.bank);
                }
            }
        }).error(function() {
            $ionicLoading.hide();
            showAlertMsg.showMsgFun('提示', '网络异常,请稍后再试!');
        });
        //删除银行卡
        $scope.delbank = function(c) {
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '您确定要解绑本卡吗？',
                cancelText: '取消',
                okText: '确定',
                okType: 'font-color'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $ionicLoading.show({ content: 'Loading', duration: 30000 });
                    $http({
                        method: 'post',
                        url: ApiEndpoint.url + '/usr/del/bankcard',
                        data: {
                            token: UserInfo.l.token,
                            cardno: c.cardno
                        },
                    }).success(function(data) {
                        $ionicLoading.hide();
                        HttpStatus.codedispose(data);
                        if (data.status == '1') {
                            var jsongate = JSON.stringify(data.data);
                            UserInfo.add('bank', jsongate);
                            //console.log(data.data);
                            if (data.data) {
                                $scope.carlist = data.data;
                            }
                        }
                    }).error(function() {
                        $ionicLoading.hide();
                        showAlertMsg.showMsgFun('提示', '网络异常,请稍后再试!');
                    });
                } else {}
            });
        }
        $scope.goBankCardList = function() {
            $state.go('user.BankCardBinding');
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //银行卡绑定
    .controller('BankCardBindingCtrl', ["banklist", "$scope", '$state', '$ionicHistory', 'stock', 'UserInfo', '$http', 'ApiEndpoint', 'regularExpression', 'showAlertMsg', '$ionicLoading', 'HttpStatus', function(banklist, $scope, $state, $ionicHistory, stock, UserInfo, $http, ApiEndpoint, regularExpression, showAlertMsg, $ionicLoading, HttpStatus) {
        $scope.banklist = banklist.getbanklist; //银行卡待选列表
        $scope.showsetbank = false;
        $scope.xssetbank = function() {
            $scope.showsetbank = true;
        }
        $scope.setbank = function(l, $event) {
                if (l == 0) {
                    $scope.showsetbank = false;
                } else {
                    $scope.bankCardObj.bank = l.bank;
                    $scope.showsetbank = false;
                }
                $event.stopPropagation();
            }
            //正则验证（空）
        var nullReg = regularExpression.nullRegFun();
        var bankCardNumReg = regularExpression.bankCardNumRegFun();
        $scope.bankCardObj = { bank: $scope.banklist[0].bank, cardno: '', name: '', token: UserInfo.l.token };
        //银行卡卡号验证
        $scope.setCardNum = function() {
            $scope.setCardNumError = false;
            if (nullReg.test($scope.bankCardObj.cardno)) {
                $scope.setCardNumError = true;
                $scope.setCardNumErrorMsg = '卡号不能为空！';
                return false;
            } else if (!bankCardNumReg.test($scope.bankCardObj.cardno)) {
                //.log($scope.bankCardObj.cardno);
                $scope.setCardNumError = true;
                $scope.setCardNumErrorMsg = '卡号格式错误！';
                return false;
            } else {
                $scope.setCardNumError = false;
                return true;
            }
        };
        //获得焦点错误信息消失
        $scope.setCardNumErrorOff = function() {
            $scope.setCardNumError = false;
        };
        //银行卡开户名验证
        $scope.setAccountName = function() {
            $scope.setAccountNameError = false;
            if (nullReg.test($scope.bankCardObj.name)) {
                $scope.setAccountNameError = true;
                $scope.setAccountNameErrorMsg = '开户名不能为空！';
                return false;
            } else {
                $scope.setAccountNameError = false;
                return true;
            }
        };
        //获得焦点错误信息消失
        $scope.setAccountNameErrorOff = function() {
            $scope.setAccountNameError = false;
        };
        //银行卡开户行验证
        $scope.setAccountBankName = function() {
            $scope.setAccountBankNameError = false;
            if (nullReg.test($scope.bankCardObj.AccountBankName)) {
                $scope.setAccountBankNameError = true;
                $scope.setAccountBankNameErrorMsg = '开户行不能为空！';
                return false;
            } else {
                $scope.setAccountBankNameError = false;
                return true;
            }
        };
        //获得焦点错误信息消失
        $scope.setAccountBankNameErrorOff = function() {
            $scope.setAccountBankNameError = false;
        };
        //绑定银行卡总验证
        $scope.doBindingBankCard = function() {
            //.log($scope.bankCardObj.bank);
            if (nullReg.test($scope.bankCardObj.bank) || $scope.bankCardObj.bank == '请选择银行') {
                showAlertMsg.showMsgFun('提示', '请选择填写银行名称！');
            } else {
                if ($scope.setAccountName() && $scope.setCardNum() && $scope.setAccountName()) {
                    $ionicLoading.show({ content: 'Loading', duration: 30000 });
                    //请求数据验证
                    $http({
                        method: 'POST',
                        url: ApiEndpoint.url + '/usr/set/bankcard',
                        data: $scope.bankCardObj
                    }).success(function(data) {
                        $ionicLoading.hide();
                        HttpStatus.codedispose(data);
                        if (data.status == 1) {
                            showAlertMsg.showMsgFun('提示', '绑定银行卡成功！');
                            $scope.backGo();
                        }
                    }).error(function() {
                        $ionicLoading.hide();
                        showAlertMsg.showMsgFun('失败', '网络异常,请稍后再试!');
                    });
                }
            }
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //身份绑定
    .controller('IDcardCtrl', ['$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'HttpStatus', function($scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, HttpStatus) {
        $scope.login = {
            token: UserInfo.l.token,
        };
        $scope.SIOtype = false;
        if (UserInfo.l.idcard) {
            $scope.SIOtype = true;
            $scope.login.name = UserInfo.l.idcard;
            $scope.login.idcard = UserInfo.l.name;
        }
        if (stock.Nonull($scope.login.account)) {
            $scope.logintype = false;
        } else {
            $scope.logintype = true;
        }
        $scope.doLogin = function() {
                if (!$scope.login.name) {
                    showAlertMsg.showMsgFun('提示', '用户名不能为空');
                    return false;
                };
                if (!$scope.login.idcard) {
                    showAlertMsg.showMsgFun('身份证号码不能为空');
                    return false;
                };
                $ionicLoading.show({ content: 'Loading', duration: 30000 });
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/usr/set/idcard',
                    data: $scope.login,
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        showAlertMsg.showMsgFun('绑定成功', data.msg);
                        $scope.backGo();
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('温馨提示', '网络连接失败，请检查网络连接');
                });
            }
            //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //余额充值
    .controller('WalletPayCtrl', ['$ionicScrollDelegate','HttpServer','$ionicModal','PayFlow', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'HttpStatus', function($ionicScrollDelegate,HttpServer,$ionicModal,PayFlow, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, HttpStatus) {
        $scope.remdata = '';
        $scope.mPhone = true;
        $scope.processType = 0;
        $scope.carlist = [];//转账银行卡列表
        $scope.popshow = false;//pop弹出显示
        $scope.chargelist = [];//充值金额列表
        $scope.tablist = false;//控制礼包列表显示
        $scope.bagbom = false;
        $scope.search = {
            money: '',
        };
        $scope.wd = {
            money: '',
            token: UserInfo.l.token,
            cardno:'',
        };
        $scope.car = {
        };
        $scope.bankinfo = {};
        $scope.checkmPhone = function() {
            $scope.processType = $scope.search.money;
        }
        $scope.billcz = function(evt) {
            var elem = evt.currentTarget;
            $scope.processType = elem.getAttributeNode('data-active').value;
            var d = $scope.processType;
            $scope.search.money = parseInt($scope.processType);
            if($scope.search.money==1001){
                $scope.search.money = '';
                $scope.openModal();
            }
        }
        $scope.chargewd = {
            ctype:'',
            cvalue:'',
            token: UserInfo.l.token,
        }
        //充值金额
        HttpServer.Spost($scope.chargewd,'/wallet/chargeitem').then(function (data) {
            $scope.chargelist = data.data;
            for (var i = 0;i<$scope.chargelist.length;i++){
                if($scope.chargelist[i].excount>0 && $scope.chargelist[i].excount_usr!=0){
                    $scope.tablist = true;
                    $scope.minmoney = $scope.chargelist[i].cmoney;
                    //console.log($scope.minmoney);
                    break;
                }
            }
        })
        //礼包列表伸缩
        $scope.Stroke = function () {
            $scope.bagbom = !$scope.bagbom;
            $ionicScrollDelegate.$getByHandle('walletpay').resize();
        }
        $scope.getmoneys = function(evt) {
            var elem = evt.currentTarget;
            $scope.moneyType = elem.getAttributeNode('data-active').value;
            var t = $scope.moneyType;
           $scope.wd.money = t;
           //console.log(t)
        }
        $scope.doPost = function() {
                //console.log($scope.search.ptype);
                if (!$scope.search.money) {
                    showAlertMsg.showMsgFun('提示', '请输入充值金额');
                    return false;
                }
            if ($scope.search.money>=1000) {
                $scope.openModal();
                var m = $scope.search.money;
                var ms = $scope.moneys;
                var j = 0;
                var k = 0;
                for(var i =1;i<ms.length;i++){
                    j = m-ms[i-1];
                    k = m-ms[i];
                    if(Math.abs(j)<Math.abs(k)){
                        $scope.moneyType = ms[i-1];
                        break;
                    }else{
                        $scope.moneyType = ms[i];
                    }
                }
                return false;
            }
                PayFlow.charge($scope.search);
        }
        //vip充值
        $scope.vipcharge = function () {
            $ionicLoading.show({ content: 'Loading', duration: 30000 });
            $http({
                method: 'POST',
                url: ApiEndpoint.url + '/wallet/vip/charge',
                data: $scope.wd
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.totalmoney = data.data.totalmoney;
                    $scope.popshow = true;
                    $scope.bankinfo = data.data.bankinfo;
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('温馨提示', '网络异常,请稍后再试!');
            });
        }
        $scope.getsss = function () {
            copy.copytxt('sssssssssssssss');
        }
        var clipboard = new Clipboard('.btn');
        //优雅降级:safari 版本号>=10,提示复制成功;否则提示需在文字选中后，手动选择“拷贝”进行复制
        clipboard.on('success', function(e) {
            showAlertMsg.showProject('复制成功!')
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
            showAlertMsg.showProject('请选择“拷贝”进行复制!')
            //showAlertMsg.showProject('请选择“拷贝”进行复制!')
            //showAlertMsg.showMsgFun('温馨提示','请选择“拷贝”进行复制!')
        });
        //充值银行卡
        $scope.vipbanklist = function () {
            $ionicLoading.show({ content: 'Loading', duration: 30000 });
            $http({
                method: 'POST',
                url: ApiEndpoint.url + '/wallet/vip/banklist',
                data: {
                    token: UserInfo.l.token,
                }
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.carlist = data.data.banklist;
                    $scope.wd.cardno = data.data.banklist[0].cardno;
                    $scope.moneys = data.data.moneys.split(',');
                    $scope.moneyType = $scope.moneys[3];
                    $scope.wd.money =  $scope.moneys[3];
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('失败', '网络异常,请稍后再试!');
            });
        }
        $scope.vipbanklist();

        //大额充值
        $ionicModal.fromTemplateUrl('templates/common/morepay.html?0904', {
            scope: $scope,
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        //关闭大额充值
        $scope.close = function () {
            $scope.popshow = false;
            $scope.closeModal();
        }
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //订单付款
    .controller('paymentCtrl', ['$location','$stateParams','$ionicScrollDelegate','HttpServer','$ionicModal','PayFlow', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'HttpStatus', function($location,$stateParams,$ionicScrollDelegate,HttpServer,$ionicModal,PayFlow, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, HttpStatus) {
        $scope.Transactiondata  = JSON.parse($stateParams.paystring);
        $scope.type  = $stateParams.type;
        $scope.palytype = $stateParams.palytype;
        $scope.search = {
            money: '',
        };
        //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //提现
    .controller('WithdrawCtrl', ['HttpServer','PayFlow', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'HttpStatus', function(HttpServer,PayFlow, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, HttpStatus) {
        $scope.vle = 'ALI';
        $scope.showmodule = false;
        $scope.showbank = false;
        //登录验证
        var dl = {
            token: UserInfo.l.token,
        }
        HttpStatus.myinfo().then(function (data) {
            //console.log(data);
            HttpStatus.codedispose(data);
        })
        $scope.tagshowmodule = function() {
            $scope.showmodule = true;
        }
        $scope.login = {
            token: UserInfo.l.token,
            ctype: 'ALI',
            msg: '',
        }
        $scope.quanbu = function() {
            if (UserInfo.l.money) {
                $scope.login.money = UserInfo.l.money;
            }
        }
        $scope.changeTab = function(evt) {
            var elem = evt.currentTarget;
            $scope.vle = elem.getAttributeNode('data-active').value;
            if ($scope.vle == 'ALI') {
                $scope.login.cname = UserInfo.l.cashAliName || '';
                $scope.login.cant = UserInfo.l.cashAliAccount || '';
                $scope.login.ctype = 'ALI';
            } else {
                $scope.showbank = false;
                $scope.login.ctype = 'BANK';
                $scope.login.cname = '';
                $scope.login.cant = '';
            }
        }
        $scope.balance = UserInfo.l.money || 0;
        $scope.login.cname = UserInfo.l.cashAliName || '';
        $scope.login.cant = UserInfo.l.cashAliAccount || '';
        $scope.txmoney = function() {
            $scope.login.money = parseInt($scope.login.money);
        }
        $scope.doLogin = function() {
                if (!$scope.login.cname) {
                    if ($scope.vle == 'ALI') {
                        showAlertMsg.showMsgFun('温馨提示', '请输入真实姓名');
                    } else {
                        showAlertMsg.showMsgFun('温馨提示', '请选择提现银行卡');
                    }
                    return false;
                };
                if (!$scope.login.cant) {
                    showAlertMsg.showMsgFun('温馨提示', '请输入支付宝账号');
                    return false;
                };
                if (!$scope.login.money) {
                    showAlertMsg.showMsgFun('温馨提示', '请输入提现金额');
                    return false;
                };
                $ionicLoading.show({ content: 'Loading', duration: 30000 });
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/wallet/cash',
                    data: $scope.login,
                }).success(function(data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        showAlertMsg.showMsgFun('温馨提示', data.msg);
                        $scope.backGo();
                    }
                }).error(function(data) {
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('温馨提示', '网络连接失败，请检查网络连接');
                });
            }
            //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            $ionicHistory.clearCache().then(function() {
                $state.go('tab.account');
            })
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //充值查询
    .controller('PaysuccessCtrl', ['$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'serializeUrl', 'stock', 'UserInfo', 'showAlertMsg', 'HttpStatus', '$interval', function($scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, serializeUrl, stock, UserInfo, showAlertMsg, HttpStatus, $interval) {
        $scope.successimg = false;
        var jsondata = serializeUrl.url(location.href);
        //console.log(jsondata.param.extends);
        var orderid = jsondata.param.extends;
        var pid = jsondata.param.pid;
        var Timing = true;
        $scope.sult = 30;
        $scope.doPost = function() {
            /* if(Timing){
                 return false;
             }*/
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/wallet/querycharge",
                data: {
                    orderid: orderid,
                    token: UserInfo.l.token,
                }
            }).success(function(data) {
                if (data.status == 1) {
                    /* Timing = true;*/
                    if (data.data.payresult == 1) {
                        $scope.successimg = true;
                        $interval.cancel($scope.codeTime);
                    }
                } else {
                    HttpStatus.codedispose(data);
                    $interval.cancel($scope.codeTime);
                }
            }).error(function() {

            })
        }
        $scope.codeTime = $interval(function() {
                $scope.doPost();
                $scope.sult--;
                if ($scope.sult == 0) {
                    $interval.cancel($scope.codeTime);
                    $scope.backGopay();
                }
            }, 1000)
            //返回方法
        $scope.backGopay = function() {
            //$ionicHistory.goBack();
            //window.history.back();
            if ($scope.codeTime) {
                $interval.cancel($scope.codeTime);
            }
            if(String(pid).substr(0,2) == 10){
                $ionicHistory.clearCache().then(function() {
                    $state.go('practice.syxwhall', { type: 10 });
                })
            }else{
                $state.go('tab.account');
            }
        }
        $scope.Gohome = function() {
            if ($scope.codeTime) {
                $interval.cancel($scope.codeTime);
            }
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {
            $interval.cancel($scope.codeTime);
        })
    }])
    //竞彩足球大厅
    .controller('SoccerhallCtrl', ['$ionicGesture', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Flottery', 'myFactory', 'Match', '$timeout', 'HttpStatus', '$ionicPopup', 'Chats', function($ionicGesture, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Flottery, myFactory, Match, $timeout, HttpStatus, $ionicPopup, Chats) {
        //初始化
        var DJstatus = false;
        $scope.screenH = screen.height
        $scope.bgimg = false;
        var time = new Date().getTime();
        $scope.playlistdata = 1; //默认选择单关胜负平
        $scope.playlisttext = '胜负平(过关)';
        $scope.gamesession = '请至少选择两场比赛';
        $scope.Showcbfmod = false;
        $scope.Showhhmod = false;
        $scope.Matchlist = '';
        $scope.ShlistHeght = false;
        $scope.HfiltrateHeght = false;
        $scope.assistantShow = false;
        $scope.list = '';
        $scope.vle = 1;
        $scope.matchnamelist = [];
        var cbfarry = [];
        $scope.gamearry = '';
        $scope.scrolllen = 0;
        //筛选比赛为0场时空状态图片展示
        var dow = function () {
            $timeout(function() {
                var _this = $('#zuqiu .match-divider');
                var typebg =false;
                for (var i = 0; i < _this.length; i++) {
                    if(parseInt($(_this[i]).find('.date-num').text())>0){
                        typebg = false;
                        break;
                    }else{
                        typebg = true;
                    }
                }
                if(typebg){
                    $scope.bgimg = true;
                }else{
                    $scope.bgimg = false;
                }
            },0)
        }
        //监听玩法与场次筛选数据
        $scope.$watch('playlistdata',
            function (newVal,oldVal) {
                dow();
            })
        $scope.$watch('gamearry',
            function (newVal,oldVal) {
                dow();
            })
        //助手
        $scope.assistant = function(e) {
                switch (e) {
                    case 1:
                        $state.go('practice.detaillist', { type: 1 });
                        break;
                    case 2:
                        $state.go('practice.play-About', { type: '1' });
                        break;
                    case 3:
                        $state.go('practice.Lottery', { type: '1' });
                        break;
                    default:
                        break;
                }
                $scope.assistantShow ? $scope.assistantShow = false : $scope.assistantShow = true;
            }
            //赛事筛选
        $('.gamefilter').on('touchend', 'a', function(evt) {
            var elem = evt.currentTarget;
            $scope.$apply(function() {
                $scope.vle = elem.getAttributeNode('data-active').value;
            });
            var li = $('.gamename li');
            if ($scope.vle == 1) {
                for (var i = 0; i < li.length; i++)
                    if (li[i].className.indexOf('ott-img') == -1) {
                        $(li[i]).addClass('ott-img');
                    }
            } else if ($scope.vle == 2) {
                for (var i = 0; i < li.length; i++) {
                    $(li[i]).toggleClass('ott-img');
                }
            }
            evt.stopPropagation();
        })
        $('.gamename').on('touchend', 'li', function(event) {
            $(this).toggleClass('ott-img')
            event.stopPropagation();
        })
        $('.gamefoot').on('touchend', '.qd', function(event) {
                if (Chats.gamenameQD() == '') {
                    showAlertMsg.showMsgFun('提示', '至少选择一场赛事');
                    return false;
                };
                $scope.$apply(function() {
                    $scope.list = Match.MatchFilter($scope.playlistdata);
                    if ($scope.playlistdata > 6) {
                        $scope.gamesession = '请至少选择一场比赛';
                    } else {
                        $scope.gamesession = '请至少选择两场比赛';
                    }
                    cbfarry = [];
                    $scope.gamearry = Chats.gamenameQD();
                    $scope.HfiltrateHeght = false;
                    //console.log($scope.gamearry);
                });
                event.stopPropagation();
            })
            //获取赛事列表
        $scope.doPost = function() {
            $ionicLoading.show({ content: 'Loading', duration: 30000 })
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/zq/list",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    var jsondata = JSON.stringify(data.data);
                    $scope.Matchlist = data.data;
                    //console.log(jsondata.length);
                    UserInfo.add('jsondatazq', jsondata);
                    UserInfo.add('jsondatazqtime', new Date().getTime());
                    $scope.list = Match.MatchFilter(1);
                    //console.log($scope.list);
                    $scope.matchnamelist = Chats.gamefilter($scope.list);
                    for (var i in $scope.matchnamelist) {
                        $scope.gamearry += $scope.matchnamelist[i];
                    }
                    //$scope.gamearry =
                    //console.log(JSON.parse(jsondata));
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            if(UserInfo.l.jsongate){
                return false
            }
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/zq/gate",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    var jsongate = JSON.stringify(data.data);
                    UserInfo.add('jsongate', jsongate);
                }
            })
        }
        //加载优化
     /*   var fromhall = false;
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            console.log($ionicHistory.viewHistory())
            //console.log(fromState.name)
            if(fromState.name=='practice.Betting' || fromState.name=='user.login' || fromState.name=='user.register'){
                fromhall = true;
            }
        })*/
       /* $scope.$on('$ionicView.beforeEnter', function() {

        });*/
        $timeout(function() {
                $scope.doPost();
        }, 350)
        $scope.Shlist = function() {
            //console.log(e.target);
            $scope.HfiltrateHeght = false;
            $scope.ShlistHeght ? $scope.ShlistHeght = false : $scope.ShlistHeght = true;
        }
        $scope.Hfiltrate = function() {
                //console.log(e.target);
                $scope.ShlistHeght = false;
                $scope.HfiltrateHeght ? $scope.HfiltrateHeght = false : $scope.HfiltrateHeght = true;
            }
            //赛事收起
        $('.opensss').on('touchend', '.match-divider', function() {
                $(this).toggleClass('closed');
                $(this).closest('.match-list').toggleClass('hideOneDay');
            })
            //点击弹出层空白区域隐藏
        $('.Soccerhall-playlist').on('touchend', function() {
                $scope.$apply(function() {
                    $scope.ShlistHeght = false;
                    $scope.HfiltrateHeght = false;
                })
            })
            //玩法筛选
        var playlist = document.querySelectorAll('.Soccerhall-playlist ul li');
        var Addplaylist = function() {
                for (var i = 0; i < playlist.length; i++) {
                    if (playlist[i].className.indexOf('ott-img') != -1) {
                        playlist[i].className = '';
                    }
                }
            }
            //玩法选择
        angular.element(playlist[0]).addClass('ott-img');
        angular.element(playlist).on('touchend', function(e) {
            Addplaylist();
            angular.element(this).addClass('ott-img');
            playlistdata = this.getAttribute('data');
            var playlisttext = angular.element(this).text();
            $scope.$apply(function() {
                if (playlistdata > 6) {
                    $scope.gamesession = '请至少选择一场比赛';
                } else {
                    $scope.gamesession = '请至少选择两场比赛';
                }
                cbfarry = [];
                $scope.playlistdata = playlistdata;
                $scope.playlisttext = playlisttext;
                $scope.Shlist();
                $scope.list = Match.MatchFilter(playlistdata);
                //console.log($scope.list);
            });
            return false;
        });
        //投注选择监听
        var arryv2 = [];//投注数据保存
        var arry1 = []; //整体数据
        $('.opensss').on('click', '.betbtns', function(event) {
            /*            var touch = event.targetTouches[0];
                        startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};
                        isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
                        console.log(startPos);
                        $(this).on('touchmove', function (event) {
                            var touch = event.targetTouches[0];
                            endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
                            movetime = +new Date - startPos.time;
                            isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
                            istime = movetime>50 ? 1:0;    //istime为1时，表示触摸超过200毫秒，0为小于
                            if(istime === 1){
                                event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
                            }
                            console.log(istime);
                        })
                        $(this).on('touchend', function (event) {
                            console.log(event);
                            var duration = +new Date - startPos.time;
                            console.log(duration);
                           $(this).off('touchmove');
                            $(this).off('touchend');
                        })*/
            /*var objv2 = {};
            objv2.gameid = $(this).data('gameid');
            objv2.bettingid = $(this).data('bettingid');
            objv2.resultid = $(this).data('resultid');
            objv2.result = $(this).find('span').first().text();
            arryv2.push(objv2);
            arryv2 = Match.hashunique(arryv2);
            console.log(arryv2);*/


            angular.element(this).toggleClass('ssss');
            if (($scope.playlistdata == 6 || $scope.playlistdata == 12) && $scope.Showhhmod == false) {
                $scope.list = Match.hhjsondata($(this), $scope.list);
            }
            DJstatus = true;
            Searchresult();
            //console.log(arry1);
            return false;
            //console.log(Match.splicearry1(cbfarry));
        })

        var Searchresult = function() {
                arry1 = [];
                if (($scope.playlistdata == 6 || $scope.playlistdata == 12) && $scope.Showhhmod == true) {
                    var a = $('.Showcbf .betbtns');
                } else {
                    var a = $('.betbtns');
                }
                //console.log(a);
                if (($scope.playlistdata == 6 || $scope.playlistdata == 12) && $scope.Showhhmod == false) {

                } else {
                    for (var i = 0; i < a.length; i++) {
                        var obj = {}; //场次
                        if (a[i].className.indexOf('ssss') != -1) {
                            //console.log($(a[i]).find('span').first().text());
                            obj.gameid = a[i].getAttribute('data-gameid');
                            obj.bettingid = a[i].getAttribute('data-bettingid');
                            obj.resultid = a[i].getAttribute('data-resultid');
                            obj.result = $(a[i]).find('span').first().text();
                            arry1.push(obj);
                        }
                    }
                }

                //非弹出层选菜场次计算
                if (($scope.playlistdata == 6 || $scope.playlistdata == 12) && $scope.Showhhmod == false) {
                    var gamelist = Match.fructus($scope.list);
                    $scope.$apply(function() {
                        $scope.gamesession = Match.countsession(gamelist, $scope.playlistdata);
                    })
                } else if ($scope.playlistdata == 4 || $scope.playlistdata == 10) {} else if ($scope.playlistdata != 6 && $scope.playlistdata != 12) {
                    $scope.$apply(function() {
                        $scope.gamesession = Match.countsession(arry1, $scope.playlistdata);
                    });
                }
            }
            //猜比分弹出窗
        $scope.showcbf = '';
        var cbfindex = '';
        var cbfparentinde = '';
        $scope.showPopup = function(cbf, parentinde, index) {
            DJstatus = false;
            $scope.Showcbfmod = true;
            $scope.showcbf = cbf;
            cbfparentinde = parentinde;
            cbfindex = index;
            if (cbf.result != undefined) {
                $timeout(function() {
                    Match.hhselected(cbf);
                }, 2)

            }
        };
        $scope.cbfcancel = function() {
            $scope.Showcbfmod = false;
        };
        //猜比分投注数据记录 var cbfarry = [];
        $scope.cbfconfirm = function() {
            $scope.Showcbfmod = false;
            if (DJstatus == false) {
                return false;
            }
            var list = $scope.list;
            var f = '';
            var g = '';
            var k = '';
            for (var j in arry1) {
                f += arry1[j].result + ' ';
                g += arry1[j].bettingid + ' ';
                k += arry1[j].resultid + ' ';
            }
            $scope.list[cbfparentinde].file[cbfindex].result = f;
            $scope.list[cbfparentinde].file[cbfindex].resbettingid = g;
            $scope.list[cbfparentinde].file[cbfindex].resresultid = k;
            //console.log($scope.list);
            //cbfarry.push(arry1);
            //console.log(cbfarry);
            //获取处理混合投注数据
            $scope.gamesession = Match.countsession(Match.fructus($scope.list), $scope.playlistdata);
            //渲染所有选中结果
            Match.hhpageselected($scope.list);
        };

        //混合投注
        $scope.showhh = '';
        $scope.showmixall = function(hh, parentinde, index) {
            DJstatus = false;
            $scope.Showhhmod = true;
            //Searchresult();
            //console.log(arry1);
            $scope.showhh = hh;
            cbfparentinde = parentinde;
            cbfindex = index;
            if (hh.result != undefined) {
                //console.log(hh);
                Match.hhselected(hh);
            }
        };
        $scope.hhcancel = function() {
            $scope.Showhhmod = false;
        };
        $scope.hhconfirm = function() {
            $scope.Showhhmod = false;
            if (DJstatus == false) {
                return false;
            }
            var list = $scope.list;
            var f = '';
            var g = '';
            var k = '';
            for (var j in arry1) {
                f += arry1[j].result + ' ';
                g += arry1[j].bettingid + ' ';
                k += arry1[j].resultid + ' ';
            }
            $scope.list[cbfparentinde].file[cbfindex].result = f;
            $scope.list[cbfparentinde].file[cbfindex].resbettingid = g;
            $scope.list[cbfparentinde].file[cbfindex].resresultid = k;
            //console.log($scope.list);
            //cbfarry.push(arry1);
            //console.log(cbfarry);
            //获取处理混合投注数据
            $scope.gamesession = Match.countsession(Match.fructus($scope.list), $scope.playlistdata);
            //渲染所有选中结果
            Match.hhpageselected($scope.list);
        };
        //清除比赛
        $scope.hallcancel = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您确定要清空当前投注吗？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.list = Match.MatchFilter($scope.playlistdata);
                        $scope.gamesession = '请至少选择两场比赛';
                    } else {

                    }
                });
            }
            //确认提交
        $scope.Confirm = function() {
                //登录验证
                if (!UserInfo.l.flag) {
                    $state.go('user.login', { type: 1 });
                    return false;
                }
                $ionicLoading.show({ content: 'Loading', duration: 30000 });
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/usr/myinfo',
                    data: {
                        token: UserInfo.l.token
                    },
                }).success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == '1') {
                        UserInfo.save(data.data);
                        if ($scope.playlistdata == 4 || $scope.playlistdata == 6 || $scope.playlistdata == 10 || $scope.playlistdata == 12) {
                            arry1 = Match.fructus($scope.list);
                            //console.log(arry1);
                            $scope.gamesession = Match.countsession(arry1, $scope.playlistdata);
                        }
                        myFactory.setter(arry1);
                        var Passdata = JSON.stringify(arry1);
                        var gamesession = $scope.gamesession.replace(/[^0-9]/ig, "");
                        if ($scope.playlistdata <= 6) {
                            if (gamesession < 2) {
                                showAlertMsg.showMsgFun('提示', '请至少选择两场比赛');
                                return false;
                            } else if (gamesession > 8) {
                                showAlertMsg.showMsgFun('提示', '过关玩法投注场次最大为8场');
                                return false;
                            }
                        } else {
                            if (gamesession < 1) {
                                showAlertMsg.showMsgFun('提示', '请至少选择一场场比赛');
                                return false;
                            } else if (gamesession > 8) {
                                showAlertMsg.showMsgFun('提示', '过关玩法投注场次最大为8场');
                                return false;
                            }
                        }
                        //console.log($scope.list);
                        UserInfo.add('Passdata', Passdata);
                        //console.log($scope.playlisttext);
                        $state.go('practice.Betting', {
                            id: $scope.playlistdata,
                            gamenum: gamesession,
                            palytype: $scope.playlisttext
                        });
                    } else if (data.status == '100') {
                        $state.go('user.login', { type: 1 });
                    }
                })
            }
            //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            //window.history.back();
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {
            //console.log('页面销毁');
            $('.opensss').off('click', '.betbtns');
            angular.element(playlist).off('touchend');
        })
    }])
    //竞彩足球投注
    .controller('BettingCtrl', ['activity','$rootScope','$filter','$ionicScrollDelegate', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', '$timeout', 'Bettingpage', 'Chats', 'History', '$ionicPopup', 'PayFlow', function(activity,$rootScope,$filter,$ionicScrollDelegate, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus, $timeout, Bettingpage, Chats, History, $ionicPopup, PayFlow) {
        $scope.playlistdata = $stateParams.id;
        var palytype = $stateParams.palytype;
        $scope.palytype = palytype;
        $scope.type = $stateParams.type || 1;
        $scope.zhtype = $stateParams.atype;//包中活动标识
        $scope.bzbom = false;//包中分析shouqi
        $scope.styletop = {'top':'0'};
        $scope.join = true;
        //console.log($filter('gates')($stateParams.guan.replace(/(.*)[,，]$/, '$1').split(",")));
        var aid = $stateParams.aid;
        $scope.vle = 1;
        $scope.Showcbfmod = false;
        $scope.Showhhmod = false;
        //跳转购彩协议
        $scope.golotage = function() {
                $state.go('betinfo.lotage');
            }
            //var Passdata =  myFactory.getter();
        var Passdata = JSON.parse(UserInfo.l.Passdata);
        //console.log(Passdata);
        $scope.jsongate = JSON.parse(UserInfo.l.jsongate);
        $scope.Passdata = Passdata;
        $scope.Infodata = '';
        $scope.confirmation = false;
        $scope.Mannerbox = false;
        $scope.Transactiondata = '';
        if (!Passdata || Passdata == '') {
            window.history.back();
            return false;
        }
        //console.log(Match.datatreatment(Passdata));
        //猜比分弹出窗
        $scope.showcbf = '';
        var cbfindex = '';
        var cbfparentinde = '';
        $scope.showPopup = function(cbf, parentinde, index) {
            $scope.Showcbfmod = true;
            $scope.showcbf = cbf;
            cbfparentinde = parentinde;
            cbfindex = index;
            $timeout(function() {
                Match.cbfbetting(Passdata);
            }, 2)
        };
        $scope.cbfcancel = function() {
            $scope.Showcbfmod = false;
        };
        //猜比分投注数据记录 var cbfarry = [];
        $scope.cbfconfirm = function() {
            $scope.Showcbfmod = false;
        };
        //混合投注
        $scope.showhh = '';
        $scope.showmixall = function(hh, parentinde, index) {
            $scope.Showhhmod = true;
            $scope.showhh = hh;
            cbfparentinde = parentinde;
            cbfindex = index;
            $timeout(function() {
                Match.cbfbetting(Passdata);
            }, 2)
        };
        $scope.hhcancel = function() {
            $scope.Showhhmod = false;
        };
        $scope.hhconfirm = function() {
                $scope.Showhhmod = false;
            }

        //赛事列表
        var select = function(total, option) {
                var list = [];
                var t = total; //总赛事
                var o = option; //所选赛事
                for (var i = 0; i < o.length; i++) {
                    for (var j = 0; j < t.length; j++) {
                        if (o[i].gameid == t[j].gameid) {
                            list.push(t[j]);
                            break;
                        }
                    }
                }
                return list;
            }
            //console.log( Match.unique(select(totaldata,Passdata)));

        //console.log(Passdata);
        //console.log($scope.list);
        //addclass();
        //console.log(300+'|'+Match.datatreatment(Passdata));
        //提交订单
        $scope.data = {
            betcount: 10,
            doublecount: $stateParams.doubleCount || 5,
            money: 50,
            token: UserInfo.l.token,
            type: 1,
            betjson: '',
        }
        $scope.doPost = function() {
            if ($scope.Passway == '') {
                showAlertMsg.showProject('请选择过关方式');
                return false;
            } else if ($scope.list == '') {
                showAlertMsg.showProject('未选择任何投注方案');
                return false;
            } else if ($scope.list.length < 2 && $scope.playlistdata <= 6) {
                showAlertMsg.showProject('请至少选择两场比赛');
                return false;
            }
            var pw = Bettingpage.passway($scope.Passway) || 200;
            $scope.data.betjson = pw + '|' + Match.datatreatment(Passdata);
            PayFlow.money($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    $scope.Infodata = data.data;
                }
            })
        }

        //进入当前视图
        //筛选已投注赛事
        var totaldata =[];
        $scope.$on('$ionicView.beforeEnter', function() {
            $timeout(function() {
                Match.MatchFilterpay($scope.playlistdata, 2).then(function (data) {
                    //console.log(data);
                    totaldata = data;
                    $scope.list = Match.unique(select(totaldata, Passdata));
                    $scope.list = Match.result($scope.list, Passdata);
                    $scope.gamenum = $scope.list.length;
                    //默认选择过关方式
                    if ($scope.playlistdata > 6) {
                        $scope.Passway = [{
                            gatename: "仅支持单关",
                            id: 100
                        }];
                    } else {
                        var p = Passdata;
                        if ($scope.gamenum >= 4) {
                            for (var i = 0; i < p.length; i++) {
                                if ((Passdata[i].bettingid == 1 || Passdata[i].bettingid == 2)) {
                                    $scope.gamenum = 4;
                                    break;
                                } else if (Passdata[i].bettingid == 3 && $scope.gamenum >= 6) {
                                    $scope.gamenum = 6;
                                }
                            }
                        }
                        /*  if($scope.playlistdata==3 || $scope.playlistdata==4 ){
                         $scope.pid = 400;
                         $scope.Passway = [
                         {
                         gatename: "4串1",
                         id: 400
                         }
                         ];
                         }else if($scope.playlistdata==5){
                         $scope.pid = 600;
                         $scope.Passway = [
                         {
                         gatename: "6串1",
                         id: 600
                         }
                         ];
                         }else{*/
                        //console.log($rootScope.atype);
                        if ($scope.zhtype == 'BAOZHONG') {
                            $scope.pid = $scope.gamenum * 100;
                            $scope.Passway = [];
                            //console.log($stateParams.guan);
                            var guanid = $stateParams.guan.replace(/(.*)[,，]$/, '$1').split(",");
                            //console.log(guanid);
                            //var guan = $stateParams.guan.replace(/(.*)[,，]$/, '$1').split(",");
                            for (var n = 0; n < guanid.length; n++) {
                                var obj = {};
                                obj.gatename = $filter('gates')(guanid[n]);
                                obj.id = guanid[n];
                                $scope.Passway.push(obj);
                            }
                            $('#bzbagpop').remove();
                            //$('body').off('click', '#bzbagpop #continue');
                            //$scope.pid = $scope.gamenum * 100;
                            /* $scope.Passway = [{
                             gatename: guan,
                             id: guanid,
                             }];*/
                            //console.log($scope.Passway);
                        } else {
                            $scope.pid = $scope.gamenum * 100;
                            $scope.Passway = [{
                                gatename: $scope.gamenum + "串1",
                                id: $scope.gamenum * 100
                            }];
                        }
                        /*}*/
                        /* $scope.Passway = [
                         {
                         gatename: "2串1",
                         id: 200
                         }
                         ];*/
                    }
                    $scope.doPost();
                });
            },50);
        })

        //过关方式处理
        $scope.Betsway = function() {
                if ($scope.playlistdata > 6) {
                    return false
                }
                $scope.Mannerbox ? $scope.Mannerbox = false : $scope.Mannerbox = true;
            }
            //过关方式收起
        $scope.Betswayshow = function() {
            $scope.Mannerbox = false;
        }
        $scope.changeTab = function(evt) {
            var elem = evt.currentTarget;
            $scope.vle = elem.getAttributeNode('data-active').value;
            if ($scope.vle == 1) {
                $scope.pid = $scope.gamenum * 100;
                $scope.Passway = [{
                    gatename: $scope.gamenum + "串1",
                    id: $scope.gamenum * 100
                }];
                $scope.doPost();
            }
            evt.stopPropagation();
        }
        $scope.gatefilter = function(g) {
            var p = Passdata;
            if ($scope.gamenum >= 4) {
                for (var i = 0; i < p.length; i++) {
                    if ((Passdata[i].bettingid == 1 || Passdata[i].bettingid == 2)) {
                        $scope.gamenum = 4;
                        break;
                    } else if (Passdata[i].bettingid == 3 && $scope.gamenum >= 6) {
                        $scope.gamenum = 6;
                    }
                }
            }
            if ($scope.vle == 2) {
                if (g.fixed == false && $scope.gamenum >= g.totalgate && 1 != g.totalgate) {
                    return true;
                } else {
                    return false;
                }
            } else if ($scope.vle == 1) {
                if (g.fixed == true && $scope.gamenum >= g.totalgate && 1 != g.totalgate) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        $scope.dochange = function() {
            if ($scope.data.doublecount <= 0 || $scope.data.doublecount == '') {
                return false;
            }
            if ($scope.data.doublecount > 9999) {
                $scope.data.doublecount = 9999;
            }
            $scope.doPost();
        }
        $scope.doblur = function() {
                if ($scope.data.doublecount <= 0 || $scope.data.doublecount == '') {
                    $scope.data.doublecount = 1;
                    showAlertMsg.showProject('单次投注倍数应在1~9999');
                } else if ($scope.data.doublecount > 9999) {
                    $scope.data.doublecount = 9999;
                    showAlertMsg.showProject('单次投注倍数应在1~9999之间');
                } else if ($scope.list.length < 2 && $scope.playlistdata <= 6) {
                    showAlertMsg.showProject('请至少选择两场比赛');
                    return false;
                }
                $scope.doPost();
            }
            //清除
        $scope.clearlist = function() {
            var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您确定要清空当前的投注内容吗？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.backGo();
                        /* $ionicHistory.clearCache(['practice.Soccerhall','practice.basketballhall']).then(function () {
                         $state.go('practice.Soccerhall')
                         })*/
                    } else {

                    }
            });
        }
        $scope.add = function() {
            if ($scope.data.doublecount == 9999) {
                return false;
            }
            $scope.data.doublecount++;
            $scope.doPost();
        }
        $scope.cutdown = function() {
                if ($scope.data.doublecount == 1) {
                    return false;
                }
                $scope.data.doublecount--;
                $scope.doPost();
            }
            //删除已选投注
        $scope.deletelist = function(l) {
                Passdata = Chats.deletPassdata(l, Passdata);
                UserInfo.add('Passdata', JSON.stringify(Passdata));
                $scope.list = Chats.remove(l, $scope.list);
                if ($scope.list.length >= 2 && $scope.playlistdata <= 6) {
                    if ($scope.list.length >= 4) {
                        var tase = false;
                        for (var i = 0; i < Passdata.length; i++) {
                            if ((Passdata[i].bettingid == 1 || Passdata[i].bettingid == 2)) {
                                $scope.gamenum = 4;
                                tase = true;
                                break;
                            } else if (Passdata[i].bettingid == 3 && $scope.list.length >= 6) {
                                tase = true;
                                $scope.gamenum = 6;
                            }
                        }
                        if (tase == false) {
                            $scope.gamenum--;
                        }
                    } else {
                        $scope.gamenum--;
                    }
                    $scope.vle = 1;
                    $scope.pid = $scope.gamenum * 100;
                    $scope.Passway = History.passwayss($scope.playlistdata, $scope.gamenum);
                    $ionicScrollDelegate.$getByHandle('passwap').scrollTop();
                }
                if ($scope.list.length < 1 && $scope.playlistdata > 6) {
                    showAlertMsg.showProject('请至少选择一场比赛');
                    $scope.Infodata = [];
                    return false
                }
                if ($scope.list.length < 2 && $scope.playlistdata < 6) {
                    showAlertMsg.showProject('请至少选择两场比赛');
                    $scope.Infodata = [];
                    return false
                }
                $scope.doPost();
                /* if ($scope.list.length < 2) {
                     $scope.Infodata = [];
                     showAlertMsg.showProject('请至少选择两场比赛');
                 }*/
            }
            //关闭付款
        $scope.CloseConfirmation = function() {
            $scope.confirmation = false;
        }
        $('.methods-con').on('click', '.methods-con span', function() {
            if ($scope.vle == 2) {
                var s = $(this).siblings();
                for (var i = 0; i < s.length; i++) {
                    $(s[i]).removeClass("ott-img");
                }
            }
            $(this).toggleClass('ott-img');
            //遍历过关所选过关方式
            $scope.$apply(function() {
                $scope.Passway = Bettingpage.traverse();
                $scope.doPost();
            });
            return false;
        })
        //包中活动追投
        //$scope.matchAnalysis='sfsf'
        if($scope.zhtype=='BAOZHONG'){
            activity.lotterylist().then(function (data) {
                $scope.join = data.data[0].join;
                //console.log(data.data[0].matchAnalysis);
                $scope.matchAnalysis = data.data[0].matchAnalysis;
                //$scope.join = false;
            });
        }
        //包中活动历史跳转
        $scope.ZBhistory = function () {
            $state.go('practice.bzrecord');
        }
        //包中赛事分析
        $scope.bzfx = function () {
            $scope.bzbom = !$scope.bzbom;//包中分析shooqi
            if($scope.bzbom){
                $scope.styletop = {'top':'-5.26rem'};
            }else{
                $scope.styletop = {'top':'0'};
            }
        }
        //包中确定
        $scope.baozhongqd = function () {
            var bzPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '您已参加过本期包中活动，本次购买为自购(无包中退款),继续投注?',
                cancelText: '取消',
                okText: '继续',
                okType: 'font-color'
            });
            bzPopup.then(function(res) {
                if (res) {
                    $scope.dobill();
                    /* $ionicHistory.clearCache(['practice.Soccerhall','practice.basketballhall']).then(function () {
                     $state.go('practice.Soccerhall')
                     })*/
                } else {
                }
            });
        }
        //提交订单
        $scope.dobill = function() {
            if ($scope.Passway == '') {
                showAlertMsg.showProject('请选择过关方式');
                return false;
            } else if ($scope.list == '') {
                showAlertMsg.showProject('未选择任何投注方案');
                return false;
            } else if ($scope.data.doublecount == '' || $scope.data.doublecount <= 0 || $scope.data.doublecount > 9999) {
                showAlertMsg.showProject('单次投注倍数应在1~9999之间');
                return false;
            } else if ($scope.list.length < 2 && $scope.playlistdata <= 6) {
                showAlertMsg.showProject('请至少选择两场比赛');
                return false;
            }
            var pw = Bettingpage.passway($scope.Passway) || 200;
            $scope.data.betjson = pw + '|' + Match.datatreatment(Passdata);
            $scope.data.money = $scope.Infodata.betmoney;
            $scope.data.betcount = $scope.Infodata.betcount;
            if($scope.zhtype == 'BAOZHONG' && $scope.join){
                var proem = {
                    actid:aid,
                    copy:1,
                    token:UserInfo.l.token,
                }
                PayFlow.follow(proem).then(function(data) {
                    if(data.status == 100){
                        window.localStorage.removeItem('flag');
                        //showAlertMsg.showMsgFun('未登录','请登录');
                        $state.go('user.login',{
                            type:'-1'
                        });
                        return false;
                    }
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        $scope.Transactiondata = data.data;
                        var transactiondata = JSON.stringify($scope.Transactiondata);
                        $ionicHistory.clearCache(['user.payment']).then(function() {
                            $state.go('user.payment', {
                                paystring: transactiondata,
                                type:$scope.type,
                                palytype: $scope.palytype,
                            });
                        })
                    }
                })
            }else{
                PayFlow.bill($scope.data).then(function(data) {
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        $scope.Transactiondata = data.data;
                        var transactiondata = JSON.stringify($scope.Transactiondata);
                        $ionicHistory.clearCache(['user.payment']).then(function() {
                            $state.go('user.payment', {
                                paystring: transactiondata,
                                type:$scope.type,
                                palytype: $scope.palytype,
                            });
                        })
                    }
                })
            }
        }
      /*  $scope.$watch('Transactiondata',function(newValue,oldValue, scope){

            console.log(newValue);

            console.log(oldValue);

        });*/
        $scope.payment = function() {
            var chargedata = {
                money: $scope.Transactiondata.chargemoney,
                busorderid: $scope.Transactiondata.betorderid,
            }
            if ($scope.Transactiondata.chargemoney != 0) {
                PayFlow.charge(chargedata);
                return false;
            }
            var paydata = {
                orderid: $scope.Transactiondata.betorderid,
                ordermoney: $scope.Transactiondata.paymoney,
                token: UserInfo.l.token || '',
            }
            PayFlow.pay(paydata).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    if (data.data.payresult == 2) {
                        PayFlow.charge(chargedata);
                    }
                    if (data.data.payresult == 1) {
                        $state.go('practice.paid', { id: data.data.orderid, type: '1', palytype: palytype, backurl: 'practice.Soccerhall' });
                    }
                }
            })
        }
        //滑动事件
        $scope.onSwipe=function($event){
            //console.log($event)
            alert("onSwipe")
            $event.preventDefault();
            return false;
        }
        //返回
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //竞彩篮球大厅
    .controller('basketballhallCtrl', ['$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Flottery', 'myFactory', 'Match', '$timeout', 'HttpStatus', '$ionicPopup', 'Chats', function($scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Flottery, myFactory, Match, $timeout, HttpStatus, $ionicPopup, Chats) {
        //初始化
        DJstatus = false;
        $scope.screenH = screen.height;
        $scope.bgimg = false;
        var time = new Date().getTime();
        $scope.playlistdata = 1; //默认选择单关胜负平
        $scope.playlisttext = '胜负(过关)';
        $scope.gamesession = '请至少选择两场比赛';
        $scope.Showcbfmod = false;
        $scope.Showhhmod = false;
        $scope.Matchlist = '';
        $scope.ShlistHeght = false;
        $scope.HfiltrateHeght = false;
        $scope.assistantShow = false;
        $scope.list = '';
        $scope.vle = 1;
        $scope.matchnamelist = [];
        var cbfarry = [];
        $scope.gamearry = '';
        //助手
        $scope.assistant = function(e) {
                switch (e) {
                    case 1:
                        $state.go('practice.detaillist', { type: 2 });
                        break;
                    case 2:
                        $state.go('practice.play-About', { type: '2' });
                        break;
                    case 3:
                        $state.go('practice.Lottery', { type: '2' });
                        break;
                    default:
                        break;
                }
                if ($scope.assistantShow == false) {
                    $scope.assistantShow = true;
                } else {
                    $scope.assistantShow = false;
                }
            }
            //赛事筛选
        $('.gamefilter').on('touchend', 'a', function(evt) {
            var elem = evt.currentTarget;
            $scope.$apply(function() {
                $scope.vle = elem.getAttributeNode('data-active').value;
            });
            var li = $('.gamename li');
            if ($scope.vle == 1) {
                for (var i = 0; i < li.length; i++)
                    if (li[i].className.indexOf('ott-img') == -1) {
                        $(li[i]).addClass('ott-img');
                    }
            } else if ($scope.vle == 2) {
                for (var i = 0; i < li.length; i++) {
                    $(li[i]).toggleClass('ott-img');
                }
            }
            return false;
        })
        $('.gamename').on('touchend', 'li', function(event) {
            $(this).toggleClass('ott-img')
            event.stopPropagation();
        })
        $('.gamefoot').on('touchend', '.qd', function(event) {
                if (Chats.gamenameQD() == '') {
                    showAlertMsg.showMsgFun('提示', '至少选择一场赛事');
                    return false;
                };
                $scope.$apply(function() {
                    $scope.list = Match.Matchbasball($scope.playlistdata);
                    if ($scope.playlistdata > 6) {
                        $scope.gamesession = '请至少选择1场比赛';
                    } else {
                        $scope.gamesession = '请至少选择两场比赛';
                    }
                    cbfarry = [];
                    $scope.gamearry = Chats.gamenameQD();
                    $scope.HfiltrateHeght = false;
                });
                return false;
            })
            //获取赛事列表
        $scope.doPost = function() {
            $ionicLoading.show({ content: 'Loading', duration: 30000 })
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/lq/list",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    var jsondata = JSON.stringify(data.data);
                    $scope.Matchlist = data.data;
                    //console.log(jsondata.length);
                    UserInfo.add('jsondatalq', jsondata);
                    $scope.list = Match.Matchbasball(1);
                    $scope.bgimg = true;
                    $scope.matchnamelist = Chats.gamefilter($scope.list);
                    for (var i in $scope.matchnamelist) {
                        $scope.gamearry += $scope.matchnamelist[i];
                    }
                    //console.log(JSON.parse(jsondata));
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/lq/gate",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    var jsongate = JSON.stringify(data.data);
                    UserInfo.add('jsongate', jsongate);
                }
            })
        }
        $scope.doPost();
        $scope.Shlist = function() {
            $scope.HfiltrateHeght = false;
            $scope.ShlistHeght ? $scope.ShlistHeght = false : $scope.ShlistHeght = true;
        }
        $scope.Hfiltrate = function() {
                $scope.ShlistHeght = false;
                $scope.HfiltrateHeght ? $scope.HfiltrateHeght = false : $scope.HfiltrateHeght = true;
            }
            //赛事收起
        $('.opensss').on('touchend', '.match-divider', function() {
                $(this).toggleClass('closed');
                $(this).closest('.match-list').toggleClass('hideOneDay');
            })
            //点击弹出层空白区域隐藏
        $('.Soccerhall-playlist').on('touchend', function() {
                $scope.$apply(function() {
                    $scope.ShlistHeght = false;
                    $scope.HfiltrateHeght = false;
                })
            })
            //玩法筛选
        var playlist = document.querySelectorAll('.Soccerhall-playlist li');
        var Addplaylist = function() {
                for (var i = 0; i < playlist.length; i++) {
                    if (playlist[i].className.indexOf('ott-img') != -1) {
                        playlist[i].className = '';
                    }
                }
            }
            //玩法选择
        angular.element(playlist[0]).addClass('ott-img');
        angular.element(playlist).on('touchend', function() {
            var playlistdata = this.getAttribute('data');
            if (!playlistdata) {
                $scope.$apply(function() {
                    $scope.ShlistHeght = false;
                });
                return false;
            }
            Addplaylist();
            angular.element(this).addClass('ott-img');
            var playlisttext = angular.element(this).text();
            $scope.$apply(function() {
                if (playlistdata > 6) {
                    $scope.gamesession = '请至少选择1场比赛';
                } else {
                    $scope.gamesession = '请至少选择两场比赛';
                }
                cbfarry = [];
                $scope.playlistdata = playlistdata;
                $scope.playlisttext = playlisttext;
                $scope.Shlist();
                $scope.list = Match.Matchbasball(playlistdata);
                console.log($scope.list);
            });
            return false
        });
        //投注选择监听
        var arry1 = []; //整体数据
        $('.opensss').on('click', '.betbtns', function() {
            angular.element(this).toggleClass('ssss');
            if (($scope.playlistdata == 5 || $scope.playlistdata == 11) && $scope.Showhhmod == false) {
                $scope.list = Match.hhjsondata($(this), $scope.list);
            }
            DJstatus = true;
            Searchresult();
            //console.log(arry1);
            //console.log(Match.splicearry1(cbfarry));
            return false;
        })
        var Searchresult = function() {
                arry1 = [];
                if (($scope.playlistdata == 5 || $scope.playlistdata == 11) && $scope.Showhhmod == true) {
                    var a = $('.Showcbf .betbtns');
                } else {
                    var a = $('.betbtns');
                }
                //console.log(a);
                if (($scope.playlistdata == 5 || $scope.playlistdata == 11) && $scope.Showhhmod == false) {

                } else {
                    for (var i = 0; i < a.length; i++) {
                        var obj = {}; //场次
                        if (a[i].className.indexOf('ssss') != -1) {
                            //console.log($(a[i]).find('span').first().text());
                            obj.gameid = a[i].getAttribute('data-gameid');
                            obj.bettingid = a[i].getAttribute('data-bettingid');
                            obj.resultid = a[i].getAttribute('data-resultid');
                            obj.result = $(a[i]).find('span').first().text();
                            arry1.push(obj);
                        }
                    }
                }

                //非弹出层选菜场次计算
                if ($scope.playlistdata == 5 || $scope.playlistdata == 11) {
                    var gamelist = Match.fructus($scope.list);
                    $scope.$apply(function() {
                        $scope.gamesession = Match.countsession(gamelist, $scope.playlistdata);
                    })
                } else if ($scope.playlistdata == 3 || $scope.playlistdata == 9) {} else {
                    $scope.$apply(function() {
                        $scope.gamesession = Match.countsession(arry1, $scope.playlistdata);
                    });
                }
            }
            //猜比分弹出窗
        $scope.showcbf = '';
        var cbfindex = '';
        var cbfparentinde = '';
        $scope.showPopup = function(cbf, parentinde, index) {
            DJstatus = true;
            $scope.Showcbfmod = true;
            $scope.showcbf = cbf;
            cbfparentinde = parentinde;
            cbfindex = index;
            if (cbf.result != undefined) {
                $timeout(function() {
                    Match.hhselected(cbf);
                    //console.log(cbf);
                }, 2)

            }
        };
        $scope.cbfcancel = function() {
            $scope.Showcbfmod = false;
        };
        //猜比分投注数据记录 var cbfarry = [];
        $scope.cbfconfirm = function() {
            $scope.Showcbfmod = false;
            if (DJstatus == false) {
                return false;
            }
            var list = $scope.list;
            var f = '';
            var g = '';
            var k = '';
            for (var j in arry1) {
                f += arry1[j].result + ' ';
                g += arry1[j].bettingid + ' ';
                k += arry1[j].resultid + ' ';
            }
            $scope.list[cbfparentinde].file[cbfindex].result = f;
            $scope.list[cbfparentinde].file[cbfindex].resbettingid = g;
            $scope.list[cbfparentinde].file[cbfindex].resresultid = k;
            //console.log($scope.list);
            cbfarry.push(arry1);
            //console.log(cbfarry);
            //获取处理混合投注数据
            $scope.gamesession = Match.countsession(Match.fructus($scope.list), $scope.playlistdata);
            //渲染所有选中结果
            Match.hhpageselected($scope.list);
        };

        //混合投注
        $scope.showhh = '';
        $scope.showmixall = function(hh, parentinde, index) {
            DJstatus = false;
            $scope.Showhhmod = true;
            $scope.showhh = hh;
            cbfparentinde = parentinde;
            cbfindex = index;
            if (hh.result != undefined) {
                //console.log(hh);
                Match.hhselected(hh);
            }
        };
        $scope.hhcancel = function() {
            $scope.Showhhmod = false;
        };
        $scope.hhconfirm = function() {
            $scope.Showhhmod = false;
            if (DJstatus == false) {
                return false;
            }
            var list = $scope.list;
            var f = '';
            var g = '';
            var k = '';
            for (var j in arry1) {
                f += arry1[j].result + ' ';
                g += arry1[j].bettingid + ' ';
                k += arry1[j].resultid + ' ';
            }
            //console.log(cbfparentinde, cbfindex);
            $scope.list[cbfparentinde].file[cbfindex].result = f;
            $scope.list[cbfparentinde].file[cbfindex].resbettingid = g;
            $scope.list[cbfparentinde].file[cbfindex].resresultid = k;
            //console.log($scope.list);
            cbfarry.push(arry1);
            //console.log(cbfarry);
            //获取处理混合投注数据
            $scope.gamesession = Match.countsession(Match.fructus($scope.list), $scope.playlistdata);
            //渲染所有选中结果
            Match.hhpageselected($scope.list);
        };
        //清除比赛
        $scope.hallcancel = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您确定要清空当前投注吗？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.list = Match.Matchbasball($scope.playlistdata);
                        $scope.gamesession = '请至少选择两场比赛';
                    } else {

                    }
                });
            }
            //确认提交
        $scope.Confirm = function() {
                //登录验证
                if (!UserInfo.l.flag) {
                    $state.go('user.login', { type: 2 });
                    return false;
                }
                $ionicLoading.show({ content: 'Loading', duration: 30000 });
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/usr/myinfo',
                    data: {
                        token: UserInfo.l.token
                    },
                }).success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == '1') {
                        UserInfo.save(data.data);
                        if ($scope.playlistdata == 3 || $scope.playlistdata == 5 || $scope.playlistdata == 9 || $scope.playlistdata == 11) {
                            arry1 = Match.fructus($scope.list);
                            $scope.gamesession = Match.countsession(arry1, $scope.playlistdata);
                        }
                        myFactory.setter(arry1);
                        var Passdata = JSON.stringify(arry1);
                        var gamesession = $scope.gamesession.replace(/[^0-9]/ig, "");
                        if ($scope.playlistdata < 6) {
                            if (gamesession < 2) {
                                showAlertMsg.showMsgFun('提示', '请至少选择两场比赛');
                                return false;
                            } else if (gamesession > 8) {
                                showAlertMsg.showMsgFun('提示', '过关玩法投注场次最大为8场');
                                return false;
                            }
                        }
                        //console.log($scope.list);
                        UserInfo.add('Passdata', Passdata);
                        $state.go('practice.basballbetting', {
                            id: $scope.playlistdata,
                            gamenum: gamesession,
                            palytype: $scope.playlisttext
                        });
                    } else if (data.status == '100') {
                        $state.go('user.login', { type: 2 });
                    }
                })
            }
            //返回方法
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            //window.history.back();
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {
            //console.log('页面销毁');
            $('.opensss').off('click', '.betbtns');
            angular.element(playlist).off('touchend');
        })
    }])

//竞彩篮球投注
.controller('basballbettingCtrl', ['$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', '$timeout', 'Bettingpage', 'Chats', 'History', '$ionicPopup', 'PayFlow', function($scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus, $timeout, Bettingpage, Chats, History, $ionicPopup, PayFlow) {
        $scope.playlistdata = $stateParams.id;
        $scope.gamenum = $stateParams.gamenum;
        var palytype = $stateParams.palytype;
        $scope.palytype = palytype;
        $scope.type = $stateParams.type || 2;
        $scope.vle = 1;
        $scope.pid = 200;
        $scope.Showcbfmod = false;
        $scope.Showhhmod = false;
        //跳转购彩协议
        $scope.golotage = function() {
                $state.go('betinfo.lotage');
            }
            //默认选择过关方式
        if ($scope.playlistdata > 6) {
            $scope.Passway = [{
                gatename: "仅支持单关",
                id: 100
            }];
        } else {
            $scope.Passway = [{
                gatename: "2串1",
                id: 200
            }];
        }
        //var Passdata =  myFactory.getter();
        var Passdata = JSON.parse(UserInfo.l.Passdata);
        $scope.jsongate = JSON.parse(UserInfo.l.jsongate);
        $scope.Passdata = Passdata;
        $scope.Infodata = '';
        $scope.confirmation = false;
        $scope.Mannerbox = false;
        $scope.Transactiondata = '';
        if (!Passdata || Passdata == '') {
            window.history.back();
            return false;
        }
        Match.datatreatment(Passdata);
        //猜比分弹出窗
        $scope.showcbf = '';
        var cbfindex = '';
        var cbfparentinde = '';
        $scope.showPopup = function(cbf, parentinde, index) {
            $scope.Showcbfmod = true;
            $scope.showcbf = cbf;
            cbfparentinde = parentinde;
            cbfindex = index;
            $timeout(function() {
                Match.cbfbetting(Passdata);
            }, 2)
        };
        $scope.cbfcancel = function() {
            $scope.Showcbfmod = false;
        };
        //猜比分投注数据记录 var cbfarry = [];
        $scope.cbfconfirm = function() {
            $scope.Showcbfmod = false;
        };
        //混合投注
        $scope.showhh = '';
        $scope.showmixall = function(hh, parentinde, index) {
            $scope.Showhhmod = true;
            $scope.showhh = hh;
            cbfparentinde = parentinde;
            cbfindex = index;
            $timeout(function() {
                Match.cbfbetting(Passdata);
            }, 2)
        };
        $scope.hhcancel = function() {
            $scope.Showhhmod = false;
        };
        $scope.hhconfirm = function() {
                $scope.Showhhmod = false;
            }
            //筛选已投注赛事
        var totaldata = Match.Matchbasball($scope.playlistdata, 2); //赛事列表
        var select = function(total, option) {
                var list = [];
                var t = total; //总赛事
                var o = option; //所选赛事
                for (var i = 0; i < o.length; i++) {
                    for (var j = 0; j < t.length; j++) {
                        if (o[i].gameid == t[j].gameid) {
                            list.push(t[j]);
                            break;
                        }
                    }
                }
                return list;
            }
            //console.log( Match.unique(select(totaldata,Passdata)));
        $scope.list = Match.unique(select(totaldata, Passdata));
        $scope.list = Match.result($scope.list, Passdata);
        //addclass();
        //console.log(300+'|'+Match.datatreatment(Passdata));
        //提交订单
        $scope.data = {
            betcount: 10,
            doublecount: 1,
            money: 50,
            token: UserInfo.l.token,
            type: 2,
            betjson: '',
        }
        $scope.doPost = function() {
            if ($scope.Passway == '') {
                showAlertMsg.showProject('请选择过关方式');
                return false;
            } else if ($scope.list == '') {
                showAlertMsg.showProject('未选择任何投注方案');
                return false;
            } else if ($scope.list.length < 2 && $scope.playlistdata <= 6) {
                showAlertMsg.showProject('请至少选择两场比赛');
                return false;
            }
            var pw = Bettingpage.passway($scope.Passway) || 200;
            $scope.data.betjson = pw + '|' + Match.datatreatment(Passdata);
            PayFlow.money($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    $scope.Infodata = data.data;
                }
            })
        }
        $scope.doPost();
        //过关方式处理
        $scope.Betsway = function() {
            if ($scope.playlistdata > 6) {
                return false
            }
            $scope.Mannerbox ? $scope.Mannerbox = false : $scope.Mannerbox = true;
        }
        $scope.changeTab = function(evt) {
            var elem = evt.currentTarget;
            $scope.vle = elem.getAttributeNode('data-active').value;
            if ($scope.vle == 1) {
                $scope.pid = $scope.gamenum * 100;
                $scope.Passway = [{
                    gatename: $scope.gamenum + "串1",
                    id: $scope.gamenum * 100
                }];
                $scope.doPost();
            }
        }
        $scope.gatefilter = function(g) {
            if ($scope.vle == 2) {
                if (g.fixed == false && $scope.gamenum >= g.totalgate && 1 != g.totalgate) {
                    return true;
                } else {
                    return false;
                }
            } else if ($scope.vle == 1) {
                if (g.fixed == true && $scope.gamenum >= g.totalgate && 1 != g.totalgate) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        $scope.dochange = function() {
            if ($scope.data.doublecount <= 0 || $scope.data.doublecount == '' || $scope.data.doublecount > 9999) {
                return false;
            }
            $scope.doPost();
        }
        $scope.doblur = function() {
            if ($scope.data.doublecount <= 0 || $scope.data.doublecount == '') {
                $scope.data.doublecount = 1;
                showAlertMsg.showProject('单次投注倍数应在1~9999之间');
            } else if ($scope.data.doublecount > 9999) {
                $scope.data.doublecount = 9999;
                showAlertMsg.showProject('单次投注倍数应在1~9999之间');
            } else if ($scope.list.length < 2 && $scope.playlistdata <= 6) {
                showAlertMsg.showProject('请至少选择两场比赛');
                return false;
            }
            $scope.doPost();
        }
        $scope.add = function() {
            if ($scope.data.doublecount == 9999) {
                return false;
            }
            $scope.data.doublecount++;
            $scope.doPost();
        }
        $scope.cutdown = function() {
                if ($scope.data.doublecount == 1) {
                    return false;
                }
                $scope.data.doublecount--;
                $scope.doPost();
            }
            //删除已选投注
        $scope.deletelist = function(l) {
                Passdata = Chats.deletPassdata(l, Passdata);
                UserInfo.add('Passdata', JSON.stringify(Passdata));
                $scope.list = Chats.remove(l, $scope.list);
                if ($scope.list.length >= 2 && $scope.playlistdata <= 6) {
                    $scope.gamenum--;
                    $scope.pid = $scope.gamenum * 100;
                    $scope.Passway = History.passwayss($scope.playlistdata, $scope.gamenum);
                }
                if ($scope.list.length < 1 && $scope.playlistdata > 6) {
                    showAlertMsg.showProject('请至少选择一场比赛');
                    $scope.Infodata = [];
                    return false
                }
                if ($scope.list.length < 1 && $scope.playlistdata < 6) {
                    showAlertMsg.showProject('请至少选择两场比赛');
                    $scope.Infodata = [];
                    return false
                }
                $scope.doPost();
                if ($scope.list.length < 2) {
                    $scope.Infodata = [];
                    showAlertMsg.showProject('请至少选择两场比赛');
                }
            }
            //清空
        $scope.clearlist = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您确定要清空当前的投注内容吗？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.backGo();
                        /* $ionicHistory.clearCache(['practice.Soccerhall','practice.basketballhall']).then(function () {
                         $state.go('practice.basketballhall');
                         })*/
                    } else {

                    }
                });
            }
            //关闭付款
        $scope.CloseConfirmation = function() {
            $scope.confirmation = false;
        }
        $('.methods-con').on('click', '.methods-con span', function() {
            if ($scope.vle == 2) {
                var s = $(this).siblings();
                for (var i = 0; i < s.length; i++) {
                    $(s[i]).removeClass("ott-img");
                }
            }
            $(this).toggleClass('ott-img');
            //遍历过关所选过关方式
            $scope.$apply(function() {
                $scope.Passway = Bettingpage.traverse();
                //console.log($scope.Passway);
                $scope.doPost();
            });
        })
        $scope.dobill = function() {
            showAlertMsg.showMsgFun('温馨提示', '竞彩足球暂停投注');
            return false;
            if ($scope.Passway == '') {
                showAlertMsg.showProject('请选择过关方式');
                return false;
            } else if ($scope.list == '') {
                showAlertMsg.showProject('未选择任何投注方案');
                return false;
            } else if ($scope.data.doublecount == '' || $scope.data.doublecount <= 0 || $scope.data.doublecount > 9999) {
                showAlertMsg.showProject('单次投注倍数应在1~9999之间');
                return false;
            } else if ($scope.list.length < 2 && $scope.playlistdata <= 6) {
                showAlertMsg.showProject('请至少选择两场比赛');
                return false;
            }
            var pw = Bettingpage.passway($scope.Passway) || 200;
            $scope.data.betjson = pw + '|' + Match.datatreatment(Passdata);
            $scope.data.money = $scope.Infodata.betmoney;
            $scope.data.betcount = $scope.Infodata.betcount;
            PayFlow.bill($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.Transactiondata = data.data;
                    var transactiondata = JSON.stringify($scope.Transactiondata);
                    $ionicHistory.clearCache(['user.payment']).then(function() {
                        $state.go('user.payment', {
                            paystring: transactiondata,
                            type:$scope.type,
                            palytype: $scope.palytype,
                        });
                    })
                }
            })
        }
        $scope.payment = function() {
            var chargedata = {
                money: $scope.Transactiondata.chargemoney,
                busorderid: $scope.Transactiondata.betorderid,
            }
            if ($scope.Transactiondata.chargemoney != 0) {
                PayFlow.charge(chargedata);
                return false;
            }
            var paydata = {
                orderid: $scope.Transactiondata.betorderid,
                ordermoney: $scope.Transactiondata.paymoney,
                token: UserInfo.l.token || '',
            }
            PayFlow.pay(paydata).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    if (data.data.payresult == 2) {
                        PayFlow.charge(chargedata);
                    }
                    if (data.data.payresult == 1) {
                        $state.go('practice.paid', { id: data.data.orderid, type: '1', palytype: palytype, backurl: 'practice.Soccerhall' });
                    }
                }
            })
        }
        var b = $('.Bettinglist .betbtns');
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //投注成功
    .controller('paidCtrl', ['$location','browser', 'UserInfo', 'serializeUrl', 'order', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', '$stateParams', function($location,browser, UserInfo, serializeUrl, order, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, $stateParams) {
        $scope.orderid = $stateParams.id;
        var type = $stateParams.type;
        var url = $stateParams.backurl;
        account = UserInfo.l.account;
        if (UserInfo.l.navigator == 'android') {
            $scope.navigator = 'android'
        } else {
            $scope.navigator = 'ios'
        }
        if (UserInfo.l.guid == 'true') {
            $scope.guid = true;
        } else {
            $scope.guid = false;
        }
        if (browser.iswebapp()) {
            $scope.iswebapp = true;
        } else {
            $scope.iswebapp = false;
        }
        $scope.palytype = $stateParams.palytype;
        if (type == '1') {
            $scope.ball = '竞彩足球';
        } else if (type == '2') {
            $scope.ball = '竞彩篮球';
        } else if (type == '3') {
            $scope.ball = '七星彩';
        } else if (type == '4') {
            $scope.ball = '排列三';
        } else if (type == '5') {
            $scope.ball = '排列五';
        } else if (type == '6') {
            $scope.ball = '大乐透';
        } else if (type == '7' || type == '8' || type == '9' || type == '10') {
            $scope.ball = '11选5';
        }
        $scope.backGo = function() {
                //$ionicHistory.goBack();
                window.history.back();
            }
            //继续购买
        $scope.Goagainpay = function() {
            var backurl = order.getbackurl[type];
            //console.log(backurl);
            $ionicHistory.clearCache().then(function() {
                UserInfo.remove(['jsondatapls', 'jsondatasyxw', 'Passdata', 'historybet']);
                $state.go(backurl, { type: type });
            })
        }
        $scope.guide = function() {
                if (UserInfo.l.navigator == 'android') {
                    $state.go('practice.appdownload', { account: account });
                } else {
                    $state.go('tab.hall', { flag: 'zjdl' });
                }
            }
            //查看订单
        $scope.Godetai = function() {
            if(type == 10){
                UserInfo.add('syxwseebet','10');
                $scope.Goagainpay();
            }else{
                $state.go('practice.detail', { id: $scope.orderid, type: 2 });
            }
        }
        //var path = $location.path();
        //$location.path(path).replace();
        $scope.Gohome = function() {
            if(type == 10){
                $scope.Goagainpay();
            }else {
                $state.go('tab.hall');
            }
        }
    }])
    //购彩记录
    .controller('detaillistCtrl', ['$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', function($scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus) {
        $scope.list = new Array();
        $scope.goods_load_over = true;
        $scope.maxData = '';
        $scope.data = '';
        $scope.bgimg = false;
        $scope.search = {
            flag: 0,
            page: 1,
            token: UserInfo.l.token || '',
            lotteryid: $stateParams.type,
        };
        $scope.doPost = function() {
            $ionicLoading.show({ template: "正在查询请稍后...", duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/betting/order/list",
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.maxData = data.data.items;
                    $scope.data = data.data;
                    if ($scope.search.page >= $scope.data.totalpage) {
                        $scope.goods_load_over = false;
                    }
                    if (!$scope.maxData) {
                        $scope.bgimg = true;
                        return false;
                    }
                    for (var i = 0; i < $scope.maxData.length; i++) {
                        $scope.list.push($scope.maxData[i]);
                    }
                }
            }).error(function() {
                $ionicLoading.hide();
                $scope.goods_load_over = false;
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            $scope.$broadcast('scroll.refreshComplete');
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //下拉刷新
        $scope.bomdoPost = function() {
                $scope.goods_load_over = true;
                $scope.search.page = 1;
                $scope.list = new Array();
                $scope.doPost();
            }
            //翻页
        $scope.loadParticulars = function() {
                $scope.search.page++;
                if ($scope.search.page > $scope.data.totalpage) {
                    $scope.goods_load_over = false;
                }
                $scope.doPost();
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //$ionicScrollDelegate.scrollTop(true);
            }
            //查看订单
        $scope.godetaail = function(list) {
            $state.go('practice.detail', { id: list, type: 1, goback: 'practice.Soccerhall' });
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //投注详情
    .controller('detailCtrl', ['activity','$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', '$stateParams', 'stock', 'UserInfo', 'showAlertMsg', 'Match', 'HttpStatus', 'order', function(activity,$scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, $stateParams, stock, UserInfo, showAlertMsg, Match, HttpStatus, order) {
        var orderid = $stateParams.id;
        var goback = $stateParams.goback;
        var type = $stateParams.type;
        var objlist = {};
        $scope.tempfalg = true;
        if(UserInfo.l.jsongate){
            $scope.jsongate = JSON.parse(UserInfo.l.jsongate);
        }else{
            $scope.jsongate = '';
        }
        $scope.baozhongpid = '';//当前包中方案pid
        var url = '';
        var balltp = '';
        $scope.list = '';
        $scope.arrylist = []; //足球篮球过关方式
        $scope.search = {
            token: UserInfo.l.token || '',
        }
        $scope.temp = function() {
            $scope.tempfalg = !$scope.tempfalg;
        }
        $scope.playabout = function() {
            $state.go('practice.play-About', { type: $scope.list.lotteryid });
        }
        $scope.doPost = function() {
            $scope.search.orderid = orderid;
            url = "/betting/detail";
            $ionicLoading.show({ template: "正在查询请稍后...", duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + url,
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    $scope.list = data.data;
                    //console.log($scope.list);
                    balltp = data.data.lotteryid;
                    if (data.data.lotteryid == 1 || data.data.lotteryid == 2) {
                        $scope.arrylist = order.Passway($scope.list.bcontext);
                        $scope.ccodes($scope.list);
                    } else {
                        $scope.arrylist = order.NumberGame($scope.list);
                        if (balltp == '6' || balltp == '11') {
                            if ($scope.list.acode) {
                                var str6 = $scope.list.acode.replace(/,/g, ' ');
                                $scope.acode = str6.split('|');
                            } else {
                                $scope.acode = [''];
                            }
                        }
                    }
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
        }
        if (!UserInfo.l.jsongate) {
            HttpStatus.getgate().then(function(data) {
                if (data.status == '1') {
                    var jsongate = JSON.stringify(data.data);
                    UserInfo.add('jsongate', jsongate);
                    $scope.doPost();
                }
            })
        } else {
            $scope.doPost();
        }
        //继续购买
        $scope.Goagainpay = function() {
            var backurl = order.getbackurl[balltp];
            //console.log(backurl);
            $ionicHistory.clearCache().then(function() {
                UserInfo.remove(['jsondatapls', 'jsondatasyxw', 'Passdata', 'historybet']);
                $state.go(backurl, { type: balltp });
            })
        }
        //投注数据数据反解析
        $scope.ccodes = function(ls) {
            var list = ls.bbets;
            var s = {};
            var ls1 = [];
            for (var i = 0; i < list.length; i++) {
                s = order.ccodeslist(list[i]);
                ls1.push(s);
            }
            for (var j = 0; j < list.length; j++) {
                $scope.list.bbets[j].playid = ls1[j];
            }
            objlist = order.zjpd($scope.list);
        }
        $scope.Winning = function(l, s) {
            //console.log(l);
            //console.log(objlist[l.pid][s.bettypeID]);
            if (!l.hs) {
                return false;
            }
            if (objlist[l.pid][s.bettypeID] == s.betresult) {
                return true;
            } else {
                return false
            }
        }
        $scope.zjborde = function(l) {
            var s = l.playid;
            var f = false;
            if (!l.hs) {
                return false;
            }
            for (var i = 0; i < s.length; i++) {
                if (objlist[l.pid][s[i].bettypeID] == s[i].betresult) {
                    f = true;
                    break;
                }
            }
            if (f == false) {
                return false
            } else {
                return true;
            }
        }
        //包中追加
        $scope.dwjj = function (l) {
            activity.lotterylist().then(function (data) {
                //console.log(data.data[0].betInfo.betStr);
                activity.addto(data,l.bcontext,l.bdouble);
            });
        }
        activity.lotterylist().then(function (data) {
            if(data.data.length>0){
                //console.log(data.data[0].betInfo.pid)
                $scope.baozhongpid = data.data[0].betInfo.pid;
            }else{
                $scope.baozhongpid = '';
            }
        })
        //追投显示控制
        $scope.zhuitouif = function (l,pid) {
            var showbzicon = activity.showaddto(l.bcontext,pid);
            return showbzicon;
        }
        //返回
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            if (type == 2) {
                $state.go('tab.hall');
            } else {
                window.history.back();
            }
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //开奖信息
    .controller('LotteryCtrl', ['$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', '$stateParams', 'UserInfo', 'showAlertMsg', 'HttpStatus', function($scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, $stateParams, UserInfo, showAlertMsg, HttpStatus) {
        var type = $stateParams.type;
        var sign = false;
        $scope.timearry1 = [];
        $scope.myDate = new Date(new Date() - 24 * 60 * 60 * 1000);
        //$scope.myDate = new Date(new Date());
        var refer = '';
        var TDDate1 = $filter('date')($scope.myDate, 'yyyy-MM-dd');
        $scope.TDDate = TDDate1;
        var timelist = function(TDDate) {
            $scope.timearry1 = [];
            var timestamp = new Date(TDDate).getTime();
            for (var i = 0; i < 9; i++) {
                var s = timestamp - i * 24 * 60 * 60 * 1000;
                $scope.timearry1.push($filter('date')(s, 'yyyy-MM-dd'));
            }
        }
        timelist(TDDate1);
        $scope.ball = type;
        $scope.ShlistHeght = false;
        $scope.playlisttext = '竞彩足球开奖';
        $scope.showtoggle = false;
        $scope.list = '';
        var typenum = 1;
        $scope.playlist = 1;
        if (type == '1') {
            $scope.playlisttext = '竞彩足球开奖';
            typenum = 1;
        } else if (type == '2') {
            $scope.playlisttext = '竞彩篮球开奖';
            typenum = 2;
        }
        refer = TDDate1
        $scope.search = {
                token: UserInfo.l.token || '',
                type: typenum
            }
            //赛事收起
        $scope.toggle = function() {
                if ($scope.showtoggle == false) {
                    $scope.showtoggle = true;
                } else {
                    $scope.showtoggle = false
                }
            }
            //日起选择
        $('.open-time').on('touchend', 'li', function(event) {
                refer = $(this).text();
                $scope.TDDate = refer;
                //console.log($scope.search.date);
                $(this).siblings().removeClass('ott-img');
                $(this).addClass('ott-img');
                $scope.doPost();
                $scope.Shlist();
                event.stopPropagation()
            })
            //点击弹出层空白区域隐藏
        $('.open-time').on('touchend', function() {
            $scope.$apply(function() {
                $scope.ShlistHeght = false;
            })
        })
        $scope.Shlist = function() {
            if ($scope.ShlistHeght == false) {
                $scope.ShlistHeght = true;
            } else {
                $scope.ShlistHeght = false;
            }
        }
        $scope.doPost = function() {
            $scope.search.date = refer;
            $ionicLoading.show({ template: "正在查询请稍后...", duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + '/betting/result',
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    if (data.data) {
                        $scope.list = data.data;
                    } else if (sign == true) {
                        $scope.myDate = new Date(new Date() - 24 * 60 * 60 * 1000);
                        $scope.TDDate = $filter('date')($scope.myDate, 'yyyy-MM-dd')
                        refer = $scope.TDDate1;
                        timelist($scope.TDDate);
                        $scope.doPost();
                    }
                    sign = false;
                    //console.log($scope.list);
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
        }
        $scope.doPost();
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //排列三
    .controller('plshallCtrl', ['HttpStatus', '$ionicPopup', 'showAlertMsg', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', '$ionicScrollDelegate', function(HttpStatus, $ionicPopup, showAlertMsg, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, $ionicScrollDelegate) {
        //初始化
        $scope.type = $stateParams.type;
        //console.log($scope.type);
        if ($scope.type == 4) {
            $scope.plstext = '直选三';
        } else if ($scope.type == 13) {
            $scope.plstext = '直选';
        }
        $scope.list = '';
        var plsarry = [];
        var playid = 'zx3';
        $scope.ShlistHeght = false;
        $scope.assistantShow = false;
        $scope.missflag = false;
        $scope.plsjxd = false;
        $scope.gamesession = 0;
        var ts = pls.ts(playid, $scope.type);
        $scope.ts1 = ts.o;
        $scope.ts2 = ts.t;
        $scope.ts3 = ts.f;
        /*$scope.ts1 = '猜中开奖数且一一对应，即奖';
        $scope.ts2 ='每位至少选1个号码';
        $scope.ts3 ='1040元';*/
        var max = 9;
        var num = 3;
        var min = 0;
        $scope.aryb = [];
        $scope.ary = [];
        var Init = function(x, n, m) {
            var o = $('#pl3 li div');
            o.removeClass('a_class');
            for (var i = n; i <= x; i++) $scope.aryb.push(i);
            if (playid != 'z3_hz' && playid != 'z6_hz') {
                for (var i = n; i <= m - 1; i++) $scope.ary[i] = [];
            } else {
                for (var i = 0; i <= 0; i++) $scope.ary[i] = [];
            }
        };
        Init(max, min, num);
        // 下拉
        $scope.cotchange = function() {
                $('.seven-cot').toggleClass('s-cot-t');
                $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
                $('.sch-f-a').toggleClass('schf-a-top');
            }
            /*  $scope.up = function (e) {
                 /!* console.log(e.gesture.deltaY);
                  $('.seven-cot').toggleClass('s-cot-t');
                  $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
                  $('.sch-f-a').toggleClass('schf-a-top');
                  e.stopPropagation();*!/
              };
              $scope.down = function (e) {
                  console.log(e.gesture.deltaY);
                  console.log($ionicScrollDelegate.getScrollPosition());
                /!*  $('.seven-cot').toggleClass('s-cot-t');
                  $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
                  $('.sch-f-a').toggleClass('schf-a-top');*!/
                  return false
              };*/
        $scope.search = {
            token: UserInfo.l.token,
            pn: 1,
            type: $scope.type,
        }
        $scope.doPost = function() {
            $ionicLoading.show({ content: 'Loading', duration: 30000 })
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/lotteryinfo",
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    $scope.list = data.data;
                    $scope.ntime = $scope.list.stime.split(",");
                }
            }).error(function(data) {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('温馨提示', '网络连接失败，请检查网络连接');
            });
        }
        $scope.doPost();
        //助手
        $scope.assistant = function(e) {
                switch (e) {
                    case 1:
                        $state.go('practice.detaillist', { type: $scope.type });
                        break;
                    case 2:
                        $state.go('practice.play-About', { type: $scope.type });
                        break;
                    case 3:
                        $state.go('practice.lot-details', { type: $scope.type });
                        break;
                    default:
                        break;
                }
                $scope.assistantShow ? $scope.assistantShow = false : $scope.assistantShow = true;
            }
            //清除
        $scope.deleteary = function() {
                plsarry = [];
                $('#pl3 li .temp_li').removeClass('a_class');
                $scope.gamesession = 0;
            }
            //走势图
        $scope.goqxc = function(a) {
                $state.go('practice.trendchar', { type: a });
            }
            //玩法选择
        $scope.Shlist = function() {
            $scope.ShlistHeght ? $scope.ShlistHeght = false : $scope.ShlistHeght = true;
        }
        $('.Soccerhall-playlist').on("touchend", 'ul li', function(e) {
                $(this).siblings().removeClass('ott-img');
                $(this).addClass('ott-img');
                var plstext = $(this).text();
                playid = $(this).data('pls');
                num = pls.toggleplay(playid);
                $scope.aryb = [];
                $scope.ary = [];
                var ts = pls.ts(playid, $scope.type);
                $scope.$apply(function() {
                    $scope.gamesession = 0;
                    $scope.plstext = plstext;
                    $scope.ShlistHeght = false;
                    $scope.ts1 = ts.o;
                    $scope.ts2 = ts.t;
                    $scope.ts3 = ts.f;
                    plsarry = []
                    if (playid == 'zx_hz') {
                        num = 1;
                        max = 27;
                        Init(max, min, num);
                    } else if (playid == 'z3_hz') {
                        num = 1;
                        max = 26;
                        Init(max, 1, num);
                    } else if (playid == 'z6_hz') {
                        num = 1;
                        max = 24;
                        Init(max, 3, num);
                    } else {
                        max = 9;
                        Init(max, min, num);
                    }
                });
                e.preventDefault();
                e.stopPropagation();
            })
            //点击空白关闭
        $('.Soccerhall-playlist').on("touchend", function(e) {
            $scope.$apply(function() {
                $scope.ShlistHeght = false;
            });
        });
        //页面滚动
        $scope.scrollup = function() {
            //$ionicScrollDelegate.$getByHandle('plscon').scrollTop();
            $('.seven-cot').removeClass('s-cot-t');
            $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
            $('.sch-f-a').removeClass('schf-a-top');
            // $ionicScrollDelegate.scrollTop()
        }
        $scope.scrolldown = function() {
                var obj = $ionicScrollDelegate.getScrollPosition();
                if (obj.top == 0) {
                    $('.seven-cot').addClass('s-cot-t');
                    $('.sch-f-a img').addClass('sch-f-i').removeClass('sch-f-i');
                    $('.sch-f-a').addClass('schf-a-top');
                }
            }
            //机选一注
        $scope.Random = function() {
                plsarry = [];
                var r = pls.sjs(playid, max, num);
                //console.log(r);
                var o = $('#pl3 li .temp_li');
                o.removeClass('a_class');
                var e = [];
                if (playid == 'zx3' || playid == 'z3_ds') {
                    for (var i = 0; i < r.length; i++) {
                        $(o[r[i] + i * 10]).addClass('a_class');
                        $scope.ary[i] = [];
                        $scope.ary[i].push(r[i]);
                    }
                    e = $scope.ary;
                } else if (playid == 'z3_fs' || playid == 'z6_fs' || playid == 'zx_hz') {
                    for (var i = 0; i < r.length; i++) {
                        $(o[r[i]]).addClass('a_class');
                    }
                    e = r;
                } else if (playid == 'z3_hz') {
                    for (var i = 0; i < r.length; i++) {
                        $(o[r[i] - 1]).addClass('a_class');
                    }
                    e = r;
                } else if (playid == 'z6_hz') {
                    for (var i = 0; i < r.length; i++) {
                        $(o[r[i] - 3]).addClass('a_class');
                    }
                    e = r;
                }
                if (playid != 'z3_ds') {
                    $scope.gamesession = pls.tzs(playid, e);
                } else {
                    $scope.gamesession = 1;
                }
                //console.log(e);
                plsarry = e;
            }
            // 数字点击反馈
        $scope.tempfalg = true;
        $scope.fangdahidea = function(a, b, event) { // 离开
            e = event.target;
            var d = $("#pl3 li .temp_li");
            $(e).find('.scclr-big').hide();
            var c = a * 10 + b;
            if ($scope.tempfalg) {
                if (playid !== 'z3_ds') {
                    $(e).toggleClass("a_class");
                } else {
                    $(e).parents('li').siblings().find('.temp_li').removeClass('a_class');
                    $(e).toggleClass('a_class');
                    if ($(e).parents('.scc-li').index() == 0) {
                        $(d[b + 10]).removeClass('a_class');
                    } else {
                        $(d[b]).removeClass('a_class');
                    }
                }
                plsclick();
            }
        }
        $scope.fangdahideb = function(a, b, event) { //滑动
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.tempfalg = false;
        }
        $scope.numclick = function(a, b, event) { //点击
                e = event.target;
                $(e).find('.scclr-big').show();
                $scope.tempfalg = true;
            }
            //机选多注
        $scope.jixuan = function() {
                $scope.plsjxd ? $scope.plsjxd = false : $scope.plsjxd = true;
            }
            //点击选择
        var plsclick = function() {
                plsarry = [];
                var e = [];
                var d = $("#pl3 li .temp_li");
                if (playid !== 'z3_ds') {
                    //$(this).find('.temp_li').toggleClass('a_class');
                    if (playid !== 'zx3') {
                        for (var i = 0; i < d.length; i++) {
                            if ($(d[i]).is('.a_class')) {
                                e.push($(d[i]).data('num'));
                            };
                        }
                    } else {
                        for (var i = 0; i < 3; i++) e[i] = [];
                        for (var i = 0; i < d.length; i++) {
                            if ($(d[i]).is('.a_class')) {
                                c = $(d[i]).data('num');
                                if (i < 10) e[0].push(c);
                                else if (i < 20) e[1].push(c);
                                else if (i < 30) e[2].push(c);
                            };
                        }
                    }
                } else {
                    for (var i = 0; i < 2; i++) e[i] = [];
                    for (var i = 0; i < d.length; i++) {
                        if ($(d[i]).is('.a_class')) {
                            c = $(d[i]).data('num');
                            if (i < 10) e[0].push(c);
                            else if (i < 20) e[1].push(c);
                        };
                    }
                }
                if (playid != 'z3_ds') {
                    $scope.gamesession = pls.tzs(playid, e);
                } else {
                    if (e[0][0] >= 0 && e[1][0] >= 0) {
                        $scope.gamesession = 1;
                    } else {
                        $scope.gamesession = 0;
                    }
                }
                plsarry = e;
            }
            //提交投注
        $scope.Confirm = function() {
            if ($scope.gamesession <= 0 && plsarry.length == 0) {
                $scope.Random();
                return false;
            } else if ($scope.gamesession <= 0) {
                showAlertMsg.showMsgFun('温馨提示', $scope.ts2);
                return false;
            }
            $scope.Coninfo();
        }
        $scope.Coninfo = function() {
                //登录验证
                if (!UserInfo.l.flag) {
                    $state.go('user.login', { type: $scope.type });
                    return false;
                }
                $ionicLoading.show({ content: 'Loading', duration: 30000 });
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/usr/myinfo',
                    data: {
                        token: UserInfo.l.token
                    },
                }).success(function(data) {
                    $ionicLoading.hide();
                    if (data.status == '1') {
                        var plsdata = [];
                        plsdata.push(pls.tz(playid, plsarry));
                        if (UserInfo.l.jsondatapls) {
                            var plsobj = JSON.parse(UserInfo.l.jsondatapls);
                            for (var i = 0; i < plsobj.length; i++) {
                                plsdata.push(plsobj[i]);
                            }
                        }
                        var jsondatapls = JSON.stringify(plsdata);
                        UserInfo.add('jsondatapls', jsondatapls);
                        $scope.rdnums(0);
                    } else if (data.status == '100') {
                        $state.go('user.login', { type: $scope.type });
                    }
                })
            }
            //机选命令
        $scope.rdnums = function(a) {
            UserInfo.add('perform', 'yes');
            $state.go('practice.plsbetting', { id: a, type: $scope.type, typeid: playid });
        }

        $scope.backGo = function() {
            if (UserInfo.l.jsondatapls || $scope.gamesession) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        UserInfo.remove("jsondatapls");
                        $state.go('tab.hall');
                    } else {}
                });
            } else {
                $state.go('tab.hall');
            }
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {
            //console.log('页面销毁');
            $('.Soccerhall-playlist').off("touchend", 'ul li')
        })
    }])
    //排列三投注
    .controller('plsbettingCtrl', ['$ionicScrollDelegate', 'Chats', '$ionicPopup', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', 'showAlertMsg', 'HttpStatus', 'PayFlow', '$timeout', function($ionicScrollDelegate, Chats, $ionicPopup, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, showAlertMsg, HttpStatus, PayFlow, $timeout) {
        if (UserInfo.l.jsondatapls) {
            var plsobj = JSON.parse(UserInfo.l.jsondatapls);
            $scope.plsobj = pls.zs(JSON.parse(UserInfo.l.jsondatapls));
        } else {
            var plsobj = [];
            $scope.plsobj = [];
        }
        $scope.confirmation = false;
        $scope.Transactiondata = {};
        var Randomnum = $stateParams.id;
        var playtype = $stateParams.typeid;
        var type = $stateParams.type;
        $scope.type = $stateParams.type;
        var plsarry = [];
        //var plsdata = plsobj;
        $scope.ary = [];
        $scope.Infodata = {
            betcount: 0,
            doublecount: 1,
            qs: 1
        }
        $scope.data = {
                betcount: 0,
                doublecount: 1,
                money: 2,
                token: UserInfo.l.token,
                type: type,
                betjson: '',
            }
            //继续选号
        $scope.lotteryadd = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '退出该页面会清空购彩篮里的数据，是否将已选的号码保存在号码篮内？',
                    cancelText: '否',
                    okText: '是',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.backGo();
                    } else {
                        UserInfo.remove("jsondatapls");
                        $scope.backGo();
                    }
                });
            }
            //跳转购彩协议
        $scope.golotage = function() {
                $state.go('betinfo.lotage');
            }
            //机选
        $scope.Random = function(playid) {
            if (playid != 'zx_hz' && playid != 'z3_hz' && playid != 'z6_hz') {
                var num = pls.toggleplay(playid);
                var max = 9;
            } else {
                var num = 1;
                var max = 27;
                console.log(max);
            }
            plsarry = [];
            var r = pls.sjs(playid, max, num)
            var e = [];
            $scope.ary = [];
            if (playid == 'zx3' || playid == 'z3_ds') {
                for (var k = 0; k < r.length; k++) {
                    $scope.ary[k] = [];
                    $scope.ary[k].push(r[k]);
                }
                e = $scope.ary;
            } else if (playid == 'z3_fs' || playid == 'z6_fs' || playid == 'zx_hz' || playid == 'z3_hz' || playid == 'z6_hz') {
                e = r;
            }
            //console.log(e);
            plsarry = e;
            plsobj.push(pls.tz(playid, plsarry));
            var jsondatapls = JSON.stringify(plsobj);
            UserInfo.add('jsondatapls', jsondatapls);
        }

        //money计算
        $scope.total = function() {
                $scope.data.doublecount = $scope.Infodata.doublecount;
                $scope.data.qs = $scope.Infodata.qs;
                $scope.data.money = 2 * $scope.data.betcount * $scope.data.doublecount * $scope.data.qs;
            }
            //单注数计算
        $scope.plstzs = function(p, index) {
                if (p.playid == 'z3_ds') {
                    return 1;
                } else {
                    return pls.tzs(p.playid, plsobj[index].plsarry);
                }
            }
            //总投注数计算
        $scope.plsbettnum = function() {
            $scope.data.betcount = 0;
            for (var i = 0; i < plsobj.length; i++) {
                if (plsobj[i].playid != 'z3_ds') {
                    $scope.data.betcount += pls.tzs(plsobj[i].playid, plsobj[i].plsarry);
                } else {
                    $scope.data.betcount += 1;
                }
            }
            $scope.total();
        }
        $scope.plsbettnum();
        //机选命令
        $scope.Randomorder = function(i) {
            for (var j = 0; j < i; j++) {
                $scope.Random(playtype);
            }
            $scope.plsobj = pls.zs(JSON.parse(UserInfo.l.jsondatapls));
            plsobj = JSON.parse(UserInfo.l.jsondatapls);
            //console.log($scope.plsobj);
            $scope.plsbettnum();
            //$scope.total();
        }
        if (Randomnum != 0 && UserInfo.l.perform == 'yes') {
            UserInfo.add('perform', 'no');
            $scope.Randomorder(Randomnum);
        }
        $scope.add = function(i) {
            if (i == 2) {
                if ($scope.Infodata.doublecount == 9999) {
                    return false;
                }
                $scope.Infodata.doublecount++;
                $scope.total();
            } else {
                if ($scope.Infodata.doublecount == 9999) {
                    return false;
                }
                $scope.Infodata.qs++;
            }
            $scope.total();
        }
        $scope.cutdown = function(i) {
                if (i == 2) {
                    if ($scope.Infodata.doublecount == 1) {
                        return false;
                    }
                    $scope.Infodata.doublecount--;
                } else {
                    if ($scope.Infodata.qs == 1) {
                        return false;
                    }
                    $scope.Infodata.qs--;
                }
                $scope.total();
            }
            //提交订单
        $scope.doPost = function() {
            var pl = pls.handle(plsobj);
            $scope.data.betjson = '1|' + pl;
            PayFlow.money($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {}
            })
        }
        $scope.doblur = function() {
            if ($scope.Infodata.doublecount <= 0) {
                $scope.Infodata.doublecount = 1;
            } else if ($scope.Infodata.doublecount > 9999) {
                $scope.Infodata.doublecount = 9999;
            }
            if ($scope.Infodata.qs <= 0 || $scope.Infodata.qs == '') {
                $scope.Infodata.qs = 1;
            } else if ($scope.Infodata.qs > 99) {
                $scope.Infodata.qs = 99;
            }
            $scope.total();
        }
        $scope.dochange = function() {
                if ($scope.Infodata.doublecount == '' || $scope.Infodata.qs == '') {
                    if ($scope.Infodata.doublecount == '') {
                        $scope.data.doublecount = 1;
                    } else {
                        $scope.data.qs = 1;
                    }
                    $scope.data.money = 2 * $scope.data.betcount * $scope.data.doublecount * $scope.data.qs;
                    return false;
                }
                if ($scope.Infodata.doublecount <= 0) {
                    $scope.Infodata.doublecount = 1;
                } else if ($scope.Infodata.doublecount > 9999) {
                    $scope.Infodata.doublecount = 9999;
                }
                if ($scope.Infodata.qs <= 0 || $scope.Infodata.qs == '') {
                    $scope.Infodata.qs = 1;
                } else if ($scope.Infodata.qs > 99) {
                    $scope.Infodata.qs = 99;
                }
                $scope.total();
            }
            //删除单场赛事
        $scope.arydelete = function(l, p, index) {
                $scope.plsobj = Chats.remove(l, p);
                plsobj = Chats.removeindex(index, plsobj);
                var jsondatapls = JSON.stringify(plsobj);
                UserInfo.add('jsondatapls', jsondatapls);
                $scope.plsbettnum();
            }
            //清除
        $scope.clearlist = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您确定要清空当前投注吗？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        UserInfo.remove("jsondatapls");
                        $scope.plsobj = [];
                        plsobj = [];
                        plsdata = [];
                        $scope.plsbettnum();
                        $timeout(function() {
                            $ionicScrollDelegate.$getByHandle('plsbetting').resize();
                        }, 500)
                    } else {

                    }
                });
            }
            //关闭付款
        $scope.CloseConfirmation = function() {
            $scope.confirmation = false;
        }
        $scope.dobill = function() {
            if (type == 13) {
                showAlertMsg.showMsgFun('温馨提示', '福彩3D暂停销售');
                return false;
            }
            if (!plsobj.length) {
                showAlertMsg.showMsgFun('温馨提示', '至少选择一注进行投注');
                return false;
            }
            var pl = pls.handle(plsobj);
            $scope.data.betjson = $scope.data.qs + '|' + pl;
            PayFlow.bill($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.Transactiondata = data.data;
                    var transactiondata = JSON.stringify($scope.Transactiondata);
                    $ionicHistory.clearCache(['user.payment']).then(function() {
                        $state.go('user.payment', {
                            paystring: transactiondata,
                            type:$scope.type,
                        });
                    })
                }
            })
        }
        $scope.payment = function() {
            var chargedata = {
                money: $scope.Transactiondata.chargemoney,
                busorderid: $scope.Transactiondata.betorderid,
            }
            if ($scope.Transactiondata.chargemoney != 0) {
                PayFlow.charge(chargedata);
                return false;
            }
            var paydata = {
                orderid: $scope.Transactiondata.betorderid,
                ordermoney: $scope.Transactiondata.paymoney,
                token: UserInfo.l.token || '',
            }
            PayFlow.pay(paydata).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    if (data.data.payresult == 2) {
                        PayFlow.charge(chargedata);
                    }
                    if (data.data.payresult == 1) {
                        UserInfo.remove("jsondatapls");
                        $state.go('practice.paid', { id: data.data.orderid, type: type, backurl: 'practice.plshall' });
                    }
                }
            })
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            $ionicHistory.clearCache().then(function() {
                window.history.back();
            })
        }
        $scope.Gohome = function() {
            var firmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '回到主页,将清空所有已选号码',
                cancelText: '取消',
                okText: '确定',
                okType: 'font-color'
            });
            firmPopup.then(function(res) {
                if (res) {
                    UserInfo.remove("jsondatapls");
                    $state.go('tab.hall');
                } else {

                }
            });
        }
    }])
    //十一选五
/*
    .controller('syxwhallCtrl', ['stock','$timeout','HttpServer','$interval', 'HttpStatus', '$ionicPopup', 'cAp', 'syxw', 'showAlertMsg', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', '$ionicScrollDelegate', function(stock,$timeout,HttpServer,$interval, HttpStatus, $ionicPopup, cAp, syxw, showAlertMsg, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, $ionicScrollDelegate) {
        //初始化
        syxw.bounstotal();
        //var playtype = $stateParams.type;
        var playtype = UserInfo.l.syxwtrack || 10;
        $scope.SYXWtype = playtype;//十一选五的id
        $scope.zjatime = '';//浙江开奖时间
        $scope.sxatime = '';//山西开奖时间
        //初始化默认玩法
        $scope.plstext = '任选二';
        var plsarry = [];
        var payluid = '2';
        var playid = 'rx2_pt';
        $scope.playid = 'rx2_pt';
        $scope.downtime = '';
        var rx = 2;
        $scope.rx = 2;
        $scope.list = '';
        $scope.ShlistHeght = false;
        $scope.assistantShow = false;
        $scope.missflag = false;
        $scope.plsjxd = false;
        $scope.dtma = false;
        $scope.gamesession = 0;
        $scope.ts1 = '猜中开奖的任意2个号码，即奖';
        $scope.ts2 = '至少选2个号';
        $scope.ts3 = '6元';
        var max = 11;
        var min = 1;
        var num = 1;
        $scope.aryb = [];
        $scope.ary = [];
        var Init = function(x, n, m) {
            var o = $('#syxw li div');
            o.removeClass('a_class');
            for (var i = n; i <= x; i++) {
                if (i < 10) {
                    $scope.aryb.push('0' + i);
                } else {
                    $scope.aryb.push(i);
                }
            }
            for (var i = 0; i < m; i++) $scope.ary[i] = [];
        };
        Init(max, min, num);
        //切换省份
        $scope.toggletype = function (id) {
            UserInfo.add("syxwtrack",id);//保存历史足迹
            playtype = id;
            $scope.SYXWtype = playtype;
            $scope.search.type = playtype;
            if(UserInfo.l.jsondatasyxw){
                UserInfo.remove("jsondatasyxw");
            }
            $interval.cancel($scope.cleartime);
            $scope.doPost();
        }
        //获取省份开奖时分
        var getatime = function (id) {
            var gatimedata = {
                token: UserInfo.l.token,
                pn: 1,
                type: '',
            }
            if(id==10){
                gatimedata.type = 20;
            }else if(id==20){
                gatimedata.type = 10;
            }
            HttpServer.Hpost(gatimedata,"/trade/lotteryinfo").then(function (data) {
                if(gatimedata.type == 10){
                    $scope.zjatime = stock.getHM(stock.Formattime(data.data.atime));
                }else if(gatimedata.type == 20){
                    $scope.sxatime = stock.getHM(stock.Formattime(data.data.atime));
                }
            })
        }
        // 下拉
        $scope.cotchange = function() {
            $('.seven-cot').toggleClass('syxw-cot-t');
            $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
            $('.sch-f-a').toggleClass('schf-a-top');
        }
        var down = false;
        $scope.search = {
            token: UserInfo.l.token,
            pn: 1,
            type: playtype,
        }
        $scope.doPost = function() {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/lotteryinfo",
                data: $scope.search,
            }).success(function(data) {
                HttpStatus.codedispose(data);
                if($scope.cleartime){
                    $interval.cancel($scope.cleartime);
                };
                if (data.status == 1) {
                    $scope.list = data.data;
                    if($scope.search.type == 10){
                        $scope.zjatime = stock.getHM(stock.Formattime(data.data.atime));
                    }else if($scope.search.type == 20){
                        $scope.sxatime = stock.getHM(stock.Formattime(data.data.atime));
                    }
                    getatime($scope.search.type);
                    $scope.ntime = $scope.list.stime.split(",");
                    var SysTime = new Date().getTime() / 1000;
                    var xiangchatime = (new Date(data.data.stime.replace(/-/g, "/")).getTime() - new Date(data.data.ntime.replace(/-/g, "/")).getTime()) / 1000;
                    $scope.downtime = xiangchatime;
                    down = true;
                    $scope.cleartime = $interval(function() {
                        var myDate = new Date();
                        //console.log(myDate);
                        var mytime = myDate.getTime() / 1000;
                        var time = Math.round(mytime - SysTime);//请求系统时间-当前系统时间=已经过去时间
                        $scope.downtime = xiangchatime - time;
                        //console.log(xiangchatime);
                        //console.log($scope.downtime);
                        if ($scope.downtime < -61 && down == true) {
                            down == false;
                            $interval.cancel($scope.cleartime);
                            //console.log($scope.downtime);
                            $timeout(function () {
                                $scope.doPost();
                            },1000);
                        }
                    }, 1000);
                }
            }).error(function(data) {});
        }
        $scope.doPost();
        $scope.Sync = $interval(function () {
            HttpServer.Hpost($scope.search,"/trade/lotteryinfo").then(function (data) {
                $scope.list = data.data;
                //getatime($scope.search.type);
            })
        },60000);//一分钟同步一次开奖数据
        //助手
        $scope.assistant = function(e) {
                switch (e) {
                    case 1:
                        $state.go('practice.detaillist', { type: playtype });
                        break;
                    case 2:
                        $state.go('practice.play-About', { type: playtype });
                        break;
                    case 3:
                        $state.go('practice.lot-details', { type: playtype });
                        break;
                    default:
                        break;
                }
                $scope.assistantShow ? $scope.assistantShow = false : $scope.assistantShow = true;
            }
            //走势图
        $scope.goqxc = function(a) {
                $state.go('practice.trendchar', { type: a });
            }
            //玩法选择
        $scope.Shlist = function() {
            $scope.ShlistHeght ? $scope.ShlistHeght = false : $scope.ShlistHeght = true;
        }
        $($('.Soccerhall-playlist ul li')[0]).addClass('ott-img');
        $('.Soccerhall-playlist').on("touchend", 'ul li', function(e) {
                $(this).siblings().removeClass('ott-img');
                $(this).addClass('ott-img');
                var plstext = $(this).text();

                playid = $(this).data('syxw');
                payluid = $(this).data('payluid');
                rx = $(this).data('rx');
                num = pls.toggleplay(playid);
                $scope.aryb = [];
                $scope.ary = [];
                var ts = syxw.ts(playid);
                $scope.$apply(function() {
                    $scope.gamesession = 0;
                    if (playid.indexOf('dt') != -1) {
                        $scope.plstext = plstext + '-胆拖';
                    } else {
                        $scope.plstext = plstext;
                    }
                    $scope.ShlistHeght = false;
                    $scope.playid = playid;
                    $scope.rx = rx;
                    $scope.ts1 = ts.o;
                    $scope.ts2 = ts.t;
                    $scope.ts3 = ts.f;
                    plsarry = []
                    if (playid.indexOf('dt') == -1 && playid != 'q2_pt' && playid != 'q3_pt') {
                        max = 11;
                        Init(max, min, num);
                    } else if (playid.indexOf('dt') != -1 || playid == 'q2_pt') {
                        num = 2;
                        max = 11;
                        Init(max, min, num);
                    } else if (playid.indexOf('dt') == -1 && playid == 'q3_pt') {
                        num = 3;
                        max = 11;
                        Init(max, min, num);
                    }
                    if (playid.indexOf('dt') == -1) {
                        $scope.dtma = false;
                    } else {
                        $scope.dtma = true;
                    }
                });
                e.preventDefault();
                e.stopPropagation();
            })
            //点击空白关闭
        $('.Soccerhall-playlist').on("touchend", function(e) {
            $scope.$apply(function() {
                $scope.ShlistHeght = false;
            });
        });
        //页面滚动
        $scope.scrollup = function() {
            //$ionicScrollDelegate.$getByHandle('plscon').scrollTop();
            $('.seven-cot').removeClass('s-cot-t');
            $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
            $('.sch-f-a').removeClass('schf-a-top');
            // $ionicScrollDelegate.scrollTop()
        }
        $scope.scrolldown = function() {
                var obj = $ionicScrollDelegate.getScrollPosition();
                if (obj.top == 0) {
                    $('.seven-cot').addClass('s-cot-t');
                    $('.sch-f-a img').addClass('sch-f-i').removeClass('sch-f-i');
                    $('.sch-f-a').addClass('schf-a-top');
                }
            }
            //清除
        $scope.deleteary = function() {
                plsarry = [];
                $('#syxw li .temp_li').removeClass('a_class');
                $scope.gamesession = 0;
            }
            //机选一注
        $scope.Random = function() {
                plsarry = [];
                var r = syxw.sjs(playid, rx)
                    //console.log(r);
                var o = $('#syxw li .temp_li');
                o.removeClass('a_class');
                var e = [];
                if (playid == 'q2_pt' || playid == 'q3_pt') {
                    var j = '';
                    for (var i = 0; i < r.length; i++) {
                        j = parseInt(r[i]);
                        $(o[j - 1 + i * 11]).addClass('a_class');
                        $scope.ary[i] = [];
                        $scope.ary[i].push(r[i]);
                    }
                    e = $scope.ary;
                } else {
                    var j = '';
                    for (var i = 0; i < r.length; i++) {
                        j = parseInt(r[i]);
                        $(o[j - 1]).addClass('a_class');
                    }
                    e = r;
                }
                $scope.gamesession = 1;
                //console.log(e);
                plsarry = e;
            }
            // 数字点击反馈
        $scope.tempfalg = true;
        $scope.fangdahidea = function(a, b, event) {// 离开
            b = b - 1;
            e = event.target;
            var d = $("#syxw li .temp_li");
            $(e).find('.scclr-big').hide();
            if ($scope.tempfalg) {
                if (playid.indexOf('dt') == -1 && playid !== 'q2_pt' && playid !== 'q3_pt') {
                    if (playid == 'rx8_pt' && plsarry.length >= 8) {
                        if ($(e).is('.a_class')) {
                            $(e).toggleClass('a_class');
                            plsclick();
                        }
                        return false;
                    }
                    $(e).toggleClass("a_class");
                } else {
                    if (playid.indexOf('dt') != -1 && plsarry[0] != undefined) {
                        if ($(e).parents('.scc-li').index() == 0 && plsarry[0].length >= rx - 1) {
                            if ($(e).is('.a_class')) {
                                $(e).toggleClass('a_class');
                                plsclick();
                            }
                            return false;
                        }
                        if ($(e).parents('.scc-li').index() == 1 && plsarry[1].length >= 10) {
                            if ($(e).is('.a_class')) {
                                $(e).toggleClass('a_class');
                                plsclick();
                            }
                            return false;
                        }
                    }
                    //$(e).parents('li').siblings().find('.temp_li').removeClass('a_class');
                    if ($(e).parents('.scc-li').index() == 0) {
                        //console.log($(e).parents('.sccl-r'))
                        $(d[b + 11]).removeClass('a_class');
                        $(d[b + 22]).removeClass('a_class');
                    } else if ($(e).parents('.scc-li').index() == 1) {
                        $(d[b]).removeClass('a_class');
                        $(d[b + 22]).removeClass('a_class');
                    } else {
                        $(d[b]).removeClass('a_class');
                        $(d[b + 11]).removeClass('a_class');
                    }
                    $(e).toggleClass('a_class');
                }
                plsclick();
            }
        }
        $scope.fangdahideb = function(a, b, event) { //滑动
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.tempfalg = false;
        }
        $scope.numclick = function(a, b, event) { //点击
                e = event.target;
                $(e).find('.scclr-big').show();
                $scope.tempfalg = true;
            }
            //机选多注
        $scope.jixuan = function() {
                $scope.plsjxd ? $scope.plsjxd = false : $scope.plsjxd = true;
            }
            //点击选择
        var plsclick = function() {
                plsarry = [];
                var e = [];
                var c = '';
                var d = $("#syxw li .temp_li");
                if (playid.indexOf('dt') == -1) {
                    if (playid != 'q2_pt' && playid != 'q3_pt') {
                        for (var i = 0; i < d.length; i++) {
                            if ($(d[i]).is('.a_class')) {
                                e.push($(d[i]).data('num').id);
                            };
                        }
                    } else {
                        var maxtz = 2;
                        if (playid != 'q2_pt') {
                            maxtz = 3;
                        }
                        for (var i = 0; i < maxtz; i++) e[i] = [];
                        for (var i = 0; i < d.length; i++) {
                            if ($(d[i]).is('.a_class')) {
                                c = $(d[i]).data('num').id;
                                if (i < 11) e[0].push(c);
                                else if (i < 22) e[1].push(c);
                                else if (i < 33) e[2].push(c);
                            };
                        }
                    }
                } else {
                    for (var i = 0; i < 2; i++) e[i] = [];
                    for (var i = 0; i < d.length; i++) {
                        if ($(d[i]).is('.a_class')) {
                            c = $(d[i]).data('num').id;
                            if (i < 11) e[0].push(c);
                            else if (i < 22) e[1].push(c);
                            else if (i < 33) e[2].push(c);
                        };
                    }
                }
                if (playid.indexOf('dt') == -1 && playid != 'q2_pt' && playid != 'q3_pt') {
                    var len = 0;
                    len = e.length;
                    $scope.gamesession = syxw.C(len, rx);
                    //$scope.gamesession = syxw.tzs(playid, e);
                } else if (playid.indexOf('dt') == -1 && (playid == 'q2_pt' || playid == 'q3_pt')) {
                    var f = 1;
                    for (var n = 0; n < e.length; n++) {
                        f *= e[n].length;
                    }
                    $scope.gamesession = f;
                } else {
                    var nums = 0;
                    var len = 0;
                    var fnums = 0;
                    nums = e[0].length;
                    len = e[1].length;
                    if (nums + len <= rx) {
                        plsarry = e;
                        $scope.gamesession = 0;
                        return false;
                    }
                    fnums = rx - nums;
                    $scope.gamesession = syxw.C(len, fnums);
                }
                plsarry = e;
            }
            //提交投注
        $scope.Confirm = function() {
            //console.log(plsarry);
            if ($scope.gamesession <= 0 && plsarry.length == 0 && playid.indexOf('dt') == -1) {
                $scope.Random();
                return false;
            } else if ($scope.gamesession <= 0) {
                showAlertMsg.showMsgFun('温馨提示', '请至少选择一注');
                return false;
            }
            $scope.Coninfo();


        }
        $scope.Coninfo = function() {
            //登录验证
            if (!UserInfo.l.flag) {
                $state.go('user.login', { type: $scope.SYXWtype });
                return false;
            }
            $ionicLoading.show({ content: 'Loading', duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + '/usr/myinfo',
                data: {
                    token: UserInfo.l.token
                },
            }).success(function(data) {
                $ionicLoading.hide();
                if (data.status == '1') {
                    var plsdata = [];
                    plsdata.push(syxw.tz(playid, plsarry, rx, payluid));
                    if (UserInfo.l.jsondatasyxw) {
                        var plsobj = JSON.parse(UserInfo.l.jsondatasyxw);
                        for (var i = 0; i < plsobj.length; i++) {
                            plsdata.push(plsobj[i]);
                        }
                    }
                    var jsondatapls = JSON.stringify(plsdata);
                    UserInfo.add('jsondatasyxw', jsondatapls);
                    $scope.rdnums(0);
                } else if (data.status == '100') {
                    $state.go('user.login', { type: $scope.SYXWtype });
                }
            })
        }
        $scope.rdnums = function(a) {
            UserInfo.add('perform', 'yes');
            $state.go('practice.syxwbetting', { id: a, type: playid, lotteryid: playtype, rx: rx, payluid: payluid });
        }

        $scope.backGo = function() {
            //$ionicHistory.goBack();
            if (UserInfo.l.jsondatasyxw || $scope.gamesession) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        UserInfo.remove("jsondatasyxw");
                        $interval.cancel($scope.cleartime);
                        $interval.cancel($scope.Sync);
                        $state.go('tab.hall');
                    } else {}
                });
            } else {
                $interval.cancel($scope.cleartime);
                $state.go('tab.hall');
            }
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        $scope.$on('$destroy', function() {
            //console.log('页面销毁');
            $('.Soccerhall-playlist').off("touchend", 'ul li')
            $interval.cancel($scope.cleartime);
            $interval.cancel($scope.Sync);
        })
    }])
    //十一选五投注
    .controller('syxwbettingCtrl', ['$ionicScrollDelegate', 'syxw', 'Chats', '$ionicPopup', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', 'showAlertMsg', 'HttpStatus', 'PayFlow', '$timeout', function($ionicScrollDelegate, syxw, Chats, $ionicPopup, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, showAlertMsg, HttpStatus, PayFlow, $timeout) {
        if (UserInfo.l.jsondatasyxw) {
            var plsobj = JSON.parse(UserInfo.l.jsondatasyxw);
            $scope.plsobj = syxw.zs(JSON.parse(UserInfo.l.jsondatasyxw));
            //console.log($scope.plsobj);
        } else {
            var plsobj = [];
            $scope.plsobj = [];
        }
        var lotteryid = $stateParams.lotteryid;
        $scope.type = $stateParams.lotteryid;
        var rx = $stateParams.rx;
        $scope.confirmation = false;
        $scope.Transactiondata = {};
        var Randomnum = $stateParams.id;
        var payluid = $stateParams.payluid;
        var playtype = $stateParams.type;
        $scope.playtype = playtype;
        var plsarry = [];
        //var plsdata = plsobj;
        $scope.ary = [];
        $scope.Infodata = {
            betcount: 0,
            doublecount: 1,
            qs: 1
        }
        $scope.data = {
                betcount: 0,
                doublecount: 1,
                money: 2,
                token: UserInfo.l.token,
                type: lotteryid,
                betjson: '',
            }
            //跳转购彩协议
        $scope.golotage = function() {
                $state.go('betinfo.lotage');
            }
            //继续选号
        $scope.lotteryadd = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '退出该页面会清空购彩篮里的数据，是否将已选的号码保存在号码篮内？',
                    cancelText: '否',
                    okText: '是',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        $scope.backGo();
                    } else {
                        UserInfo.remove("jsondatasyxw");
                        $scope.backGo();
                    }
                });
            }
            //机选
        $scope.Random = function(playid) {
                plsarry = [];
                var r = syxw.sjs(playid, rx)
                    //console.log(r);
                var e = [];
                if (playid == 'q2_pt' || playid == 'q3_pt') {
                    var j = '';
                    for (var i = 0; i < r.length; i++) {
                        $scope.ary[i] = [];
                        $scope.ary[i].push(r[i]);
                    }
                    e = $scope.ary;
                } else {
                    e = r;
                }
                //plsarry = e;
                plsobj.push(syxw.tz(playid, e, rx, payluid));
                var jsondatapls = JSON.stringify(plsobj);
                UserInfo.add('jsondatasyxw', jsondatapls);
            }
            //money计算
        $scope.total = function() {
                $scope.data.doublecount = $scope.Infodata.doublecount;
                $scope.data.qs = $scope.Infodata.qs;
                $scope.data.money = 2 * $scope.data.betcount * $scope.data.doublecount * $scope.data.qs;
            }
            //单注数计算
        $scope.plstzs = function(p, index) {
                if (p.playid.indexOf('dt') == -1 && p.playid != 'q2_pt' && p.playid != 'q3_pt') {
                    var len = 0;
                    len = plsobj[index].plsarry.length;
                    return syxw.C(len, plsobj[index].rx);
                } else if (p.playid.indexOf('dt') == -1 && (p.playid == 'q2_pt' || p.playid == 'q3_pt')) {
                    var f = 1;
                    for (var n = 0; n < plsobj[index].plsarry.length; n++) {
                        f *= plsobj[index].plsarry[n].length;
                    }
                    return f;
                } else {
                    var num = 0;
                    var len = 0;
                    num = plsobj[index].plsarry[0].length;
                    len = plsobj[index].plsarry[1].length;
                    num = plsobj[index].rx - num;
                    return syxw.C(len, num);
                }
            }
            //总投注数计算
        $scope.plsbettnum = function() {
            $scope.data.betcount = 0;
            for (var i = 0; i < plsobj.length; i++) {
                if (plsobj[i].playid.indexOf('dt') == -1 && plsobj[i].playid != 'q2_pt' && plsobj[i].playid != 'q3_pt') {
                    var len = 0;
                    len = plsobj[i].plsarry.length;
                    $scope.data.betcount += syxw.C(len, plsobj[i].rx);
                } else if (plsobj[i].playid.indexOf('dt') == -1 && (plsobj[i].playid == 'q2_pt' || plsobj[i].playid == 'q3_pt')) {
                    var f = 1;
                    for (var n = 0; n < plsobj[i].plsarry.length; n++) {
                        f *= plsobj[i].plsarry[n].length;
                    }
                    $scope.data.betcount += f;
                } else {
                    var num = 0;
                    var len = 0;
                    num = plsobj[i].plsarry[0].length;
                    len = plsobj[i].plsarry[1].length;
                    num = plsobj[i].rx - num;
                    $scope.data.betcount += syxw.C(len, num);
                }
            }
            $scope.total();
        }
        $scope.plsbettnum();
        //机选命令
        $scope.Randomorder = function(i) {
            for (var j = 0; j < i; j++) {
                $scope.Random(playtype);
                $scope.plsobj = syxw.zs(JSON.parse(UserInfo.l.jsondatasyxw));
                plsobj = JSON.parse(UserInfo.l.jsondatasyxw);
            }
            $scope.plsbettnum();
        }
        if (Randomnum != 0 && UserInfo.l.perform == 'yes') {
            UserInfo.add('perform', 'no');
            $scope.Randomorder(Randomnum);
        }
        $scope.add = function(i) {
            if (i == 2) {
                if ($scope.Infodata.doublecount == 9999) {
                    return false;
                }
                $scope.Infodata.doublecount++;
                $scope.total();
            } else {
                if ($scope.Infodata.doublecount == 9999) {
                    return false;
                }
                $scope.Infodata.qs++;
            }
            $scope.total();
        }
        $scope.cutdown = function(i) {
                if (i == 2) {
                    if ($scope.Infodata.doublecount == 1) {
                        return false;
                    }
                    $scope.Infodata.doublecount--;
                } else {
                    if ($scope.Infodata.qs == 1) {
                        return false;
                    }
                    $scope.Infodata.qs--;
                }
                $scope.total();
            }
            //提交订单
        $scope.doPost = function() {
            var pl = pls.handle(plsobj);
            $scope.data.betjson = '1|' + pl;
            PayFlow.money($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {}
            })
        }
        $scope.doblur = function() {
            if ($scope.Infodata.doublecount <= 0) {
                $scope.Infodata.doublecount = 1;
            } else if ($scope.Infodata.doublecount > 9999) {
                $scope.Infodata.doublecount = 9999;
            }
            if ($scope.Infodata.qs <= 0 || $scope.Infodata.qs == '') {
                $scope.Infodata.qs = 1;
            } else if ($scope.Infodata.qs > 99) {
                $scope.Infodata.qs = 99;
            }
            $scope.total();
        }
        $scope.dochange = function() {
                if ($scope.Infodata.doublecount == '' || $scope.Infodata.qs == '') {
                    if ($scope.Infodata.doublecount == '') {
                        $scope.data.doublecount = 1;
                    } else {
                        $scope.data.qs = 1;
                    }
                    $scope.data.money = 2 * $scope.data.betcount * $scope.data.doublecount * $scope.data.qs;
                    return false;
                }
                if ($scope.Infodata.doublecount <= 0) {
                    $scope.Infodata.doublecount = 1;
                } else if ($scope.Infodata.doublecount > 9999) {
                    $scope.Infodata.doublecount = 9999;
                }
                if ($scope.Infodata.qs <= 0 || $scope.Infodata.qs == '') {
                    $scope.Infodata.qs = 1;
                } else if ($scope.Infodata.qs > 99) {
                    $scope.Infodata.qs = 99;
                }
                $scope.total();
            }
            //删除单场赛事
        $scope.arydelete = function(l, p, index) {
                $scope.plsobj = Chats.remove(l, p);
                plsobj = Chats.removeindex(index, plsobj);
                var jsondatapls = JSON.stringify(plsobj);
                UserInfo.add('jsondatasyxw', jsondatapls);
                $scope.plsbettnum();
            }
            //清除
        $scope.clearlist = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '您确定要清空当前投注吗？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        UserInfo.remove("jsondatasyxw");
                        $scope.plsobj = [];
                        plsobj = [];
                        plsdata = [];
                        $scope.plsbettnum();
                        $timeout(function() {
                            $ionicScrollDelegate.$getByHandle('syxwbetting').resize();
                        }, 500)
                    } else {

                    }
                });
            }
            //关闭付款
        $scope.CloseConfirmation = function() {
            $scope.confirmation = false;
        }
        $scope.dobill = function() {
            /!*showAlertMsg.showMsgFun('温馨提示', '十一选五暂停销售');
            return false;*!/
            if (!plsobj.length) {
                showAlertMsg.showMsgFun('温馨提示', '至少选择一注进行投注');
                return false;
            }
            var pl = syxw.handle(plsobj);
            //console.log(pl);
            $scope.data.betjson = $scope.data.qs + '|' + pl;
            PayFlow.bill($scope.data).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.Transactiondata = data.data;
                    $timeout(function() {
                        $scope.confirmation = true;
                    }, 20)
                }
            })
        }
        $scope.payment = function() {
            var paydata = {
                orderid: $scope.Transactiondata.betorderid,
                ordermoney: $scope.Transactiondata.paymoney,
                token: UserInfo.l.token || '',
            }
            var chargedata = {
                money: $scope.Transactiondata.chargemoney,
                busorderid: $scope.Transactiondata.betorderid,
            }
            if ($scope.Transactiondata.chargemoney != 0) {
                PayFlow.charge(chargedata);
                return false;
            }
            PayFlow.pay(paydata).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    if (data.data.payresult == 2) {
                        PayFlow.charge(chargedata);
                    }
                    if (data.data.payresult == 1) {
                        UserInfo.remove("jsondatasyxw");
                        $state.go('practice.paid', { id: data.data.orderid, type: lotteryid, backurl: 'practice.syxwhall' });
                    }
                }
            })
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            $ionicHistory.clearCache().then(function() {
                window.history.back();
            })
        }
        $scope.Gohome = function() {
            var firmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '回到主页,将清空所有已选号码',
                cancelText: '取消',
                okText: '确定',
                okType: 'font-color'
            });
            firmPopup.then(function(res) {
                if (res) {
                    UserInfo.remove("jsondatasyxw");
                    $state.go('tab.hall');
                } else {

                }
            });
        }
    }])
*/

//玩法介绍
.controller('playAboutCtrl', ['$scope', '$ionicHistory', '$stateParams', '$state', function($scope, $ionicHistory, $stateParams, $state) {
        $scope.type = $stateParams.type;
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //app下载
    .controller('appdownloadCtrl', ['UserInfo', 'ApiEndpoint', 'serializeUrl', '$scope', '$ionicHistory', '$stateParams', '$state', function(UserInfo, ApiEndpoint, serializeUrl, $scope, $ionicHistory, $stateParams, $state) {
        $scope.download = function() {
            if (UserInfo.l.is_weixn == 'yes') {
                var d = "<div class='Backdrops-new'><img src='img/android.png'><div class='back-close'><a class='icon iconfont icon-tianjia'></a></div></div>";
                $('body').append(d);
                $('body').on('touchstart', '.back-close', function(e) {
                    $('.Backdrops-new').remove();
                    return false;
                })
            }
        }
        $scope.isweixin = UserInfo.l.is_weixn;
        $scope.download();
        if (UserInfo.l.webp == 'true') {
            $scope.bgimg = 'img/download.webp';
        } else {
            $scope.bgimg = 'img/download.png';
        }
        var jsondata = serializeUrl.url(location.href);
        var pid = jsondata.param.pid || '';
        var account = jsondata.param.account || UserInfo.l.account || $stateParams.account || '';
        if (pid) {
            var parameter = 'pid=' + pid + '&account=' + account;
        } else {
            var parameter = 'account=' + account;
        }
        $scope.durl = ApiEndpoint.url + '/download/apk?' + parameter;
        //$('#downloadAPK').attr("href",durl);
        //console.log(pid,account);
        $scope.yesno = false;
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //消息列表
    .controller('msglistCtrl', ['showAlertMsg', 'HttpStatus', 'UserInfo', 'ApiEndpoint', '$http', '$ionicLoading', '$scope', '$ionicHistory', '$stateParams', '$state', function(showAlertMsg, HttpStatus, UserInfo, ApiEndpoint, $http, $ionicLoading, $scope, $ionicHistory, $stateParams, $state) {
        $scope.ary = {};
        //获取赛事列表
        $scope.doPost = function() {
            $ionicLoading.show({ content: 'Loading', duration: 30000 })
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/usr/msg/summary",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    dataProcessing(data.data)
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
        }
        $scope.doPost();
        var dataProcessing = function(ary) {
            //console.log(ary);
            for (var i = 0; i < ary.length; i++) {
                $scope.ary[ary[i].mt] = ary[i];
            }
            //console.log($scope.ary)
        }
        $scope.goclassifylist = function(f) {
            $state.go('message.classifylist', { mt: f });
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //分类消息列表
    .controller('classifylistCtrl', ['httpcom', 'showAlertMsg', 'HttpStatus', 'UserInfo', 'ApiEndpoint', '$http', '$ionicLoading', '$scope', '$ionicHistory', '$stateParams', '$state', function(httpcom, showAlertMsg, HttpStatus, UserInfo, ApiEndpoint, $http, $ionicLoading, $scope, $ionicHistory, $stateParams, $state) {
        $scope.mt = $stateParams.mt;
        $scope.list = new Array();
        $scope.goods_load_over = true;
        $scope.maxData = '';
        $scope.data = '';
        $scope.search = {
            mt: $stateParams.mt,
            page: 1,
            token: UserInfo.l.token || '',
        };
        $scope.doPost = function() {
            $ionicLoading.show({ template: "正在查询请稍后...", duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/usr/msg/list",
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.maxData = data.data;
                    $scope.data = data.data;
                    if ($scope.maxData.length == 0) {
                        $scope.goods_load_over = false;
                        return false;
                    }
                    for (var i = 0; i < $scope.maxData.length; i++) {
                        $scope.list.push($scope.maxData[i]);
                    }
                }
            }).error(function() {
                $ionicLoading.hide();
                $scope.goods_load_over = false;
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            $scope.$broadcast('scroll.refreshComplete');
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //下拉刷新
        $scope.bomdoPost = function() {
                $scope.goods_load_over = true;
                $scope.search.page = 1;
                $scope.list = new Array();
                $scope.doPost();
            }
            //翻页
        $scope.loadParticulars = function() {
                $scope.search.page++;
                if ($scope.search.page > $scope.data.totalpage) {
                    $scope.goods_load_over = false;
                }
                $scope.doPost();
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //$ionicScrollDelegate.scrollTop(true);
            }
            //查看订单
        $scope.godetaail = function(list, id) {
            httpcom.msgread(id, 2);
            if(list.mt=='SYS'){
                if(list.busObj){
                    if(list.busObj.bustype=='E_GIFT'){
                        $state.go('practice.mycouponlist');
                    }
                }
            } else{
                //return false;
                $state.go('practice.detail', { id: list.order, type: 1 });
            }
           /* if(list.busObj.bustype=='E_GIFT'){
                $state.go('practice.mycouponlist');
            }else{
                $state.go('practice.detail', { id: list.order, type: 1 });
            }*/
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //我的优惠券
    .controller('mycouponlistCtrl', ['order','$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', function(order,$scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus) {
        $scope.list = new Array();
        $scope.id = $stateParams.id;
        $scope.goods_load_over = true;
        $scope.maxData = '';
        $scope.data = '';
        $scope.bgimg = false;//空状态图标控制
        $scope.search = {
            flag: 0,
            page: 1,
            token: UserInfo.l.token || '',
            lotteryid: $stateParams.type,
        };
        $scope.doPost = function() {
            $ionicLoading.show({content: 'Loading', duration: 30000})
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/act/coupon/mylist",
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.maxData = data.data;
                    $scope.data = data.data;
                    if ($scope.search.page >= $scope.data.totalpage) {
                        $scope.goods_load_over = false;
                    }
                    if ($scope.maxData.length<=0) {
                        $scope.bgimg = true;
                        return false;
                    }
                    for (var i = 0; i < $scope.maxData.length; i++) {
                        $scope.list.push($scope.maxData[i]);
                    }
                    if($scope.id>=0){
                        $scope.item = $scope.list[$scope.id];
                    }
                }
            }).error(function() {
                $ionicLoading.hide();
                $scope.goods_load_over = false;
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            $scope.$broadcast('scroll.refreshComplete');
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //奖券样式控制
        $scope.coustyle = function (t,s) {
            if(s == 0){
                return t
            }else{
                return 0;
            }
        }
        //下拉刷新
        $scope.bomdoPost = function() {
            $scope.goods_load_over = true;
            $scope.search.page = 1;
            $scope.list = new Array();
            $scope.doPost();
        }
        //翻页
        $scope.loadParticulars = function() {
            $scope.search.page++;
            if ($scope.search.page > $scope.data.totalpage) {
                $scope.goods_load_over = false;
            }
            $scope.doPost();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            //$ionicScrollDelegate.scrollTop(true);
        }
        //查看订单
        $scope.godetaail = function(l,index) {
            if(l.status != 0){
                return false;
            }else{
                $state.go('practice.coupondetails',{id:index});
                $scope.item = $scope.list[$scope.id];
            }
        }
        //彩种跳转
        $scope.golottery = function (type) {
            var backurl = order.getbackurl[type];
            //console.log(backurl);
            $ionicHistory.clearCache().then(function() {
                $state.go(backurl, { type: type });
            })
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //优惠券详情
    .controller('coupondetailsCtrl', ['$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', function($scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus) {
        $scope.list = new Array();
        $scope.search = {
            id:$stateParams.id,
            token: UserInfo.l.token || '',
        };
        $scope.doPost = function() {
            $ionicLoading.show({ template: "Loading", duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/act/coupon/cfg",
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.list = data.data;
                }
            }).error(function() {
                $ionicLoading.hide();
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            //$scope.$broadcast('scroll.refreshComplete');
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //查看订单
        $scope.godetaail = function(list) {
            $state.go('practice.detail', { id: list, type: 1, goback: 'practice.Soccerhall' });
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])

    //金币兑换
    .controller('conversionCtrl', ['$ionicPopup','HttpServer','$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', function($ionicPopup,HttpServer,$scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus) {
        $scope.list = new Array();
        $scope.vle = 1;
        $scope.search = {
            count:'',
            token: UserInfo.l.token || '',
        };
        $scope.exchange = {};
        var seetingrato = function () {
            var jsonexchange = JSON.parse(UserInfo.l.exchange);
            for(var i = 0;i<jsonexchange.length;i++){
                $scope.exchange[jsonexchange[i].from+'to'+jsonexchange[i].to] = jsonexchange[i].rate;
            }
        }
        //读取兑换配置
        if(UserInfo.l.exchange){
            seetingrato();
        }else{
            HttpStatus.getsetting().then(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    seetingrato();
                }
            })
        }
        //登录状态验证
        HttpStatus.myinfo().then(function (data) {
            //console.log(data);
            HttpStatus.codedispose(data);
        })
        //现金不足充值提示
        $scope.WalletPay = function () {
            var bzPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '账户余额不足，是否充值后兑换?',
                cancelText: '取消',
                okText: '充值',
                okType: 'font-color'
            });
            bzPopup.then(function(res) {
                if (res) {
                    $state.go('user.WalletPay')
                    /* $ionicHistory.clearCache(['practice.Soccerhall','practice.basketballhall']).then(function () {
                     $state.go('practice.Soccerhall')
                     })*/
                } else {
                }
            });
        }
        $scope.userinfo = {
            head: UserInfo.l.head,
            phone: UserInfo.l.phone,
            nick: UserInfo.l.nick,
            money: UserInfo.l.money||0,
            vmoney: UserInfo.l.vmoney||0,
            gcoin: UserInfo.l.gcoin||0,
        };
        $scope.changeTab = function(evt) {
            var elem = evt.currentTarget;
            $scope.vle = elem.getAttributeNode('data-active').value;
            $scope.search.count ='';
        }
        //强制转换整数
        $scope.changeInt = function () {
            if($scope.search.count==0){
                $scope.search.count = 1;
            }else{
                $scope.search.count = parseInt($scope.search.count);
            }
        }
        //全部兑换
        $scope.Alldollars = function () {
            if($scope.vle==1){
                $scope.search.count = parseInt($scope.userinfo.money-(-$scope.userinfo.vmoney));
            }else if($scope.vle==2){
                $scope.search.count = parseInt($scope.userinfo.gcoin);
            }
        }
        $scope.doPost = function() {
            if($scope.vle==1){
                if(!$scope.search.count){
                    showAlertMsg.showMsgFun('温馨提示','请输入>0的金额');
                    return false;
                }
                var url = '/wallet/currency/cash2gcoin';
                //当余额不足
                if($scope.search.count>($scope.userinfo.money-(-$scope.userinfo.vmoney))){
                    $scope.WalletPay();
                    return false;
                }
            }else if($scope.vle==2){
                if(!$scope.search.count){
                    showAlertMsg.showMsgFun('温馨提示','请输入>0的金币数');
                    return false;
                }
                var url = '/wallet/currency/gcoin2vcash';
            }
            HttpServer.Spost($scope.search,url).then(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    //$scope.backGo();
                    HttpStatus.myinfo().then(function (data) {
                        $scope.userinfo = {
                            head: UserInfo.l.head,
                            phone: UserInfo.l.phone,
                            nick: UserInfo.l.nick,
                            money: UserInfo.l.money,
                            vmoney: UserInfo.l.vmoney,
                            gcoin: UserInfo.l.gcoin,
                        };
                    })
                    $scope.search.count = '';
                    showAlertMsg.showMsgFun('温馨提示',data.msg);
                }
            })
            //$scope.$broadcast('scroll.refreshComplete');
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        //$scope.doPost();
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //包中历史记录
    .controller('bzrecordCtrl', ['order','$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'Match', '$stateParams', 'HttpStatus', function(order,$scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, Match, $stateParams, HttpStatus) {
        $scope.list = new Array();
        $scope.id = $stateParams.id;
        $scope.goods_load_over = true;
        $scope.maxData = '';
        $scope.data = '';
        $scope.bgimg = false;//空状态图标控制
        $scope.search = {
            flag: 0,
            page: 1,
            token: UserInfo.l.token || '',
            lotteryid: $stateParams.type,
        };
        $scope.doPost = function() {
            $ionicLoading.show({content: 'Loading', duration: 30000})
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/act/baozhong/list",
                data: $scope.search,
            }).success(function(data) {
                $ionicLoading.hide();
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.maxData = data.data.list;
                    $scope.data = data.data;
                    if ($scope.search.page >= $scope.data.totalPage) {
                        $scope.goods_load_over = false;
                    }
                    if ($scope.maxData.length<=0) {
                        $scope.bgimg = true;
                        return false;
                    }
                    for (var i = 0; i < $scope.maxData.length; i++) {
                        $scope.list.push($scope.maxData[i]);
                    }
                    //console.log($scope.list)
                    if($scope.id>=0){
                        $scope.item = $scope.list[$scope.id];
                    }
                }
            }).error(function() {
                $ionicLoading.hide();
                $scope.goods_load_over = false;
                showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
            })
            $scope.$broadcast('scroll.refreshComplete');
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.doPost();
        //奖券样式控制
        $scope.coustyle = function (t,s) {
            if(s == 0){
                return t
            }else{
                return 0;
            }
        }
        //下拉刷新
        $scope.bomdoPost = function() {
            $scope.goods_load_over = true;
            $scope.search.page = 1;
            $scope.list = new Array();
            $scope.doPost();
        }
        //翻页
        $scope.loadParticulars = function() {
            $scope.search.page++;
            if ($scope.search.page > $scope.data.totalpage) {
                $scope.goods_load_over = false;
            }
            $scope.doPost();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            //$ionicScrollDelegate.scrollTop(true);
        }
        //查看订单
        $scope.godetaail = function(l,index) {
            if(l.status != 0){
                return false;
            }else{
                $state.go('practice.coupondetails',{id:index});
                $scope.item = $scope.list[$scope.id];
            }
        }
        //彩种跳转
        $scope.golottery = function (type) {
            var backurl = order.getbackurl[type];
            //console.log(backurl);
            $ionicHistory.clearCache().then(function() {
                $state.go(backurl, { type: type });
            })
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])
    //外部页面
    .controller('ceshipageCtrl', ['$timeout','$rootScope','$scope','$state','$stateParams',function ($timeout,$rootScope,$scope,$state,$stateParams) {
        var m = window.document.querySelector('meta[name="viewport"]');
        var c = m.getAttribute("content");
        $scope.yourURL = $stateParams.url;
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            m.setAttribute("content", c);
            $state.go('tab.hall');
        }
        $scope.Gohome = function() {
            m.setAttribute("content", c);
            $state.go('tab.hall');
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            $timeout(function() {
                m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1");
            }, 0)
        });
        if(!$rootScope.addevent){
            window.addEventListener('hashchange', function(ev){
                if(ev.oldURL.indexOf('user/ceshi')!=-1){
                    m.setAttribute("content", c);
                }
            });
            $rootScope.addevent = true;
        }
    }])