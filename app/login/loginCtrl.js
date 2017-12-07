brandLabel.controller("loginCtrl", function($scope, httpService, $rootScope, $window, $state, toaster) {

    $scope.doLogin = function() {
        $scope.submitted;

        if ($scope.myForm.$valid) {
            console.log('login form data', $scope.userData);
            httpService.post("login", $scope.userData)
                .success(function(response) {

                    console.log(response);
                    $rootScope.user = response.user;
                    $rootScope.token = response.token.token;

                    $window.localStorage.setItem("user", JSON.stringify($rootScope.user));
                    $window.localStorage.setItem("token", response.token.token);

                    if ($rootScope.user.status == "Active") {
                        $state.go("app.dashboard");
                    } else {
                        $state.go("login");
                    }

                })
                .error(function(err) {

                    toaster.error({ title: "Error...!", body: err.message });
                });

        } else {
            toaster.error({ title: "Error...!", body: "Please Fill Required details" });

        }


    };


    $scope.sendForgotLink = function() {
        if ($scope.forgotPasswordForm.$valid) {
            $scope.processing = true;
            console.log("hjdgf");
            var data = {
                "email": $scope.email
            }
            httpService.post('sendForgotLink', data)
                .success(function(response) {
                    if (response.status == "success") {
                        toaster.success({ title: "Success...!", body: response.message });
                        $state.go("login");
                    } else {

                        toaster.error({ title: "Error...!", body: response.message });
                    }
                    $scope.processing = false;
                })
                .error(function(error) {

                    toaster.error({ title: "Error...!", body: error.message });
                     $scope.processing = false;
                });
               
        } else {
            toaster.error({ title: "Error...!", body: "Please Fill Required Fields" });
            $scope.processing = false;

        }
    };



});