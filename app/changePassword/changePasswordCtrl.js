brandLabel.controller("changePasswordCtrl", function($scope, httpService, $rootScope, $uibModal, $state, $window,toaster) {

    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/changePassword/modals/changePassword.html',
        controller: 'updatePasswordCtrl',
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

        }
    }, function() {

        $state.go("app.dashboard");

    })

});

brandLabel.controller("updatePasswordCtrl", function($scope, httpService, $rootScope, $uibModalInstance, modalData, $state, $window,toaster) {

    $scope.user = JSON.parse($window.localStorage.getItem('user'));
    $scope.setPassword = function(form) {

        if (form.$valid) {

            data = {
                "userId": $scope.user._id,
                "oldPassword": $scope.oldPassword,
                "newPassword": $scope.newPassword
            }
            console.log("data", data);
            if ($scope.newPassword == $scope.confirmPassword) {
                httpService.put('changePassword/', data).then(function(response) {
                        console.log("inside checkOld Password", response);
                        if (response.status == 500) {
                            toaster.error({ title: "Error...!", body: "Old Password is not correct" });
                            $scope.newPassword = "";
                            $scope.confirmPassword = "";
                            $scope.oldPassword = "";

                        } else {
                            toaster.success({ title: "Success...!", body: "Your Password changed" });
                            //$uibModalInstance.close();
                            $uibModalInstance.close('Ok');
                            $state.go("app.dashboard");
                        }

                    },
                    function(error) {
                        
                        toaster.error({ title: "Error...!", body: "Old Password is not correct" });

                    });

            } else {
              
                toaster.error({ title: "Error...!", body: "Password Not Matching! Re-Enter New Password and Confirm Password" });
                $scope.newPassword = "";
                $scope.confirmPassword = "";
            }
        } else {
            toaster.error({ title: "Error...!", body: "All fields are required" });

        }
    };


    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
        

    };
});