brandLabel.controller("importLogsCtrl", function($scope, httpService, $rootScope, $uibModal, $state, toaster, ngTableParams, $filter) {

    $scope.getAllCountry = function() {
        //console.log("---------citiesCtrl == in getAllCities()");

        httpService.secureGet("getCountry").success(function(response) {
            if (response.status == "success") {
                console.log("response", response.docs)
                // toaster.success({title: "success", body:"get all cities"});
                $scope.isFiltersVisible = false;
                $scope.cities = response.docs;
                var data = $scope.cities;
                $scope.logisData = data.length > 0 ? true : false;

                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 10, // count per page
                    filter: {
                        // name: 'M' // initial filter
                    },
                    sorting: {
                        name: 'asc' // initial sorting
                    }
                }, {
                    total: data.length, // length of data
                    getData: function($defer, params) {
                        // use build-in angular filter
                        var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                        orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

                        $scope.cities = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.cities);
                    }
                });

            } else {
                toaster.warning({ title: "warning", body: "longitude and latitude should be proper" });

                console.log("response", response.status)
            }
        }).error(function(error) {
            toaster.error({ title: "error", body: error.message });

        })
    };

    $scope.importNow = function(selectedCity) {
        console.log("---------importNow == in importNow()", selectedCity);


        httpService.put('importNow', selectedCity).success(function(response) {
            if (response.status == "success") {
                console.log("response", response.docs)
                $scope.getAllCountry();
            }
        }).error(function(error) {
            toaster.error({ title: "error", body: "error" });

        })
    };

});