Roster.directive('bbpRosterPlayerForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.player.form.html',
      controller: [
        '$scope',
        '$log',
        'Roster',
        'RosterService',
        function($scope, $log, Roster, RosterService) {

          $scope.newPlayerCtx = {};

          $scope.clearNewPlayer = function() {
            $scope.newPlayerCtx = {};
          };

          $scope.createPlayer = function() {
            if ($scope.newPlayerCtx && $scope.newPlayerCtx.name && $scope.newPlayerCtx.slug) {
              RosterService.saveRosterPlayer($scope.newPlayerCtx)
                .then(function(response) {
                  $log.debug('saved player');
                  $scope.clearNewPlayer();
                });

            }
          }

        }
      ]
    }
  }
]);
Roster.directive('bbpPlayerForm', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.player.form.html',
      controller: [
        '$scope',
        '$log',
        'Roster',
        function($scope, $log, Roster) {

          $scope.clearEditPlayer = function() {
            delete $scope.currentEditRoster.editPlayer;
          };

          $scope.currentEditRoster = {};
          $scope.saveEditPlayer = function() {
            var rosterObj = $scope.currentEditRoster;
            delete rosterObj._id;
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
                });
              },
              function(response){
                console.log('bad update roster');
              }
            );

          }

        }
      ]
    }
  }
]);

Roster.directive('bbpRosterDraftView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.draft.view.html'
    }
  }
]);
Roster.directive('bbpRosterListView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.list.view.html'
    }
  }
]);
Roster.directive('bbpRosterList', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        roster: '=',
        saveRoster: '&'
      },
      templateUrl: './scripts/modules/roster/templates/roster.list.html',
      controller:[
        '$scope',
        'RosterService',
        '$log',
        function($scope, RosterService, $log) {

          $scope.deleteRosterPlayer = function(roster, playerIndex) {
            var player = roster.players[playerIndex];
            if (roster && player) {
              if (confirm('delete player?')) {
                RosterService.deleteRosterPlayer(roster, player)
                  .then(function(response) {
                    $log.debug('Deleted PLayer');
                  });
              }
            }
          };
        }
      ],
      link: function(scope, el, attrs) {

        //scope.$watch('roster', function(newVal, oldVal) {
        //  var x = scope;
        //  console.log('scope', x);
        //});

        scope.updatePlayerDraftStatus = function(roster) {
          scope.saveRoster({roster: roster});
          //.then(function(response) {
          //  console.log('Saved the Roster');
          //});

        };
        scope.updatePlayerPos = function(roster) {
          scope.saveRoster({roster: roster});
          // var xyz = player.pos;
        };


      }
    }
  }
]);
Roster.directive('bbpRosterDraftList', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        roster: '=',
        saveRoster: '&'
      },
      templateUrl: './scripts/modules/roster/templates/roster.draft.list.html',
      controller:[
        '$scope',
        'RosterService',
        '$log',
        function($scope, RosterService, $log) {

          $scope.deleteRosterPlayer = function(roster, playerIndex) {
            var player = roster.players[playerIndex];
            if (roster && player) {
              if (confirm('delete player?')) {
                RosterService.deleteRosterPlayer(roster, player)
                  .then(function(response) {
                    $log.debug('Deleted PLayer');
                  });
              }
            }
          };
          $scope.getDraftStatusClass = function(player, index) {
            if ((index < 12) && (player.draftStatus === 'protected')) {
              return 'draft-protected';
            }
            $log.debug(player.name && player.draftStatus);
            if ((index >= 12) && (player.draftStatus === 'protected')) {
              return 'draft-overprotected';
            }
            if (player.draftStatus === 'bubble') {
              return 'draft-bubble';
            }
            return '';
          };
        }
      ],
      link: function(scope, el, attrs) {

        //scope.$watch('roster', function(newVal, oldVal) {
        //  var x = scope;
        //  console.log('scope', x);
        //});

        scope.updatePlayerDraftStatus = function(roster) {
          scope.saveRoster({roster: roster});
          //.then(function(response) {
          //  console.log('Saved the Roster');
          //});

        };
        scope.updatePlayerPos = function(roster) {
          scope.saveRoster({roster: roster});
         // var xyz = player.pos;
        };


      }
    }
  }
]);

