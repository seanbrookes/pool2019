Charts.controller('ChartsMainController', [
  '$scope',
  '$log',
  'RosterService',
  function($scope, $log, RosterService) {
    $log.debug('Charts main controller');
    $scope.allPlayers = [];
    $scope.playerChartCtx = {
      currentPlayerHistory: []
    };

  }
]);
