brandLabel.controller('appCtrl',
    function($scope, $rootScope, $state, $window, httpService) {

        $rootScope.SITE_URL=SITE_URL;

    	 $scope.logout = function() {
            /*console.log("Inside logout");*/
            $window.localStorage.clear();
            $rootScope.xKey = undefined;
            $rootScope.xToken = undefined;
            $rootScope.user = undefined;
            $state.go("login");
        }
        
    });