Roster.directive('bbpRosterDiamondView', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.diamond.view.html'
    }
  }
]);
Roster.directive('bbpRosterDiamond', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        roster: '='
      },
      templateUrl: './scripts/modules/roster/templates/roster.diamond.html',
      controller:[
        '$scope',
        'RosterService',
        function($scope, RosterService) {


          $scope.leftFields = [];
          $scope.centerFields = [];
          $scope.rightFields = [];
          $scope.threeBs = [];
          $scope.sss = [];
          $scope.twoBs = [];
          $scope.oneBs = [];
          $scope.starters = [];
          $scope.relievers = [];
          $scope.dhs = [];
          $scope.catchers = [];

          $scope.getDiamondPlayerClass = function(player) {
            if ((player.index < 12) && (player.draftStatus === 'protected')) {
              return 'draft-protected';
            }
            console.log(player.name && player.draftStatus);
            if ((player.index >= 12) && (player.draftStatus === 'protected')) {
              return 'draft-overprotected';
            }
            if (player.draftStatus === 'bubble') {
              return 'draft-bubble';
            }
            return '';
          }


        }



      ],
      link: function(scope, el, attrs) {

        initPositions = function() {

        };

        scope.$watch('roster', function(newRoster, oldVal) {
        //  var x = scope;
        //  console.log('scope', x);

          if (newRoster && newRoster.players) {
           // initPositions();
            scope.leftFields = [];
            scope.centerFields = [];
            scope.rightFields = [];
            scope.threeBs = [];
            scope.sss = [];
            scope.twoBs = [];
            scope.oneBs = [];
            scope.starters = [];
            scope.relievers = [];
            scope.dhs = [];
            scope.catchers = [];
            newRoster.players.map(function(player, index) {
              if (player.draftStatus === 'protected' ||
                player.draftStatus === 'prospect' ||
                player.draftStatus === 'roster') {
                console.log('Roster Diamond', index);
                player.index = index;
                switch(player.pos){

                  case 'LF':
                    scope.leftFields.push(player);
                    break;

                  case 'CF':
                    scope.centerFields.push(player);
                    break;

                  case 'RF':
                    scope.rightFields.push(player);
                    break;

                  case '3B':
                    scope.threeBs.push(player);
                    break;

                  case 'SS':
                    scope.sss.push(player);
                    break;

                  case '2B':
                    scope.twoBs.push(player);
                    break;

                  case '1B':
                    scope.oneBs.push(player);
                    break;

                  case 'SP':
                    scope.starters.push(player);
                    break;

                  case 'RP':
                    scope.relievers.push(player);
                    break;

                  case 'DH':
                    scope.dhs.push(player);
                    break;

                  case 'C':
                    scope.catchers.push(player);
                    break;

                  default:



                }
              }


            });
            scope.roster = newRoster;
          }

        });

      }
    }
  }
]);




//Roster
//
//Roster.directive('bbpRosterDiamond', [
//  function() {
//    return {
//      restrict: 'E',
//      templateUrl: './scripts/modules/roster/templates/roster.diamond.html'
//    }
//  }
//]);

Roster.directive('bbpRosterEdit', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.edit.html',
      controller: [
        '$scope',
        '$log',
        'RosterService',
        'Roster',
        '$state',
        '$stateParams',
        function ($scope, $log, RosterService, Roster, $state, $stateParams) {

          $scope.currentEditRoster = {
            slug:'bashers'
          };

          $scope.cRoster = {};

          if ($stateParams.slug) {

            $scope.currentEditRoster.slug = $stateParams.slug;

          }


          $scope.updatePlayerPos = function() {
            Roster.upsert($scope.currentEditRoster.roster,
              function(response){
                console.log('good update roster');
                $scope.currentEditRoster = RosterService.getRoster($scope.currentEditRoster.slug)
                  .then(function(roster) {

                    var startersArray = [];
                    var closersArray = [];

                    roster.map(function(player) {
                      if (player.pos === 'sp') {
                        startersArray.push(player);
                      }
                      if (player.pos === 'rp') {
                        closersArray.push(player);
                      }
                    });


                    roster.players = $scope.positionSort(roster);

                    roster.players.concat(startersArray);
                    roster.players.concat(closersArray);

                    $scope.currentEditRoster.roster = roster;
                  });
              },
              function(response){
                console.log('bad update roster');
              }
            );
          };

          $scope.editPlayer = function(player) {
            $scope.currentEditRoster.editPlayer = player;
          };
          $scope.deletePlayer = function(player) {
            if (confirm('delete player? ')) {
              RosterService.deleteRosterPlayer($scope.currentEditRoster.roster, player)
                .$promise
                .then(function(response) {
                  $log.debug('player deleted');

                });

            }
          };

          // init the roster for editing
          $scope.currentEditRoster = RosterService.getRoster($scope.currentEditRoster.slug)
            .then(function(roster) {


              var startersArray = [];
              var closersArray = [];

              roster.players.map(function(player) {
                if (player.pos === 'SP') {
                  startersArray.push(player);
                }
                if (player.pos === 'RP') {
                  closersArray.push(player);
                }
              });


              roster.players = $scope.positionSort(roster);

              var plusStarters = roster.players.concat(startersArray);

              var plusClosers = plusStarters.concat(closersArray);

              roster.players = plusClosers;

              //roster.players.concat(startersArray);
              //roster.players.concat(closersArray);

             // roster.players = $scope.positionSort(roster);

              $scope.currentEditRoster.roster = roster;
            });

        }
      ]
    }
  }
]);

