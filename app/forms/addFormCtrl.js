brandLabel.controller("addFormCtrl", function($scope, httpService, $rootScope, $stateParams, $state, toaster) {

    scope = $scope;

    $scope.getGroupType = function() {
        httpService.secureGet("activeGroupType")
            .success(function(response) {
                if (response.status == "success") {
                    $scope.groupType = angular.copy(response.docs)
                    console.log("get all active group type: ",$scope.groupType);

                } else {
                    toaster.error({ title: "Error...!", body: response.message });
                }
            })
            .error(function(error) {
                toaster.error({ title: "Error...!", body: error.message });
            })
    };

    $scope.getForm = function() {
        httpService.get('form/' + $stateParams.id)
            .success(function(response) {
               
                $scope.formModel = response.doc;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });
            });
    };


    $scope.getGroupType();

    if ($stateParams.id) {
        $scope.getForm();
        $scope.isEdit = true;

    } else {
        $scope.isEdit = false;

        $scope.formModel = {};
        $scope.formModel.questionGroups = [];
        $scope.formModel.questions = [];

        $scope.formModel.status = 'Active';
        console.log(" from model is created", $scope.formModel);
    }

    $scope.questionGroups = {};
    $scope.questionGroups.questions = [{
        questionId: null,
        sequenceNo: null
    }];
    $scope.questions = {
        questionId: null,
        sequenceNo: null
    };
    $scope.questionSearch = { questionText: null };


    $scope.searchQuestion = function(keyword) {
        httpService.get('searchQuestion?search=' + keyword)
            .success(function(response) {
                console.log(response);
                $scope.questionList = response.docs;
            })
            .error(function() {

                toaster.error({ title: "Error", body: "Error" });

            })
    };

    $scope.selectQuestion = function(questionIndex, question) {
        console.log("questionIndex-----");
        console.log(questionIndex);
        console.log("selected question is-----");
        console.log(question);

        $scope.questionGroups.questions[questionIndex].questionId = question._id;
    };
    $scope.selectInQuestion = function(question) {
        console.log("question-----");
        console.log(question);
        $scope.questions.questionId = question._id;
    };

    $scope.addGroup = function() {

        console.log("addGroup.... ");

        $scope.formModel.questionGroups = $scope.formModel.questionGroups || [];

        var questionsValidated = true;

        _.each($scope.questionGroups.questions, function(question) {
            console.log("question type: ",question);
            if (!question.questionId || !question.sequenceNo) {
                questionsValidated = false;
            }
        });

       if($scope.questionGroups.type)
       {
           var groupName=_.findWhere($scope.groupType, {_id: $scope.questionGroups.type});
            $scope.questionGroups.groupName=groupName.name;
       }
       
       
       //console.log("groupName: ",groupName.name);

        if ($scope.questionGroups.name && $scope.questionGroups.type && $scope.questionGroups.sequenceNo && questionsValidated) {
          
           $scope.formModel.questionGroups.push($scope.questionGroups);
           console.log("group name: ###########",$scope.formModel.questionGroups); 

            $scope.questionGroups = {};
            $scope.questionGroups.questions = [{
                questionId: null,
                sequenceNo: null
            }];
        } else {

            toaster.warning({ title: "Warning", body: "Required all fields." });

        }
        console.log("addGroup.... ", $scope.formModel.questionGroups);
    };
    $scope.addQuestion = function() {



        if ($scope.questions.questionId !== null && $scope.questions.sequenceNo !== null) {

            $scope.formModel.questions.push($scope.questions)
            $scope.questions = {
                questionId: null,
                sequenceNo: null
            };
        } else {
            toaster.warning({ title: "Warning", body: "Required all fields." });
        }
        console.log("addQuestion.... ", $scope.formModel.questions);
        // console.log("$scope.question.questionsText",$scope.question.questionsText);
    }

    $scope.removeGroup = function(index) {
        $scope.formModel.questionGroups.splice(index, 1);
    };
    $scope.remove = function(index) {
        $scope.formModel.questions.splice(index, 1);
    }

    $scope.saveForm = function() {

        console.log("saveForm.... my questions ", $scope.formModel);

        if ($scope.formModel.questionGroups.length > 0) {

            if ($stateParams.id) {
                var url = "form?id=" + $stateParams.id;
            } else {
                var url = "form";
            }

            httpService.post(url, $scope.formModel)
                .success(function(response) {
                    console.log(response);
                    // $scope.questionList = response.docs;
                    $state.go("app.forms");
                })
                .error(function() {

                    toaster.error({ title: "Error", body: "Error" });

                })
        } else {
            toaster.warning({ title: "Warning", body: "Please fill atleast one question group" });

        }
    };



});