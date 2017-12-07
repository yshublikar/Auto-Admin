brandLabel.controller("groupTypeCtrl", function($scope, httpService, $rootScope, $uibModal, ngTableParams, $filter, toaster) {
    $scope.addGroupType = function() {
        console.log("---------addConfig");
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/groupType/modals/addGroupType.html',
            controller: 'addGroupTypeCtrl',
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
                $scope.getGroupType();
            }
        }, function() {

        })

    }
    $scope.isActive = function(group) {

        if (group.name == 'AMENITIES' || group.name == 'INTEGRITY' || group.name == 'QUALITY OF WORK' || group.name == 'CUSTOMER SERVICE') {
            group["disable"] = true;
        } else {
            group["disable"] = false;
        }
    }

    $scope.editgroup = function(group) {
        console.log("---------addConfig");
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/groupType/modals/addGroupType.html',
            controller: 'addGroupTypeCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return group;
                }
            }

        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                $scope.getGroupType();
            }
        }, function() {

        })

    }


    $scope.getGroupType = function() {
        httpService.secureGet("groupType")
            .success(function(response) {
                if (response.status == "success") {
                    $scope.groups = angular.copy(response.docs)

                    $scope.isFiltersVisible = false;

                    var data = $scope.groups;

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

                            $scope.groups = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                            params.total(orderedData.length);
                            // set total for recalc pagination
                            $defer.resolve($scope.groups);
                        }
                    });


                } else {

                    toaster.error({ title: "Error...!", body: response.message });

                }
            })
            .error(function(error) {

                toaster.error({ title: "Error...!", body: error.message });


            })
    }
    $scope.getGroupType();
    $scope.changeGroupStatus = function(group) {

        swal({
                title: "Are you sure?",
                text: "You want to change status?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, change it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    //httpService.secureDelete("groupType/" + group._id)
                    console.log("group: ", group);

                    httpService.securePut("changeTypeStatus/" + group._id, group)
                        .success(function(response) {
                            if (response.status == "success") {
                                $scope.getGroupType();
                                toaster.success({ title: "Success", body: "Status changed successfully.." });
                            }
                        })
                        .error(function(error) {

                            toaster.error({ title: "Error...!", body: error.message });

                        })
                }

            });

    }
});

brandLabel.controller("addGroupTypeCtrl", function($scope, httpService, $rootScope, $uibModalInstance, modalData, toaster) {
    $scope.isEdit = false;
    if (modalData) {
        $scope.groupModel = angular.copy(modalData);
        $scope.isEdit = true;
    } else {
        $scope.groupModel = {};
        $scope.groupModel.editable = true;
    }

    $scope.addGroup = function(form) {
        if (form.$valid) {
            $scope.processing = true;
            var method;
            if (!$scope.isEdit) {
                method = httpService.securePost("groupType", $scope.groupModel)
            } else {
                method = httpService.securePut("groupType/" + $scope.groupModel._id, $scope.groupModel);
            }

            method.success(function(response) {
                    if (response.status == "success") {
                        $uibModalInstance.close('Ok');

                    } else {

                        toaster.error({ title: "Error...!", body: response.message });

                    }
                    $scope.processing = false;
                })
                .error(function(error) {
                    $scope.processing = false;

                    toaster.error({ title: "Error...!", body: error.message });


                })
        } else {

            toaster.warning({ title: "Warning...!", body: "All fields are required." });
        }
    };

    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };
});