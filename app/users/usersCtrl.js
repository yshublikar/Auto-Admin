brandLabel.controller("usersCtrl", function($scope, httpService, $rootScope, toaster, $filter, ngTableParams) {
    $scope.users = {};
    $scope.isFiltersVisible = false;
    $scope.getUsers = function() {
        httpService.secureGet("users")
            .success(function(response) {
                console.log("response", response);
                //$scope.users = response.docs;

                var data = angular.copy(response.docs);
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

            })
            .error(function(error) {
                toaster.error({ title: "error", body: error.message });

            })
    }

    $scope.changeStatus = function(user, status, msg) {
                 swal({
                 title: "Are you sure?",
                 text: "You want to "+ msg + " this User",
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonColor: "#DD6B55",
                 confirmButtonText: "Yes,"+ msg +" it!",
                 closeOnConfirm: true
             },
             function(isComfirm) {
                 if (isComfirm) {
                     data = { "status": status };
                     httpService.put("updateUserStatus/" + user._id, data)
                         .success(function(response) {
                             if (response.status = "success") {
                                 user.status = response.docs.status;
                             }
                         })
                         .error(function(err) {
                             toaster.error({ title: "Error", body: err.message });
                         });
                 }
             });
    }

    $scope.WarnedUser=function(user)
    {
        swal({
                 title: "Are you sure?",
                 text: "You want to WarnedUser this User",
                 type: "warning",
                 showCancelButton: true,
                 confirmButtonColor: "#DD6B55",
                 confirmButtonText: "Yes, WarnedUser!",
                 closeOnConfirm: true
             },
             function(isComfirm) {
                 if (isComfirm) {
                     data = { "status": status };
                     httpService.post("warneduser/" + user._id)
                         .success(function(response) {
                             if (response.status = "success") {
                                 console.log('warneduser success');
                                 $scope.getUsers();
                             }
                         })
                         .error(function(err) {
                             toaster.error({ title: "Error", body: err.message });
                         });
                 }
             });
    }
});