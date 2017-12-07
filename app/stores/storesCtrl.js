brandLabel.controller("storesCtrl", function($scope, httpService, $rootScope, ngTableParams, $filter, toaster) {
    $scope.isFiltersVisible = false;
    $scope.SITE_URL= SITE_URL.replace('/#','');
    $scope.getAllStores = function() {
        httpService.secureGet('stores')
            .then(function(response) {
                if (response.data.status == "success") {
                    //console.log("storedata",response.data.docs);
                    var data = angular.copy(response.data.docs);
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

                            $scope.makeList = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                            params.total(orderedData.length);
                            // set total for recalc pagination
                            $defer.resolve($scope.makeList);
                        }
                    });
                } else {

                    toaster.error({ title: "Error...!", body: response.data.message });

                }
            }, function(error) {

                toaster.error({ title: "Error...!", body: error.message });
            });
    };
    $scope.getAllStores();

    $scope.deleteStore = function(stores) {
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this store!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.secureDelete('store/' + stores._id)
                        .success(function(response) {
                            if (response.status == 'success') {
                                $scope.getAllStores();
                                toaster.success({ title: "Deleted...!", body: "Record deleted successfully" });

                            } else {

                                toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });
                            }
                        })
                        .error(function(error) {
                            $scope.processing = false;
                            toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });
                        });
                }

            });


    };
});