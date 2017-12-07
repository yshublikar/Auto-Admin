brandLabel.controller("carModelCtrl", function($scope, httpService, $rootScope, $uibModal, ngTableParams, $filter, toaster) {
    $scope.isFiltersVisible = true;
    $scope.addModel = function() {
        $rootScope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/carModels/addModel.html',
            controller: 'addModelCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return
                }
            }

        });
        $rootScope.modalInstance.result.then(function(response) {
            console.log(response)
            $scope.getAllCarModels();
        }, function() {

        })

    }

    $scope.getAllCarModels = function() {
        httpService.get("carModels")
            .success(function(response) {
                if (response.status = "success") {
                    $scope.carModels = response.docs;

                    console.log($scope.carModels);
                    var data = $scope.carModels;
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

                            $scope.carModels = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                            params.total(orderedData.length);
                            // set total for recalc pagination
                            $defer.resolve($scope.carModels);
                        }
                    });
                }
            })
            .error(function(err) {

                toaster.error({ title: "Error...!", body: err.message });

            });
    }

    $scope.removeCarModel = function(carModelId, carModelindex) {

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this Model!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.delete("carModel/" + carModelId)
                        .success(function(response) {
                            if (response.status = "success") {
                                toaster.success({ title: "Deleted", body: "Model Deleted Successfully" });
                                $scope.getAllCarModels();
                            }
                        })
                        .error(function(err) {
                            toaster.error({ title: "Error", body: err.message });

                        });
                }

            });

    }
    $scope.editCarModel = function(carModelIndex) {

        $rootScope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/carModels/addModel.html',
            controller: 'addModelCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return $scope.carModels[carModelIndex];
                }
            }
        });
        $rootScope.modalInstance.result.then(function(response) {
            console.log(response)
            $scope.getAllCarModels();
        }, function() {

        })
    }

});

brandLabel.controller("addModelCtrl", function($scope, httpService, $rootScope, $uibModalInstance, modalData, toaster) {
    $scope.model = {};
    $scope.variant = {};
    $scope.model.variants = [];

    $scope.editCarModelData = angular.copy(modalData);

    $scope.flagCount = 0;

    if($scope.editCarModelData)
        $scope.flagVariant = false;
    else
        $scope.flagVariant = true;

    $scope.getMakes = function() {
        httpService.get("makes")
            .success(function(response) {
                if (response.status = "success") {
                    $scope.makes = response.docs;
                    if ($scope.flagCount == 3 && $scope.editCarModelData) {
                        $scope.setData();
                    } else {
                        $scope.flagCount++;
                    }
                }
            })
            .error(function(err) {
                toaster.error({ title: "Error", body: err.message });
            });
    }

    $scope.getAllConfigs = {};
    $scope.getBodyStyle = function() {
        httpService.secureGet("getMastersByKey/Car_Body_Styles")
            .success(function(response) {
                if (response.status = "success") {
                    $scope.getAllConfigs.bodyStyles = angular.copy(response.docs);
                    if ($scope.flagCount == 3 && $scope.editCarModelData) {
                        $scope.setData();
                    } else {
                        $scope.flagCount++;
                    }
                }
            })
            .error(function(err) {
                toaster.error({ title: "Error", body: err.message });
            });
    }

    $scope.getSegmentType = function() {
        httpService.secureGet("getMastersByKey/Car_Segment_Types")
            .success(function(response) {
                if (response.status = "success") {
                    $scope.getAllConfigs.segmentTypes = angular.copy(response.docs);
                    if ($scope.flagCount == 3 && $scope.editCarModelData) {
                        $scope.setData();
                    } else {
                        $scope.flagCount++;
                    }
                }
            })
            .error(function(err) {
                toaster.error({ title: "Error", body: err.message });
            });
    }

    $scope.getEngineType = function() {
        httpService.secureGet("getMastersByKey/Car_Engine_Types")
            .success(function(response) {
                if (response.status = "success") {
                    $scope.getAllConfigs.engineTypes = angular.copy(response.docs);
                    if ($scope.flagCount == 3 && $scope.editCarModelData) {
                        $scope.setData();
                    } else {
                        $scope.flagCount++;
                    }
                }
            })
            .error(function(err) {
                toaster.error({ title: "Error", body: err.message });
            });
    }

    $scope.getMakes();
    $scope.getBodyStyle();
    $scope.getSegmentType();
    $scope.getEngineType();

    $scope.setData = function() {
        $scope.model = $scope.editCarModelData;
        $scope.model.makeId = $scope.editCarModelData.makeId._id;
        $scope.model.bodyStyle = $scope.editCarModelData.bodyStyle._id;
        $scope.model.segmentType = $scope.editCarModelData.segmentType._id;
        for (var i = 0; i < $scope.model.variants.length; i++) {
            $scope.model.variants[i].engineType = $scope.model.variants[i].engineType._id;
        }
    }

    $scope.saveCarModel = function(form) {
        if (form.$valid) {
            if ($scope.variant.name) {
                $scope.saveVariant();
            }

            if ($scope.editCarModelData) {
                if ($scope.variant.name) {
                    $scope.saveVariant();
                }
                httpService.put("carModel/" + $scope.model._id, $scope.model)
                    .success(function(response) {
                        if (response.status = "success") {
                            toaster.success({ title: "Success...!", body: "Record Updated SuccessFully" });
                            $rootScope.modalInstance.close(true)
                        }
                    })
                    .error(function(err) {
                        toaster.error({ title: "Error", body: err.message });
                    });
            } else {
                httpService.post("carModel", $scope.model)
                    .success(function(response) {
                        if (response.status = "success") {
                            toaster.success({ title: "Success", body: "Record Saved SuccessFully" });
                            $rootScope.modalInstance.close(true)
                        }
                    })
                    .error(function(err) {
                        toaster.error({ title: "Error", body: err.message });
                    });
            }
        } else {
            toaster.warning({ title: "Warning...!", body: "All fields are required." });
        }
    }

    $scope.saveVariant = function() {
        if (!$scope.variant.name) {
            toaster.warning({ title: "Warning...!", body: "Variant Name is required." });
            return;
        }
        if (!$scope.variant.engineType) {
            toaster.warning({ title: "Warning...!", body: "Engine Type is Required." });
            return;
        }
        $scope.model.variants.push({ "name": $scope.variant.name, "engineType": $scope.variant.engineType })
        console.log($scope.model.variants);
        $scope.variant = {};
        if ($scope.model.variants.length) {
            $scope.flagVariant = false;
        }
    }

    $scope.removeVariant = function(variantIndex) {
        $scope.model.variants.splice(variantIndex, 1);
        if (!$scope.model.variants.length) {
            $scope.flagVariant = true;
        }
    }

    $scope.cancel = function() {
        $rootScope.modalInstance.close(false)
    }
});