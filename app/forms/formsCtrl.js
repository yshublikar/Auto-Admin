brandLabel.controller("formsCtrl", function($scope, httpService, $rootScope, ngTableParams, $filter, toaster) {

    scope = $scope;

    $scope.status = [{
        'id': '',
        'title': ''
    }, {
        'id': 'Active',
        'title': 'Active'
    }, {
        'id': 'Archieved',
        'title': 'Archieved'
    }];

    $scope.getForms = function() {

        $scope.isFiltersVisible = false;

        httpService.get('forms')
            .then(function(response) {
                console.log(response);
                $scope.formList = response.data.docs;
                //console.log(response.data);
                var data = $scope.formList;
                console.log(data);
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

                        $scope.formList = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                        params.total(orderedData.length);
                        // set total for recalc pagination
                        $defer.resolve($scope.formList);
                    }
                });
            }, function(error) {

                toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later" });
            });
    };

    $scope.getForms();


    $scope.deleteForm = function(formId) {
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

                httpService.delete('form/' + formId).then(function(response) {

                    toaster.success({ title: "Deleted...!", body: "Record deleted successfully" });

                  
                    $scope.getForms();
                }, function(error) {
                    toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later" });

                });
            }

        });
    };


});