/**
 * Created by liudonghua on 2016-09-12.
 */
app = angular.module('myApp', []);

app.controller('tableCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.rowCollection = [];

    $scope.setSelected = function(row) {
        $scope.selectedRow = row;
        $scope.selected_row_id = row.id;
        $scope.yjxks = [{yjxkdm: row.zykx, yjxkmc: row.zyxk}];
        $scope.zys = [{zydm: row.dexk, zymc: row.dexk}];
    };

    $http.get('/xktj/20160019').then(function(response) {
        if(response.status == 200) {
            for(let row of response.data) {
                $scope.rowCollection.push(row);
            }
        }
    });

    $http.get('/xkdm').then(function(response) {
        if(response.status == 200) {
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
        $http.post("/xktj/", data).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(data);
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

}]);