/**
 * Created by liudonghua on 2016-09-12.
 */
app = angular.module('myApp', ['ngRoute', 'ngTable', 'ngSanitize', 'ngCsv', 'ui.bootstrap.datetimepicker']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl : 'partials/home.html'
        })
        .when('/print', {
            templateUrl : 'partials/print.html'
        })
        .when('/', {
            redirectTo : '/home'
        });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
});

app.factory('dataService', function($http) {
    var promiseForXY, promiseForXKDM, promiseForXKML, promiseForExtraDW;
    var getDataByXY = {
        async: function(xy) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promiseForDataByXY = $http.get('/xktj/relevant/by_szxy/' + xy).then(function (response) {
                // The then function here is an opportunity to modify the response
                console.log('getDataByXY(%s) is %j', xy, response);
                // The return value gets picked up by the then in the controller.
                return response.data;
            });
            // Return the promise to the controller
            return promiseForDataByXY;
        }
    };
    var getDataByUserId = {
        async: function(user_id) {
            var promiseForDataByUserId = $http.get('/xktj/relevant/by_id/' + user_id).then(function (response) {
                console.log('getDataByUserId(%s) is %j', user_id, response);
                return response.data;
            });
            return promiseForDataByUserId;
        }
    };
    var getXY = {
        async: function() {
            if (!promiseForXY ) {
                promiseForXY = $http.get('/xktj/xy/').then(function (response) {
                    console.log('getXY is %j', response);
                    return response.data;
                });
            }
            return promiseForXY;
        }
    };
    var getXKDM = {
        async: function() {
            if (!promiseForXKDM ) {
                promiseForXKDM = $http.get('/xkdm').then(function (response) {
                    console.log('getXKDM is %j', response);
                    return response.data;
                });
            }
            return promiseForXKDM;
        }
    };
    var getXKML = {
        async: function() {
            if (!promiseForXKML ) {
                promiseForXKML = $http.get('/xkdm/ml').then(function (response) {
                    console.log('getXKML is %j', response);
                    return response.data;
                });
            }
            return promiseForXKML;
        }
    };
    var getExtraDW = {
        async: function() {
            if (!promiseForExtraDW ) {
                promiseForExtraDW = $http.get('/dwmc.json').then(function (response) {
                    console.log('getExtraDW is %j', response);
                    return response.data;
                });
            }
            return promiseForExtraDW;
        }
    };
    return {getDataByXY: getDataByXY, getDataByUserId: getDataByUserId, getXY: getXY, getXKDM: getXKDM, getXKML: getXKML, getExtraDW: getExtraDW};
});

app.controller('navCtrl', function ($scope, $location, $http, $window) {
    $scope.isActive = function (route) {
        return route === $location.path();
    }
    $scope.logout = function () {
        $http.get('http://xktj.grs.ynu.edu.cn/logout').success(function(data) {
            $window.location="http://ids.ynu.edu.cn/authserver/logout?service=http://xktj.grs.ynu.edu.cn/";
        });
    }
});

app.controller('printCtrl', function($scope, $rootScope, $http, dataService) {
    $scope.current_xy = $rootScope.current_xy;
    $scope.data = $rootScope.data;
    $scope.user_id = $rootScope.user_id;

    if(!$scope.data) {
        dataService.getDataByXY.async($scope.current_xy).then(function (data) {
            $scope.data = data;
            $scope.current_xy = data[0].szxy;
        });
    }

    $scope.print = function() {
        var print_table_css = '<link href="bootstrap/dist/css/bootstrap.min.css" rel="stylesheet"/><link href="stylesheets/style.css" rel="stylesheet">';
        var print_content =  print_table_css + document.getElementById('data_table').innerHTML;
        var print_window = window.open('', '', 'width=1280,height=800');
        print_window.document.write(print_content);
        print_window.focus();
        setTimeout(function () {
            print_window.print();
        },1000);
    }
});

