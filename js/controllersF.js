/**
 * Created by King on 2017/12/7.
 */
angular.module('starter.controllersF', [])
// NEW 11选5
    .controller('syxwguideaCtrl', ['$q','$stomp', '$rootScope', 'websocket', '$location', 'algorithm', '$anchorScroll', 'order', 'PayFlow', 'stock', '$timeout', 'HttpServer', '$interval', 'HttpStatus', '$ionicPopup', 'cAp', 'syxw', 'showAlertMsg', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', '$ionicScrollDelegate', function ($q,$stomp, $rootScope, websocket, $location, algorithm, $anchorScroll, order, PayFlow, stock, $timeout, HttpServer, $interval, HttpStatus, $ionicPopup, cAp, syxw, showAlertMsg, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, $ionicScrollDelegate) {
        //初始化
        $scope.syyjflag = true;
        $scope.syyjanima_a = true;
        $scope.siteflag = true;
        $scope.tendflag = true;
        $scope.tendshows = false;
        var playtype = $stateParams.type;
        var over = $stateParams.over;
        var actApplyResult = $stateParams.actApplyResult;
        console.log(actApplyResult);
        console.log(over)
        $scope.type = playtype;
        //var playtype = UserInfo.l.syxwtrack || 10;
        $scope.SYXWtype = playtype; //十一选五的id
        $scope.zjatime = ''; //浙江开奖时间
        $scope.sxatime = ''; //山西开奖时间
        $scope.confirmation = false; //支付确认弹窗
        $scope.lotterylist = [];
        //初始化默认玩法
        $scope.plstext = '';
        var plsarry = [];
        var payluid = '';
        var playid = UserInfo.l.syxwplayrecord || 'rx2_pt';
        $scope.playid = '';
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
        $scope.ts1 = '';
        $scope.ts2 = '';
        $scope.ts3 = '';
        $scope.alCot = {};
        $scope.payload = '';//开奖号码
        $scope.qzrowsmarr = []; //遗漏值
        $scope.agopid = '';//前一期PID
        $scope.oldacode = '';//前一期开奖号码-指引
        $scope.oldpidguideb = '';//前一期pid-指引
        $scope.buyoldlist = false;//开奖期次是否购买
        $scope.syyjdowntimebig = 0;//10秒倒计时效果 缩放
        $scope.openendsyyjcot  = false;//开奖页面左移出现
        $scope.mybetflag = true;//我的投注号码按钮
        $scope.syyjdowntimeleft = false;//开奖动画
        //指引控制
        /**
         * over true-开奖,展开我的投注列表，false-投注,关闭我的投注列表
         */
        if(over){
            $scope.nguidea = false;//指引画面1
            $scope.nguidec = true;//指引画面3
            $scope.mynumlist = true;//我的投注号码-展开
            $scope.mytext = '手动选号';
            $timeout(function () {
                $scope.syyjdowntimebig = 1;
            },5000);
            $timeout(function () {
                $scope.syyjdowntimebig = 2;
                $scope.syyjdowntimeleft = true;
            },10000);
        }else{
            $scope.nguidea = true;//指引画面1
            $scope.nguidec = false;
            $scope.mynumlist = false;//投注列表关闭
            $scope.mytext = '我的投注';
            UserInfo.remove('syxwseebet');
        }
        $scope.nguideb = false;//指引画面2
        var rxrowsm = []; //走势图
        var qzrowsm1 = []; //前三走势
        var qzrowsm2 = [];
        var qzrowsm3 = [];
        $scope.arrylist = [];
        if (UserInfo.l.syxwplaycfg) {
            $scope.syxwarray = JSON.parse(UserInfo.l.syxwplaycfg)
        } else {
            $scope.syxwarray = [1, 2, 3, 4]; //默认所选玩法列表
        }
        $scope.syxwpull = [];
        $scope.syn_tempary = syxw.syntempary();

        var bAry = ['balla', 'ballb', 'ballc', 'balld', 'balle'];
        var tAry = [1500, 1250, 1050, 850, 650]; //动画时间
        // var nAry = ['05', '06', '07', '08', '10']
        var dAry = ['.2rem', '.82rem', '1.42rem', '2.04rem', '2.66rem'];

        $scope.closeendshow = function () {
            $('.syyj_cot').hide();
        }
        //偏移到对应玩法位置
        $scope.syxwarrays = function (a) {
            $scope.syxwpull = [];
            for (var x in $scope.syxwarray) {
                $scope.syxwpull[x] = $scope.syn_tempary[$scope.syxwarray[x] - 1]
            }
            $ionicScrollDelegate.$getByHandle('syn_chooses').scrollTo(0, 0, true);
            if (a) {
                var b;
                for (var x in $scope.syxwarray) {
                    if ($scope.syxwarray[x] == a) {
                        b = x;
                        break;
                    }
                }
                if (b) {
                    var rems = parseInt($('html').css('fontSize')) / 100;
                    var b = b * 1 + 1;
                    var length = $scope.syxwarray.length;
                    var inst = parseInt((document.body.offsetWidth - 100 * rems) / (160 * rems));
                    var sites = parseInt(inst / 2);
                    //console.log(b, length, inst, sites, document.body.offsetWidth)
                    if (length > inst) {
                        if (b + sites >= length) {
                            var d = length - inst;
                        } else if (b + sites < length) {
                            var d = b - sites - 1;
                        }
                    } else {
                        var d = 0;
                    }
                    //console.log('位移量:' + (d * 1 * 160 * rems - 15))
                    $timeout(function () {
                        $ionicScrollDelegate.$getByHandle('syn_chooses').scrollTo(d * 160 * rems - 15, 0, true);
                    }, 50);
                    $scope.clsyxwpull($scope.syxwpull[b - 1]);
                    //$scope.ShlistHeght = true;
                }
            }
        }
        //$scope.syxwarrays();
        $scope.numType = function (a) {
            return !isNaN(Number(a));
        }
        //图片预加载
        syxw.preloadimages(['imgs/11-1.gif', 'imgs/11-6.gif', 'imgs/11-8.gif', 'imgs/bg.png']);
        //我的投注切换
        $scope.mynumlists = function () {
            //console.log($('.seven-cot').height(), $('.syn_cotb_mynum').height())
            if (!$scope.mybetflag) {
                return false;
            }
            $scope.tendshows = false
            //$('.syn_cotb_my').height($('.seven-cot').height());
            if ($scope.mynumlist) {
                $scope.mynumlist = false;
                $scope.mytext = '我的投注';
            } else {
                $scope.mynumlist = true;
                $scope.mytext = '手动选号';
            }
        }
        var max = 11;
        var min = 1;
        var num = 1;
        $scope.tendbtns = function () {
            if ($scope.tendshows) {
                $scope.tendshows = false;
            } else {
                $scope.tendshows = true;
            }
        }
        $scope.aryb = [];
        $scope.ary = [];
        var Init = function (x, n, m) {
            var o = $('.syxw li div');
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
        //期次数据
        $scope.search = {
            token: UserInfo.l.token,
            pn: 1,
            type: 10,
        }
        //遗漏计算
        var missnum = function () {
            if (playid.indexOf('dt') == -1 && playid.indexOf('rx') != -1) {
                $scope.qzrowsmarr.push(rxrowsm);
            } else if (playid.indexOf('dt') == -1 && (playid.indexOf('q2_pt') != -1 || playid.indexOf('q3_pt') != -1)) {
                $scope.qzrowsmarr.push(qzrowsm1, qzrowsm2, qzrowsm3);
            }
        }
        $scope.doPost = function () {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/lotteryinfo",
                data: $scope.search,
            }).success(function (data) {
                HttpStatus.codedispose(data);
                $scope.lotterylist = [];
                $scope.prepidlist = [];
                if ($scope.cleartime) {
                    $interval.cancel($scope.cleartime);
                };
                if (data.status == 1) {
                    $scope.oldacode = data.data.rowsp[0].acode;
                    $scope.oldpidguideb = data.data.rowsp[0].pid;
                    $scope.agopid = data.data.prepid.pid;
                    var prepid = data.data.prepid;
                    var rowsm = data.data.rowsm.split(",");
                    rxrowsm = rowsm.slice(0, 11); //走势图
                    qzrowsm1 = rowsm.slice(11, 22); //前三走势
                    qzrowsm2 = rowsm.slice(22, 33);
                    qzrowsm3 = rowsm.slice(33, 44);
                    $scope.qzrowsmarr = [];
                    missnum(); //遗漏值初始化
                    $scope.list = data.data;
                    $scope.ntime = $scope.list.stime.split(",");
                    var SysTime = new Date().getTime() / 1000;
                    var xiangchatime = (new Date(data.data.stime.replace(/-/g, "/")).getTime() - new Date(data.data.ntime.replace(/-/g, "/")).getTime()) / 1000 + 120;//结束时间-当前时间=截止倒计时总时间；
                    var xctime = (new Date(data.data.atime.replace(/-/g, "/")).getTime() - new Date(data.data.stime.replace(/-/g, "/")).getTime()) / 1000 + 2;//下期开始时间-当期结束时间 = 暂停间隔时间
                    var openxctime = (new Date(data.data.prepid.openTimeStr.replace(/-/g, "/")).getTime() - new Date(data.data.ntime.replace(/-/g, "/")).getTime()) / 1000;//开奖时间-当前时间 = 开奖倒计时
                    if ($scope.search.type == 10) {
                        $scope.zjatime = stock.getHM(stock.Formattime(data.data.atime));
                    } else if ($scope.search.type == 20) {
                        $scope.sxatime = stock.getHM(stock.Formattime(data.data.atime));
                    }
                    //开奖中开奖动画界入口逻辑
                    if ((prepid.status>=1) && (openxctime>0 && openxctime<120)) {
                        var obj = {
                            pid: prepid.pid,
                            status: prepid.status,
                        }
                        $scope.prepidlist.push(obj);
                        for (var i = 0; i < data.data.rowsp.length; i++) {
                            if(data.data.rowsp[i].pid < $scope.oldpidguideb){
                                $scope.lotterylist.push(data.data.rowsp[i]);
                            }
                        }
                    } else {
                        for (var i = 0; i < data.data.rowsp.length; i++) {
                            if(data.data.rowsp[i].pid<$scope.oldpidguideb){
                                $scope.lotterylist.push(data.data.rowsp[i]);
                            }
                        }
                    }
                    // getatime($scope.search.type);
                    //console.log(openxctime);
                    $scope.downtime = xiangchatime;//投注倒计时
                    $scope.openlottery = openxctime;//开奖倒计时
                    $scope.tencountDown = 10;
                    var down = true;
                    $scope.cleartime = $interval(function () {
                        var myDate = new Date();
                        //console.log(myDate);
                        var mytime = myDate.getTime() / 1000;
                        var time = Math.round(mytime - SysTime); //请求系统时间-当前系统时间=已经过去时间
                        $scope.downtime = xiangchatime - time;
                        $scope.openlottery = openxctime - time;
                        /*if ($scope.openlottery > 0) {
                         console.log('开奖倒计时开始' + $scope.openlottery)
                         } else {
                         console.log('开奖倒计时未开始' + $scope.openlottery)
                         }*/
                        //上期购买判断
                        //console.log($scope.buyoldlist)
                        /*if($scope.buyoldlist){
                            if($scope.openlottery <= 9 && $scope.openlottery >0){
                                $scope.syyjdowntimebig  = 1;
                                $scope.tencountDown --;
                                //console.log($scope.openlottery);
                            }else{
                                $scope.syyjdowntimebig  = 0;
                            }
                        }
                        if($scope.openlottery > 9 || $scope.openlottery <0){
                            $scope.syyjdowntimebig  = 0;
                        }*/
                        //console.log(xiangchatime);
                        //console.log($scope.downtime);
                        //console.log($scope.downtime,-xctime)
                        if($scope.openlottery==0 && $location.path().indexOf("practice/syxwguidea") != -1){
                            $scope.oldpid().then(function (d) {
                                if(d.data.betList.length>0){
                                    $scope.buyoldlist = true;
                                }else{
                                    $scope.buyoldlist = false;
                                }
                                if(d.status ==1){
                                    if(d.data.betList.length>0){
                                        if(d.data.acode){
                                            //console.log('正式开奖' + $scope.openlottery)
                                            $scope.syyjflag = true;
                                            $scope.syyjdowntimebig  = 2;
                                            $scope.syyjdowntimeleft = true;
                                            //开奖动画出现开始开奖
                                            $scope.opening(d.data.acode.split(","));
                                        }else{
                                            $scope.syyjdowntimebig  = 0;
                                            alert('网络故障，获取开奖号码失败');
                                        }
                                    }else{
                                        $scope.syyjdowntimebig  = 0;
                                    }
                                }
                            })
                            $timeout(function () {
                                $interval.cancel($scope.cleartime);
                                $scope.doPost();
                                $scope.mybet();
                            },1000)
                        }
                        if ($scope.downtime < -xctime && down == true) {
                            down == false;
                            $interval.cancel($scope.cleartime);
                            //$scope.djs_pid = data.data.pid;
                            //console.log($scope.downtime);
                            //$scope.syyjanima_a=false;
                            $scope.doPost();
                            $timeout(function () {
                                //$scope.syyjanima_a=true;
                                $scope.mybet();
                            }, 1000);
                        }
                    }, 1000);
                    $scope.mybet();
                    $scope.oldpid()
                }
            }).error(function (data) {
            });
        }
        $scope.doPost();
       /* $scope.Sync = $interval(function () {
            HttpServer.Hpost($scope.search, "/trade/lotteryinfo").then(function (data) {
                $scope.list = data.data;
                $scope.lotterylist = [];
                $scope.prepidlist = [];
                //开奖中开奖动画界入口逻辑
                var prepid = data.data.prepid;
                var openxctime = (new Date(data.data.prepid.openTimeStr.replace(/-/g, "/")).getTime() - new Date(data.data.ntime.replace(/-/g, "/")).getTime()) / 1000;//开间时间-当前时间 = 开奖倒计时
                //开奖中开奖动画界入口逻辑
                if ((prepid.status>=1) && (openxctime>0 && openxctime<120)) {
                    var obj = {
                        pid: prepid.pid,
                        status: prepid.status,
                    }
                    $scope.prepidlist.push(obj);
                    for (var i = 0; i < data.data.rowsp.length; i++) {
                        if(data.data.rowsp[i].pid < $scope.oldpidguideb){
                            $scope.lotterylist.push(data.data.rowsp[i]);
                        }
                    }
                } else {
                    for (var i = 0; i < data.data.rowsp.length; i++) {
                        if(data.data.rowsp[i].pid<$scope.oldpidguideb){
                            $scope.lotterylist.push(data.data.rowsp[i]);
                        }
                    }
                }
                console.log($scope.prepidlist);
                //getatime($scope.search.type);
            })
        }, 60000);*/ //一分钟同步一次开奖数据
        //获取上期号码-开奖所需号码
        $scope.oldpid = function () {
            var defer = $q.defer();
            var olddata = {
                token: UserInfo.l.token,
                type: 10,
                pid:$scope.agopid,
            };
            //olddata.pid = $scope.lotterylist.pid;
            HttpServer.Hpost(olddata, "/trade/betnumber/now").then(function (datanow) {
                if(datanow.data.betList.length>0){
                    $scope.buyoldlist = true;
                }else{
                    $scope.buyoldlist = false;
                }
                $scope.alCot.orders = {
                    acode: datanow.data.acode,
                    pid: datanow.data.pid,
                    detailList: datanow.data.betList,
                    tflag: true
                }
                for (var x in $scope.alCot.orders.detailList) {
                    var temp = order.NumberGame({
                        bcontext: $scope.alCot.orders.detailList[x].bdesc,
                        lotteryid: 10
                    });
                    $scope.alCot.orders.detailList[x].codes = temp[0];
                    $scope.alCot.orders.detailList[x].codes.bets = temp[0].bets.replace(/\$/g, ' $ ').replace(/@/g, ' | ').replace(/\,/g, ' ').trim().split(' ');
                    $scope.alCot.orders.detailList[x].bounstotal = syxw.bounstotal($scope.alCot.orders.detailList[x].bdesc, $scope.alCot.orders.acode);
                }
                defer.resolve(datanow);
            });
            return defer.promise;
        }
        //助手
        $scope.assistant = function (e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', {
                        type: playtype
                    });
                    break;
                case 2:
                    $state.go('practice.play-About', {
                        type: playtype
                    });
                    break;
                case 3:
                    $state.go('practice.lot-details', {
                        type: playtype
                    });
                    break;
                default:
                    break;
            }
            $scope.assistantShow ? $scope.assistantShow = false : $scope.assistantShow = true;
        }
        //走势图
        $scope.goqxc = function (a) {
            $state.go('practice.trendchar', {
                type: a
            });
        }
        $scope.addflag = function (a, json) {
            if (a && json) {
                if (json.indexOf(a) > -1) return true;
            }
        }

        //玩法选择
        $scope.Shlist = function () {
            $scope.ShlistHeght ? $scope.ShlistHeght = false : $scope.ShlistHeght = true;
            if ($scope.ShlistHeght) {
                for (var x in $scope.syxwarray) {
                    $($('.syn_plays li')[$scope.syxwarray[x] - 1]).addClass('ott-img');
                }
            }
        }
        $scope.clsyxwpull = function (l) {
            playid = l.syxw;
            payluid = l.payid;
            rx = l.rx;
            num = pls.toggleplay(playid);
            $scope.aryb = [];
            $scope.ary = [];
            var ts = syxw.ts(playid);
            $scope.gamesession = 0;
            $scope.ShlistHeght = false;
            $scope.playid = playid;
            //console.log($scope.playid);
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

            if ($scope.ary.length == 1) {
                $scope.tendflag = true;
                if (playid == 'rx1_pt') {
                    $scope.tendflag = false;
                    $scope.tendshows = false;
                }
            } else {
                $scope.tendflag = false;
                $scope.tendshows = false;
            }
            $scope.qzrowsmarr = [];
            missnum();
            UserInfo.add('syxwplayrecord', playid);
        }
        //个人玩法初始化
        var playinit = function (p) {
            var s = syxw.syxwint(p);
            var arr = [];
            $scope.syxwarrays(s.NO + 1);
            if ($scope.syxwarray.indexOf(s.NO + 1) == -1) {
                $scope.syxwarray.push(s.NO + 1);
                $scope.syxwarray = $scope.syxwarray.sort(function (a, b) {
                    return a - b
                });
            }
            for (var x in $scope.syxwarray) {
                arr[x] = $scope.syn_tempary[$scope.syxwarray[x] - 1];
            }
            $scope.syxwarrays(s.NO + 1);
            return arr;
        }
        $scope.syxwpull = playinit(playid);
        //玩法编辑
        $('.syn_plays').on("click", 'li', function (e) {
            var tempnums = $(this).index() + 1;
            var sizenums = $scope.syxwarray.indexOf(tempnums);
            if ($(this).hasClass('ott-img')) {
                if ($scope.syxwarray.length == 1) {
                    return false;
                }
                $(this).removeClass('ott-img');
                $scope.syxwarray.splice(sizenums, 1);
            } else {
                $(this).addClass('ott-img');
                $scope.syxwarray.push(tempnums)
            }
            $scope.syxwarray.sort(function (a, b) {
                return a - b
            });
            if (sizenums == -1) {
                $scope.syxwarrays(tempnums);
            } else {
                $scope.syxwarrays($scope.syxwarray[0]);
            }
            $scope.savelotplaycfg($scope.syxwarray);
            $scope.ShlistHeght = true;
            e.stopPropagation();
            return false;
        })
        //玩法编辑记录
        $scope.savelotplaycfg = function (playcfg) {
            playcfg = algorithm.unique(playcfg);
            //console.log(playcfg)
            var cfg = JSON.stringify(playcfg);
            var savelotplaydt = {
                token: UserInfo.l.token,
                type: playtype,
                playcfg: cfg,
            }
            UserInfo.add('syxwplaycfg', cfg);
            HttpServer.Hpost(savelotplaydt, '/betting/savelotplaycfg').then(function (data) {

            })
        }
        //点击空白关闭
        $('.Soccerhall-playlist').on("click", function (e) {
            $scope.$apply(function () {
                $scope.ShlistHeght = false;
            });
        });
        //页面滚动
        $scope.scrollup = function () {
            //$ionicScrollDelegate.$getByHandle('plscon').scrollTop();
            $('.seven-cot').removeClass('s-cot-t');
            $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
            $('.sch-f-a').removeClass('schf-a-top');
            // $ionicScrollDelegate.scrollTop()
        }
        $scope.scrolldown = function () {
            var obj = $ionicScrollDelegate.getScrollPosition();
            if (obj.top == 0) {
                $('.seven-cot').addClass('s-cot-t');
                $('.sch-f-a img').addClass('sch-f-i').removeClass('sch-f-i');
                $('.sch-f-a').addClass('schf-a-top');
            }
        }
        //清除
        $scope.deleteary = function () {
            plsarry = [];
            $('.syxw li .temp_li').removeClass('a_class');
            $scope.gamesession = 0;
        }
        /**
         * 机选一注
         * @param p 玩法类型：rx6_pt
         * @param r 固定随机参数
         * @constructor
         */
        $scope.Random = function (p, r) {
            plsarry = [];
            if (!r) {
                var r = syxw.sjs(p, rx)
            }
            //console.log(p);
            var o = $('.syxw li .temp_li');
            o.removeClass('a_class');
            var e = [];
            if (p == 'q2_pt' || p == 'q3_pt') {
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
            plsarry = e;
        }
        //追投
        $scope.zhuitou = function (p, r) {
            console.log(p,r);
            plsarry = [];
            if (!r) {
                var r = syxw.sjs(p, rx)
            }
            //console.log(p,r);
            var o = $('.syxw li .temp_li');
            o.removeClass('a_class');
            if (p == 'q2_pt' || p == 'q3_pt') {
                var j = '';
                for (var i = 0; i < r.length; i++) {
                    for (var g = 0; g < r[i].length; g++) {
                        j = parseInt(r[i][g]);
                        $(o[j - 1 + i * 11]).addClass('a_class');
                    }
                }
            } else if (p.indexOf('dt') != -1) {
                var j = '';
                for (var i = 0; i < r.length; i++) {
                    for (var g = 0; g < r[i].length; g++) {
                        j = parseInt(r[i][g]);
                        $(o[j - 1 + i * 11]).addClass('a_class');
                    }
                }
            } else {
                var j = '';
                for (var i = 0; i < r.length; i++) {
                    j = parseInt(r[i]);
                    $(o[j - 1]).addClass('a_class');
                }
            }
            plsarry = r;
            return false;
        }
        //我的投注追投
        $scope.bettext = function (d) {
            if (d.acode == undefined) {
                return '加投';
            } else if (d.amoney * 1 > 0) {
                return '再投';
            } else {
                return '倍投';
            }
        }
        //追投选号
        $scope.againbet = function (d, f) {
            var i = 1;
            if (d.acode == undefined) {
                i = 1;
            } else {
                if (d.amoney * 1 > 0) {
                    i = 1;
                } else {
                    i = 2;
                }
            }
            $scope.data.doublecount = d.bdouble * i;
            $scope.data.betjson = d.bdesc;
            $scope.data.money = parseInt(d.money) * i;
            $scope.data.betcount = d.bcount;
            $scope.Infodata.doublecount = d.bdouble * i;

            $timeout(function () {
                $scope.gamesession = d.bcount;
            }, 0)
            var r = syxw.resolvebdesc(d.bdesc);
            var strarr = ''; //追投玩法
            for (var i = 0; i < $scope.syn_tempary.length; i++) {
                if ($scope.syn_tempary[i].payid == r.playid) {
                    if ($scope.syn_tempary[i].f.indexOf(r.playtype) != -1) {
                        strarr = $scope.syn_tempary[i]
                        break;
                    }
                }
            }
            $scope.syxwarray.push(strarr.NO + 1)
            $scope.syxwarray = algorithm.unique($scope.syxwarray);
            $scope.syxwarray = $scope.syxwarray.sort(function (a, b) {
                return a - b
            });
            $scope.syxwarrays(strarr.NO + 1);
            //$scope.clsyxwpull(strarr); //页面自动选中
            //return false;
            $timeout(function () {
                $scope.zhuitou(strarr.syxw, r.arr); //选择投注号码
            }, 20)
            $scope.mynumlist = false;
            $scope.mytext = '我的投注';
            $scope.tendshows = false;
            return false;
/*            PayFlow.bill($scope.data).then(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.Transactiondata = data.data;
                    var transactiondata = JSON.stringify($scope.Transactiondata);
                    $ionicHistory.clearCache(['user.payment']).then(function() {
                        $state.go('user.payment', {
                            paystring: transactiondata,
                            type: $scope.type,
                        });
                    })
                    $scope.mynumlist = false;
                }
            })*/
        }
        /**
         * 追投倍投判定
         * @param a 中奖金额
         * @param b 是否
         * @param c 是否当期
         * @returns {boolean}
         */
        $scope.tzbet = function (a, b, c) {
            var a = parseInt(a);
            console.log(a, b, c)
            if (a > 0 && c) {
                return true;
            } else {
                return false;
            }
        }
        // 数字点击反馈
        $scope.tempfalg = true;
        $scope.fangdahidea = function (a, b, event) { // 离开
            b = b - 1;
            e = event.target;
            var d = $(".syxw li .temp_li");
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
        $scope.fangdahideb = function (a, b, event) { //滑动
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.tempfalg = false;
        }
        $scope.numclick = function (a, b, event) {
            //点击
            e = event.target;
            $(e).find('.scclr-big').show();
            $scope.tempfalg = true;
        }
        //点击选择号码
        var plsclick = function () {
            plsarry = [];
            var e = [];
            var c = '';
            var d = $(".syxw li .temp_li");
            if (playid.indexOf('dt') == -1) {
                if (playid != 'q2_pt' && playid != 'q3_pt') {
                    for (var i = 0; i < d.length; i++) {
                        if ($(d[i]).is('.a_class')) {
                            e.push($(d[i]).data('num').id);
                        }
                        ;
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
                        }
                        ;
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
                var lendt = e.length;
                $scope.gamesession = syxw.C(lendt, rx);
                //$scope.gamesession = syxw.tzs(playid, e);
            } else if (playid.indexOf('dt') == -1 && (playid == 'q2_pt' || playid == 'q3_pt')) {
                var f = 1;
                for (var n = 0; n < e.length; n++) {
                    f *= e[n].length;
                }
                $scope.gamesession = f;
            } else {
                var nums = 0;
                var lendt = 0;
                var fnums = 0;
                nums = e[0].length;
                lendt = e[1].length;
                if (nums == 0 || nums + lendt <= rx) {
                    plsarry = e;
                    $scope.gamesession = 0;
                    return false;
                }
                fnums = rx - nums;
                $scope.gamesession = syxw.C(lendt, fnums);
            }
            plsarry = e;
        }
        // 摇奖界面状态
        $scope.syyjclose = function () {
            $scope.syyjdowntimeleft = false;
        }
        //我的投注数据
        $scope.mybet = function () {
            var mybetdate = {
                token: UserInfo.l.token,
                type: playtype,
            }
            $scope.alCot.now =[];
            $scope.alCot.previous =[];
            HttpServer.Hpost(mybetdate, '/trade/betnumber/now').then(function (datanow) {
                if (datanow.status == 1) {
                    if (datanow.data.betList.length > 0) {
                        $scope.alCot.now = {
                            acode: datanow.data.acode,
                            pid: datanow.data.pid,
                            detailList: datanow.data.betList,
                            tflag: true
                        }
                        for (var x in $scope.alCot.now.detailList) {
                            var temp = order.NumberGame({
                                bcontext: $scope.alCot.now.detailList[x].bdesc,
                                lotteryid: 10
                            });
                            $scope.alCot.now.detailList[x].codes = temp[0];
                            $scope.alCot.now.detailList[x].codes.bets = temp[0].bets.replace(/\$/g, ' $ ').replace(/@/g, ' | ').replace(/\,/g, ' ').trim().split(' ');
                            $scope.alCot.now.detailList[x].bounstotal = {
                                acode: '',
                                amoney: ''
                            }
                        }
                    }
                    /*  if ($scope.alCot.now) {
                     $scope.mybetflag = true;
                     } else {
                     $scope.mybetflag = false;
                     }*/
                    // **  新数据结构数组
                    // console.log((!!datanow.data.betList),(datanow.data.betList),datanow.data.betList.length)
                    // if (datanow.data.betList.length > 0) {
                    //     $scope.arrylistNew[0] = {
                    //         pid: datanow.data.pid,
                    //         tflag: true,
                    //         list: [],
                    //         acode: ''
                    //     }
                    //     var list = datanow.data.betList;
                    //     for (var x in list) {
                    //         $scope.arrylistNew[0].list[x] = list[x]
                    //     }
                    // }
                    // **

                    // var list = datanow.data.betList;
                    // for (var x in list) {
                    //     list[x].pid = datanow.data.pid;
                    //     list[x].tflag = true;
                    // }

                }
                HttpServer.Hpost({
                    count: 18,
                    intertemporal: true,
                    token: UserInfo.l.token,
                    type: playtype,
                }, '/trade/betnumber/previous').then(function (data) {
                    $scope.alCot.previous = [];
                    if (data.status == 1) {
                        var xid = '';
                        for (var i = 0; i < data.data.betList.length; i++) {
                            var length = $scope.alCot.previous.length;
                            if (data.data.betList[i].pid == xid) {
                                $scope.alCot.previous[length - 1].list.push(data.data.betList[i]);
                            } else {
                                $scope.alCot.previous[length] = {
                                    pid: data.data.betList[i].pid,
                                    tflag: false,
                                    list: [data.data.betList[i]],
                                    acode: data.data.betList[i].acode
                                }
                                if($scope.alCot.previous[length].pid==$scope.agopid && ($scope.openlottery>0 && $scope.openlottery<120)){
                                    $scope.alCot.previous[length].acode = '';
                                }
                            }
                            xid = data.data.betList[i].pid;
                        }
                        for (var i = 0; i < $scope.alCot.previous.length; i++) {
                            for (var x in $scope.alCot.previous[i].list) {
                                var temp = order.NumberGame({
                                    bcontext: $scope.alCot.previous[i].list[x].bdesc,
                                    lotteryid: 10
                                });
                                $scope.alCot.previous[i].list[x].codes = temp[0];
                                if ($scope.alCot.previous[i].acode != '') {
                                    $scope.alCot.previous[i].list[x].bounstotal = syxw.bounstotal($scope.alCot.previous[i].list[x].bdesc, $scope.alCot.previous[i].acode);
                                } else {
                                    $scope.alCot.previous[i].list[x].bounstotal = {
                                        acode: '',
                                        amoney: ''
                                    }
                                }
                                var temps = $scope.alCot.previous[i].list[x].codes.bets;
                                $scope.alCot.previous[i].list[x].codes.bets = temps.replace(/\$/g, ' $ ').replace(/@/g, ' | ').replace(/\,/g, ' ').trim().split(' ');
                            }
                        }
                        // console.log($scope.alCot.previous, 2)
                    }
                    //个人投注判断
                    if ($scope.alCot.now && $scope.alCot.previous.length > 0) {
                        $scope.mybetflag = true;
                    } else{
                        $scope.mybetflag = false;
                    }
                })
                // $scope.arrylistCot.previous = {

                // }


                // **  新数据结构数组
                // for (var i = 0; i < data.data.previousBetList.length; i++) {
                //   var length = $scope.arrylistNew.length;
                //   if (length > 0 && data.data.previousBetList[i].pid == $scope.arrylistNew[length - 1].pid) {
                //     console.log($scope.arrylistNew.length)
                //     $scope.arrylistNew[length - 1].list.push(data.data.previousBetList[i]);
                //   } else {
                //     $scope.arrylistNew[length] = {
                //       pid: data.data.previousBetList[i].pid,
                //       tflag: false,
                //       list: [data.data.previousBetList[i]],
                //       acode: data.data.previousBetList[i].acode
                //     }
                //   }
                // }

                // console.log($scope.arrylistNew)
                // for (var i = 0; i < $scope.arrylistNew.length; i++) {
                //   for (var x in $scope.arrylistNew[i].list) {
                //     var temp = order.NumberGame({
                //       bcontext: $scope.arrylistNew[i].list[x].bdesc,
                //       lotteryid: 10
                //     });
                //     $scope.arrylistNew[i].list[x].codes = temp[0];
                //     if ($scope.arrylistNew[i].acode != '') {
                //       $scope.arrylistNew[i].list[x].bounstotal = syxw.bounstotal($scope.arrylistNew[i].list[x].bdesc, $scope.arrylistNew[i].acode);
                //     } else {
                //       $scope.arrylistNew[i].list[x].bounstotal = {
                //         acode: '',
                //         amoney: ''
                //       }
                //     }
                //     var temps = $scope.arrylistNew[i].list[x].codes.bets;
                //     $scope.arrylistNew[i].list[x].codes.bets = temps.replace(/\$/g, ' $ ').replace(/@/g, ' | ').replace(/\,/g, ' ').trim().split(' ');

                //   }
                // }

                // *-------------*
            })
        }

        // 开奖动画
        $scope.opening = function (nAry) {
            $scope.openhinttxt = '开奖中...';
            $scope.syyjflag = true;
            for (var x in $scope.alCot.orders.detailList) {
                $scope.alCot.orders.detailList[x].bounstotal = syxw.bounstotal($scope.alCot.orders.detailList[x].bdesc, nAry.join(','));
            }
            $timeout(function () {
                $('.st_anima_a').addClass('sT_anima_scaleb');
            }, 50)
            $timeout(function () {
                var times = 1;
                var cAry = [];
                for (var n in nAry) {
                    cAry[n] = parseInt(nAry[n]);
                }
                if ($scope.alCot.orders.detailList.length) {
                    $(".stb_ic").attr('src', 'imgs/11-1.gif');
                    var x = 0;
                    $scope.ballruntime = $interval(function () {
                        if (x == 2) $(".stb_ic").attr('src', 'imgs/11-8.gif');
                        if (x == 4) $(".stb_ic").attr('src', 'imgs/11-6.gif');
                        if (x == 5) return false;
                        $scope.ballrun(x, nAry, cAry, times);
                        times++;
                        x++;
                    }, 3000)
                }
            }, 1500)

        }
        $scope.lotterytype = false;
        $scope.ballrun = function (a, nAry, cAry, times) {
            if (a < 5) {
                $('.stc_ball').show();
                $timeout(function () {
                    $("#" + bAry[a]).attr('src', 'imgs/ball' + parseInt(cAry[a]) + '.png');
                    var ary = $('.syyj_kaijiang');
                    var tempary = [];
                    for (var x = 0; x < $scope.alCot.orders.detailList.length; x++) {
                        //console.log($scope.alCot.orders.detailList[x].bounstotal);
                        tempary[x] = $scope.alCot.orders.detailList[x].bounstotal.acode.join(',');
                    }
                    for (var x = 0; x < ary.length; x++) {
                        var temps = $(ary[x]).find('font');
                        if (tempary[x].indexOf(nAry[a]) > -1) {
                            for (var y = 0; y < temps.length; y++) {
                                // var temp = parseInt(temps[y].innerHTML);
                                if (parseInt(temps[y].innerHTML) == parseInt(nAry[a])) {
                                    temps[y].classList.add('syn_cm_parta_am');
                                    break;
                                }
                            }
                        }
                    }
                    if (times == 5) {
                        //$scope.endShow();//奖金计算
                        // $scope.downtimes($scope.KJdowntime);
                        $scope.lotterytype = true;
                        $scope.payload = '';
                        $scope.openhinttxt = '开奖完成';
                        $scope.mynumlist = true;//我的投注号码-展开
                        $scope.mytext = '手动选号';
                        $timeout(function () {
                            $scope.syyjdowntimeleft = false;
                        },5000)
                    }
                    return false;
                }, 800 + tAry[a])
                $timeout(function () {
                    $('.stc_ball').hide();
                    $("#" + bAry[a]).show();
                    $timeout(function () {
                        $("#" + bAry[a]).css('left', dAry[a]);
                    }, 50)
                }, 800);
            }
        }
        $scope.endShow = function () {
            var cot = 0;
            for (var x in $scope.alCot.now.detailList) {
                cot += $scope.alCot.now.detailList[x].bounstotal.amoney * $scope.alCot.now.detailList[x].bdouble;
            }
            console.log(cot)
            // $scope.endingshow = true;
            // if (notbet) {
            //   if (cot > 0) {
            //     $scope.endwin = {
            //       pid: pid,
            //       amoney: cot
            //     }
            //     $scope.endresult = true;
            //   } else {
            //     $scope.endresult = false;
            //   }
            // } else {
            //   $scope.endnobet = true;
            // }
        }

        // 下拉加载
        $scope.syn_distance = true;
        $scope.loadMore = function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.listprize = function (a) {
            if (a) {
                return a.replace(/\,/g, ' ')
            }
        }
        //中奖判断
        $scope.amoneycot = function (a, f, m) {
            //console.log(a,f)
            var b = parseInt(a);
            if (b > 0) {
                return '奖金' + a + '元'
            } else if (b == 0 && f != '') {
                return '未中奖';
            } else {
                return ' ';
            }
        }
        //热门号码

        $scope.hotball = function () {
            var myhotdate = {
                token: UserInfo.l.token,
                type: playtype,
            }
            HttpServer.Hpost(myhotdate, '/trade/hotball').then(function (data) {
                if (data.status == 1) {
                    $scope.numbers = data.data.numbers.split(",");
                    var hotSum = data.data.hotSum.split(",");
                    $scope.hotSum = hotSum;
                    var total = 0;
                    var maxnum = 0;
                    for (var i = 0; i < hotSum.length; i++) {
                        total -= -hotSum[i];
                        if (parseInt(hotSum[i]) > parseInt(maxnum)) {
                            maxnum = hotSum[i];
                        }
                    }
                    var rate = total / maxnum - 1;
                    //console.log(total,maxnum,rate)
                    $scope.scale = [];
                    for (var j = 0; j < hotSum.length; j++) {
                        var scale = hotSum[j] / total;
                        $scope.scale.push(scale.toFixed(2) * 100 * rate);
                    }
                }
                //console.log($scope.numbers)
            })
        }
        $scope.hotball();

        $scope.tendoff = function () {
            $scope.tendshows = false;
        }
        /**
         *冷门热门投注
         * @param playid 自定义玩法id
         * @param numarr 热门号码数组
         * @param h 冷--0  热--1
         */
        $scope.coldhotbet = function (playid, numarr, h) {
            var strarr = syxw.syxwint(playid);
            $scope.Random(strarr.syxw, algorithm.syxwhotbet(numarr, strarr.rx, h));
        }
        //syxw.bounstotal();//金额奖金计算

        //倍数输入
        $scope.doblur = function () {
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
        $scope.dochange = function () {
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
        //总投注计算
        $scope.total = function () {
            $scope.data.doublecount = $scope.Infodata.doublecount;
            $scope.data.qs = $scope.Infodata.qs;
            $scope.data.betcount = $scope.gamesession;
            $scope.data.money = 2 * $scope.data.betcount * $scope.data.doublecount * $scope.data.qs;
        }
        //倍数加
        $scope.add = function (i) {
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
        //倍数减少
        $scope.cutdown = function (i) {
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
        //提交投注
        $scope.Confirm = function () {
            //console.log(plsarry);
            $scope.mynumlist = false;
            if ($scope.gamesession <= 0 && plsarry.length == 0 && playid.indexOf('dt') == -1) {
                $scope.Random($scope.playid);
                return false;
            } else if ($scope.gamesession <= 0) {
                showAlertMsg.showMsgFun('温馨提示', '请至少选择一注');
                return false;
            }
            $scope.Coninfo();
        }
        //关闭付款
        $scope.CloseConfirmation = function () {
            $scope.confirmation = false;
        }
        $scope.Infodata = {
            betcount: 0,
            doublecount: 5,
            qs: 1
        }
        //提交订单数据
        $scope.data = {
            betcount: 0,
            doublecount: 1,
            money: 2,
            token: UserInfo.l.token,
            type: 10,
            betjson: '',
            qs: 1
        }
        //生成订单
        $scope.dobill = function (p) {
            $scope.total();
            /*showAlertMsg.showMsgFun('温馨提示', '十一选五暂停销售');
             return false;*/
            if (!$scope.gamesession) {
                showAlertMsg.showMsgFun('温馨提示', '至少选择一注进行投注');
                return false;
            }
            var pl = syxw.handle(p);
            //console.log(pl);
            $scope.data.betjson = $scope.data.qs + '|' + pl;
            PayFlow.bill($scope.data).then(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    $scope.Transactiondata = data.data;
                    var transactiondata = JSON.stringify($scope.Transactiondata);
                    $ionicHistory.clearCache(['user.payment']).then(function() {
                        $state.go('practice.syxwguideb', {
                            paystring: transactiondata,
                            type: $scope.type,
                        });
                    })
                }
            })
        }
        $scope.payment = function () {
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
            /* PayFlow.pay(paydata).then(function(data) {
             HttpStatus.codedispose(data);
             if (data.status == '1') {
             if (data.data.payresult == 2) {
             PayFlow.charge(chargedata);
             }else if (data.data.payresult == 1) {
             UserInfo.remove("jsondatasyxw");
             $state.go('practice.paid', {
             id: data.data.orderid,
             type: "10"
             });
             //$state.go('practice.paid', { id: data.data.orderid,type: '10',palytype:1,backurl: 'practice.syxwhall' });
             }
             }
             })*/
        }

        $scope.Coninfo = function () {
            $scope.mynumlist = false;
            //登录验证
            if (!UserInfo.l.flag) {
                $state.go('user.login', {
                    type: $scope.SYXWtype
                });
                return false;
            }
            $ionicLoading.show({
                content: 'Loading',
                duration: 30000
            });
            $http({
                method: 'post',
                url: ApiEndpoint.url + '/usr/myinfo',
                data: {
                    token: UserInfo.l.token
                },
            }).success(function (data) {
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
                    $scope.dobill(plsdata);
                    return false;
                    //UserInfo.add('jsondatasyxw', jsondatapls);
                    //$scope.rdnums(0);
                } else if (data.status == '100') {
                    $state.go('user.login', {
                        type: $scope.SYXWtype
                    });
                }
            })
        }
        $scope.rdnums = function (a) {
            UserInfo.add('perform', 'yes');
            $state.go('practice.syxwbetting', {
                id: a,
                type: playid,
                lotteryid: playtype,
                rx: rx,
                payluid: payluid
            });
        }

        $scope.backGo = function () {
            //$ionicHistory.goBack();
            if (UserInfo.l.jsondatasyxw || $scope.gamesession) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        UserInfo.remove("jsondatasyxw");
                        $interval.cancel($scope.cleartime);
                        $interval.cancel($scope.Sync);
                        $state.go('tab.hall');
                    } else {
                    }
                });
            } else {
                $interval.cancel($scope.cleartime);
                $state.go('tab.hall');
            }
        }
        $scope.Gohome = function () {
            $state.go('tab.hall');
        }
        $scope.Gosyxwanima = function (x) {
            $state.go('practice.syxwanima', {
                type: 10,
                pid: x.pid
            });
        }
        $scope.subscription = '';
        $timeout(function () {
            console.log('link')
            $scope.subscription = $stomp.subscribe('/topic/notice', function (payload, headers, res) {
                //$scope.payload = payload
                if(payload.data.gid == 10){
                    console.log(payload);
                    $scope.oldpid();
                    $scope.payload = payload;
                }
            });
        }, 3000);

        /* websocket.sockt(ApiEndpoint.url).then(function (data) {
         // $timeout(function() {
         console.log(123123)
         // var data = '01,05,06,09,08';
         /!*  if (pid == data.data.pid && Lotteryoff) {
         Lotteryoff = false;
         $interval.cancel($scope.kjcleartime); //收到开奖号码结束倒计时
         $('.sT_daojishi').hide();
         for (var x in $scope.arrylist) {
         $scope.arrylist[x].bounstotal = syxw.bounstotal($scope.arrylist[x].bdesc, data.data.code);
         }
         $scope.opening(data.data.code.split(","));
         } else {
         return false
         }
         $scope.opening(data.split(","));
         var nAry = [3, 1, 7, 4, 10];//中奖号码*!/
         });*/
        $scope.guidelist = ['01','02','03','04','05','06','07','08','09','10','11'];
        $scope.flowba = function (d) {
            console.log(d[0].pid);
            var tzarr = d[0].acode.split(',');
            var tzpid = d[0].pid;
            $scope.tzarr = tzarr.slice(0,2)
            $timeout(function () {
                $scope.zhuitou('rx2_pt',$scope.tzarr); //选择投注号码
                $scope.gamesession = 1;
            }, 20)
            $scope.nguidea = false;
            $scope.nguideb = true;
            return false
            var i = 1;
            if (d.acode == undefined) {
                i = 1;
            } else {
                if (d.amoney * 1 > 0) {
                    i = 1;
                } else {
                    i = 2;
                }
            }
            $scope.data.doublecount = d.bdouble * i;
            $scope.data.betjson = d.bdesc;
            $scope.data.money = parseInt(d.money) * i;
            $scope.data.betcount = d.bcount;
            $scope.Infodata.doublecount = d.bdouble * i;

            $timeout(function () {
                $scope.gamesession = d.bcount;
            }, 0)
            var r = syxw.resolvebdesc(d.bdesc);
            var strarr = ''; //追投玩法
            for (var i = 0; i < $scope.syn_tempary.length; i++) {
                if ($scope.syn_tempary[i].payid == r.playid) {
                    if ($scope.syn_tempary[i].f.indexOf(r.playtype) != -1) {
                        strarr = $scope.syn_tempary[i]
                        break;
                    }
                }
            }
            $scope.syxwarray.push(strarr.NO + 1)
            $scope.syxwarray = algorithm.unique($scope.syxwarray);
            $scope.syxwarray = $scope.syxwarray.sort(function (a, b) {
                return a - b
            });
            $scope.syxwarrays(strarr.NO + 1);
            //$scope.clsyxwpull(strarr); //页面自动选中
            //return false;
            $timeout(function () {
                $scope.zhuitou(strarr.syxw, r.arr); //选择投注号码
            }, 20)
            $scope.mynumlist = false;
            $scope.mytext = '我的投注';
            $scope.tendshows = false;
        }
        $scope.flowbb = function (d) {
            $state.go('practice.syxwguideb', {
                type: $scope.type,
            });
            return false
            HttpServer.Hpost(d,'/act/kvs/report').then(function (d) {
                $ionicLoading.hide();
                if (data.status == '1') {
                    $state.go('practice.syxwguideb', {
                        type: $scope.type,
                    });
                }
            })
        }

        $scope.$on('$destroy', function () {
            //console.log('页面销毁');
            $('.Soccerhall-playlist').off("touchend", 'ul li');
            $interval.cancel($scope.cleartime);
            $interval.cancel($scope.Sync);
            console.log($scope.subscription)
            if ($scope.subscription) {
                $scope.subscription.unsubscribe();
            }
        })
    }])
    //订单付款-指引
    .controller('syxwguidebCtrl', ['$location','$stateParams','$ionicScrollDelegate','HttpServer','$ionicModal','PayFlow', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'stock', 'UserInfo', 'showAlertMsg', 'HttpStatus', function($location,$stateParams,$ionicScrollDelegate,HttpServer,$ionicModal,PayFlow, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, stock, UserInfo, showAlertMsg, HttpStatus) {
        //$scope.Transactiondata  = JSON.parse($stateParams.paystring);
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
        $scope.goguidec = function () {
            $state.go('practice.syxwguidec', {

            });
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        var path = $location.path();
        console.log($location.search())
        $location.path(path).replace();
    }])
    //十一选五投注成功-指引
    .controller('syxwguidecCtrl', ['$location','browser', 'UserInfo', 'serializeUrl', 'order', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', '$stateParams', function($location,browser, UserInfo, serializeUrl, order, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, $stateParams) {
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
        $scope.goorder = function () {
            $state.go('practice.syxwguidea', { type:10,over:1 });
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
        $scope.Gohome = function() {
            if(type == 10){
                $scope.Goagainpay();
            }else {
                $state.go('tab.hall');
            }
        }
        var path = $location.path();
        console.log(path)
        $location.path(path).replace();
    }])