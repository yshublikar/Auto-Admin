brandLabel.controller("addFaqCtrl", function($scope, httpService, $rootScope, $stateParams, $state, toaster) {
    console.log("hello******************");
    // scope = $scope;
    console.log($stateParams);
    httpService.secureGet("getMastersByKey/FAQ_Sections")
        .success(function(response) {
            console.log(response);
            $scope.sections = response.docs;
        })
        .error(function(err) {
            console.log("in error");
        });

    httpService.secureGet("getMastersByKey/FAQ_Categories")
        .success(function(response) {
            console.log(response);
            $scope.categories = response.docs;
        })
        .error(function(err) {
            console.log("in error");
        });

    if ($stateParams.id) {
        getOnefaq();
    } else {
        $scope.faqModel = {};
    }

    $scope.addFaq = function() {
        console.log($scope.faqModel);
        httpService.post("createAndUpdateFaq", $scope.faqModel)
            .success(function(response) {
                console.log(response);
                if (response.status = "success") {
                    toaster.success({ title: "Success...!", body: response.message });


                    $state.go("app.faqs")
                }
            })
            .error(function(err) {

                toaster.error({ title: "Error...!", body: err.message });

            });
    };

    function getOnefaq() {
        httpService.get("getOnefaq/" + $stateParams.id)
            .success(function(response) {
                console.log(response);
                $scope.faqModel = response.doc;
            })
            .error(function(err) {

                toaster.error({ title: "Error...!", body: err.message });

            });
    };
});