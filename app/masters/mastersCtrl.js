brandLabel.controller("mastersCtrl", function($scope, httpService, $rootScope,toaster) {
    //get all  system config data 
    $scope.masterKey = "Car_Body_Styles";
    $scope.getAllMasters = function() {
        httpService.secureGet("getAllMasters")
            .success(function(response) {
                if (response.status == "success") {
                    $scope.masters = angular.copy(response.docs)
                } else {

                    toaster.error({ title: "Error", body: response.message });


                }
            })
            .error(function(error) {

                toaster.error({ title: "Error", body: error.message });
            })
    }
    $scope.getAllMastersByKey = function() {
        httpService.secureGet("getMastersByKey/" + $scope.masterKey)
            .success(function(response) {
                if (response.status == "success") {
                    $scope.masters = angular.copy(response.docs)
                } else {

                    toaster.error({ title: "Error", body: response.message });


                }
            })
            .error(function(error) {

                toaster.error({ title: "Error", body: error.message });
            })
    }
    $scope.getAllMastersByKey();


    $scope.updateMaster = function(master) {
        if (!$scope.masterKey) {
            swal("Error!", "Please select master key to add value");
            return;
        }
        if (!master.masterValue || master.masterValue == "") {
            swal("Error!", "Please value to master value");
            return;
        }
        httpService.securePut('updateMsater/' + master._id, master).success(function(response) {
                if (response.status == "success") {

                    toaster.success({ title: "Updated", body: "Records updated successfully" });
                } else {

                    toaster.error({ title: "Error", body: response.message });
                }

            })
            .error(function(error) {


                toaster.error({ title: "Error", body: error.message });


            });
    }
    $scope.addMsater = function() {
        if (!$scope.masterKey) {

            toaster.error({ title: "Error", body: "Please select master key to add value" });
            return;
        }
        if (!$scope.masterValue || $scope.masterValue == "") {

            toaster.error({ title: "Error", body: "Please enter value" });
            return;
        }
        httpService.securePost('addMsater', { masterKey: $scope.masterKey, masterValue: $scope.masterValue }).success(function(response) {
                if (response.status == "success") {
                    $scope.getAllMastersByKey();
                    $scope.masterValue = "";
                } else {

                    toaster.error({ title: "Error", body: response.message });
                }
            })
            .error(function(error) {

                toaster.error({ title: "Error", body: error.message });

            });
    }

    $scope.deleteMasterKey = function(master) {
        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this store!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    httpService.secureDelete('deleteMasterKey/' + master._id).success(function(response) {
                            if (response.status == "success") {
                                $scope.getAllMastersByKey();

                            } else {

                                toaster.error({ title: "Error", body: response.message });
                            }
                        })
                        .error(function(error) {

                            toaster.error({ title: "Error", body: error.message });

                        });
                }
            })
    }


});