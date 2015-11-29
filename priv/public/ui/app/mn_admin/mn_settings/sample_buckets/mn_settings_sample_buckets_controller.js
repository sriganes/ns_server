(function () {
  "use strict";

  angular
    .module("mnSettingsSampleBuckets", ["mnSettingsSampleBucketsService", "mnPromiseHelper", "mnPoolDefault"])
    .controller("mnSettingsSampleBucketsController", mnSettingsSampleBucketsController);

  function mnSettingsSampleBucketsController($scope, mnSettingsSampleBucketsService, mnPromiseHelper, mnPoolDefault) {
    var vm = this;
    vm.selected = {};
    vm.mnPoolDefault = mnPoolDefault.latestValue();
    vm.isCreateButtonDisabled = isCreateButtonDisabled;
    vm.installSampleBuckets = installSampleBuckets;

    activate();

    function activate() {
      $scope.$watch("settingsSampleBucketsCtl.selected", function (selected) {
        mnPromiseHelper(vm, mnSettingsSampleBucketsService.getSampleBucketsState(selected))
          .cancelOnScopeDestroy($scope)
          .showSpinner()
          .applyToScope("mnSettingsSampleBucketsState");
      }, true);
    }

    function installSampleBuckets() {
      mnPromiseHelper(vm, mnSettingsSampleBucketsService.installSampleBuckets(vm.selected))
        .showErrorsSensitiveSpinner()
        .cancelOnScopeDestroy($scope)
        .reloadState();
    }

    function isCreateButtonDisabled() {
      return vm.viewLoading || vm.mnSettingsSampleBucketsState &&
             (_.chain(vm.mnSettingsSampleBucketsState.warnings).values().some().value() ||
             !vm.mnSettingsSampleBucketsState.available.length) ||
             !_.keys(_.pick(vm.selected, _.identity)).length;
    }

  }
})();