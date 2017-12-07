brandLabel.controller("experienceDetailsCtrl", function($scope, httpService, $rootScope, toaster, $stateParams) {
    console.log("stateParams", $stateParams.experienceId);
    $scope.SITE_URL= SITE_URL.replace('/#','');
    $scope.getExperince = function() {
        console.log("function called")
        httpService.get('experience/' + $stateParams.experienceId).success(function(response) {
            if (response.status == "success") {
                console.log("data", response);
                $scope.experience = response.doc;
                $scope.title=($scope.experience.posts[0].title).toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            }
        }).error(function(error) {

            toaster.error({ title: "Error...!", body: "error in getting Experience" });


        })
    }

    $scope.bannUser = function(userId) {
        console.log("bannUser function called", userId);
        httpService.put('bannUser/' + userId).success(function(response) {
            if (response.status == "success") {
                console.log("data", response);
                //$scope.experience = response.doc;
                toaster.success({ title: "success...!", body: "User is blocked successfully" });
                $scope.getExperince();
            }
        }).error(function(error) {

            toaster.error({ title: "Error...!", body: error.message });


        })
    }

    $scope.featured = function(experienceId) {
        console.log("experienceId function called", experienceId);
        console.log("experienceId Is isFeatured?", !$scope.experience.featured);
        var status = { "status": !$scope.experience.featured };
        httpService.put('isFeatured/' + experienceId, status).success(function(response) {
            if (response.status == "success") {
                console.log("data", response);
                //$scope.experience = response.doc;
                toaster.success({ title: "success...!", body: "Experience featured successfully" });
                $scope.getExperince();
            }
        }).error(function(error) {

            toaster.error({ title: "Error...!", body: error.message });


        })
    }

    $scope.removePost = function(experienceId, postId) {

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this Post",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    //var postId = { "postId": postId };
                    console.log("removePost function called", experienceId, postId);

                    httpService.put('removePost/' + experienceId + '/' + postId).success(function(response) {
                        if (response.status == "success") {
                            console.log("data", response.docs);
                            $scope.experience = response.docs;
                            toaster.success({ title: "Success...!", body: "Post Deleted successfully" });
                        }
                    }).error(function(error) {

                        toaster.error({ title: "Error...!", body: error.message });


                    })
                }

            });



    }

    $scope.removeComment = function(experienceId, postId, commentId) {

        swal({
                title: "Are you sure?",
                text: "You will not be able to recover this Comment",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: true
            },
            function(isComfirm) {
                if (isComfirm) {
                    //var postId = { "postId": postId };
                    var data = { "postId": postId, "commentId": commentId };
                  //  console.log("removePost function called", experienceId, postId);

                    httpService.put('removeComment/' + experienceId, data).success(function(response) {
                        if (response.status == "success") {
                            console.log("data", response.docs);
                            $scope.experience = response.docs;
                            toaster.success({ title: "Success...!", body: "Comment Deleted successfully" });
                        }
                    }).error(function(error) {

                        toaster.error({ title: "Error...!", body: error.message });


                    })
                }

            });

        /* var data = { "postId": postId, "commentId": commentId };
         console.log("removePost function called", experienceId, postId);

         httpService.put('removeComment/' + experienceId, data).success(function(response) {
             if (response.status == "success") {
                 console.log("data", response.docs);
                 $scope.experience = response.docs;
             }
         }).error(function(error) {

             toaster.error({ title: "Error...!", body: error.message });


         })*/
    }
});