brandLabel.controller("featuredStoresCtrl", function($scope, httpService, $rootScope, ngTableParams, $filter, toaster, $uibModal) {
    $scope.isFiltersVisible = false;
    $scope.getAllStores = function() {
        httpService.secureGet('featuredStores')
            .then(function(response) {
                if (response.data.status == "success") {
                    console.log("response for featuredstores", response.data.docs);

                    var myArr = [];
                  
                    for (var i = 0; i < response.data.docs.length; i++) {
                        
                        for (var j = 0; j < response.data.docs[i].featuredStores.length; j++) {
                            var myData = {};
                            myData.cityId=response.data.docs[i]._id
                            myData.cityName = response.data.docs[i].name;
                            myData.storeId=response.data.docs[i].featuredStores[j]._id; 
                            myData.storeName = response.data.docs[i].featuredStores.length > 0 && response.data.docs[i].featuredStores[j].storeId && response.data.docs[i].featuredStores[j].storeId.name? response.data.docs[i].featuredStores[j].storeId.name:'';
                            myData.from = response.data.docs[i].featuredStores[j].from;
                            myData.to = response.data.docs[i].featuredStores[j].to;
                            myArr.push(myData);
                        }
                        
                    }
                   
                    var data = myArr;

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
                        total: myArr.length, // length of data
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



    $scope.addStore = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/featuredStores/modals/addFeaturedStore.html',
            controller: 'addFeaturedStoreCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return
                }
            }
        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                toaster.success({ title: "success", body: " Question is Addded successfully" });

                $scope.getAllStores();
            }
        }, function() {

        })
    }

    $scope.deleteStore=function(store) {
        console.log(" delete store",store);
            swal({
            title: "Are you sure?",
            text: "Your will not be able to recover this record!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
        }, function(isConfirm) {
            if (isConfirm) {

                httpService.delete('deletefeaturedstores/'+store.cityId+'/' + store.storeId).then(function(response) {

                    toaster.success({ title: "Deleted...!", body: "Record deleted successfully" });

                                     $scope.getAllStores();
                }, function(error) {
                    toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later" });

                });
            }

        });
    }
});

brandLabel.controller("addFeaturedStoreCtrl", function($scope, httpService, $rootScope, $uibModalInstance, toaster, modalData) {
    $scope.searchCity = function(keyword) {
        console.log(" search city Function ", keyword);
        httpService.get('searchcity?search=' + keyword)
            .success(function(response) {
                console.log(response);
                $scope.cityList = response.docs;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })
    };
    $scope.searchStore = function(keyword) {
        //console.log("city",city);
        httpService.get('searchstore?cityId=' + $scope.cityId + '&search=' + keyword)
            .success(function(response) {
                console.log(response);
                $scope.storeList = response.docs;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })
    };
    $scope.selectCity = function($item) {
        //console.log("cityIndex",cityIndex);
        console.log("$item", $item._id);
        $scope.cityId = $item._id;
    }

    $scope.selectStore = function($item) {
        //console.log("cityIndex",cityIndex);
        console.log(" store $item", $item._id);
        $scope.storeId = $item._id;
    }
    $scope.saveStore = function() {
        $scope.processing = "Processing...";
        var featuredStore = {
            'storeId': $scope.storeId,
            'from': $scope.from,
            'to': $scope.to
        }
        httpService.put('addFeaturedStore/' + $scope.cityId, featuredStore)
            .success(function(response) {
                console.log("addFeaturedStore response.....", response);
                if (response.status == "success") {
                    $uibModalInstance.close('Ok');
                }
                $scope.processing = false;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })

    }

    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };
});