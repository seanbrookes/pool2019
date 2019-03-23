Stats.controller('StatsUpdateFramesController', [
  '$scope',
  function($scope) {
    console.log('fuck you');
  }
]);
Stats.controller('StatsUpdateMainController', [
  '$scope',
  '$log',
  'MLBServices',
  'RosterService',
  function($scope, $log, MLBServices, RosterService) {
    $log.debug('Stats Update Main Controller');
    $scope.statsCtx = {
      currentRosters: [],
      currentRoster: {},
      currentRosterPLayerList: [],
      currentNetMlbHitters: [],
      currentNetMlbPitchers: [],
      mlbHitters: [],
      mlbPitchers: []
    };
    $scope.statsCtx.currentRosters = RosterService.getAllRosters()
      .then(function(rosters) {
        $scope.statsCtx.currentRosters = rosters;
        $scope.statsCtx.currentRosters.map(function(roster) {
          roster.players.map(function(player) {
            $scope.statsCtx.currentRosterPLayerList.push(player);
          });
        });
        $scope.statsCtx.mlbHitters = MLBServices.getMlbHitters()
          .then(function(hitters) {
            //  $log.debug('eyaaa hitters: ' + hitters);
            $scope.statsCtx.mlbHitters = JSON.parse(hitters);
            $scope.statsCtx.currentRosterPLayerList.map(function(player) {
              $scope.statsCtx.mlbHitters.map(function(mlbPlayer) {
                if (mlbPlayer.mlbid === player.mlbid) {
                  $scope.statsCtx.currentNetMlbHitters.push(mlbPlayer);
                }
              });
            });
          });

        $scope.statsCtx.mlbPitchers = MLBServices.getMlbPitchers()
          .then(function(pitchers) {
            // $log.debug('eyaaa hitters: ' + pitchers);
            $scope.statsCtx.mlbPitchers = JSON.parse(pitchers);
            $scope.statsCtx.currentRosterPLayerList.map(function(player) {
              $scope.statsCtx.mlbPitchers.map(function(mlbPlayer) {
                if (mlbPlayer.mlbid === player.mlbid) {
                  $scope.statsCtx.currentNetMlbPitchers.push(mlbPlayer);
                }
              });
            });
          });
      });


  }
]);
Stats.controller('RankPosController',[
  '$scope',
  'Dailybatterstat',
  'Dailypitcherstat',
  '$stateParams',
  function($scope, Dailybatterstat, Dailypitcherstat, $stateParams) {
    console.log('pos rank controller');


    $scope.currentFilter = $stateParams.pos;
    $scope.bbpCtx.currentRoster = '';
    $scope.bbpCtx.currentPosFilter = $stateParams.pos;
    $scope.showBatters = true;
    $scope.showStarters = false;
    $scope.showClosers = false;


    var filter = {
      'filter[where][pos]': $stateParams.pos,
      'filter[order]': 'mlbid',
      'filter[order]': 'lastUpdate DESC'
    };

    if ($stateParams.pos === 'all'){
      filter = {
        'filter[order]': 'total DESC'
      };
    }


    switch($scope.currentFilter){
      case 'RP':
        $scope.positionRanking = Dailypitcherstat.query(filter);
        $scope.positionRanking
          .$promise
          .then(function (result) {
            if (result.length) {
              result.map(function(player) {
                player.total = parseFloat(player.total);
              });
              $scope.closers = result;
              $scope.showBatters = false;
              $scope.showStarters = false;
              $scope.showClosers = true;

            }
          }
        );
        break;
      case 'SP':
        $scope.positionRanking = Dailypitcherstat.query(filter);
        $scope.positionRanking.$promise.
          then(function (result) {
            result.map(function(player) {
              player.total = parseFloat(player.total);
            });
            $scope.starters = result;
            $scope.showBatters = false;
            $scope.showStarters = true;
            $scope.showClosers = false;
          }
        );
        break;
      default:
        $scope.positionRanking = Dailybatterstat.query(filter);
        $scope.positionRanking.$promise.
          then(function (result) {
            result.map(function(player) {
              player.total = parseFloat(player.total);
            });
            $scope.batters = result;
            $scope.showBatters = true;
            $scope.showStarters = false;
            $scope.showClosers = false;
          }
        );
        break;
    }



  }
]);
