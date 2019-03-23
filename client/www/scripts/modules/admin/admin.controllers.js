/**
 * Created by seanbrookes on 2014-02-08.
 */
Admin.controller('AdminRawStatsController',[
  '$scope',
  'Dailybatterstat',
  'Dailypitcherstat',
  function($scope, Dailybatterstat, Dailypitcherstat){
    // load roster data

    $scope.mode = '';

    $scope.loadRawBatters = function(){
      $scope.hideBatterButton = true;
      $scope.mode = 'batter';
      $scope.currentRoster = Dailybatterstat.raw();
      $scope.currentRoster.$promise.
        then(function (result) {
          $scope.hideBatterButton = false;
          // $scope.currentRoster = result[0];
          $scope.stats = result.stats;
          $scope.recordCount = result.stats.length;

        }
      ),
      function(response){
        console.log('rejected get batters: ' + JSON.stringify(response));
        $scope.hideBatterButton = false;
      };
    };
    $scope.loadRawPitchers = function(){
      $scope.hidePitcherButton = true;
      $scope.mode = 'pitcher';
      $scope.currentRoster = Dailypitcherstat.raw();
      $scope.currentRoster.$promise.
        then(function (result) {
          $scope.hidePitcherButton = false;
         // $scope.currentRoster = result[0];
          $scope.stats = result.stats;
          $scope.recordCount = result.stats.length;

        }
      );
    };

    $scope.remove = function(array, index){
      $scope.stats.splice(index, 1);
    }


    $scope.deleteRawStat = function(stat, event){
      if (confirm('delete?')){

        event.currentTarget.disabled = true;

        console.log('delete this stat' + stat );
        if ($scope.mode === 'batter'){
          Dailybatterstat.deleteById({id:stat.id},
            function(response){
             // $scope.remove($scope.stats, index);
              console.log('success delete object: ' + JSON.stringify(response));
            },
            function(response){
              console.log('bad delete object: ' + JSON.stringify(response));
            }
          );
        }
        else if ($scope.mode === 'pitcher'){
          Dailypitcherstat.deleteById({id:stat.id},
            function(response){
           //   $scope.remove($scope.stats, index);
              console.log('success delete object: ' + JSON.stringify(response));
            },
            function(response){
              console.log('bad delete object: ' + JSON.stringify(response));
            }
          );

        }
        else {
          console.log('no mode selected for delete');
        }
      }

    }
  }


]);
Admin.controller('AdminStatsController', [
  '$scope',
  '$log',
  function($scope, $log) {

  }
]);
Admin.controller('RosterAdminController',[
  '$scope',
  'RosterService',
  'Roster',
  '$http',
  '$log',
  function($scope, RosterService, Roster, $http, $log) {
    "use strict";
    $scope.currRoster = {};
    $scope.loadAdminRoster = function(slug){

      $scope.currRoster = slug;
      // load roster data
      var filter = {
        'filter[where][slug]':slug
      };
      $scope.currentRoster = Roster.query(filter);
      $scope.currentRoster.$promise.
        then(function (result) {
          $scope.currentRoster = result[0];
          $scope.currentRosterName = $scope.currentRoster.slug;
          $scope.players = $scope.currentRoster.players;

        }
      );

    };
    $scope.bringIt = function(slug) {
      var pathStub = './scripts/modules/roster/';
      $http({
        method: 'GET',
        url: pathStub + slug + '.json'
      }).then(function successCallback(response) {
        var xyz = response.data[0];
        delete xyz.editPlayer;
        xyz.year = 2016;
        $log.debug(xyz);
        RosterService.addRoster(xyz)
          .then(function(response) {
            $log.debug('yeah we did it')
          })
          .catch(function(error) {
            $log.warn('bad create Roster', error);
          });

      }, function errorCallback(response) {
        $log.debug('bad load roster json', error);

      })
    };

    $scope.editThisPlayer = function(player){
      $scope.editPlayer = player;
    };
    $scope.deleteRosterPlayer = function(player) {
      if (confirm('delete this player?')) {
        for (var i = 0; i < $scope.currentRoster.players.length;i++) {
          var curPlayer = $scope.currentRoster.players[i];
          //if (player.mlbid == curPlayer.mlbid) {
          //  $scope.currentRoster.players.splice(i,1);
          //  break;
          //}
          if (player.name == curPlayer.name) {
            $scope.currentRoster.players.splice(i,1);
            break;
          }

        }
        Roster.upsert($scope.currentRoster,
          function(response) {
            console.log('good update current roster');
          },
          function(error) {
            console.log('bad update target roster: ' + JSON.stringify(error));
          }
        );
      }

    };
    $scope.saveEditPlayer = function(player){
      var editConfirmed = false;

      // is it new
      if (!$scope.currentRoster.slug) {
        var filter = {
          'filter[where][slug]':$scope.currentRosterName
        };
        $scope.currentRoster = Roster.query(filter);
        $scope.currentRoster.$promise.
          then(function (result) {
            $scope.cRoster = result[0];
            $scope.cRoster.players.push(player);

            // save target roster
            Roster.upsert($scope.cRoster,
              function(response) {
                console.log('good update current roster');
              },
              function(error) {
                console.log('bad update current roster: ' + JSON.stringify(error));
              }
            );

          }
        );
      }
      else {
        if ($scope.currentRosterName !== $scope.currentRoster.slug) {
          // alert('we are changing teams')
          var sourceRoster = $scope.currentRoster;

          var filter = {
            'filter[where][slug]':$scope.currentRosterName
          };

          var targetRoster = Roster.query(filter)
            .$promise.
            then(function (result) {
              targetRoster = result[0];

              // add player to target roster
              player.slug = targetRoster.slug;
              targetRoster.players.push(player);

              for (var i = 0; i < $scope.currentRoster.players.length;i++) {
                var curPlayer = $scope.currentRoster.players[i];
                if (player.mlbid == curPlayer.mlbid) {
                  $scope.currentRoster.players.splice(i,1);
                }

              }


              // remove from current roster

              // save current roster
              Roster.upsert(targetRoster,
                function(response) {
                  console.log('good update target roster');
                },
                function(error) {
                  console.log('bad update target roster: ' + JSON.stringify(error));
                }
              );

              // save target roster
              Roster.upsert($scope.currentRoster,
                function(response) {
                  console.log('good update current roster');
                },
                function(error) {
                  console.log('bad update current roster: ' + JSON.stringify(error));
                }
              );

              var save = 'save';

            }
          );
        }
        else {
          if (player.mlbid){
            angular.forEach($scope.currentRoster.players, function(value, key){
              if (value.mlbid === player.mlbid){
                console.log('matched player');
                $scope.currentRoster.players[key] = player;
                editConfirmed = true;
              }
            });
          }
          else {
            // loop over players to see if name matches
            var isUnique = true;
            for (var i = 0;i < $scope.currentRoster.players.length;i++) {
              if ($scope.currentRoster.players[i].name.toLowerCase() === player.name.toLowerCase()) {
                isUnique = false;
                $scope.currentRoster.players[i] = player;
                break;
              }
            }
            if (isUnique) {
              $scope.currentRoster.players.push(player);
            }
            else {

            }
            editConfirmed = true;
          }


          if (editConfirmed){
            var rosterObj = $scope.currentRoster;
            //delete rosterObj._id;
            Roster.upsert(rosterObj,
              function(response){
                console.log('good update roster');
                var filter = {
                  'filter[where][slug]':$scope.currentRosterName
                };
                $scope.currentRoster = Roster.query(filter);
                $scope.currentRoster.$promise.then(function (result) {
                  $scope.currentRoster = result[0];

                  $scope.players = $scope.currentRoster.players;
                  $scope.player = {
                    draftStatus:'roster',
                    status:'regular',
                    posType:'hitter'
                  };
                  $scope.editPlayer = {};

                });
              },
              function(response){
                console.log('bad update roster');
              }
            );
          }

        }
      }





    };









  }
]);
Admin.controller('AdminMainController',[
  '$scope',
  'Mlbbatters',
  'Mlbpitchers',
  'Statupdate',
  'Roster',
  function($scope, Mlbbatters, Mlbpitchers, Statupdate, Roster){
    "use strict";

    $scope.allPlayers = [];
    $scope.linkPLayer = {};
    $scope.players = [];
    $scope.currRoster = {};

    $scope.pullRawBatters = function(){
      console.log('pull raw batters');
      $scope.allPlayers = Mlbbatters.fetchBatters({},
        function(response) {
          $scope.allPlayers = response.data;
          var count = $scope.allPlayers.length;
          var z = response.data;
          var a = z;
        },
        function(error) {
          $log.debug('bad get batters', error);
        });

    };
    $scope.pullRawPitchers = function(){
      console.log('pull raw pitchers');
      $scope.allPlayers = Mlbpitchers.fetchPitchers({},
        function(response) {
          $scope.allPlayers = response.data;
          var count = $scope.allPlayers.length;
        },
        function(error) {
          $log.debug('bad get batters', error);
        });
    };
    $scope.getAssociatedStatus = function(player){

      if (player.mlbid){
        return 'is-associated';
      }


    };

    $scope.refreshStats = function(){
      console.log('refresh stats');

      Statupdate.updatestats({},
        function(response){
          console.log('good stats update: ' + JSON.stringify(response));
        },
        function(response){
          console.log('bad stats update: ' + JSON.stringify(response));
        }
      );
    };


    $scope.associateRosterPLayer = function(player){
      console.log('PLayer: ' + player.name);
      var refreshPlayers = [];
      angular.forEach($scope.players, function(value, key){
        var targetPlayer = value;
        if (value.name === player.name){
          console.log('MATCH  value: ' + JSON.stringify(value));
          targetPlayer.mlbid = $scope.mLBSet.mlbid;
          // map the property on the object
        }
        refreshPlayers.push(targetPlayer);


      });
      // reassign players to roster
      $scope.currentRoster.players = refreshPlayers;
      console.log('save this: ' + JSON.stringify($scope.currentRoster));
      delete $scope.currentRoster._id;
      Roster.upsert($scope.currentRoster,
        function(response){
          console.log('good update roster');
          // load roster data
          var filter = {
            'filter[where][slug]':$scope.currRoster
          };
          $scope.currentRoster = Roster.query(filter);
          $scope.currentRoster.$promise.
            then(function (result) {
              $scope.currentRoster = result[0];
              $scope.players = $scope.currentRoster.players;

            });
        },
        function(response){
          console.log('bad update roster');
        }
      );





    };

    $scope.chooseMLBPLayer = function(){
      console.log('selected mlb player: ' + $scope.mLBSet.mlbid);
    };

    $scope.selectedMLBIds = [];

    $scope.loadRoster = function(roster){
      $scope.currRoster = roster;
      // load roster data
      var filter = {
        'filter[where][slug]':$scope.currRoster
      };
      $scope.currentRoster = Roster.find(filter);
      $scope.currentRoster.$promise.
        then(function (result) {
          $scope.currentRoster = result[0];
          $scope.players = $scope.currentRoster.players;

        });

    };

    $scope.deletePlayer = function(player){
      if(confirm('delete player')){
        console.log('try to delete: ' + player.name);

        var index = $scope.currentRoster.players.indexOf(player);
        $scope.currentRoster.players.splice(index,1);
        delete $scope.currentRoster._id;
        Roster.upsert($scope.currentRoster,
          function(response){
            console.log('good update roster');
            var filter = {
              'filter[where][slug]':$scope.currentRosterName
            };
            $scope.currentRoster = Roster.find(filter);
            $scope.currentRoster.$promise.then(function (result) {
              $scope.currentRoster = result[0];

              $scope.players = $scope.currentRoster.players;
              $scope.player = {
                draftStatus:'roster',
                status:'regular',
                posType:'hitter'
              };


            });
          },
          function(response){
            console.log('bad update roster');
          }
        );


      }
    };
    $scope.savePlayer = function(player){
      console.log('fuck ya');
      var rosterObj = $scope.currentRoster;
      if (!rosterObj.players){
        rosterObj.players = [];
      }
      rosterObj.players.push(player);

      if (rosterObj._id){
        delete rosterObj._id;
        Roster.upsert(rosterObj,
          function(response){
            console.log('good update roster');
            var filter = {
              'filter[where][slug]':$scope.currentRosterName
            };
            $scope.currentRoster = Roster.find(filter);
            $scope.currentRoster.$promise.then(function (result) {
              $scope.currentRoster = result[0];

              $scope.players = $scope.currentRoster.players;
              $scope.player = {
                draftStatus:'roster',
                status:'regular',
                posType:'hitter'
              };


            });
          },
          function(response){
            console.log('bad update roster');
          }
        );
      }
      else{
        rosterObj.name = $scope.currentRosterName;
        rosterObj.slug = $scope.currentRosterName;
        Roster.updateOrCreate(rosterObj,
          function(response){
            console.log('good update roster');
            var filter = {
              'filter[where][slug]':$scope.currentRosterName
            };
            $scope.currentRoster = Roster.find(filter);
            $scope.currentRoster.$promise.then(function (result) {
              $scope.currentRoster = result[0];

              $scope.players = $scope.currentRoster.players;
              $scope.player = {
                draftStatus:'roster',
                status:'regular',
                posType:'hitter'
              };


            });
          },
          function(response){
            console.log('bad update roster');
          }
        );
      }


    };
  }
]);
