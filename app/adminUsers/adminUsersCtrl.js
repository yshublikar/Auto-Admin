brandLabel.controller("adminUsersCtrl", function($scope, httpService, $rootScope, $uibModal, ngTableParams, $filter,toaster) {
    $scope.addUser = function() {
        console.log("---------addConfig");
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/adminUsers/modals/addUser.html',
            controller: 'addUserCtrl',
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
                $scope.getUsers();
            }
        }, function() {

        })

    }
    $scope.editUser = function(user) {
        console.log("---------addConfig");
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/adminUsers/modals/addUser.html',
            controller: 'addUserCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return user;
                }
            }

        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                $scope.getUsers();
            }
        }, function() {

        })

    }
    $scope.setPassword = function(user) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/adminUsers/modals/setPassword.html',
            controller: 'setPasswordCtrl1',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return user;
                }
            }

        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                $scope.getUsers();
            }
        }, function() {

        })

    }

    $scope.getUsers = function() {
        httpService.secureGet("adminUsers")
            .success(function(response) {
                if (response.status == "success") {
                    $scope.users = angular.copy(response.docs)

                    $scope.isFiltersVisible = false;

                    var data = $scope.users;

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


                } else {

                    toaster.error({ title: "Error...!", body: response.message });

                }
            })
            .error(function(error) {

                toaster.error({ title: "Error...!", body: error.message });


            })
    }
    $scope.getUsers();
    $scope.deleteUser = function(admin) {

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this User!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.secureDelete("adminUser/" + admin._id)
                        .success(function(response) {
                            if (response.status == "success") {
                                $scope.getUsers();
                                toaster.success({ title: "success", body: "User is deleted successfully.." });
                            }
                        })
                        .error(function(error) {

                            toaster.error({ title: "Error...!", body: error.message });

                        })
                }

            });

    }
});

brandLabel.controller("addUserCtrl", function($scope, httpService, $rootScope, $uibModalInstance, modalData, toaster) {
    $scope.isEdit = false;
    if (modalData) {
        $scope.userModel = angular.copy(modalData);
        $scope.isEdit = true;
    } else {
        $scope.userModel = {};
    }

    $scope.addAdmin = function(form) {
        if (form.$valid) {
            $scope.processing = true;
            var method;
            if (!$scope.isEdit) {
                method = httpService.securePost("adminUser", $scope.userModel)
            } else {
                method = httpService.securePut("adminUser/" + $scope.userModel._id, $scope.userModel);
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

brandLabel.controller("setPasswordCtrl1", function($scope, httpService, $rootScope, $uibModalInstance, modalData, toaster) {

    console.log(modalData);
    $scope.setPassword = function(form) {
        if (form.$valid) {
            $scope.processing = true;
            httpService.securePut("setPassword/" + modalData._id, { password: $scope.password }).success(function(response) {
                    if (response.status == "success") {
                        $uibModalInstance.close('Ok');
                    } else {
                        alert(response.message)
                        toaster.error({ title: "Error...!", body: response.message });

                    }
                    $scope.processing = false;
                })
                .error(function(error) {
                    $scope.processing = false;
                    toaster.error({ title: "Error...!", body: response.message });


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