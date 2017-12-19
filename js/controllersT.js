angular.module('starter.controllersT', [])


//开奖信息列表
    .controller('LotterylistCtrl', ['HttpStatus', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'UserInfo', function (HttpStatus, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, UserInfo) {
        /*var obj = {
         slide: document.querySelector(".slide"),
         slideBox: document.querySelector('.slide-box'),
         sMain: document.querySelectorAll('.sMain'),
         sItem: document.querySelector('.slide-item').querySelectorAll('li'),
         img: document.querySelector('.sMain').querySelectorAll("img"),
         item: 0,
         time: 5000,
         switch: true
         };
         huadong.Slider(obj);*/
        //5445
        $scope.ary = {};
        $scope.dopost = function () {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/resultlist",
                data: {
                    token: UserInfo.l.token || ''
                }
            }).success(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    if (data.data == "") {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        dataProcessing(data.data);
                    }

                }
            }).error(function (data) {
                showAlertMsg.showMsgFun('提示', '网络连接失败！');
            });
        }
        $scope.dopost();
        var dataProcessing = function (ary) {
            for (var i = 0; i < ary.length; i++) {
                $scope.ary[ary[i].gid] = {};
                $scope.ary[ary[i].gid].acode = ary[i].acode.split(',');
                if (ary[i].sjh) {
                    $scope.ary[ary[i].gid].sjh = ary[i].sjh.split(',');
                }

                $scope.ary[ary[i].gid].pid = ary[i].pid;
                $scope.ary[ary[i].gid].atime = ary[i].atime;
            }
        }
        $scope.refreshAry = function () {
            $scope.dopost();
            // $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');

        }
        $scope.goLotteryzq = function (t) {
            $state.go('practice.Lottery', {
                type: t
            });
        }
        $scope.godetails = function (a) {
            $state.go('practice.lot-details', {
                type: a
            });
        }
        $scope.backGo = function () {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function () {
            $state.go('tab.hall');
        }
    }])

    //七星彩 & 排列五
    .controller('lotteryseven', ['showAlertMsg', '$ionicLoading', '$scope', '$stateParams', '$state', 'qxc', 'ApiEndpoint', 'MathRnum', '$http', 'UserInfo', 'PayFlow', 'HttpStatus', '$ionicScrollDelegate', '$ionicPopup', function (showAlertMsg, $ionicLoading, $scope, $stateParams, $state, qxc, ApiEndpoint, MathRnum, $http, UserInfo, PayFlow, HttpStatus, $ionicScrollDelegate, $ionicPopup) {
        var max = 9,
            mix = 0;

        $scope.type = $stateParams.type;
        $scope.postobj = {
            betcount: 1,
            betjson: "",
            doublecount: 1,
            money: 0,
            token: UserInfo.l.token || '',
            type: 3
        }
        if ($scope.type == 5) {
            $scope.nums = 5;
            $scope.typeflag = false;
            $scope.nameary = ["万", "千", "百", "十", "个"];
            $scope.titlehtml = "排列五";
            $scope.postobj.type = 5;
        }
        if ($scope.type == 3) {
            $scope.nums = 7;
            $scope.typeflag = true;

            $scope.titlehtml = "七星彩";
            $scope.postobj.type = 3;
        }

        $http({
            method: 'post',
            url: ApiEndpoint.url + "/trade/lotteryinfo",
            data: {
                token: UserInfo.l.token || '',
                type: $scope.postobj.type
            }
        }).success(function (data) {
            if (data.status == 1) {
                $scope.nOrder = data.data;
                $scope.rAry = data.data.rowsp;
                $scope.ntime = $scope.nOrder.stime.split(",");
                $scope.dispose($scope.rAry[0].acode, data.data.rowsm)
            }
        }).error(function (data) {
            showAlertMsg.showMsgFun('提示', '网络连接失败！');


        });

        // 遗漏值处理
        $scope.dispose = function (a, b) {
            // $scope.nums = 7;
            a = a.split(',');
            b = (b.split(',')).splice(1);
            c = [];
            for (var x = 0; x < a.length; x++) {
                c[x] = b.slice(x * 10, (x + 1) * 10);
                //console.log(c[x])
                for (var y in c[x]) {
                    if (c[x][y] == a[x] && c[x][y] == y) c[x][y] = "0";
                }
            }
            $scope.omit = c;
            $scope.missflag = true;
            // console.log($scope.omit)
        }
        //助手
        $scope.assistants = function (e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', {
                        type: $scope.type
                    });
                    break;
                case 2:
                    $state.go('practice.play-About', {
                        type: $scope.type
                    });
                    break;
                case 3:
                    $state.go('practice.lot-details', {
                        type: $scope.type
                    });
                    break;
                default:
                    break;
            }
            $scope.assistantShow = !$scope.assistantShow;
        }
        $scope.choosenums = false;
        $scope.flag = false; //投注是否正常
        $scope.aryb = [];
        $scope.ary = [];
        $scope.missflag = true;


        $scope.assistantShow = false;
        $scope.cathNum = 1; //追期数
        $scope.playWay = 1; //玩法方式
        $scope.betWat = 1; //投注方式


        $scope.arys = new Array;
        for (var i = 0; i < 9; i++) {
            $scope.arys[i] = i;
            $scope.arys[i] = new Array;
            $scope.arys[i] = MathRnum.repeatNum(9, $scope.nums);
        }
        for (var i = mix; i <= max; i++) $scope.aryb.push(i);
        for (var i = mix; i <= $scope.nums - 1; i++) $scope.ary[i] = [];

        // 数字点击反馈
        $scope.tempfalg = true;
        $scope.sar = function (a, b) {
            var c = a * 10 + b;
            if ($scope.tempfalg) {
                $('.sccl-r li .temp_li').eq(c).toggleClass("a_class");
                var flag = $('.sccl-r li .temp_li').eq(c).hasClass('a_class');
                if (!flag) {
                    $scope.ary[a].splice($scope.ary[a].indexOf(b), 1);
                } else if ($scope.ary[a] == undefined) {
                    $scope.ary[a] = [];
                    $scope.ary[a][0] = b;
                } else {
                    $scope.ary[a].push(b);
                }
                $scope.statuValue($scope.ary);
            }
        }
        // 数字点击 离开
        $scope.fangdahidea = function (a, b) {
            var c = a * 10 + b;
            $('.sccl-r li .temp_li .scclr-big').eq(c).hide();
            $scope.sar(a, b)
        }
        // 数字点击 滑动
        $scope.fangdahideb = function (a, b) {
            var c = a * 10 + b;
            $('.sccl-r li .temp_li .scclr-big').eq(c).hide();
            $scope.tempfalg = false;
        }
        // 数字点击 点击
        $scope.numclick = function (a, b) {
            var c = a * 10 + b;
            // console.log(a,b)
            $('.sccl-r li .temp_li .scclr-big').eq(c).show();
            $scope.tempfalg = true;
        }
        // 状态值
        $scope.statuValue = function (ary) {
            var ns = qxc.countNuma(ary);
            if (ns != "") $scope.flag = true;
            else $scope.flag = false;

            $scope.ending = ns;
        }
        //摇一摇
        $scope.shake = function () {
            $('.sccl-r li .temp_li').removeClass("a_class");
            var reary = MathRnum.repeatNum(max, $scope.nums);
            for (var x in reary) {
                $scope.ary[x] = [];
                $scope.ary[x].push(reary[x]);
                m = reary[x] + x * 10;
                $('.sccl-r li .temp_li').eq(m).addClass("a_class");
            }
            $scope.statuValue($scope.ary);
        }
        // 返回
        $scope.assistant = function () {
            $scope.assistantShow = !$scope.assistantShow;
        }
        $scope.backGo = function () {
            var history = window.localStorage.historybet;
            if (history != undefined) {
                var tempary = JSON.parse(history)
                //console.log(tempary)
            }

            if ((history == undefined || tempary.nums == "") && $scope.flag == false) {
                $state.go('tab.hall');
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        window.localStorage.removeItem("historybet");
                        $state.go('tab.hall');
                    } else {
                    }
                });
            }
        }
        $scope.randomss = function () {
            $scope.choosenums = !$scope.choosenums;
        }
        // 选择清除
        $scope.deleteary = function () {
            $('.sccl-r li .temp_li').removeClass("a_class");
            for (var i = mix; i <= $scope.nums - 1; i++) $scope.ary[i] = [];
            $scope.flag = false;
        }
        // 切换 （下拉）
        $scope.cotchange = function () {
            $('.seven-cot').toggleClass('s-cot-t');
            $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
            $('.sch-f-a').toggleClass('schf-a-top');
        }
        /*            //  上滚
         $scope.scrollup = function() {
         $('.seven-cot').removeClass('s-cot-t');
         $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i')
         $('.sch-f-a').removeClass('schf-a-top');
         // $ionicScrollDelegate.scrollTop()
         //助手
         }
         //  下滚
         $scope.scrolldown = function() {
         var obj = $ionicScrollDelegate.getScrollPosition();
         if (obj.top == 0) {
         $('.seven-cot').addClass('s-cot-t');
         $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
         $('.sch-f-a').addClass('schf-a-top');
         }
         }*/
        // 遗漏miss
        $scope.miss = function () {
            $scope.missflag = false;
        }
        // 走势图链接
        $scope.zstopen = function () {
            $state.go('practice.trendchar', {
                type: $scope.postobj.type
            });
        }
        // 请求发送
        $scope.postget = function () {
            if (!$scope.flag) {
                //console.log(1111)
                $scope.shake();
                return true
            } else if ($scope.flag) {
                $scope.postobj.betjson = "1|" + qxc.Mosaicchar($scope.ary);
                $scope.postobj.money = qxc.countNuma($scope.ary) * 2;
                var obj = {
                    type: $scope.postobj.type,
                    nums: $scope.ary
                }
                window.localStorage.qxcjson = JSON.stringify(obj);
                $scope.Confirm();
            }
        }

        $scope.Confirm = function () {
            //登录验证
            if (!UserInfo.l.flag) {
                $state.go('user.login', {
                    type: $scope.type
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
                    if ($scope.ending > 10000) {
                        showAlertMsg.showMsgFun('提示', '单个投注方案不能超过10000注!');
                        return false;
                    }
                    UserInfo.save(data.data);
                    $state.go('betinfo.newBet', {
                        type: $scope.type
                    });
                } else if (data.status == '100') {
                    $state.go('user.login', {
                        type: $scope.type
                    });
                }
            })
        }
        // 机选注数
        $scope.rdnums = function (a) {
            window.localStorage.removeItem("jxfalg");
            $scope.choosenums = !$scope.choosenums;
            $state.go('betinfo.newBet', {
                type: $scope.postobj.type,
                nums: a
            });

        }
    }])
    //大乐透 & 双色球 & 七乐彩
    .controller('lotterysuper', ['prompts', 'HttpStatus', '$ionicLoading', 'showAlertMsg', '$scope', '$stateParams', '$state', 'qxc', 'ApiEndpoint', 'MathRnum', '$http', 'UserInfo', 'PayFlow', 'HttpStatus', '$ionicScrollDelegate', 'cAp', '$ionicPopup', function (prompts, HttpStatus, $ionicLoading, showAlertMsg, $scope, $stateParams, $state, qxc, ApiEndpoint, MathRnum, $http, UserInfo, PayFlow, HttpStatus, $ionicScrollDelegate, cAp, $ionicPopup) {
        $scope.Bankerbetflag = false;
        $scope.title = "普通投注"; //  玩法类
        $scope.ShlistHeght = false; //  弹出框状态
        $scope.chooseflag = false;
        $scope.superflag = $stateParams.flag;
        if ($scope.superflag == "true") {
            $scope.Bankerbetflag = true;
            $scope.title = "胆拖投注";
            $scope.chooseflag = true;
        }
        $scope.postobj = {
            betcount: 1, //投注数
            betjson: "", //彩种ID对应的投注描述
            doublecount: 1, //翻倍数
            money: 0, //投注金额
            token: UserInfo.l.token || '', //用户令牌
            type: 6 //彩种类型
        };
        $scope.postobj.type = $stateParams.type;

        if ($scope.postobj.type == 6) {
            $scope.max = 35;
            $scope.numsa = 5;
            $scope.min = 12;
            $scope.numsb = 2;
            $scope.lotcot = "大乐透";
            $scope.scot = "请至少选择5个红球,2个蓝球";
        }
        if ($scope.postobj.type == 11) {
            $scope.max = 33;
            $scope.numsa = 6;
            $scope.min = 16;
            $scope.numsb = 1;
            $scope.lotcot = "双色球";
            $scope.scot = "请至少选择6个红球,1个蓝球";
        }
        if ($scope.postobj.type == 12) {
            $scope.max = 30;
            $scope.numsa = 7;
            $scope.min = 0;
            $scope.numsb = 0;
            $scope.lotcot = "七乐彩";
            $scope.scot = "请至少选择7个号码";
        }

        $scope.choosenums = false;
        $scope.arya = [];
        $scope.aryb = [];
        $scope.ary = [];
        for (var i = 0; i <= 3; i++) {
            $scope.ary[i] = [];
        }

        $scope.assistantShow = false;
        $scope.cathNum = 1; //追期数
        $scope.playWay = 1; //玩法方式

        $scope.arys = new Array;
        for (var i = 0; i < 9; i++) {
            $scope.arys[i] = new Array;
            $scope.arys[i][0] = MathRnum.norepeatNum($scope.max, $scope.numsa, 1).sort(function (a, b) {
                return a - b;
            });
            if ($scope.min != 0) {
                $scope.arys[i][1] = MathRnum.norepeatNum($scope.min, $scope.numsb, 1).sort(function (a, b) {
                    return a - b;
                });
            }
        }
        // 数字 变两位
        Prefix = function (num) {
            return (Array(2).join(0) + num).slice(-2);
        }
        for (var i = 1; i <= $scope.max; i++) $scope.arya.push(Prefix(i));
        for (var i = 1; i <= $scope.min; i++) $scope.aryb.push(Prefix(i));

        $http({
            method: 'post',
            url: ApiEndpoint.url + "/trade/lotteryinfo",
            data: {
                token: UserInfo.l.token || '',
                type: $scope.postobj.type
            }
        }).success(function (data) {
            if (data.status == 1) {
                $scope.nOrder = data.data;
                $scope.rAry = data.data.rowsp;
                $scope.ntime = $scope.nOrder.stime.split(",");
                $scope.dispose($scope.rAry[0].acode, data.data.rowsm)
            }
        }).error(function (data) {
            showAlertMsg.showMsgFun('提示', '网络连接失败！', '');
        });
        $scope.Shlistlist = function (a) {
            if (a) {
                $scope.Bankerbetflag = true;
                $scope.title = "胆拖投注";
            } else {
                $scope.Bankerbetflag = false;
                $scope.title = "普通投注";
            }
            $scope.ending = undefined;
            if ($scope.Bankerbetflag) $scope.chooseflag = true;
            else $scope.chooseflag = false;
        }
        $scope.Shlist = function (a) {
            $scope.ShlistHeght = !$scope.ShlistHeght;
        }

        // 遗漏值处理
        $scope.dispose = function (a, b) {
            // $scope.nums = 7;

            a = a.split(',');
            if ($scope.postobj.type == 12) {
                a = a.splice(0, 7)
            }
            b = (b.split(',')).splice(1);
            $scope.omit = {};
            $scope.omit.a = b.slice(0, $scope.max);
            for (var x in $scope.omit.a) {
                for (var y in a) {
                    if (a[y] * 1 == $scope.omit.a[x] * 1 && $scope.omit.a[x] * 1 == x * 1 + 1) $scope.omit.a[x] = "0";
                }
            }

            if ($scope.min != 0) {
                $scope.omit.b = b.slice($scope.max, $scope.max + $scope.min);
                for (var x in $scope.omit.b) {
                    if ((a[a.length - 1] * 1 == $scope.omit.b[x] * 1 || a[a.length - 2] * 1 == $scope.omit.b[x] * 1) && $scope.omit.b[x] * 1 == x * 1 + 1 && $scope.postobj.type == 6) $scope.omit.b[x] = "0";
                    if (a[a.length - 1] * 1 == $scope.omit.b[x] * 1 && $scope.omit.b[x] * 1 == x * 1 + 1 && $scope.postobj.type == 11) $scope.omit.b[x] = "0";
                }
            }

            $scope.missflag = true;
            //console.log($scope.omit)
        }

        //结果计算
        $scope.resultcal = function () {
            if ($scope.Bankerbetflag) {
                // console.log($scope.ary)
                var a = $scope.ary[0].length = undefined ? 0 : $scope.ary[0].length;
                var b = $scope.ary[1].length = undefined ? 0 : $scope.ary[1].length;
                var c = $scope.ary[2].length = undefined ? 0 : $scope.ary[2].length;
                var d = $scope.ary[3].length = undefined ? 0 : $scope.ary[3].length;
                if (a >= 1 && a <= 4 && c >= 2 && b <= 1 && d >= 2 && a + c >= 6 && $scope.postobj.type == 6) {
                    $scope.ending = cAp.comNumber(c, $scope.numsa - a) * cAp.comNumber(d, $scope.numsb - b);
                } else if (a >= 1 && a <= 5 && c >= 2 && b >= 1 && a + c >= 7 && $scope.postobj.type == 11) {
                    $scope.ending = cAp.comNumber(c, $scope.numsa - a) * cAp.comNumber(b, 1);
                } else if (a >= 1 && a <= 6 && c >= 2 && a + c >= 8 && $scope.postobj.type == 12) {
                    $scope.ending = cAp.comNumber(c, $scope.numsa - a);
                } else $scope.ending = undefined;

            } else {
                $scope.ary[0] = [];
                $scope.ary[1] = []
                for (var m = 0; m < $scope.max; m++) {
                    var flag = $('.slc-ca li .temp_li').eq(m).hasClass('a_class');
                    if (flag) $scope.ary[0].push(m + 1);
                }
                for (var m = $scope.max; m <= $scope.max + $scope.min; m++) {
                    var flag = $('.slc-ca li .temp_li').eq(m).hasClass('sc-activeb');
                    if (flag) $scope.ary[1].push(m - $scope.max + 1);
                }
                var m = $scope.ary[0].length;
                var n = $scope.ary[1].length;
                if (m >= $scope.numsa && n >= $scope.numsb) $scope.ending = cAp.comNumber(m, $scope.numsa) * cAp.comNumber(n, $scope.numsb);
                else $scope.ending = undefined;
            }
            if ($scope.ary[0] != '' || $scope.ary[1] != '') $scope.chooseflag = true;
            else if ($scope.Bankerbetflag) $scope.chooseflag = true;
            else $scope.chooseflag = false;

        }
        // 机选&清除
        $scope.choose = function (a) {
            if (a == 0) {
                if ($scope.ending != undefined) return true;
                if ($scope.Bankerbetflag == true) return false;
            }
            if (a == 1) {
                if ($scope.Bankerbetflag == true) return true;

            }
        }

        // 数字点击反馈
        $scope.feedback = function (a, b, c, e) {
            a = parseInt(a);
            if ($scope.tempfalg) {
                if ($scope.Bankerbetflag) {
                    if (b == 0) {
                        if (c == 0 && ($scope.ary[0].length < $scope.numsa - 1 || $scope.ary[0].indexOf(a) >= 0)) {
                            var b = a + $scope.max - 1;
                            var flag = $('.temp_lia').eq(b).hasClass("a_class");
                            if (flag) {
                                $('.temp_lia').eq(b).toggleClass("a_class");
                            }
                            $(e).toggleClass("a_class");
                        }
                        if (c == 1) {
                            var b = a - 1;
                            var flag = $('.temp_lia').eq(b).hasClass("a_class");
                            if (flag) {
                                $('.temp_lia').eq(b).toggleClass("a_class");
                            }
                            $(e).toggleClass("a_class");
                        }

                        for (var i = 0; i <= 2; i += 2) {
                            $scope.ary[i] = [];
                            for (var m = 0; m <= $scope.max - 1; m++) {
                                var temp = m + ($scope.max * i) / 2;
                                var flag = $('.temp_lia ').eq(temp).hasClass('a_class');
                                if (flag) $scope.ary[i].push(m + 1);
                            }
                        }

                    } else {
                        if (c == 0 && ($scope.ary[1].length < 1 || $scope.ary[1].indexOf(a) >= 0) && $scope.postobj.type == 6) {
                            var b = a + $scope.min;
                            var flag = $('.temp_lib').eq(b).hasClass("sc-activeb");
                            if (flag) {
                                $('.temp_lib').eq(b).toggleClass("sc-activeb");
                            }
                            $(e).toggleClass("sc-activeb");
                        }
                        if (c == 0 && $scope.postobj.type == 11) {
                            $(e).toggleClass("sc-activeb");
                        }
                        if (c == 1) {
                            var b = a - 1;
                            var flag = $('.temp_lib').eq(b).hasClass("sc-activeb");
                            if (flag) {
                                $('.temp_lib').eq(b).toggleClass("sc-activeb");
                            }
                            $(e).toggleClass("sc-activeb");
                        }
                        if ($scope.postobj.type == 6) {
                            for (var i = 1; i <= 3; i += 2) {
                                $scope.ary[i] = [];
                                for (var n = 0; n <= $scope.min - 1; n++) {
                                    var temp = n + (6 * (i - 1));
                                    var flag = $('.temp_lib').eq(temp).hasClass("sc-activeb");
                                    if (flag) $scope.ary[i].push(n + 1);
                                }
                            }
                        } else {
                            $scope.ary[1] = [];
                            for (var n = 0; n < $scope.min; n++) {
                                var flag = $('.temp_lib').eq(n).hasClass("sc-activeb");
                                if (flag) $scope.ary[1].push(n + 1);
                            }
                        }


                    }
                    $scope.resultcal();
                } else {
                    if (c == 1) $(e).toggleClass("sc-activeb");
                    else $(e).toggleClass("a_class");
                    //  calculate the result
                    $scope.resultcal();
                }
                if ($scope.Bankerbetflag) {
                    $scope.playWay = 5;
                } else if ($scope.ending > 1) {
                    $scope.playWay = 2;
                } else {
                    $scope.playWay = 1;
                }
            }
        }
        // 数字点击 离开
        $scope.fangdahidea = function (a, b, c, e) {
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.feedback(a, b, c, e)
        }
        // 数字点击 滑动
        $scope.fangdahideb = function (e) {
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.tempfalg = false;
        }
        // 数字点击 点击
        $scope.numclick = function (a, b, c) {
            e = event.target;
            $(e).find('.scclr-big').show();
            $scope.tempfalg = true;
        }


        // 摇一摇
        $scope.shake = function () {
            $('.slc-ca li .temp_li').removeClass("a_class").removeClass("sc-activeb");
            var redary = MathRnum.norepeatNum($scope.max, $scope.numsa, 1);
            $scope.ary[0] = [];
            for (var x in redary) {
                $scope.ary[0].push(redary[x]);
                m = redary[x] - 1;
                $('.slc-ca li .temp_li').eq(m).addClass("a_class");
            }
            if ($scope.min != 0) {
                $scope.ary[1] = [];
                var lanary = MathRnum.norepeatNum($scope.min, $scope.numsb, 1);
                for (var x in lanary) {
                    $scope.ary[1].push(lanary[x]);
                    m = lanary[x] - 1 + $scope.max;
                    $('.slc-ca li .temp_li').eq(m).addClass("sc-activeb");
                }
            }

            $scope.tempfalg = true;
            $scope.feedback();
        }
        // 助手隐藏
        $scope.assistant = function () {
            $scope.assistantShow = !$scope.assistantShow;
        }
        // 返回
        $scope.backGo = function () {

            var history = window.localStorage.historybet;
            if (history != undefined) {
                var tempary = JSON.parse(history)
            }
            if ((history == undefined || tempary.nums == "") && $scope.ending == undefined) {
                $state.go('tab.hall');
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        window.localStorage.removeItem("historybet");
                        $state.go('tab.hall');
                    } else {
                    }
                });
            }
        }
        // 助手
        $scope.assistant = function (e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', {
                        type: $scope.postobj.type
                    });
                    break;
                case 2:
                    $state.go('practice.play-About', {
                        type: $scope.postobj.type
                    });
                    break;
                case 3:
                    $state.go('practice.lot-details', {
                        type: $scope.postobj.type
                    });
                    break;
                default:
                    break;
            }
            $scope.assistantShow = !$scope.assistantShow;
        }
        // 机选
        $scope.randomss = function () {
            $scope.choosenums = !$scope.choosenums;
        }
        // 选择清除
        $scope.deleteary = function () {
            $('.slc-ca li div').removeClass("a_class").removeClass("sc-activeb");
            for (var i = 0; i <= $scope.ary.length - 1; i++) $scope.ary[i] = [];
            $scope.ending = undefined;
            if ($scope.Bankerbetflag) $scope.chooseflag = true;
            else $scope.chooseflag = false;
        }

        // 切换 （下拉）
        $scope.cotchange = function () {
            $('.seven-cot').toggleClass('s-cot-t');
            $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
            $('.sch-f-a').toggleClass('schf-a-top');
        }
        //  上滚
        // $scope.scrollup = function() {
        //         $('.seven-cot').removeClass('s-cot-t');
        //         $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i')
        //         $('.sch-f-a').removeClass('schf-a-top');
        //         // $ionicScrollDelegate.scrollTop()
        //      }
        //     //  下滚
        // $scope.scrolldown = function() {
        //     var obj = $ionicScrollDelegate.getScrollPosition();
        //     if (obj.top == 0) {
        //         $('.seven-cot').addClass('s-cot-t');
        //         $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
        //         $('.sch-f-a').addClass('schf-a-top');
        //     }
        //  }
        // 走势图链接
        $scope.zstopen = function () {
            $state.go('practice.supertrend', {
                type: $scope.postobj.type
            });
        }

        //  字符串
        $scope.addmacs = function (ary) {
            var str = "";
            var tempary = [];
            for (var x in ary) {
                if (ary[x].length > 0) {
                    tempary[x] = ary[x].join(",");
                }
            }
            if ($scope.Bankerbetflag) {
                if (tempary[1] === undefined && tempary[3] == undefined) {
                    return tempary[0] + "$" + tempary[2];
                } else if (tempary[1] === undefined) {
                    return tempary[0] + "$" + tempary[2] + "@$" + tempary[3];
                } else if (tempary[3] == undefined) {
                    return tempary[0] + "$" + tempary[2] + "@" + tempary[1];
                } else {
                    return tempary[0] + "$" + tempary[2] + "@" + tempary[1] + "$" + tempary[3];
                }
            } else {
                if (tempary[1] == undefined) {
                    return tempary[0];
                } else return tempary[0] + "@" + tempary[1];
            }
        }
        // 请求发送
        $scope.postget = function () {
            // console.log($scope.postobj.type, $scope.Bankerbetflag)
            // if ($scope.postobj.type != 6) {
            //     showAlertMsg.showMsgFun('提示', "该彩种  暂停销售");
            //     return true
            // }
            if (!$scope.Bankerbetflag) {
                if ($scope.ary[0].length == 0 && $scope.ary[1].length == 0) {
                    $scope.shake();
                    return true
                }
                var texts = prompts.textord($scope.postobj.type, $scope.ary);

                if (texts != "") {
                    showAlertMsg.showMsgFun('提示', texts, 'PostAddUser');
                    return true
                }
            } else {
                if ($scope.ending == undefined) {
                    var texts = prompts.textdan($scope.postobj.type, $scope.ary);
                    showAlertMsg.showMsgFun('提示', texts, 'PostAddUser');
                    return false;
                }
            }

            if ($scope.ending != undefined) {
                var temp = $scope.addmacs($scope.ary);
                $scope.feedback();
                $scope.postobj.betjson = "1|" + temp + ":1:" + $scope.playWay + ";";
                $scope.postobj.money = $scope.ending * 2;
                if (!$scope.Bankerbetflag) {
                    $scope.ary.splice(2, 2);
                }
                var obj = {
                    type: $scope.postobj.type,
                    nums: $scope.ary
                }
                window.localStorage.qxcjson = JSON.stringify(obj);
                $scope.Confirm();
            }
        }
        //登录验证
        $scope.Confirm = function () {
            if (!UserInfo.l.flag) {
                $state.go('user.login', {
                    type: $scope.postobj.type
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
                    UserInfo.save(data.data);
                    if ($scope.ending > 10000) {
                        showAlertMsg.showMsgFun('提示', '单个投注方案不能超过10000注!');
                        return false;
                    }
                    $state.go('betinfo.newBet', {
                        type: $scope.postobj.type,
                        id: $scope.Bankerbetflag
                    });
                } else if (data.status == '100') {
                    $state.go('user.login', {
                        type: $scope.postobj.type
                    });
                }
            })
        }
        // 机选注数
        $scope.rdnums = function (a) {
            window.localStorage.removeItem("jxfalg");
            $state.go('betinfo.newBet', {
                type: $scope.postobj.type,
                nums: a,
                id: $scope.Bankerbetflag
            });
            $scope.choosenums = !$scope.choosenums;
        }
    }])
    // 走势图（排列五/七星彩/排列三/福彩3D）
    .controller('trendchar', ['$ionicLoading', '$timeout', 'Trend', '$scope', '$state', '$stateParams', '$ionicSlideBoxDelegate', 'MathRnum', '$http', 'ApiEndpoint', 'UserInfo', 'PayFlow', 'HttpStatus', function ($ionicLoading, $timeout, Trend, $scope, $state, $stateParams, $ionicSlideBoxDelegate, MathRnum, $http, ApiEndpoint, UserInfo, PayFlow, HttpStatus) {
        $scope.aryb = [];
        $scope.aryindex = 0;
        $scope.type = $stateParams.type;
        $scope.falg = true;
        $scope.Elevenflag = false;
        $scope.threeflag = false;
        $scope.assistantShow = false; //  设置
        var max = 9;
        var middlenums = 4;
        var min = 0;
        $scope.tempfalg = false;
        $scope.pagebfalg = false;
        $scope.pagecfalg = false;
        $scope.corner = "{{y}}<i>2<i>";
        $scope.corners = "{{y}}";
        switch (parseInt($scope.type)) {
            case 3:
                nums = 7;
                $scope.counts = 7;
                $scope.titlehtml = "七星彩";
                break;
            case 4:
                nums = 3;
                $scope.titlehtml = "排列三";
                $scope.falg = false;
                $scope.threeflag = true;
                break;
            case 13:
                nums = 3;
                $scope.titlehtml = "福彩3D";
                $scope.falg = false;
                $scope.threeflag = true;
                break;
            case 5:
                nums = 5;
                $scope.counts = 5;
                $scope.titlehtml = "排列五";
                break;
            case 7:
                $scope.titlehtml = "江西11选5";
                break;
            case 8:
                $scope.titlehtml = "山东11选5";
                break;
            case 9:
                $scope.titlehtml = "上海11选5";
                break;
            case 10:
                $scope.titlehtml = "浙江11选5";
                break;
            case 20:
                $scope.titlehtml = "山西11选5";
                break;
        }

        if ($scope.type >= 7 && $scope.type <= 10 || $scope.type == 20) {
            nums = 5;
            max = 11;
            $scope.counts = 5;
            middlenums = 5;
            min = 1;
            $scope.Elevenflag = true;
            $scope.falg = false;
        }

        $scope.listnum = 30; //  统计期数
        $scope.countflag = true; //  统计状态
        $scope.aryorder = false; //  正序逆序
        var _tempObj = new Object;

        $scope.doPost = function (order) {
            $ionicLoading.show({
                content: 'Loading',
                duration: 30000
            })
            var obj = {
                count: $scope.listnum,
                token: UserInfo.l.token || '',
                type: $scope.type
            }
            Trend.trends(obj).then(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    dataProcessing(data.data, order);

                }
            })
        }

        var dataProcessing = function (a, b) {
            $scope.u = a.acodes; //期次
            $scope.alls = a.acodes; //中奖号码、期次、大小比、奇偶比等等...
            $scope.y = a.yltj; //遗漏统计

            $scope.ylz = []; //遗漏统计
            $scope.a = []; //中奖号码

            for (var x in a.yltj.ylcode) {
                $scope.ylz[x] = arrayMp(a.yltj.ylcode[x]);
                $scope.a[x] = a.acodes[x].acode.split(',');
            }

            $scope.cxs = arrayMp(a.yltj.cxcs); //出现次数
            $scope.jyl = arrayMp(a.yltj.pjyl); //平均遗漏
            $scope.zyl = arrayMp(a.yltj.zdyl); //最大遗漏
            $scope.zlc = arrayMp(a.yltj.zdlc); //最大连出

            $scope.allscp = $.extend(true, [], $scope.alls);
            $scope.ylcp = $.extend(true, [], $scope.ylz);
            $scope.acp = $.extend(true, [], $scope.a);

            if (b == undefined) {
                if ($scope.aryorder == false) {
                    $scope.a = $scope.a.reverse();
                    $scope.acp = $scope.acp.reverse();
                    $scope.allscp = $scope.allscp.reverse();
                    $scope.ylcp = $scope.ylcp.reverse();
                }
            }
            if (b == false) {
                $scope.a = $scope.a.reverse();
                $scope.acp = $scope.acp.reverse();
                $scope.allscp = $scope.allscp.reverse();
                $scope.ylcp = $scope.ylcp.reverse();
            }
        }

        var arrayMp = function (a) {
            var b = [];
            a = a.split(',').slice(1);
            var cot = max - min + 1;
            if ($scope.type == 4 || $scope.type == 13 || ($scope.type >= 7 && $scope.type <= 10) || $scope.type == 20) {
                b.str = a.slice(0, cot);
                a = a.slice(cot);
            }
            for (var i = 0; i < nums; i++) {
                b[i] = [];
                b[i] = a.slice(i * cot, (i + 1) * cot);
            }
            return b;
        }

        $scope.addCorner = function (a, b) {
            var m = 0;
            for (var x in a) {
                if (parseInt(a[x]) == $scope.aryb[b]) m++;
            }
            return m;
        }
        for (var i = min; i <= max; i++) $scope.aryb.push(i); //期号 (0-9)(1-11)
        // 角标状态判断 a
        $scope.checkst = function (a, b, flag) {

            var m = 0;

            for (var x in a) {
                if (parseInt(a[x]) == $scope.aryb[b]) m++;
            }
            if (m == 0) return false;
            if (m == 1 && flag != undefined) return false;
            else return true;
        }

        $scope.listcheck = function (a, b) {
            if (a == $scope.aryb[b]) return true;
            else return false;
        }
        // slide 页面切换
        $scope.afalg = 0;
        $scope.pagechange = function (a) {
            if ($scope.falg) {
                if (a == 1) {
                    $scope.pagebfalg = true;
                }
            }
            if (!$scope.falg) {
                if (a == 1) {
                    $scope.pagecfalg = true;
                    $scope.tempfalg = true;
                }
                if (a == 2) {
                    $scope.pagebfalg = true;
                }
            }
            $scope.afalg = a;
            $ionicSlideBoxDelegate.slide(a);
        }
        $scope.slidechange = function (a) {
            $scope.pagechange(a);
        }

        // 走势图 位数点击效果
        $scope.zsfalg = 0;
        $scope.zstx = function (a) {
            $scope.zsfalg = a;
            $scope.aryindex = a;
        }
        // 设置弹出状态
        $scope.choosebox = function () {
            $scope.assistantShow = true;
        }

        _tempObj.listnum = $scope.listnum;
        _tempObj.aryorder = $scope.aryorder;
        _tempObj.countflag = $scope.countflag;

        //  弹出框 选择事件
        $scope.flagsa = 30;
        $scope.flagsb = false;
        $scope.flagsc = true;
        $scope.chooseevent = function (a, b) {
            if (a == 0) { // 期数
                $scope.flagsa = b;
                _tempObj.listnum = parseInt($scope.flagsa);
            }
            if (a == 1) { //顺序
                $scope.flagsb = b;
                _tempObj.aryorder = $scope.flagsb;
            }
            if (a == 2) { // 统计状态
                $scope.flagsc = b;
                _tempObj.countflag = $scope.flagsc;
            }
            if (a == 3) {
                if (b) {
                    if ($scope.countflag != _tempObj.countflag) {
                        $scope.countflag = _tempObj.countflag;
                    }
                    if ($scope.listnum != _tempObj.listnum) {
                        $scope.listnum = _tempObj.listnum;
                        $scope.aryorder = _tempObj.aryorder;
                        $scope.doPost(_tempObj.aryorder);
                        $scope.assistantShow = false;
                        return false;
                    }
                    if ($scope.aryorder != _tempObj.aryorder) {
                        $scope.aryorder = _tempObj.aryorder;
                        $scope.a = $scope.a.reverse();
                        $scope.acp = $scope.acp.reverse();
                        $scope.allscp = $scope.allscp.reverse();
                        $scope.ylcp = $scope.ylcp.reverse();
                    }
                } else {
                    $scope.flagsa = $scope.listnum;
                    $scope.flagsb = $scope.aryorder;
                    $scope.flagsc = $scope.countflag;
                    _tempObj.listnum = $scope.listnum;
                    _tempObj.aryorder = $scope.aryorder;
                    _tempObj.countflag = $scope.countflag;
                }
                $scope.assistantShow = false;
            }
        }
        // 首页
        $scope.Gohome = function () {
            $state.go('tab.hall');
        }
        //  返回
        $scope.backGo = function () {
            window.history.go(-1);
        }
        $scope.load = function ($last) {
            if ($last) {
                //console.log(111, $last)
            }
        }


        $scope.$on('$ionicView.beforeEnter', function () {
            $timeout(function () {
                $scope.doPost();
                /* $timeout(function(){
                 if($scope.falg){
                 $scope.pagebfalg=true;
                 }

                 if(!$scope.falg){
                 $scope.pagecfalg=true;
                 $scope.pagebfalg=true;
                 }
                 },1000)*/
            }, 500)
        });
    }])
    // 走势图（大乐透/双色球/七乐彩）
    .controller('supertrend', ['$stateParams', '$ionicLoading', '$timeout', 'Trend', '$ionicLoading', '$scope', '$state', '$ionicSlideBoxDelegate', 'MathRnum', '$ionicScrollDelegate', '$http', 'ApiEndpoint', 'UserInfo', '$filter', 'PayFlow', 'HttpStatus', function ($stateParams, $ionicLoading, $timeout, Trend, $ionicLoading, $scope, $state, $ionicSlideBoxDelegate, MathRnum, $ionicScrollDelegate, $http, ApiEndpoint, UserInfo, $filter, PayFlow, HttpStatus) {
        $scope.aryb = [];
        $scope.aryindex = 0;
        $scope.sfalgs = false;
        $scope.titlehtml = "大乐透";
        $scope.changefalg = false;
        $scope.assistantShow = false;

        $scope.listnum = 30;
        $scope.aryorder = false;
        $scope.countflag = true;


        $scope.cgfalg = true;
        $scope.allscp = '';
        $scope.type = $stateParams.type;
        if ($scope.type == 6) {
            $scope.max = 35;
            $scope.min = 12;
            $scope.numa = 5;
            $scope.numb = 2;
            $scope.context = "大乐透";
        }
        if ($scope.type == 11) {
            $scope.max = 33;
            $scope.min = 16;
            $scope.numa = 6;
            $scope.numb = 1;
            $scope.context = "双色球";
        }
        if ($scope.type == 12) {
            $scope.max = 30;
            $scope.min = 0;
            $scope.context = "七乐彩";
        }
        var locallist_t = "",
            locallist_f = "",
            locallist_b = "";
        var sss = '';
        var _tempObj = new Object;
        var arychange = function (a) {
            var b = [];
            for (var x in a) {
                b[a.length - 1 - x] = a[x];
            }
            // console.log(b)
            return b
        }
        var dataProcessing = function (a, b) {

            $scope.u = a.acodes; //期次
            $scope.allscp = a.acodes; //中奖号码、期次、大小比、奇偶比等等...
            $scope.y = a.yltj; //遗漏统计

            $scope.ylz = []; //遗漏统计
            $scope.a = []; //中奖号码
            for (var x in a.yltj.ylcode) {
                $scope.a[x] = a.acodes[x].acode.split(',');
                $scope.ylz[x] = a.yltj.ylcode[x].split(',').slice(1);
            }

            $scope.cxs = a.yltj.cxcs.split(',').slice(1); //出现次数
            $scope.jyl = a.yltj.pjyl.split(',').slice(1); //平均遗漏
            $scope.zyl = a.yltj.zdyl.split(',').slice(1); //最大遗漏
            $scope.zlc = a.yltj.zdlc.split(',').slice(1); //最大连出
            $scope.ylcp = [];
            $scope.acp = [];
            $scope.ylcp = $.extend(true, [], $scope.ylz);
            $scope.acp = $.extend(true, [], $scope.a);


            if ((b == undefined && $scope.aryorder == false) || b == false) {
                $scope.acp = arychange($scope.acp);
                $scope.allscp = arychange($scope.allscp);
                $scope.ylcp = arychange($scope.ylcp);
            }
        }
        $scope.doPost = function (order) {
            var obj = {
                count: $scope.listnum,
                token: UserInfo.l.token || '',
                type: $scope.type
            }
            Trend.trends(obj).then(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    sss = data.data
                    locallist_t = data.data;
                    dataProcessing(locallist_t, order);

                }
            })
        }
        $scope.aryc = [];
        aryd = [];

        for (var i = 1; i <= $scope.max; i++) $scope.aryb.push(i);
        for (var i = 1; i <= $scope.min; i++) $scope.aryb.push(i);
        for (var i = 1; i <= $scope.max + $scope.min; i++) aryd.push(i);

        // 角标a
        $scope.checkst = function (a, b) {
            if (b >= 0 && b < $scope.max) {
                for (var x = 0; x < $scope.numa; x++) {
                    if (a[x] == aryd[b]) return true;
                }
            } else {
                for (var x = $scope.numa; x < $scope.numa + $scope.numb; x++) {
                    if (a[x] == (aryd[b] - $scope.max)) return true;
                }
            }
            return false;
        }
        // 角标b
        $scope.checkstb = function (a, b) {
            if (b >= 0 && b < 30) {
                for (var x = 0; x < 8; x++) {
                    if (a[x] == aryd[b] && x == 7) return 2;
                    if (a[x] == aryd[b]) return 1;
                }
            }
            return false;
        }
        // 设置弹出状态
        $scope.choosebox = function () {
            $scope.assistantShow = true;
        }
        // 同步滚动
        $scope.scrolls = function () {
            var obj = $ionicScrollDelegate.$getByHandle('dltcon').getScrollPosition();
            $(".st-h-c").scrollLeft(obj.left);
        };
        //  返回
        $scope.backGo = function () {
            window.history.go(-1);
        }
        //  页面切换
        $scope.pagechange = function (a) {
            if (a == 0) {
                $scope.changefalg = false;
                $scope.cgfalg = true;
            }
            if (a == 1) {
                $scope.changefalg = true;
                $scope.sfalgs = true;
                $scope.cgfalg = false;
            }
        }
        //  弹出框 选择事件
        $scope.flagsa = 30;
        $scope.flagsb = false;
        $scope.flagsc = true;
        _tempObj.listnum = $scope.listnum;
        _tempObj.aryorder = $scope.aryorder;
        _tempObj.countflag = $scope.countflag;

        $scope.chooseevent = function (a, b) {
            if (a == 0) { // 期数
                $scope.flagsa = b;
                _tempObj.listnum = parseInt($scope.flagsa);
            }
            if (a == 1) { //顺序
                $scope.flagsb = b;
                _tempObj.aryorder = $scope.flagsb;
            }
            if (a == 2) { // 统计状态
                $scope.flagsc = b;
                _tempObj.countflag = $scope.flagsc;
            }
        }

        $scope.confirme = function (a) {
            if (a) {
                $ionicScrollDelegate.$getByHandle('dltcon').scrollTop();
                $ionicScrollDelegate.$getByHandle('orderlist').scrollTop();
                $scope.countflag = _tempObj.countflag;

                if ($scope.listnum !== _tempObj.listnum) {
                    $scope.listnum = _tempObj.listnum;
                    $scope.aryorder = _tempObj.aryorder;
                    $scope.assistantShow = false;
                    $scope.allscp = [];
                    if ($scope.listnum == 30) {
                        dataProcessing(locallist_t, _tempObj.aryorder);
                    }
                    if ($scope.listnum == 50) {
                        dataProcessing(locallist_f, _tempObj.aryorder);
                    }
                    if ($scope.listnum == 100) {
                        dataProcessing(locallist_b, _tempObj.aryorder);
                    }
                    return false;
                }
                if ($scope.aryorder != _tempObj.aryorder) {
                    $scope.aryorder = _tempObj.aryorder;
                    $scope.acp = $scope.acp.reverse();
                    $scope.allscp = $scope.allscp.reverse();
                    $scope.ylcp = $scope.ylcp.reverse();
                }
            } else {
                $scope.flagsa = $scope.listnum;
                $scope.flagsb = $scope.aryorder;
                $scope.flagsc = $scope.countflag;

                _tempObj.listnum = $scope.listnum;
                _tempObj.aryorder = $scope.aryorder;
                _tempObj.countflag = $scope.countflag;
            }
            $scope.assistantShow = false;
        }
        $scope.golot = function () {
            $state.go('practice.lottery-super', {
                type: $scope.type
            });
        }
        $scope.Gohome = function () {
            $state.go('tab.hall');
        }

        function testCtrl() {
            var toDo = function () {
                var objf = {
                    count: 50,
                    token: UserInfo.l.token || '',
                    type: $scope.type
                }
                var obj = {
                    count: 100,
                    token: UserInfo.l.token || '',
                    type: $scope.type
                }
                Trend.trends(objf, false).then(function (data) {
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        locallist_f = data.data;
                    }
                })
                Trend.trends(obj, false).then(function (data) {
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        locallist_b = data.data;
                    }
                })
            };
            $timeout(toDo, 1400)
        }

        testCtrl();
        $scope.$on('$ionicView.beforeEnter', function () {
            $timeout(function () {
                $scope.doPost();
            }, 500)
        });
    }])
    // 下单界面
    .controller('newbetting', ['$ionicHistory', '$scope', '$state', '$ionicPopup', 'qxc', '$stateParams', 'showAlertMsg', 'MathRnum', 'UserInfo', 'PayFlow', 'HttpStatus', '$ionicLoading', '$timeout', 'cAp', function ($ionicHistory, $scope, $state, $ionicPopup, qxc, $stateParams, showAlertMsg, MathRnum, UserInfo, PayFlow, HttpStatus, $ionicLoading, $timeout, cAp) {
        var nums = $stateParams.nums;
        var pway = $stateParams.id;
        $scope.type = $stateParams.type;
        $scope.aryflag = false;
        $scope.betflag = true;
        if (pway == "") $scope.betflag = false;
        $scope.confirmation = false;
        $scope.ary = [];

        var arylength = 0;
        $scope.checkTemp = true;
        $scope.additional = 1;
        $scope.superflag = true;
        $scope.checkfalg = 1;
        $scope.additional = 1; //追加期数
        $scope.postobj = {
            betcount: 1, //投注数
            betjson: "", //彩种ID对应的投注描述
            doublecount: 1, //翻倍数
            money: 0, //投注金额
            token: UserInfo.l.token || '', //用户令牌
            type: 3 //彩种类型
        };
        $scope.postobj.money = 2 * $scope.postobj.doublecount * $scope.additional * $scope.postobj.betcount * $scope.checkfalg;
        $scope.postobj.type = $scope.type;
        switch ($scope.type) {
            case '3':
                $scope.nums = 7;
                break; // 七星彩
            case '5':
                $scope.nums = 5;
                break; // 排列五
            case '6':
                $scope.max = 35;
                $scope.nums = 5;
                $scope.min = 12;
                $scope.numsb = 2;
                break; // 大乐透
            case '11':
                $scope.max = 33;
                $scope.nums = 6;
                $scope.min = 16;
                $scope.numsb = 1;
                break; // 双色球
            case '12':
                $scope.max = 30;
                $scope.nums = 7;
                $scope.min = 0;
                $scope.numsb = 0;
                break; // 七乐彩
        }
        if (pway == 'true') $scope.superflag = false;


        //  双位处理
        var Prefix = function (num) {
            return (Array(2).join(0) + num).slice(-2);
        }
        // 购彩协议
        $scope.golotage = function () {
            $scope.dochange();
            $state.go('betinfo.lotage');
        }
        // 初始化处理
        $scope.firstPro = function () {
            if (window.localStorage.historybet != undefined) {
                var temparya = JSON.parse(window.localStorage.historybet);
                if (temparya.type != $scope.type) {
                    window.localStorage.removeItem("historybet");
                }
            }
            if (window.localStorage.historybet != undefined) {
                var tempary;
                tempary = JSON.parse(window.localStorage.historybet);
                $scope.type = tempary.type;
                $scope.ary = tempary.nums;
                arylength = $scope.ary.length;
            }
            if (window.localStorage.qxcjson != undefined) {
                var tempary;
                tempary = JSON.parse(window.localStorage.qxcjson);
                $scope.type = tempary.type;
                tempary = tempary.nums;
                for (var x in tempary) {
                    if (pway == "") {
                        if (tempary[x].length == 1) {
                            var temp = tempary[x][0];
                            tempary[x] = temp;
                        }
                    } else {
                        for (var i in tempary[x]) {
                            tempary[x][i] = Prefix(tempary[x][i]);
                        }
                    }
                }
                $scope.ary[arylength] = tempary;
            }
            $scope.endchange();
        }
        // 输出项状态
        $scope.taflag = function (a, b) {
            if (b == 1) {
                if ($scope.type == 12) return false;
                if ($scope.ary[a][1].length > 0 && $scope.ary[a][0].length < $scope.nums) return true;
                else return false;
            }
            if (b == 0) {
                if ($scope.ary[a][0].length < $scope.nums) return true;
                else return false;
            } else {
                if ($scope.ary[a][0].length < $scope.nums) return true;
                else return false;
            }
        }
        // 返回上一页
        $scope.backup = function () {
            if ($scope.type == 6 || $scope.type == 11 || $scope.type == 12) $state.go('practice.lottery-super', {
                flag: pway,
                type: $scope.type
            });
            if ($scope.type == 5 || $scope.type == 3) $state.go('practice.lottery-seven', {
                type: $scope.type
            });
        }
        // 主页
        $scope.Gohome = function () {
            if (window.localStorage.historybet != "[]") {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '回到主页,将清空所有已选号码',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        window.localStorage.removeItem("historybet");
                        $state.go('tab.hall');
                    } else {
                    }
                });
            } else $state.go('tab.hall');
        }


        //  继续选号
        $scope.lotteryadd = function () {
            var obj = {
                type: $scope.postobj.type,
                nums: $scope.ary
            };
            window.localStorage.historybet = JSON.stringify(obj);
            $ionicHistory.clearCache().then(function () {
                $scope.backup();
            })
        }
        // 机选增加
        $scope.pcadd = function (a) {
            for (var i = 0; i <= a - 1; i++) {
                if ($scope.type == 3 || $scope.type == 5) {
                    $scope.ary.push(MathRnum.repeatNum(9, $scope.nums));
                } else {
                    var tempary = [];
                    temp = MathRnum.norepeatNum($scope.max, $scope.nums, 1);
                    tempary[0] = temp.sort(function (a, b) {
                        return a - b
                    });
                    if ($scope.min != 0) {
                        temp = MathRnum.norepeatNum($scope.min, $scope.numsb, 1);
                        tempary[1] = temp.sort(function (a, b) {
                            return a - b
                        });
                    }

                    var length = $scope.ary.length;
                    $scope.ary[length] = tempary;
                }
            }
            // $scope.type == 7 ? b = 7 : b = 5;
            $scope.endchange();
        }
        // 删除条目
        $scope.arydelete = function (a) {
            $scope.ary.splice(a, 1);
            $scope.endchange();
        };


        // 类型监测
        $scope.tempcheck = function (a) {
            if (typeof(a) === 'object') {
                return false;
            } else {
                return true;
            }
        }
        // 返回状态
        $scope.hallcancel = function () {
            $scope.lotteryadd();
        }
        // 胆拖注数计算
        $scope.Notecounting = function (a) {
            var o = {
                a: 0,
                b: 0
            };
            if (a[2] == undefined) { // 单复式 投注
                if (a[0] > $scope.nums || a[1] > $scope.numsb) {
                    var zamount = cAp.comNumber(a[0], $scope.nums) * cAp.comNumber(a[1], $scope.numsb);
                    o.b = 2;
                } else {
                    var zamount = 1;
                    o.b = 1;
                }
            } else {
                if (a[1] == 0 && a[3] == 0) {
                    var zamount = cAp.comNumber(a[2], 7 - a[0]);
                } else if (a[3] == 0) {
                    var zamount = cAp.comNumber(a[2], 6 - a[0]) * cAp.comNumber(a[1], 1);
                } else {
                    var zamount = cAp.comNumber(a[2], 5 - a[0]) * cAp.comNumber(a[3], 2 - a[1]);
                }
                o.b = 5;
            }
            o.a = zamount;
            return o;
        }
        // 下标状态
        $scope.remark = function (a) {
            var b = [];
            if ($scope.type == 3 || $scope.type == 5) {
                if (qxc.countNuma(a) != 1) {
                    return "复式　" + qxc.countNuma(a) + "注　" + qxc.countNuma(a) * 2 + "元";
                } else return "单式　1注　2元";
            } else {
                for (var i = 0; i <= a.length - 1; i++) {
                    if (a[i].length >= 0) b[i] = a[i].length;
                    else b[i] = 1;
                }
                var obj = $scope.Notecounting(b);
                if (obj.b == 1) return "单式投注　1注　2元";
                if (obj.b == 2) return "复式投注　" + obj.a + "注　" + obj.a * 2 + "元";
                if (obj.b == 5) return "胆拖投注　" + obj.a + "注　" + obj.a * 2 + "元";
            }
        }
        // 字符拼接
        $scope.addmacs = function (ary) {
            var a = 1;
            if ($scope.checkfalg == 1.5) {
                a = 2;
            }
            ary = ary.slice(0, 4);
            var tempary = [];
            for (var x in ary) {
                if (ary[x].length > 1) {
                    tempary[x] = ary[x].join(",");
                } else {
                    tempary[x] = ary[x];
                }
            }
            if (tempary.length > 2) { //胆拖投注
                var str;
                if (tempary[3] == "" && tempary[1] == "") {
                    str = tempary[0] + "$" + tempary[2]; //qlc
                } else if (tempary[3] == "") {
                    str = tempary[0] + "$" + tempary[2] + "@" + tempary[1]; //ssq
                } else if (tempary[1] == "") {
                    str = tempary[0] + "$" + tempary[2] + "@$" + tempary[3]; //dlt-1
                } else {
                    str = tempary[0] + "$" + tempary[2] + "@" + tempary[1] + "$" + tempary[3]; //dlt-2
                }
                return str + ":" + a + ":5;";

            } else {
                if ($scope.type == 12 && ary[0].length > $scope.nums) var nums = 2;
                else if ($scope.type != 12 && (ary[0].length > $scope.nums || ary[1].length > $scope.numsb)) var nums = 2;
                else var nums = 1;
                if (tempary[1] == undefined || tempary[1] == '') return tempary[0] + ":" + a + ":" + nums + ";";
                return tempary[0] + "@" + tempary[1] + ":" + a + ":" + nums + ";";
            }
        }


        // 加减
        $scope.addSubtract = function (a, b) {
            if (b == 0) {
                if (a) {
                    $scope.additional--;
                    $scope.doblur()
                } else {
                    $scope.postobj.doublecount--;
                    $scope.doblur()
                }
            } else {
                if (a) {
                    $scope.additional++;
                    $scope.doblur()
                } else {
                    $scope.postobj.doublecount++;
                    $scope.doblur()
                }
            }
            $scope.endchange();
        }
        // 期数倍数
        $scope.dochange = function () {
            if ($scope.postobj.doublecount <= 0 || $scope.postobj.doublecount > 9999 || $scope.additional <= 0 || $scope.additional == '' || $scope.additional > 9999) {
                $scope.checkTemp = false;
            }
            if ($scope.postobj.doublecount > 9999) {
                $scope.postobj.doublecount = 9999;
            }
            if ($scope.postobj.doublecount == "") {
                $scope.postobj.money = "";
                return false;
            }
            if ($scope.postobj.doublecount < 0) $scope.postobj.doublecount = 1;

            $scope.postobj.money = 2 * $scope.postobj.doublecount * $scope.additional * $scope.postobj.betcount * $scope.checkfalg;
        }
        // 失焦事件
        $scope.doblur = function () {
            if ($scope.postobj.doublecount <= 0 || $scope.postobj.doublecount == '') {
                $scope.postobj.doublecount = 1;
                showAlertMsg.showMsgFun('单次投注倍数应在1~9999之间');
            } else if ($scope.postobj.doublecount > 9999) {
                $scope.postobj.doublecount = 9999;
                showAlertMsg.showMsgFun('单次投注倍数应在1~9999之间');
            }
            if ($scope.additional <= 0 || $scope.additional == '') {
                $scope.additional = 1;
                showAlertMsg.showMsgFun('单次追期数应在1~999之间');
            } else if ($scope.additional > 999) {
                $scope.additional = 999;
                showAlertMsg.showMsgFun('单次追期数应在1~999之间');
            }
            $scope.endchange();
            $scope.checkTemp = true;
        }
        // 追加状态
        $scope.msgboxs = function () {
            $scope.checkfalg == 1 ? $scope.checkfalg = 1.5 : $scope.checkfalg = 1;
            $scope.endchange();
        }
        // 结果确认
        $scope.endchange = function (a) {
            var m = 0;
            if ($scope.type == 3 || $scope.type == 5) {
                for (var x in $scope.ary) {
                    m = m + parseInt(qxc.countNuma($scope.ary[x]));
                }
            } else {
                for (var x in $scope.ary) {
                    var b = [];
                    for (var i = 0; i <= $scope.ary[x].length - 1; i++) {
                        if ($scope.ary[x][i].length >= 0) b[i] = $scope.ary[x][i].length;
                        else b[i] = 1;
                    }
                    var zamount = $scope.Notecounting(b);
                    m = m + zamount.a;
                }

            }
            $scope.ary.length == 0 ? $scope.aryflag = false : $scope.aryflag = true;
            $scope.postobj.betcount = m;
            $scope.postobj.money = 2 * $scope.postobj.doublecount * $scope.additional * $scope.postobj.betcount * $scope.checkfalg;
            var obj = {
                type: $scope.postobj.type,
                nums: $scope.ary
            }
            window.localStorage.historybet = JSON.stringify(obj);
            window.localStorage.removeItem("qxcjson");
        }
        // 清空list
        $scope.clearlist = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '您确定要清空当前的投注内容吗？',
                cancelText: '取消',
                okText: '确定',
                okType: 'font-color'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $scope.ary = [];
                    $scope.additional = 1;
                    $scope.postobj.doublecount = 1;
                    window.localStorage.removeItem("historybet");
                    $scope.endchange();
                }
            })
        }


        // 下单请求
        $scope.dobill = function (a) {
            if ($scope.type == 3) {
                showAlertMsg.showMsgFun('温馨提示', '七星彩　暂停销售');
                return false;
            }
            if ($scope.postobj.doublecount <= 0 || $scope.postobj.doublecount > 9999 || $scope.additional <= 0 || $scope.additional == '' || $scope.additional > 9999) {
                $scope.checkTemp = false;
            }
            $scope.endchange();
            if ($scope.aryflag && $scope.checkTemp) {
                var tempjson = "";
                for (var x in $scope.ary) {
                    if (pway == "") {
                        tempjson = tempjson + qxc.Mosaicchar($scope.ary[x]);
                    } else {
                        tempjson = tempjson + $scope.addmacs($scope.ary[x]);
                    }
                }
                $scope.postobj.betjson = $scope.additional + '|' + tempjson;
                PayFlow.bill($scope.postobj).then(function (data) {
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
                    }
                })
            }
            if (!$scope.aryflag) {
                showAlertMsg.showMsgFun('至少选择一注进行投注！');
                return false;
            }
        }
        //  支付窗口
        $scope.CloseConfirmation = function () {
            $scope.confirmation = false;
        }
        // 支付请求
        $scope.payment = function () {
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
            PayFlow.pay(paydata).then(function (data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    if (data.data.payresult == 2) {
                        PayFlow.charge(chargedata);
                    }
                    if (data.data.payresult == 1) {
                        window.localStorage.removeItem("historybet");
                        $state.go('practice.paid', {
                            id: data.data.orderid,
                            type: $scope.postobj.type
                        });
                    }
                }

            })
        }


        $scope.firstPro();
        if (nums != "" && window.localStorage.jxfalg != 'true') {
            if (nums <= 0) nums = 1;
            if (nums > 10) nums = 10;
            window.localStorage.jxfalg = true;
            $scope.pcadd(nums);
        }
    }])
    // 具体的开奖列表
    .controller('lotdatails', ['listcot', '$ionicScrollDelegate', 'order', '$scope', '$state', '$stateParams', '$http', 'UserInfo', 'ApiEndpoint', function (listcot, $ionicScrollDelegate, order, $scope, $state, $stateParams, $http, UserInfo, ApiEndpoint) {
        $scope.type = parseInt($stateParams.type);
        if ($scope.type < 3 || $scope.type > 20) {
            $state.go('practice.Lotterylist');
        }
        pages = 1;
        $scope.ary = [];
        $scope.infintefalg = true;
        $scope.dopost = function () {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/list",
                data: {
                    pn: pages,
                    token: UserInfo.l.token || '',
                    type: $scope.type
                }
            }).success(function (data) {
                if (data.status == 1) {
                    if (data.data.rowsp == "") {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.infintefalg = false;
                        return false;
                    } else {
                        dataProcessing(data.data.rowsp);
                    }
                }
            }).error(function (data) {
                showAlertMsg.showMsgFun('提示', '网络连接失败！');
            });
        }
        var dataProcessing = function (ary) {
            $scope.temptype = parseInt(ary[0].gid);
            $scope.textcot = listcot.texts($scope.temptype);
            gDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
            for (var x in ary) {
                ary[x].acode = ary[x].acode.split(",");
                if (ary[x].ginfo != undefined) {
                    ary[x].ninfo = ary[x].ninfo.split(",");
                    ary[x].ginfo = ary[x].ginfo.split(",");
                }
                if (ary[x].sjh) {
                    ary[x].sjh = ary[x].sjh.split(",");
                }
                ary[x].goldn = listcot.gold($scope.type);
                if ($scope.type >= 7 && $scope.type <= 10 || $scope.type == 20) {
                    ary[x].ginfo = ['130', '65', '1170', '195', '13', '6', '19', '78', '540', '90', '26', '9']
                }
                timea = ary[x].atime;
                ary[x].timea = timea.substring(5, 10);
                ary[x].atime = ary[x].atime.replace(/-/g, '/');
                var datetime = new Date(ary[x].atime);
                ary[x].days = gDays[datetime.getDay()];
                // console.log(datetime.getDay())
            }
            if (pages == 1) {
                $scope.ary = [];

            }
            for (var x = 0; x < ary.length; x++) {
                $scope.ary.push(ary[x]);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            if (pages == 1) {
                $('.lot-detail .ldl-up').eq(0).append('<span class="ldl-icon">NEW</span>');
                $('.lot-detail .ldl-down').eq(0).addClass('ldl-new');
            }
        }
        $scope.numfalg = "";
        $scope.openlist = function (x) {
            if ($scope.numfalg == "") {
                $scope.numfalg = x;
            } else if ($scope.numfalg != x) {
                $scope.numfalg = x;
            } else {
                $scope.numfalg = ""
            }
        }

        $scope.checks = function (a) {
            var b = $scope.type;
            if (a == 0) {
                if (b == 3) return true;
            }
            if (a == 1) {
                if (b == 4 || b == 5 || b == 13) return true;
            }
            if (a == 2) {
                if (b == 6 || b == 11 || b == 12) return true;
            }
            if (a == 3) {
                if (b >= 7 && b <= 10 || b == 20) return true;
            }
            return false;
        }
        $scope.check = function (a, b) {
            for (var i = a; i <= b; i++) {
                if (i == $scope.type) return true;
            }
            return false;
        }
        $scope.backGo = function () {
            window.history.go(-1);
        }
        $scope.Gohome = function () {
            $state.go('tab.hall');
        }
        $scope.dopost();
        $scope.golot = function () {
            $state.go(order.getbackurl[$scope.temptype], {
                type: $scope.temptype
            });
        }
        $scope.conScorll = function () {
            pages++;
            $scope.dopost();
        }
        $scope.refreshAry = function () {
            pages = 1;
            $scope.dopost();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.infintefalg = true;
        }
    }])
    // 帮助中心
    .controller('helpcenter', ['MathRnum', 'helpcontent', '$state', '$scope', '$stateParams', function (MathRnum, helpcontent, $state, $scope, $stateParams) {
        $scope.obj = helpcontent.cot();
        var type = $stateParams.type;
        var nums = $stateParams.number;
        $scope.tempfalg = 1;
        $scope.ary = [];

        var check = function (a, b, ary) {
            if (ary.length == "") return false;
            for (var x in ary) {
                if (ary[x].aa == a && ary[x].bb == b) return true;
            }
            return false;
        }
        $scope.elseqst = function () {
            for (var i = 0; i < 4; i++) {
                var a = MathRnum.norepeatNum($scope.obj.length - 1, 1, 0) * 1;
                var b = MathRnum.norepeatNum($scope.obj[a].cot.length - 1, 1, 0) * 1;
                var qst = helpcontent.cot(a, b);
                var flag = check(a, b, $scope.ary);
                if (flag) {
                    i = i - 1;
                } else {
                    $scope.ary[i] = {
                        qusetion: qst.question,
                        aa: a,
                        bb: b
                    }
                }
            }
        }
        if (type !== undefined || nums != undefined) {
            type = type * 1;
            nums = nums * 1;
            if (type < 0 || type >= $scope.obj.length) type = 0;
            if (nums < 0 || nums >= $scope.obj[type].cot.length) nums = 0;
            $scope.cotqa = helpcontent.cot(type, nums);
            $scope.elseqst();

        }

        $scope.backGo = function () {
            window.history.back(-1);
        };
        $scope.Gohome = function () {
            $state.go('tab.hall');
        }
        $scope.changeqa = function (a, b) {
            $scope.cotqa = helpcontent.cot(a, b);
            $scope.elseqst();
        }

        $scope.closelist = function (a) {
            if ($scope.tempfalg == a) {
                $scope.tempfalg = "";
            } else {
                $scope.tempfalg = a;
            }

        }
        $scope.goconcrete = function (a, b) {
            $state.go('user.helpcot', {
                type: a,
                number: b
            });
        }
    }])
    //  快三
    .controller('lotterythree', ['fastthree', '$stateParams', '$ionicLoading', '$timeout', 'Trend', '$ionicLoading', '$scope', '$state', '$ionicSlideBoxDelegate', 'MathRnum', '$ionicScrollDelegate', '$http', 'ApiEndpoint', 'UserInfo', '$filter', 'PayFlow', 'HttpStatus', function (fastthree, $stateParams, $ionicLoading, $timeout, Trend, $ionicLoading, $scope, $state, $ionicSlideBoxDelegate, MathRnum, $ionicScrollDelegate, $http, ApiEndpoint, UserInfo, $filter, PayFlow, HttpStatus) {
        $scope.lottypes = 0;
        $scope.title = '和值';
        $scope.goption = false;
        $scope.options = function (a) {
            if (a == 0) {
                $scope.goption = false;
            } else {
                $scope.goption = true;
            }
        }
        $scope.lotct = fastthree.lottype();
        // 返回
        $scope.backGo = function () {
            //$ionicHistory.goBack();
            window.history.back();
        }
        //玩法选择
        $scope.choosetype = function (a, b) {
            if ($scope.lottypes != b) {
                $scope.lottypes = b;
                $scope.title = a.a;
            }
        }

        // 走势图链接
        $scope.zstopen = function () {
            // $state.go('practice.trendchar', { type: $scope.postobj.type });
        }
        $scope.assistantShow = false;
        $scope.assistants = function (e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', {
                        type: $scope.type
                    });
                    break;
                case 2:
                    $state.go('practice.play-About', {
                        type: $scope.type
                    });
                    break;
                case 3:
                    $state.go('practice.lot-details', {
                        type: $scope.type
                    });
                    break;
                default:
                    break;
            }
            $scope.assistantShow = !$scope.assistantShow;
        }
        // 返回
        $scope.assistant = function () {
            $scope.assistantShow = !$scope.assistantShow;
        }
    }])
    // 开奖动画
   /* .controller('syxwanimaCtrl', ['websocket', 'order', 'stock', '$timeout', 'HttpServer', '$interval', 'HttpStatus', '$ionicPopup', 'cAp', 'syxw', 'showAlertMsg', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', '$ionicScrollDelegate', function (websocket, order, stock, $timeout, HttpServer, $interval, HttpStatus, $ionicPopup, cAp, syxw, showAlertMsg, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, $ionicScrollDelegate) {
        //初始化
        //var playtype = $stateParams.type;
        var pid = $stateParams.pid;
        $scope.nowpid = pid;
        var playtype = UserInfo.l.syxwtrack || 10;
        $scope.SYXWtype = playtype; //十一选五的id
        $scope.zjatime = ''; //浙江开奖时间
        $scope.sxatime = ''; //山西开奖时间
        //初始化默认玩法
        $scope.coutdown = {
            min: '',
            sec: ''
        }
        $scope.plstext = '任选二';
        $scope.playid = 'rx2_pt';
        $scope.KJdowntime = ''; //开奖倒计时
        var rx = 2;
        $scope.rx = 2;
        $scope.list = '';
        $scope.ShlistHeght = false;
        $scope.assistantShow = false;
        $scope.missflag = false;
        $scope.plsjxd = false;
        $scope.dtma = false;
        $scope.gamesession = 0;
        $scope.winflag = false;
        $scope.arrylist = [];
        $scope.openflag = true;
        $scope.endingshow = false; //弹窗控制
        $scope.endresult = false; //投注-未中奖
        $scope.endnobet = false; //未投注-未中奖
        $scope.endresult = 0;
        $scope.showtext = '开奖中';
        var notbet = true; //是否投注数据
        var Lotteryoff = true;
        $scope.endpart = {
            text: false,
            num: false
        }
        false;
        $scope.aftercot = {
            flag: true,
            cot: '',
        };
        var bAry = ['balla', 'ballb', 'ballc', 'balld', 'balle'];
        var tAry = [1500, 1250, 1050, 850, 650]; //动画时间
        // var nAry = ['05', '06', '07', '08', '10']
        var dAry = ['.2rem', '.82rem', '1.42rem', '2.04rem', '2.66rem'];
        $scope.search = {
            token: UserInfo.l.token,
            pid: pid,
            type: 10,
        }
        $scope.doPost = function (a) {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/betnumber/now",
                data: $scope.search,
            }).success(function (data) {
                HttpStatus.codedispose(data);
                if (a == undefined) {
                    if (data.status == 1) {
                        $scope.arrylist = [];
                        if (data.data.betList != '') {
                            $scope.aftercot = {
                                flag: true,
                                cot: '我的投注号码',
                            }
                            var list = data.data.betList;
                            for (var x in list) {
                                $scope.arrylist[x] = {};
                                var temp = order.NumberGame({
                                    bcontext: list[x].bdesc,
                                    lotteryid: 10
                                });
                                $scope.arrylist[x].codes = temp[0];
                                $scope.arrylist[x].bdesc = list[x].bdesc;
                                $scope.arrylist[x].bdouble = list[x].bdouble;
                                $scope.arrylist[x].money = list[x].money;
                                $scope.arrylist[x].bounstotal = {};
                            }
                            for (var y in $scope.arrylist) {
                                var temp = $scope.arrylist[y].codes;
                                var temps = temp.bets;
                                temp.bets = temps.replace(/\$/g, ' $ ').replace(/\@/g, ' | ').replace(/,/g, ' ').trim().split(' ');
                                // console.log($scope.arrylist[x])
                            }
                        } else {
                            notbet = false;
                            $scope.listhistory = [];
                            $http({
                                method: 'post',
                                url: ApiEndpoint.url + "/trade/lotteryinfo",
                                data: $scope.search,
                            }).success(function (data) {
                                HttpStatus.codedispose(data);
                                if (data.status == 1) {
                                    $scope.aftercot = {
                                        flag: false,
                                        cot: '历史开奖号码',
                                    }
                                    if (data.data.rowsp) {
                                        var temp = data.data.rowsp;
                                        for (var x in temp) {
                                            $scope.listhistory[x] = temp[x];
                                        }
                                    }
                                }
                            }).error(function (data) {
                            });
                        }
                        if (data.data.acode && Lotteryoff) {
                            //console.log($scope.arrylist, data.data.acode)
                            for (var x in $scope.arrylist) {
                                $scope.arrylist[x].bounstotal = syxw.bounstotal($scope.arrylist[x].bdesc, data.data.acode);
                            }
                            $interval.cancel($scope.kjcleartime);
                            $('.sT_daojishi').hide();
                            // $('.sT_anima').removeClass('sT_anima_scalea');
                            // $('.sT_anima').addClass('sT_anima_scaleb');
                            $scope.opening(data.data.acode.split(","));
                        }
                    }
                } else {
                    if (data.status == 1) {
                        if (data.data.acode && Lotteryoff) {
                            $scope.opentime = $interval.cancel($scope.kjcleartime);
                            $('.sT_daojishi').hide();
                            // $('.sT_anima').removeClass('sT_anima_scalea');
                            // $('.sT_anima').addClass('sT_anima_scaleb');
                            $scope.opening(data.data.acode.split(","));
                        } else {
                            alert('网路异常，请稍后再试！')
                        }
                    } else {
                        alert('网路异常，请稍后再试！')
                    }
                }
            }).error(function (data) {
            });
        }
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
        //倒计时
        $scope.lotterycdown = function () {
            var SysTime = new Date().getTime() / 1000;
            var down = true;
            var xiangchatime = 90; //倒计时基数
            $scope.KJdowntime = xiangchatime;
            $scope.kjcleartime = $interval(function () {
                var myDate = new Date();
                var mytime = myDate.getTime() / 1000;
                var time = Math.round(mytime - SysTime); //请求系统时间-当前系统时间=已经过去时间
                $scope.KJdowntime = xiangchatime - time;
                //console.log(xiangchatime);
                // console.log($scope.KJdowntime);
                $scope.downtimes($scope.KJdowntime)
                if ($scope.KJdowntime <= 0 && down == true) {
                    down == false;
                    $timeout(function () {
                        // $('.sT_anima').removeClass('sT_anima_scalea');
                        // $('.sT_anima').addClass('sT_anima_scaleb');
                        $timeout(function () {
                            $scope.doPost(1);
                        }, 1000);
                    }, 500);
                    $('.sT_daojishi').css('top', '-4rem');
                    $interval.cancel($scope.kjcleartime);
                }
            }, 1000);
        }
        $scope.lotterycdown();
        $scope.downtimes = function (a) {
            if (a >= 60 && a <= 120) {
                $scope.coutdown = {
                    min: 1,
                    sec: a - 60
                }
            } else if (a < 60) {
                $scope.coutdown = {
                    min: 0,
                    sec: a
                }
            }
            if ($scope.coutdown.sec < 10) {
                $scope.coutdown.sec = '0' + $scope.coutdown.sec;
            }
        }
        $scope.closeendshow = function () {
            $('.ending_Show').hide();
        }
        //开奖通知监听
        websocket.sockt(ApiEndpoint.url).then(function (data) {
            // $timeout(function() {
            // var data = '01,05,06,09,08';
            if (pid == data.data.pid && Lotteryoff) {
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
            // $scope.opening(data.split(","));
            //var nAry = [3, 1, 7, 4, 10];//中奖号码
        });
        //syxw.bounstotal();//金额奖金计算
        //开奖
        $scope.opening = function (nAry) {
            $scope.endpart.text = true;
            $timeout(function () {
                $scope.endingshow = true;
                $timeout(function () {
                    $('.st_anima_a').addClass('sT_anima_scaleb');
                }, 50)
                $timeout(function () {
                    var times = 1;
                    var cAry = [];
                    for (var n in nAry) {
                        cAry[n] = parseInt(nAry[n]);
                    }
                    if ($scope.openflag) {
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
            }, 1000)
        }
        $scope.ballrun = function (a, nAry, cAry, times) {
            if (a < 5) {
                $('.stc_ball').show();
                $timeout(function () {
                    $("#" + bAry[a]).attr('src', 'imgs/ball' + parseInt(cAry[a]) + '.png');
                    if ($scope.arrylist.length > 0) {
                        var ary = $('.syc_kaijiang');
                        var tempary = [];
                        for (var x = 0; x < $scope.arrylist.length; x++) {
                            tempary[x] = $scope.arrylist[x].bounstotal.acode.join(',');
                        }
                        for (var x = 0; x < ary.length; x++) {
                            var temps = $(ary[x]).find('font');
                            if (tempary[x].indexOf(nAry[a]) > -1) {
                                for (var y = 0; y < temps.length; y++) {
                                    var temp = parseInt(temps[y].innerHTML);
                                    if (parseInt(temp) == parseInt(nAry[a])) {
                                        temps[y].classList.add('syn_cm_parta_am');
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (times == 5) {
                        $scope.endShow();
                        $scope.endingshow = false;
                        $scope.downtimes($scope.KJdowntime);
                        $timeout(function () {
                            $scope.winflag = true;
                            $scope.endpart.num = true;
                            var tempattr = $("#stdjs_gza_ball .std_balls");
                            for (var i = 0; i < 5; i++) {
                                tempattr[i].src = 'imgs/ball' + parseInt(cAry[i]) + '.png';
                            }
                            $scope.showtext = '开奖号码';
                            $timeout(function () {
                                if ($scope.endwin == undefined) {
                                    $scope.endingshow = true;
                                    if ($scope.aftercot.flag) {
                                        $scope.endresult = 2;
                                    } else {
                                        $scope.endresult = 3;
                                    }
                                }
                            }, 1000)
                        }, 1500)
                    }
                    return
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
            for (var x in $scope.arrylist) {
                cot += $scope.arrylist[x].bounstotal.amoney * $scope.arrylist[x].bdouble;
            }
            $scope.endingshow = true;
            if (notbet) {
                if (cot > 0) {
                    $scope.endwin = {
                        pid: pid,
                        amoney: cot
                    }
                    $scope.endresult = true;
                } else {
                    $scope.endresult = false;
                }
            } else {
                $scope.endnobet = true;
            }

        }
        // number/str
        $scope.numstr = function (a) {
            return !isNaN(Number(a));
        }
        // back
        $scope.gosyxw = function () {
            $ionicHistory.clearCache().then(function () {
                $state.go('practice.syxwhall', {
                    type: $scope.SYXWtype,
                });
            })
        }
        $scope.backGo = function () {
            //$ionicHistory.goBack();
            $ionicHistory.clearCache().then(function () {
                window.history.back();
            })
        }
        $scope.Gohome = function () {
            $ionicHistory.clearCache().then(function () {
                $state.go('tab.hall');
            })
        }
        $scope.doPost();
        $scope.$on('$destroy', function () {
            if ($scope.kjcleartime) {
                $interval.cancel($scope.kjcleartime);
            }
            if ($scope.opentime) {
                $interval.cancel($scope.opentime);
            }
            if ($scope.ballruntime) {
                $interval.cancel($scope.ballruntime);
            }
        })
    }])*/
    // NEW 11选5
    .controller('newsyxwCtrl', ['$q','$stomp', '$rootScope', 'websocket', '$location', 'algorithm', '$anchorScroll', 'order', 'PayFlow', 'stock', '$timeout', 'HttpServer', '$interval', 'HttpStatus', '$ionicPopup', 'cAp', 'syxw', 'showAlertMsg', '$scope', '$ionicHistory', '$http', '$filter', 'ApiEndpoint', '$ionicLoading', '$state', 'MathRnum', 'pls', '$stateParams', 'UserInfo', '$ionicScrollDelegate', function ($q,$stomp, $rootScope, websocket, $location, algorithm, $anchorScroll, order, PayFlow, stock, $timeout, HttpServer, $interval, HttpStatus, $ionicPopup, cAp, syxw, showAlertMsg, $scope, $ionicHistory, $http, $filter, ApiEndpoint, $ionicLoading, $state, MathRnum, pls, $stateParams, UserInfo, $ionicScrollDelegate) {
        //初始化
        $scope.syyjflag = true;
        $scope.syyjanima_a = true;
        $scope.siteflag = true;
        $scope.tendflag = true;
        $scope.tendshows = false;
        var playtype = $stateParams.type;
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
        $scope.buyoldlist = false;//开奖期次是否购买
        $scope.syyjdowntimebig = 0;//10秒倒计时效果 缩放
        $scope.openendsyyjcot  = false;//开奖页面左移出现
        $scope.mybetflag = true;//我的投注号码按钮
        $scope.syyjdowntimeleft = false;
        /**
         * 下单成功界面查看订单展开我的投注列表
         */
        if(UserInfo.l.syxwseebet){
            $scope.mynumlist = true;//我的投注号码-展开
            $scope.mytext = '手动选号';
            UserInfo.remove('syxwseebet');
        }else{
            $scope.mynumlist = false;
            $scope.mytext = '我的投注';
        }
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
                }
                ;
                if (data.status == 1) {
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
                    var xiangchatime = (new Date(data.data.stime.replace(/-/g, "/")).getTime() - new Date(data.data.ntime.replace(/-/g, "/")).getTime()) / 1000;//结束时间-当前时间=截止倒计时总时间；
                    var xctime = (new Date(data.data.atime.replace(/-/g, "/")).getTime() - new Date(data.data.stime.replace(/-/g, "/")).getTime()) / 1000 + 2;//下期开始时间-当期结束时间 = 暂停间隔时间
                    var openxctime = (new Date(data.data.prepid.openTimeStr.replace(/-/g, "/")).getTime() - new Date(data.data.ntime.replace(/-/g, "/")).getTime()) / 1000;//开间时间-当前时间 = 开奖倒计时
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
                            if(data.data.rowsp[i].pid != $scope.prepidlist[0].pid){
                                $scope.lotterylist.push(data.data.rowsp[i]);
                            }
                        }
                    } else {
                        for (var i = 0; i < data.data.rowsp.length; i++) {
                            $scope.lotterylist.push(data.data.rowsp[i]);
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
                        if($scope.buyoldlist){
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
                        }
                        //console.log(xiangchatime);
                        //console.log($scope.downtime);
                        //console.log($scope.downtime,-xctime)
                            if($scope.openlottery==0 && $location.path().indexOf("practice/newsyxw") != -1){
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
                                    console.log('当期开奖倒计时结束')
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
        $scope.Sync = $interval(function () {
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
                        if(data.data.rowsp[i].pid != $scope.prepidlist[0].pid){
                            $scope.lotterylist.push(data.data.rowsp[i]);
                        }
                    }
                } else {
                    for (var i = 0; i < data.data.rowsp.length; i++) {
                        $scope.lotterylist.push(data.data.rowsp[i]);
                    }
                }
                console.log($scope.prepidlist);
                //getatime($scope.search.type);
            })
        }, 60000); //一分钟同步一次开奖数据
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
            PayFlow.bill($scope.data).then(function (data) {
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
            })
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
            doublecount: 5,
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
                        $state.go('user.payment', {
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
                    UserInfo.add('jsondatasyxw', jsondatapls);
                    $scope.rdnums(0);
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