brandLabel.controller("experiencesCtrl", function($scope, httpService, $rootScope, toaster, $stateParams, $filter, ngTableParams) {
    $scope.oneAtATime = true;
    $scope.isFiltersVisible = false;
    $scope.isShowFlagged=false;

    $scope.getExperiences = function() {
        var url = 'experiences';
        if ($scope.isShowFlagged) {
            url += "?isShowFlagged=" + $scope.isShowFlagged;
        }
        httpService.get(url).success(function(response) {
            if (response.status == "success") {
                console.log("data", response.docs);
                // $scope.experiences=response.docs;
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

                        $scope.experiences = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.experiences);
                    }
                });


            }
        }).error(function(error) {

            toaster.error({ title: "Error...!", body: error.message });


        })
    };

    $scope.deleteExperience = function(id) {
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this experience!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.secureDelete('experience/' + id)
                        .success(function(response) {
                            if (response.status == 'success') {
                                $scope.getExperiences();
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