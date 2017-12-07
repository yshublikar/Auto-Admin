brandLabel.controller("featuredExperiencesCtrl", function($scope, httpService, $rootScope, ngTableParams, $filter, toaster, $uibModal) {
    console.log("featuredExperiencesCtrl");
    $scope.isFiltersVisible = false;
    $scope.getAllExperiences = function() {
        httpService.secureGet('featuredexperiences')
            .then(function(response) {
                if (response.data.status == "success") {
                    console.log("response for featuredstores", response.data.docs);

                    var myArr = [];

                    for (var i = 0; i < response.data.docs.length; i++) {

                        for (var j = 0; j < response.data.docs[i].featuredExperiences.length; j++) {
                            var myData = {};
                            myData.cityId = response.data.docs[i]._id
                            myData.cityName = response.data.docs[i].name;
                            myData.experienceId = response.data.docs[i].featuredExperiences[j]._id;
                            myData.title = response.data.docs[i] && response.data.docs[i].featuredExperiences.length > 0 && response.data.docs[i].featuredExperiences[j].experienceId && response.data.docs[i].featuredExperiences[j].experienceId.posts && response.data.docs[i].featuredExperiences[j].experienceId.posts.length > 0 ? response.data.docs[i].featuredExperiences[j].experienceId.posts[0].title : '';
                            myData.from = response.data.docs[i].featuredExperiences[j].from;
                            myData.to = response.data.docs[i].featuredExperiences[j].to;
                            myArr.push(myData);
                        }

                    }
                    console.log("myArr", myArr);
                    var data = myArr;

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
                        total: myArr.length, // length of data
                        getData: function($defer, params) {
                            // use build-in angular filter
                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                            orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) : orderedData;

                            $scope.makeList = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                            params.total(orderedData.length);
                            // set total for recalc pagination
                            $defer.resolve($scope.makeList);
                        }
                    });
                } else {

                    toaster.error({ title: "Error...!", body: response.data.message });

                }
            }, function(error) {

                toaster.error({ title: "Error...!", body: error.message });
            });
    };
    $scope.getAllExperiences();



    $scope.addExperience = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/featuredExperiences/modals/addFeaturedExperiences.html',
            controller: 'addFeaturedExperiencesCtrl',
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
                toaster.success({ title: "success", body: " Experience is Addded successfully" });

                $scope.getAllExperiences();
            }
        }, function() {

        })
    }

    $scope.deleteExperience = function(experience) {
        console.log(" delete experience", experience);
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

                httpService.delete('deletefeaturedexperience/' + experience.cityId + '/' + experience.experienceId).then(function(response) {

                    toaster.success({ title: "Deleted...!", body: "Record deleted successfully" });
                    $scope.getAllExperiences();
                }, function(error) {
                    toaster.error({ title: "Error", body: "Oops! Some problem occured, please try again later" });

                });
            }

        });
    }
});

brandLabel.controller("addFeaturedExperiencesCtrl", function($scope, httpService, $rootScope, $uibModalInstance, toaster, modalData) {
    $scope.searchCity = function(keyword) {
        console.log(" search city Function ", keyword);
        httpService.get('searchcity?search=' + keyword)
            .success(function(response) {
                console.log(response);
                $scope.cityList = response.docs;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })
    };
    $scope.searchExperience = function(keyword) {
        //console.log("city",city);
        httpService.get('searchexperience?cityId=' + $scope.cityId + '&search=' + keyword)
            .success(function(response) {
                console.log("searchexperience", response.docs)
                $scope.experienceList = [];

                console.log("experienceList doc length", response.docs.length);
                for (var i = 0; i < response.docs.length; i++) {
                    console.log("response.docs[i].posts", response.docs[i].posts.length);
                    for (var j = 0; j < response.docs[i].posts.length; j++) {
                        $scope.experience = {};
                        $scope.experience.title = response.docs[i].posts[j].title;
                        $scope.experience.id = response.docs[i]._id;

                        $scope.experienceList.push($scope.experience);
                    }
                }
                console.log("experienceList", $scope.experienceList);


            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })
    };
    $scope.selectCity = function($item) {
        //console.log("cityIndex",cityIndex);
        console.log("$item", $item._id);
        $scope.cityId = $item._id;
    }

    $scope.selectExperience = function($item) {
        //console.log("cityIndex",cityIndex);
        console.log(" selectExperience $item", $item);
        $scope.experienceId = $item.id;
    }
    $scope.saveExperience = function() {
        $scope.processing = "Processing...";

        // var fromDate = new Date($scope.from).toISOString();
        // var toDate = new Date($scope.to).toISOString();
        // var fromDate = new Date($scope.from);
        // var toDate = new Date($scope.to);

       // fromDate = fromDate.getFullYear() + "-" + (fromDate.getMonth()+1) + "-" + fromDate.getDate();
        //toDate = toDate.getFullYear() + "-" + (toDate.getMonth()+1) + "-" + toDate.getDate();


        // console.log("------------- From Date : ", fromDate);
        // console.log("------------- to Date : ", toDate);
 
        var featuredExperiences = {
            'experienceId': $scope.experienceId,
            'from': $('#from-date').val(),
            'to': $('#to-date').val()
        }
        console.log("~~~~~~~~~~featuredExperiences", featuredExperiences);
        console.log("cityId", $scope.cityId);
        httpService.put('addFeaturedExperiences/' + $scope.cityId, featuredExperiences)
            .success(function(response) {
                console.log("addFeaturedStore response.....", response);
                if (response.status == "success") {
                    $uibModalInstance.close('Ok');
                }
                $scope.processing = false;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })

    }

    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };
});