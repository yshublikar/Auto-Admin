brandLabel.controller("addStoreCtrl", function($scope, httpService, $rootScope, $state, $stateParams, $filter, toaster) {
    $scope.storeModel = { workingHours: [] };
    var weekday = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (var i = 0; i < 7; i++) {
        $scope.storeModel.workingHours.push({ day: weekday[i], closed: false, start: 0, end: 0 })
    }
    $scope.hours = [];
    for (var i = 0; i < 25; i++) {
        $scope.hours.push(i == 0 ? "" : i)
    }

    $scope.makeVanityUrl = function() {
        if ($scope.storeModel.name) {
            $scope.storeModel.vanityUrl = ($scope.storeModel.name).toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")
        } else {
            $scope.storeModel.vanityUrl = "";
        }
    };
     $scope.SITE_URL= SITE_URL.replace('/#','');
    $scope.getStore = function() {
        httpService.secureGet('store/' + $stateParams.storeId)
            .success(function(response) {
                if (response.status == 'success') {
                    console.log("reponse: ", response.doc);
                    if (response.doc.workingHours.length == 0) {
                        //console.log("in if condition");
                        response.doc.workingHours = $scope.storeModel.workingHours;
                    }
                    $scope.storeModel = angular.copy(response.doc);
                   /* $scope.storeModel.featuredFrom=new Date($scope.storeModel.featuredFrom);
                    $scope.storeModel.featuredTo=new Date($scope.storeModel.featuredTo);*/
                    $scope.storeModel.lattitude = response.doc.location.coordinates[0];
                    $scope.storeModel.longitude = response.doc.location.coordinates[1];
                } else {
                    toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });

                }
            })
            .error(function(error) {
                $scope.processing = false;
                toaster.error({ title: "Error",body: error.message });


            });

    };

    if ($stateParams.storeId) {
        $scope.getStore();
    }


    $scope.addStore = function(form) {
        if (form.$valid && document.getElementById('icon').files[0] != null) {

            console.log("file data****************", document.getElementById('icon').files[0]);
          
            $scope.processing = true;


            var fd = new FormData();
            fd.append('file', document.getElementById('icon').files[0]);
            fd.append('storeModel', JSON.stringify($scope.storeModel));


            httpService.filePost('store', fd)
                .success(function(response) {
                    if (response.status == 'success') {
                        $state.go('app.stores');
                        $scope.processing = false;
                    } else {
                        toaster.error({ title: "Error", body: response.message });

                    }
                })
                .error(function(error) {
                    console.log();
                    $scope.processing = false;
                    toaster.error({ title: "Error", body: error.error });

                });
        } else {
            //toaster.error({ title: "Error", body: "Please fill required fields." });

        }
    };
    $scope.updateStore = function(form) {
        if (form.$valid) {
            $scope.processing = true;
            var fd = new FormData();
            fd.append('file', document.getElementById('icon').files[0]);
            fd.append('storeModel', JSON.stringify($scope.storeModel));

            httpService.filePut('store/' + $stateParams.storeId, fd)
                .success(function(response) {
                    if (response.status == 'success') {
                        $state.go('app.stores');
                        $scope.processing = false;
                    } else {
                        toaster.error({ title: "Error", body: response.message });

                    }
                })
                .error(function(error) {
                    $scope.processing = false;
                    toaster.error({ title: "Error", body:error.error });

                });
        } else {
            toaster.error({ title: "Error", body: "Please fill required fields." });

        }
    };

    $scope.setCountry = function(cityId) {
        var city = $filter('filter')($scope.cities, { _id: cityId })[0];
        $scope.storeModel.country = city.country;
        $scope.storeModel.state = city.state;
    }

    $scope.getAllCities = function() {
        httpService.secureGet('getAllCities')
            .success(function(response) {
                if (response.status == 'success') {
                    $scope.cities = angular.copy(response.docs);
                } else {
                    toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });

                }
            })
            .error(function(error) {
                $scope.processing = false;
                toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });

            });

    };
    $scope.getAllCities();
    $scope.getAllMakes = function() {
        httpService.secureGet('makes')
            .success(function(response) {
                if (response.status == 'success') {
                    $scope.makes = angular.copy(response.docs);
                } else {
                    toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });

                }
            })
            .error(function(error) {
                $scope.processing = false;
                toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later." });

            });

    };
    $scope.getAllMakes();




});