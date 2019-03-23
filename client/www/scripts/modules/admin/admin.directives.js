Admin.directive('bbpAdminStats', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/admin/admin.stats.html',
      link:function(scope, el, attrs) {

        scope.$watch('statsCtx.batterUpdateHistory', function(updates, previousUpdates) {
          // render react component
        }, true);
      }
    }
  }
]);
