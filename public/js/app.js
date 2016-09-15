/**
 * Created by liudonghua on 2016-09-12.
 */
app = angular.module('myApp', ['ngRoute', 'ngTable', 'ngSanitize', 'ngCsv']);

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
    //$locationProvider.html5Mode(true);
});

app.controller('navCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
        return route === $location.path();
    }
});

app.controller('printCtrl', function($scope, $rootScope) {
    $scope.current_xy = $rootScope.current_xy;
    $scope.data = $rootScope.data;
    $scope.user_id = $rootScope.user_id;

    if(!$scope.data) {
        $http.get('/xktj/relevant/by_szxy/' + $scope.current_xy)
            .success(function (data, status) {
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

app.controller('tableCtrl', ['$scope', '$rootScope', '$http', '$filter', 'NgTableParams', function ($scope, $rootScope, $http, $filter, NgTableParams) {

    $scope.update_status = {status: "", teacher_name: ""};

    var self = this;

    $scope.setSelected = function(row) {
        $scope.selectedRow = row;
        $scope.selected_row_id = row.id;
        $scope.yjxks = [{yjxkdm: row.zykx, yjxkmc: row.zyxk}];
        $scope.zys = [{zydm: row.dexk, zymc: row.dexk}];
    };

    $scope.update_szxy = function() {
        $http.get('/xktj/relevant/by_szxy/' + $scope.selected_szxy)
            .success(function (data, status) {
                update_table_data(data);
            });
    };

    if(!$scope.szxys) {
        $http.get('/xktj/xy/')
            .success(function (data, status) {
                $scope.szxys = data;
            });
    }

    var user_id = angular.element("#navbar > ul > li > a > span").text();
    var user_type = angular.element("#navbar > ul > li.hidden").text();
    $scope.user_id = user_id;
    $scope.user_type = user_type;

    var update_table_data = function (data) {
        $scope.data = data;
        $scope.current_xy = data[0].szxy;
        $rootScope.current_xy = $scope.current_xy;
        $rootScope.data = $scope.data;

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
        $http.get('/xktj/relevant/by_id/' + user_id)
            .success(function (data, status) {
                update_table_data(data);
            });
    }
    else {
        update_table_data($scope.data);
    }


    if(!$scope.xkdm) {
        $http.get('/xkdm').then(function (response) {
            if (response.status == 200) {
                $scope.xkdm = response.data;

                var xkmls = [];
                //xkmls.push({mldm: "-", mlmc: ""});
                var xkdm = response.data;
                for (var key in xkdm) {
                    if (xkdm.hasOwnProperty(key)) {
                        xkmls.push({mldm: key, mlmc: xkdm[key].mlmc});
                    }
                }
                $scope.xkmls = xkmls;
            }
        });
    }



}]);

app.controller('formCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.update_xkml = function() {
        var mlmc = $scope.selected_xkml;
        var xkdm = $scope.xkdm;
        var mldm = null;
        for (var key in xkdm) {
            if (xkdm.hasOwnProperty(key) && xkdm[key].mlmc == mlmc) {
                mldm = key;
            }
        }
        $scope.mldm = mldm;

        var yjxks = [];
        //yjxks.push({yjxkdm: "-", yjxkmc: ""});
        var yjxks_object = $scope.xkdm[mldm].yjxks;
        for (var key in yjxks_object) {
            if (yjxks_object.hasOwnProperty(key)) {
                yjxks.push({yjxkdm: key, yjxkmc: yjxks_object[key].yjxkmc});
            }
        }
        $scope.yjxks = yjxks;

    }

    $scope.update_yjxk = function() {
        var yjxkmc = $scope.selectedRow.zyxk;
        var yjxks = $scope.xkdm[$scope.mldm].yjxks;
        var zyxkdm = null;
        for (var key in yjxks) {
            if (yjxks.hasOwnProperty(key) && yjxks[key].yjxkmc == yjxkmc) {
                zyxkdm = key;
            }
        }
        $scope.zyxkdm = zyxkdm;

        $scope.zys = $scope.xkdm[$scope.mldm].yjxks[zyxkdm].zys;

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

}]);