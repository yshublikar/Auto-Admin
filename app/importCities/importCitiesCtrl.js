brandLabel.controller("importCitiesCtrl", function($scope, httpService, $rootScope, $uibModal, $state, toaster, ngTableParams, $filter) {

    var formdata = new FormData();
    $scope.SITE_URL= SITE_URL.replace('/#','');
    
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
                    cityForm.append('country', $scope.countryCode);

                    $scope.uploading = true;
                    $rootScope.isLoader = true;

                    console.log("requsting")
                    httpService.filePost("addCities/", cityForm)
                        .success(function(response) {
                            if (response.status == "success") {
                                console.log("response Data", response)
                                $rootScope.isLoader = false;
                                $scope.uploading = false;
                                $scope.isImport = false;
                                angular.element("input[type='file']").val(null);
                                toaster.success({ title: "success", body: response.message });
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