app.controller('tableCtrl', function ($scope, $rootScope, $filter, NgTableParams, dataService, $q) {

    $scope.update_status = {status: "", teacher_name: ""};

    var self = this;

    $scope.setSelected = function(row) {
        $scope.selectedRow = row;
        $scope.selected_row_id = row.id;
        // initialization select element
        $scope.zyxk_xkmls = [row.zyxk_xkml];
        $scope.zyxk_yjxks = [row.zyxk_yjxk];
        $scope.zyxk_ejxks = [row.zyxk_ejxk];
        $scope.dexk_xkmls = [row.dexk_xkml];
        $scope.dexk_yjxks = [row.dexk_yjxk];
        $scope.dexk_ejxks = [row.dexk_ejxk];
    };

    $scope.update_szxy = function() {
        dataService.getDataByXY.async($scope.selected_szxy).then(function (data) {
            update_table_data(data);
        });
    };

    var xlsx_tool = {

        datenum: function(v, date1904) {
            if(date1904) v+=1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        },

        sheet_from_array_of_arrays: function(data, opts) {
            var ws = {};
            var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
            for(var R = 0; R != data.length; ++R) {
                for(var C = 0; C != data[R].length; ++C) {
                    if(range.s.r > R) range.s.r = R;
                    if(range.s.c > C) range.s.c = C;
                    if(range.e.r < R) range.e.r = R;
                    if(range.e.c < C) range.e.c = C;
                    var cell = {v: data[R][C] };
                    if(cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                    if(typeof cell.v === 'number') cell.t = 'n';
                    else if(typeof cell.v === 'boolean') cell.t = 'b';
                    else if(cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
            if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
            return ws;
        },

        Workbook: function() {
            //if(!(this instanceof this.Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        },

        s2ab: function(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

    };

    $scope.export_xlsx = function () {
        var data = $scope.data;
        if(data) {
            var array_data = [];
            array_data.push(['工号', '姓名', '出生日期', '性别', '专业技术职务', '最高学位', '学历', '所在学院', '主要学科学科门类', '主要学科一级学科', '主要学科二级学科', '主要学科导师', '第二学科学科门类', '第二学科一级学科', '第二学科二级学科', '第二学科导师', '手机号码', '电子邮箱', '备注']);
            for(var i = 0; i < data.length; i ++) {
                item = data[i];
                array_data.push([item.id, item.xm, item.csrq, item.xb, item.zyjszw, item.zgxw, item.xl, item.szxy, item.zyxk_xkml, item.zyxk_yjxk, item.zyxk_ejxk, item.zyxk_ds, item.dexk_xkml, item.dexk_yjxk, item.dexk_ejxk, item.dexk_ds, item.sjhm, item.dzyx, item.bz]);
            }

            var ws_name = $scope.current_xy + "学科统计数据";
            var wb = new xlsx_tool.Workbook();
            var ws = xlsx_tool.sheet_from_array_of_arrays(array_data);

            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
            saveAs(new Blob([xlsx_tool.s2ab(wbout)],{type:"application/octet-stream"}), "data.xlsx")

        }
    };

    var user_id = angular.element("#navbar > ul > li > a > span").text();
    var user_type = angular.element("#navbar > ul > li.hidden").text();
    $scope.user_id = user_id;
    $scope.user_type = user_type;

    var current_xy_deferred = $q.defer();
    var current_xy_promise = current_xy_deferred.promise;
    current_xy_promise.then(function(current_xy) {
        if(user_type == 'admin') {
            dataService.getXY.async().then(function (data) {
                $scope.szxys = data;
                var xydws = [];
                for(var i = 0; i < data.length; i++) {
                    xydws.push(data[i].szxy);
                }
                $scope.xydws = xydws;
            });
        }
        else if(user_type == 'user') {
            dataService.getExtraDW.async().then(function (data) {
                $scope.extraDW = data;
                var xydws = Object.assign([], data);
                xydws.splice(0, 0, current_xy);
                $scope.xydws = xydws;
            });
        }
    });

    var update_table_data = function (data) {
        $scope.data = data;
        $scope.current_xy = data[0].szxy;
        $rootScope.current_xy = $scope.current_xy;
        $rootScope.data = $scope.data;
        current_xy_deferred.resolve($scope.current_xy);

        $scope.tableParams = new NgTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
        }, {
            tatal: $scope.data.length,
            getData: function (params) {
                // use build-in angular filter
                var filteredData = params.filter() ?
                    $filter('filter')($scope.data, params.filter()) :
                    $scope.data;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
                params.total(orderedData.length);

                return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
        });
    };

    if(user_id && !$scope.data) {
        dataService.getDataByUserId.async(user_id).then(function (data) {
            update_table_data(data);
        });
    }
    else if($scope.data) {
        update_table_data($scope.data);
    }
    else {
        console.error('no user_id or cached data to show!');
    }

    if(!$scope.xkdm) {
        dataService.getXKDM.async().then(function (data) {
            $scope.xkdm = data;
            var xkdm = data;
            var xkmls = [];
            //xkmls.push({mldm: "-", mlmc: ""});
            for (var key in xkdm) {
                if (xkdm.hasOwnProperty(key)) {
                    xkmls.push({mldm: key, mlmc: xkdm[key].mlmc});
                }
            }
            $scope.xkmls = xkmls;
        });
    }

});

app.controller('formCtrl', function ($scope, $http, $window, dataService) {

    dataService.getXKML.async().then(function (data) {
        var plain_data = [];
        for (var i = 0; i < data.length; i ++) {
            plain_data.push(data[i].mlmc);
        }
        $scope.zyxk_xkmls = plain_data;
        var dexk_xkmls = Object.assign([], plain_data);
        $scope.dexk_xkmls = dexk_xkmls;
    });

    dataService.getXKDM.async().then(function (data) {
        $scope.xkdm = data;
    });

    dataService.getXY.async().then(function (data) {
        var plain_data = [];
        for (var i = 0; i < data.length; i ++) {
            plain_data.push(data[i].szxy);
        }
        $scope.szxys = plain_data;
    });

    $scope.update_zyxk_xkml = function() {
        var zyxk_xkml = $scope.selectedRow.zyxk_xkml;
        var zyxk_yjxks = [];

        var zyxk_yjxks_object = $scope.xkdm[zyxk_xkml];
        for (var key in zyxk_yjxks_object) {
            if (zyxk_yjxks_object.hasOwnProperty(key)) {
                zyxk_yjxks.push(key);
            }
        }
        $scope.zyxk_yjxks = zyxk_yjxks;

    }

    $scope.update_zyxk_yjxk = function() {
        var zyxk_yjxk = $scope.selectedRow.zyxk_yjxk;
        $scope.zyxk_ejxks = $scope.xkdm[$scope.selectedRow.zyxk_xkml][zyxk_yjxk];

    }

    $scope.update_dexk_xkml = function() {
        var dexk_xkml = $scope.selectedRow.dexk_xkml;
        var dexk_yjxks = [];
        //dexk_yjxks.push({yjxkdm: "-", yjxkmc: ""});

        var dexk_yjxks_object = $scope.xkdm[dexk_xkml];
        for (var key in dexk_yjxks_object) {
            if (dexk_yjxks_object.hasOwnProperty(key)) {
                dexk_yjxks.push(key);
            }
        }
        $scope.dexk_yjxks = dexk_yjxks;

    }

    $scope.update_dexk_yjxk = function() {
        var dexk_yjxk = $scope.selectedRow.dexk_yjxk;
        $scope.dexk_ejxks = $scope.xkdm[$scope.selectedRow.dexk_xkml][dexk_yjxk];

    }

    $scope.update_xktj = function(xktj) {
        var data = JSON.stringify(xktj);
        $scope.update_status.teacher_name = xktj.xm;
        $http.post("/xktj/", data).
        success(function(data, status, headers, config) {
            $scope.update_status.status = 'success';
            $scope.selectedRow.updated = true;
            console.log(data);
        }).
        error(function(data, status, headers, config) {
            $scope.update_status.status = 'error';
            console.log(data);
        });
    }

    $scope.refresh = function() {
         $window.location.reload();
    }

});
