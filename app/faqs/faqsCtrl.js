brandLabel.controller("faqsCtrl", function($scope, httpService, $rootScope, $uibModal, ngTableParams, $filter, toaster) {
    $scope.getFAQs = function() {
        $scope.isFiltersVisible = false;
        httpService.get('getFAQs').then(function(response) {
            $scope.faqs = response.data.docs;
            console.log("faq data", $scope.faqs);
            var data = $scope.faqs;
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

                    $scope.faqs = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length);
                    // set total for recalc pagination
                    $defer.resolve($scope.faqs);
                }
            });
        }, function(error) {

            toaster.error({ title: "Error...!", body: "Oops! Some problem occured, please try again later" });
        });
    };

    $scope.removeFAQ = function(id) {

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this FAQ!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.delete("removeFAQ/" + id)
                        .success(function(response) {
                            if (response.status == "success") {
                                $scope.getFAQs();
                                toaster.success({ title: "success", body: "FAQ is deleted successfully.." });
                            }
                        })
                        .error(function(error) {

                            toaster.error({ title: "Error...!", body: error.message });

                        })
                }

            });


    };
});