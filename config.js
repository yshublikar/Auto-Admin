var brandLabel = angular.module("brandLabel", [
    "ngSanitize",
    "ngAnimate",
    "ui.router",
    "ui.bootstrap",
    "ngTable",
    "toaster",
    "ngRateIt",
   /* "ngImageDimensions"*/

    /*"summernote"*/
]).run(function($rootScope) {
    $rootScope.isLoader = false;
})

brandLabel.config(function($stateProvider, $urlRouterProvider) {

    //used for otherwise in case of state Or Url is not matching
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'loginCtrl'
        })

        .state('set-password', {
            url: '/set-password/:id',
            templateUrl: 'app/login/setPassword.html',
            controller: 'setPasswordCtrl'
        })


        .state('app', {
            templateUrl: 'app/_includes/app.html',
            controller: 'appCtrl',
            abstract: true
        })

        .state('app.dashboard', {
            url: '/dashboard',
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'dashboardCtrl',
        })

        .state('app.change-password', {
            url: '/change-password',
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'changePasswordCtrl',
        })

        //Users
        .state('app.users', {
            url: '/users',
            templateUrl: 'app/users/users.html',
            controller: 'usersCtrl',
        })

        //Experiences
        .state('app.experiences', {
            url: '/experiences',
            templateUrl: 'app/experiences/experiences.html',
            controller: 'experiencesCtrl',
        })

        .state('app.experienceDetails', {
            url: '/experience-details/:experienceId',
            templateUrl: 'app/experiences/experienceDetails.html',
            controller: 'experienceDetailsCtrl',
        })

         .state('app.featuredStores', {
            url: '/featured-stores',
            templateUrl: 'app/featuredStores/featuredStores.html',
            controller: 'featuredStoresCtrl',
        })
         .state('app.featuredExperiences', {
            url: '/featured-experiences',
            templateUrl: 'app/featuredExperiences/featuredExperiences.html',
            controller: 'featuredExperiencesCtrl',
        })



        //activities
        .state('app.comments', {
            url: '/comments',
            templateUrl: 'app/comments/comments.html',
            controller: 'commentsCtrl',
        })
        .state('app.posts', {
            url: '/posts',
            templateUrl: 'app/posts/posts.html',
            controller: 'postsCtrl',
        })


        //listings
        .state('app.stores', {
            url: '/stores',
            templateUrl: 'app/stores/stores.html',
            controller: 'storesCtrl',
        })


        .state('app.addStore', {
            url: '/add-store/:storeId',
            templateUrl: 'app/stores/addStore.html',
            controller: 'addStoreCtrl',
        })

        .state('app.makes', {
            url: '/makes',
            templateUrl: 'app/makes/makes.html',
            controller: 'makesCtrl',
        })

        .state('app.addMake', {
            url: '/addMake/:id',
            templateUrl: 'app/makes/addMake.html',
            controller: 'addMakeCtrl',
        })

        .state('app.carModels', {
            url: '/carmodels',
            templateUrl: 'app/carModels/carModels.html',
            controller: 'carModelCtrl',
        })

        .state('app.cities', {
            url: '/cities',
            templateUrl: 'app/cities/cities.html',
            controller: 'citiesCtrl',
        })

        .state('app.import-cities', {
            url: '/import-cities',
            templateUrl: 'app/importCities/importCities.html',
            controller: 'importCitiesCtrl',
        })

        .state('app.import-logs', {
            url: '/import-logs',
            templateUrl: 'app/importLogs/importLogs.html',
            controller: 'importLogsCtrl',
        })




        //Contents
        .state('app.questions', {
            url: '/questions',
            templateUrl: 'app/questions/questions.html',
            controller: 'questionsCtrl'
        })

        .state('app.forms', {
            url: '/forms',
            templateUrl: 'app/forms/forms.html',
            controller: 'formsCtrl'
        })

        .state('app.addForm', {
            url: '/add-form',
            templateUrl: 'app/forms/addForm.html',
            controller: 'addFormCtrl'
        })

        .state('app.editForm', {
            url: '/edit-form/:id',
            templateUrl: 'app/forms/addForm.html',
            controller: 'addFormCtrl'
        })

        .state('app.groupType', {
            url: '/groupType',
            templateUrl: 'app/groupType/groupType.html',
            controller: 'groupTypeCtrl'
        })

       /* .state('app.addGroupType', {
            url: '/add-groupType',
            templateUrl: 'app/groupType/addGroupType.html',
            controller: 'addGroupTypeCtrl'
        })

        .state('app.editGroupType', {
            url: '/edit-groupType/:id',
            templateUrl: 'app/groupType/addGroupType.html',
            controller: 'addGroupTypeCtrl'
        })
*/
        .state('app.faqs', {
            url: '/faqs',
            templateUrl: 'app/faqs/faqs.html',
            controller: 'faqsCtrl'
        })

        .state('app.pages', {
            url: '/pages',
            templateUrl: 'app/pages/pages.html',
            controller: 'pagesCtrl'
        })


        //Settings
        .state('app.adminUsers', {
            url: '/admin-users',
            templateUrl: 'app/adminUsers/adminUsers.html',
            controller: 'adminUsersCtrl',
        })

        .state('app.config', {
            url: '/config',
            templateUrl: 'app/config/config.html',
            controller: 'configCtrl'
        })

        .state('app.masters', {
            url: '/masters',
            templateUrl: 'app/masters/masters.html',
            controller: 'mastersCtrl'
        })

        .state('app.addFAQ', {
            url: '/addFAQ/:id',
            templateUrl: 'app/faqs/addFAQ.html',
            controller: 'addFaqCtrl'
        })
.state('app.newsletterUsers', {
            url: '/newsletterUsers',
            templateUrl: 'app/newsletterUsers/newsletterUsers.html',
            controller: 'newsletterUsersCtrl'
        })


});