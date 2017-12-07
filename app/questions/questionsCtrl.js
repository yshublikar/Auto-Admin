brandLabel.controller("questionsCtrl", function($scope, httpService, $rootScope, $uibModal, toaster, $filter, ngTableParams) {

    $scope.getQuestions = function() {
        httpService.secureGet("questions")
            .success(function(response) {
                if (response.status == "success") {
                    $scope.questionModel = angular.copy(response.docs);
                    var data = $scope.questionModel;
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

                            $scope.questionModel = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                            params.total(orderedData.length);
                            // set total for recalc pagination
                            $defer.resolve($scope.questionModel);
                        }
                    });
                }
            })
            .error(function(error) {
                toaster.error({ title: "error", body: error.message });

            })
    }

    $scope.addQuestion = function(question) {
        if ($scope.questionModel.type == 'Boolean') {
            $scope.optionValues = "1,0";
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/questions/modals/addQuestion.html',
            controller: 'addQuestionCtrl',
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

                $scope.getQuestions();
            }
        }, function() {

        })
    }

    $scope.editQuestion = function(question) {
        //console.log("my from data",question);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/questions/modals/addQuestion.html',
            controller: 'addQuestionCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return question
                }
            }
        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                toaster.success({ title: "success", body: " Question is updated successfully" });
                $scope.getQuestions();
            }
        }, function() {
            $scope.getQuestions();
        })
    }

    $scope.deleteQuestion = function(question) {
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this Question!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.securePut("removeQuestion/" + question._id)
                        .success(function(response) {
                            if (response.status == "success") {
                                $scope.getQuestions();
                                toaster.success({ title: "success", body: "Question is deleted successfully.." });
                            }
                        })
                        .error(function(error) {

                            toaster.error({ title: "Error", body: error.message });

                        })
                }

            });
    }

});

brandLabel.controller("addQuestionCtrl", function($scope, httpService, $rootScope, $uibModalInstance, toaster, modalData) {


    $scope.isEdit = false;
    if (modalData) {
        $scope.questionModel = angular.copy(modalData);
        $scope.isEdit = true;
        $scope.options = [];
        $scope.optionValues = [];

        _.each($scope.questionModel.options, function(option) {
            $scope.options.push(option.text);
            $scope.optionValues.push(option.value);
        });

        $scope.options = $scope.options.join(",");
        $scope.optionValues = $scope.optionValues.join(",");

    } else {
        $scope.questionModel = {};
    }

    $scope.saveQuestion = function(form) {
        if ($scope.questionModel.type == 'Boolean') {
            console.log("options", $scope.options);
            //console.log("optionValues",$scope.optionValues);
            $scope.questionModel.options = [];
            console.log('hhhh')

            // 


            var value = [1, 0]; //null
            // options.filter(Boolean);
            var options = $scope.options.split(",");
            console.log("value", value);

            var valid = true;

            if (options.length == 2) {
                for (var i = 0; i < options.length; i++) {
                    $scope.questionModel.options.push({
                        text: options[i].trim(),
                        value: parseInt(value[i])
                    })
                }
            } else {
                valid = false;
                toaster.warning({ title: "warning", body: "No of options shoulde be 2" });
            }
        } else {
            var options = $scope.options.split(","); //""
            var value = $scope.optionValues.split(","); //null
            // options.filter(Boolean);

            var valid = true;
            $scope.questionModel.options = [];
            //console.log("my values", parseInt(value));
            if (options.length == value.length) {
                for (var i = 0; i < options.length; i++) {
                    if (value[i] && options[i]) {
                        $scope.questionModel.options.push({
                            text: options[i].trim(),
                            value: parseInt(value[i].trim())
                        })
                    } else {
                        valid = false;
                        break;
                    }

                }
            } else {
                valid = false;
                toaster.warning({ title: "warning", body: "No of options and values must be same" });
            }
        }



        if (valid) {
            console.log("from data", $scope.questionModel);
            $scope.processing = "Processing...";
            if (form.$valid) {
                var method;
                if (!$scope.isEdit) {
                    method = httpService.securePost("addQuestion", $scope.questionModel);
                } else {
                    method = httpService.securePut("updateQuestion/" + $scope.questionModel._id, $scope.questionModel);
                }
                method.success(function(response) {
                        if (response.status == "success") {
                            $uibModalInstance.close('Ok');
                        }
                        $scope.processing = false;
                    })
                    .error(function(error) {
                        $scope.processing = false;

                        toaster.error({ title: "Error", body: error.message });
                    })
            } else {
                $scope.processing = false;
                toaster.error({ title: "Error", body: "All Fields are required" });

            }
        } else {
            toaster.error({ title: "Error", body: "Entered incorrect data." });

        }


    };

    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };

});