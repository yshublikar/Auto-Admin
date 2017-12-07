brandLabel.controller("configCtrl", function($scope, httpService, $rootScope,toaster) {
 //get all  system config data 
    $scope.getSystemConfig = function() {
        httpService.secureGet("getConfig")
            .success(function(response) {
                console.log("response:", response);
                if (response.status == "success") {
                    $scope.allConfigs = angular.copy(response.configData)
                } else {
                    toaster.error({ title: "Error...!", body: response.message });
               }
            })
            .error(function(error) {
                toaster.error({ title: "Error...!", body: error.message });
            })
    }

    //update config value code
    $scope.updateConfig = function(id, value) {

        httpService.securePut('updateConfig/' + id, value).then(function(response) {

            if (response.status == 200) {
                toaster.success({ title: "Updated...!", body: "Records updated successfully" });
            } else {
                 toaster.error({ title: "Error...!", body: "Some problem occured, please try again later" });
            }

        }, function(error) { 
             toaster.error({ title: "Error...!", body: error.message });

        });
    }


});