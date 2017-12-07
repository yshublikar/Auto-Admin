brandLabel.run(function($rootScope, $state, $window, $http) {

    $rootScope.user = JSON.parse($window.localStorage.getItem('user'));
    $rootScope.token = $window.localStorage.getItem('token');

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        $rootScope.issueListSideBarToggle = false;

        if (toState.name == 'login' && ($rootScope.user && $rootScope.token)) {
            console.log("already logged in still accessing login page");

            event.preventDefault();
            $state.go('app.dashboard');

        } else if (toState.name != 'login' && toState.name != 'set-password' && toState.name != '404' && (!$rootScope.user || !$rootScope.token)) {
            console.log("no login accessing inner pages");
            event.preventDefault();
            $state.go('login');

        }
        console.log("state change:" + JSON.stringify(toState));
    });


});