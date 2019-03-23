MLB.directive('bbpMlbHittersList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/mlb/templates/hitter.list.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
MLB.directive('bbpMlbPitchersList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/mlb/templates/pitcher.list.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
MLB.directive('bbpRosterIdMapList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/mlb/templates/roster.id.map.list.html'

    }
  }
]);
