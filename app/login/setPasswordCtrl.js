brandLabel.controller('setPasswordCtrl', function($scope, $state, httpService, $stateParams,toaster) {

    $scope.user = {};
    /*API call to get link data*/
    httpService.get('secure/links/' + $stateParams.id).then(function(response) {

    }, function(error) {

        toaster.error({ title: "Error...!", body: error.data.message });

    });
    /*end of link data*/


    $scope.setPassword = function() {
        console.log('set password');

        httpService.post('setPassword/' + $stateParams.id, $scope.user)
            .then(function(response) {
                    console.log("response from db: ", response);
                    $scope.passwordSuccess = response.message;
                    setTimeout(function() {

                        toaster.success({ title: "Success...!", body: "Success! Password has been changed, please login" });
                        $state.go("login");
                    }, 100);
                },
                function(error) {
                    toaster.error({ title: "Error...!", body: err.message });
                    //$scope.passwordError = error.message;
                });

    }

});