MLB.controller('MLBMainController', [
  '$scope',
  '$log',
  'MLBServices',
  'RosterService',
  function($scope, $log, MLBServices, RosterService) {
    $scope.mlbCtx = {};
    $log.debug('MLB Controller');


    $scope.mlbCtx.currentRosterPlayer = {};
    $scope.mapId = function() {
      $log.debug('Map the id');
      // current roster
      $scope.mlbCtx.currentRoster.players.map(function(player) {
        if (player.name === $scope.mlbCtx.currentRosterPlayer.name) {
          player.mlbid = $scope.mlbCtx.currentMlbPlayer.mlbid;
        }
      });

      // set mlb id property for player in array
      // update roster
      RosterService.updateRoster($scope.mlbCtx.currentRoster)
        .$promise
        .then(function(roster) {
          $scope.mlbCtx.currentRoster = roster;
          $scope.mlbCtx.currentRosterPlayer = {};
          $scope.mlbCtx.currentMlbPlayer = {};

        });
      // reload roster
    };

    $scope.setCurrentRosterPlayer = function(player) {
      $scope.mlbCtx.currentRosterPlayer = player;
      $log.debug('current selected player: ' + player.name);
    };
    $scope.setCurrentMlbPlayer = function(player) {
      $scope.mlbCtx.currentMlbPlayer = player;
      $log.debug('current mlb player: ' + player.mlbid);
    };
    $scope.mlbCtx.currentRosters = RosterService.getAllRosters()
      .then(function(rosters) {
        $scope.mlbCtx.currentRosters = rosters;
      });
    $scope.mlbCtx.currentRoster = {};
    //$scope.selectRoster = function() {
    //  $scope.currentRoster = $scope.mlbCtx.currentRosters[];
    //};
    $scope.mlbCtx.currentHitters = MLBServices.getMlbHitters()
      .then(function(hitters) {
      //  $log.debug('eyaaa hitters: ' + hitters);
        $scope.mlbCtx.currentHitters = JSON.parse(hitters);
      })
    $scope.mlbCtx.currentPitchers = MLBServices.getMlbPitchers()
      .then(function(pitchers) {
       // $log.debug('eyaaa hitters: ' + pitchers);
        $scope.mlbCtx.currentPitchers = JSON.parse(pitchers);
      })
  }
]);