Roster.directive('bbpProtectedRoster', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.protected.html',
      controller: [
        '$scope',
        '$log',
        '$state',
        '$stateParams',
        function($scope, $log, $state, $stateParams) {

          $scope.tabNames = ['bashers', 'rallycaps', 'mashers', 'stallions'];

          $scope.activeTabIndex = 0;

          $scope.currentRoster = 'bashers';
          if ($stateParams.slug) {

            $scope.currentRoster = $stateParams.slug;
          }



          $scope.isDisabled = function(rosterSlug) {
            if ($scope.bbpCtx.homeRoster === rosterSlug) {
              return false;
            }
            if ($scope.bbpCtx.homeRoster === 'dog') {
              return false;
            }
            return true;
          }

        }],
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Roster.directive('bbpProtectedRosterList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.protected.list.html',
      controller: [
        '$scope',
        '$log',
        '$state',
        '$stateParams',
        function($scope, $log, $state, $stateParams) {

        $scope.tabNames = ['bashers', 'rallycaps', 'mashers', 'stallions'];

        $scope.activeTabIndex = 0;
        $scope.currentRoster = 'bashers';
        if ($stateParams.slug) {

          $scope.currentRoster = $stateParams.slug;
        }

        $scope.isDisabled = function(rosterSlug) {
          if ($scope.bbpCtx.homeRoster === rosterSlug) {
            return false;
          }
          if ($scope.bbpCtx.homeRoster === 'dog') {
            return false;
          }
          return true;
        }

      }],
      link: function(scope, el, attrs) {

      }
    }
  }
]);
/*
*
*  http://pool2015.herokuapp.com/#authuser/rallycaps
 * http://pool2015.herokuapp.com/#authuser/bashers
 * http://pool2015.herokuapp.com/#authuser/mashers
 * http://pool2015.herokuapp.com/#authuser/stallions
*
* */




Roster.directive('bbpDraftRosterBashers', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.draft.list.b.html',
      link: function(scope, el, attrs) {
        scope.dPlayers = [];
        scope.$watch('rosterDraftCtx.bashersRoster', function(newRoster) {
          if (newRoster && newRoster.players) {
            //scope.dPlayers = newRoster.players;

          }
        }, true);


      }
    }
  }
]);
Roster.directive('bbpDraftRosterRallycaps', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.draft.list.r.html',
      link: function(scope, el, attrs) {
        scope.dPlayers = [];
        scope.$watch('rosterDraftCtx.rallycapsRoster', function(newRoster) {
          if (newRoster && newRoster.players) {
            //scope.dPlayers = newRoster.players;

          }
        }, true);


      }
    }
  }
]);
Roster.directive('bbpDraftRosterStallions', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.draft.list.s.html',
      link: function(scope, el, attrs) {
        scope.dPlayers = [];
        scope.$watch('rosterDraftCtx.stallionsRoster', function(newRoster) {
          if (newRoster && newRoster.players) {
            // scope.dPlayers = newRoster.players;

          }
        }, true);

      }
    }
  }
]);
Roster.directive('bbpDraftRosterMashers', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/roster/templates/roster.draft.list.m.html',
      link: function(scope, el, attrs) {

        scope.dPlayers = [];
        scope.$watch('rosterDraftCtx.mashersRoster', function(newRoster) {
          if (newRoster && newRoster.players) {
            // scope.dPlayers = newRoster.players;

          }
        }, true);

      }
    }
  }
]);
