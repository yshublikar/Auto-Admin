brandLabel.controller("pagesCtrl", function($scope,httpService,$rootScope,$uibModal,toaster) {


	  $scope.staticPages=[{
        name:"About Us",
        path:"./views/static-pages/about-us.html"
       
    },
    {
        name:"Privacy Policy",
        path:"./views/static-pages/privacy-policy.html"
       
    },
    {
        name:"Terms and Conditions",
        path:"./views/static-pages/terms-and-conditions.html"
       
    }
    ]

    console.log("$scope.staticPages: ",$scope.staticPages);

    
      $scope.editPage = function(data) {
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/pages/modals/editPage.html',
            controller: 'editPageCtrl',
            size: 'md',
            backdrop: true,
            keyboard: true,
            resolve: {
                modalData: function() {
                    return data;
                }
            }

        });
        modalInstance.result.then(function(response) {
            if (response == "Ok") {
                //$scope.getPageContents();
            }
        }, function() {

        })

    }
    
});

brandLabel.controller("editPageCtrl", function($scope, httpService, $rootScope, $uibModalInstance, modalData,toaster) {

	console.log(modalData);
	$scope.pageModel=modalData;


    $scope.getPageContents = function() {

    	console.log("in init function");
    	httpService.securePost("getPageContents",$scope.pageModel)
            .success(function(response) {
            	console.log("in response: ",response);
            	$scope.pageModel.contents=response.doc;
               



            })
            .error(function(error) {
                alert(error.message);
            });



    }

    $scope.update = function(frm) {

    	console.log("in init function*******",frm);
    	httpService.securePut("updatePageContents",frm)
            .success(function(response) {
            	console.log("in response: ",response);
            	$uibModalInstance.close('Ok');
                 toaster.success({ title: "success", body: "Page updated successfully.." });
            	//$scope.pageModel.contents=response.doc;


            })
            .error(function(error) {
                alert(error.message);
            });



    }
        
    $scope.cancel = function() {
        console.log("cancelled");
        $uibModalInstance.dismiss('cancel');
    };
});