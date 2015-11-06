angular.module('mnXDCR').controller('mnXDCRDeleteReferenceDialogController',
  function ($scope, $uibModalInstance, mnPromiseHelper, mnXDCRService, name) {
    $scope.name = name;
    $scope.deleteClusterReference = function () {
      var promise = mnXDCRService.deleteClusterReference(name);
      mnPromiseHelper.handleModalAction($scope, promise, $uibModalInstance);
    };
  });
