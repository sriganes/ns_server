angular.module('wizard')
  .controller('wizard.step5.Controller',
    ['$scope', 'wizard.step5.service', 'wizard.step3.service', 'wizard.step2.service', 'auth.service',
    function ($scope, step5Service, step3Service, step2Service, authService) {
      $scope.focusMe = true;
      $scope.modelStep5Service = step5Service.model;

      function reset() {
        $scope.spinner = false;
        $scope.focusMe = true;
        $scope.modelStep5Service.user.password = null;
        $scope.modelStep5Service.user.verifyPassword = null;
      }

      $scope.onSubmit = function onSubmit() {
        if ($scope.spinner) {
          return;
        }
        $scope.spinner = true;
        $scope.form.$setValidity('userReq', !!$scope.modelStep5Service.user.name)
        $scope.form.$setValidity('equals', $scope.modelStep5Service.user.password === $scope.modelStep5Service.user.verifyPassword);
        $scope.form.$setValidity('passLength', $scope.modelStep5Service.user.password && $scope.modelStep5Service.user.password.length >= 6);

        if ($scope.form.$invalid) {
          return reset();
        }
        step5Service.postAuth().success(function () {
          authService.manualLogin($scope.modelStep5Service.user).success(function () {
            step5Service.resetUserCreds();
            step3Service.postBuckets(false).success(function () {
              !_.isEmpty(step2Service.model.selected) && step2Service.installSampleBuckets().error(function () {
                // var errReason = errorObject && errorObject.reason || simpleErrors.join(' and ');
                // genericDialog({
                //   buttons: {ok: true},
                //   header: "Failed To Create Bucket",
                //   textHTML: errReason
                // });
              });
            });
          });
        }).error(function (errors) {
          reset();
          $scope.errors = errors;
        });
        return;
      }
    }]);