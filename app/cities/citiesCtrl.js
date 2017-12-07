brandLabel.controller("citiesCtrl", function($scope, httpService, $rootScope, $uibModal, $state, toaster, ngTableParams, $filter) {

    var formdata = new FormData();

    $scope.getAllCities = function() {
        console.log("---------citiesCtrl == in getAllCities()");

        httpService.secureGet("getCities").success(function(response) {
            if (response.status == "success") {
                console.log("response", response.docs)
                // toaster.success({title: "success", body:"get all cities"});
                $scope.isFiltersVisible = false;
                $scope.cities = response.docs;
                var data = $scope.cities;

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



    }


    $scope.addCity = function() {
        console.log("---------citiesCtrl == in addCity()");
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/cities/modals/addCity.html',
            controller: 'addCityCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return
                }
            }
        })
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                toaster.success({ title: "success", body: " City is Addded successfully" });

                $scope.getAllCities();
            }
        }, function() {
            $scope.getAllCities();
        })
    }
    $scope.isFileExist = function(element) {
        if (element.files) {
            $scope.isImport = true;
        } else {
            $scope.isImport = false;
        }
    }

    $scope.uploadFile = function() {

        swal({
                title: "Do you want to proceed ?",
                text: "It may take a few minutes to Import Cities from file",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Import it !",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {

                    var file = $scope.citiesFile;
                    var cityForm = new FormData();

                    cityForm.append('file', file);

                    $scope.uploading = true;
                    $rootScope.isLoader = true;

                    console.log("requsting")
                    httpService.filePost("addCities/", cityForm)
                        .success(function(response) {
                            if (response.status == "success") {

                                $scope.getAllCities();
                                $rootScope.isLoader = false;
                                $scope.uploading = false;
                                $scope.isImport = false;
                                angular.element("input[type='file']").val(null);
                                toaster.success({ title: "success", body: response.count + " City added successfully.." });
                            }
                        })
                        .error(function(error) {
                            $rootScope.isLoader = false;
                            $scope.uploading = false;
                            $scope.isImport = false;
                            angular.element("input[type='file']").val(null);
                            toaster.error({ title: "Error", body: error.message });
                        })
                }
            })

    };

    $scope.editCity = function(city) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/cities/modals/addCity.html',
            controller: 'addCityCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return city
                }
            }
        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                toaster.success({ title: "success", body: " City is Updated successfully" });
                $scope.getAllCities();
            }
        }, function() {
            $scope.getAllCities();
        })
    }
    $scope.deleteCity = function(city) {


        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this City!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.secureDelete("deleteCity/" + city._id)
                        .success(function(response) {
                            if (response.status == "success") {
                                $scope.getAllCities();
                                toaster.success({ title: "success", body: "City is deleted successfully.." });
                            }
                        })
                        .error(function(error) {

                            toaster.error({ title: "Error", body: error.message });
                        })
                }

            });
    }
    $scope.getAllCities();
});


brandLabel.controller("addCityCtrl", function($scope, httpService, $rootScope, $uibModalInstance, modalData, $state, toaster) {
    $scope.isEdit = false;
    if (modalData) {
        $scope.cityModel = angular.copy(modalData);
        $scope.longitude = modalData.location.coordinates[0];
        $scope.latitude = modalData.location.coordinates[1];
        $scope.isEdit = true;
    } else {
        $scope.cityModel = {};

    }

    $scope.addCity = function(form) {
        if (form.$valid) {
            $scope.cityModel.location = {};
            $scope.cityModel.location.coordinates = []

            $scope.cityModel.location.coordinates.push($scope.longitude);
            $scope.cityModel.location.coordinates.push($scope.latitude);

            var method;
            if (!$scope.isEdit) {
                method = httpService.securePost("addCity", $scope.cityModel)
            } else {
                console.log("my city model", $scope.cityModel)
                $scope.cityModel.location.coordinates = [];
                $scope.cityModel.location.coordinates.push($scope.longitude);
                $scope.cityModel.location.coordinates.push($scope.latitude);
                method = httpService.securePut("updateCity/" + $scope.cityModel._id, $scope.cityModel);
            }

            method.success(function(response) {
                console.log("add city response----");
                console.log(response);
                if (response.status == "success") {
                    $uibModalInstance.close('Ok');
                }
            }).error(function(error) {
                console.log("------- Error", error);
                toaster.error({ title: "Error", body: "longitude & latitude should be proper" });
            })
        } else {
            toaster.error({ title: "Error", body: "All Fields are required" });
        }
    };
    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };
});



brandLabel.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);