brandLabel.controller("newsletterUsersCtrl", function($scope, httpService, $rootScope, toaster, $filter, ngTableParams) {
    $scope.users = {};
    $scope.isFiltersVisible = false;
     //$scope.isData = false;
    $scope.getUsers = function() {
        httpService.secureGet("newsletterusers")
            .success(function(response) {
                console.log("response", response);
                //$scope.users = response.docs;

                var data = angular.copy(response.docs);
                if(data.length>0){
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    filter: {
                        // name: 'M' // initial filter
                    },
                    sorting: {
                        // name: 'asc' // initial sorting
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {
                        // use build-in angular filter
                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                        orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

                        $scope.users = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.users);
                    }
                });
            } else{
                data="data not found";
            }

            })
            .error(function(error) {
                toaster.error({ title: "error", body: error.message });

            })
    }

   $scope.getExcel= function(){
       httpService.secureGet("getExcel")
            .success(function(response) {
                console.log("response", response);
                $scope.excel=response.docs;
                if(response.docs.length<1){
                    $scope.isData = true;
                }
            }).error(function(error) {
                toaster.error({ title: "error", body: error.message });

            })
        };
});