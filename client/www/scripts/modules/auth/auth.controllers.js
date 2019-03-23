Auth.controller('AuthUserController', [
  '$scope',
  '$log',
  '$state',
  'RosterService',
  '$stateParams',
  function($scope, $log, $state, RosterService, $stateParams) {
    $scope.homeRoster = $stateParams.slug;

    $log.debug('current homeRoster: ' + $scope.homeRoster);

    $scope.logMeInAs = function(slug) {
      if (slug) {
        window.localStorage.setItem('homeRoster', slug);
        $state.go('home');
      }
    };


    $scope.rosters = RosterService.getAllRosters()
      .then(function(rosters) {
        $scope.rosters = rosters;
      });
    if ($scope.homeRoster) {
      window.localStorage.setItem('homeRoster', $scope.homeRoster);
      $state.go('home');
    }
  }
]);
