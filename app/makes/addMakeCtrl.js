brandLabel.controller("addMakeCtrl", function($scope, httpService, $rootScope, $state, $stateParams, toaster) {

    scope = $scope;

    console.log("$stateParams------");
    console.log($stateParams);
    $scope.makeVanityUrl = function() {
        if ($scope.makeModel.name) {
            $scope.makeModel.vanityUrl = ($scope.makeModel.name).toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-")
        } else {
            $scope.makeModel.vanityUrl = "";
        }
    };
    $scope.getMake = function() {
        httpService.get('make/' + $stateParams.id)
            .success(function(response) {
                console.log("get make response-----");
                console.log(response);

                if (response.status == 'success') {
                    $scope.makeModel = response.doc;
                } else {
                    console.log("bbb");
                    toaster.error({ title: "Error...!", body: "Oops! Some problem occured, please try again later." });

                }
            })
            .error(function(error) {
                $scope.processing = false;
                // toaster.error({ title: "Error...!", body: "Oops! Some problem occured, please try again later." });
                toaster.error({ title: "Error...!", body: response.message });



            });
    };


    if ($stateParams.id) {
        $scope.getMake();
    } else {
        $scope.makeModel = {};
        $scope.makeModel['offers'] = [];

    }

    $scope.offer = {};


    $scope.addOffer = function() {
        $scope.uploading = "Uploading...";
        var fd = new FormData(document.getElementById('addMakeForm'));
        console.log("addMakeForm", fd);
        httpService.filePost('uploadOffer', fd)
            .success(function(response) {
                console.log("add offer response-----");
                console.log(response);
                $scope.uploading = false;

                if (response.status == "success") {
                    $scope.offer.image = response.doc;
                    $scope.makeModel.offers.push($scope.offer);
                    $scope.offer = {};
                } else {
                    console.log("aaaaa");
                    toaster.error({ title: "Error...!", body: response.message });


                }

            })
            .error(function(error) {

                //toaster.error({ title: "Error...!", body: "All filed are required For add offer" });
                $scope.uploading = false;
                toaster.error({ title: "Error...!", body: error.message });



            });
    };



    $scope.removeOffer = function(index) {
        $scope.makeModel.offers.splice(index, 1);
    };

    $scope.saveMake = function() {
        /* if ($scope.makeModel.offers.length>0) {*/
        $scope.processing = "Processing...";
        var fd = new FormData(document.getElementById('addMakeForm'));

        fd.append('name', $scope.makeModel.name);
        fd.append('offers', JSON.stringify($scope.makeModel.offers));


        if ($stateParams.id) {
            var url = 'addMake?id=' + $stateParams.id;
            // console.log("updateeeeeeeeeee");
        } else {
            var url = 'addMake';
            // console.log("adddddddddddddd");
        }


        httpService.filePost(url, fd)
            .success(function(response) {
                console.log("add make response-----");

                console.log(response);
                $scope.processing = false;

                if (response.status == 'success') {

                    toaster.success({ title: "Success...!", body: "Make added successfully." });

                    $state.go('app.makes');
                } else {

                    toaster.error({ title: "Error...!", body: "Oops! Some problem occured, please try again later." });

                }
            })
            .error(function(error) {
                console.log(error.message);
                $scope.processing = false;
                toaster.error({ title: "Error...!", body: error.message });
            });
        /* } else {
            /* if ($scope.makeModel.offers.length) {
                 toaster.warning({ title: "Warning...!", body: " we need  atleat one offer" });
             } else {
                         //toaster.error({ title: "Error...!", body: "Oops! Some problem occured, please try again later." });
                 toaster.error({ title: "Warning...!", body: " we need  atleast one offer" });

             /*}
         }*/

    };



});