/**
 * Created by seanbrookes on 2014-03-27.
 */
Draft.controller('DraftMainController',[
  '$scope',
  'Draftpick',
  'DraftServices',
  'RosterService',
  '$log',
  '$interval',
  '$timeout',
  function($scope, Draftpick, DraftServices, RosterService,  $log, $interval, $timeout){
    console.log('Draft Main Controller');

    $scope.ePlayer = {status:'drafted'};
    $scope.isLoadBoard = false;
    $scope.draftPicks = [];
    $scope.draftCtx = {currentPick:{}};
    $scope.draftCtx.currentPickRoster = 'mashers';
    $scope.isShowBoard = false;
    //document.addEventListener("DOMContentLoaded", function(event) {
    //
    //});

    window.onbeforeunload = function(e) {
      localStorage.setItem('scrollpos', window.scrollY);
    };
    var stop;

    function loadBoard() {

      localStorage.setItem('scrollpos', window.scrollY);
      // fade
      $scope.isShowBoard = false;
      $scope.draftPicks = DraftServices.getDraftBoard()
        .then(function(response) {
          // set current pick id

          $scope.draftPicks = response;
          $scope.refreshCurrentPick();
          $scope.isShowBoard = true;

          $timeout(function() {
            var scrollpos = localStorage.getItem('scrollpos');
            if (scrollpos) window.scrollTo(0, scrollpos);

          }, 2000);
//          $timeout(function() {return $scope.isShowBoard = true}, 4000);
        });

    }
    $scope.refreshCurrentPick = function() {
      for (var i = 0;i < $scope.draftPicks.length;i++) {
        var pick = $scope.draftPicks[i];
        if (!pick.name && !pick.pos && !pick.team) {
          $scope.draftCtx.currentPick = pick;
          $scope.draftCtx.currentPickRoster = pick.roster;
          break;
        }
      }
    };

    function startReloadTimer() {
      stop = $interval(loadBoard, 45000);
    }
    $scope.pauseReload = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
        $timeout(startReloadTimer, 24000);
      }
    };
    $scope.stopReload = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };
    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      $scope.stopReload();
    });
    function init() {
      //resetCurrentPick();
      loadBoard();
     // startReloadTimer();
      //socket.on('draftPickUpdate', function() {
      //  loadBoard();
      //});
    }




    $scope.clearPick = function(pick) {
      if (confirm('clear pick?')) {
        pick.name = '';
        pick.pos = '';
        pick.team = '';
        return DraftServices.updateDraftPick(pick)
          .$promise
          .then(function(response) {
            resetCurrentPick();
            loadBoard();
            return response;
          });

      }

    };
    function isOdd(num) { return num % 2;}



    $scope.saveDraftPick = function() {
      if ($scope.draftCtx && $scope.draftCtx.currentPick && $scope.draftCtx.currentPick.name && $scope.draftCtx.currentPick.pos && $scope.draftCtx.currentPick.team) {
        // find the currentPick
        // get the draft collection
        // iterate to find the current pick
        // the one with no name/pos/team
        DraftServices.getDraftBoard()
          .then(function(response) {
            $scope.draftPicks = response;
            for (var i = 0;i < $scope.draftPicks.length;i++) {
              var pick = $scope.draftPicks[i];
              if (!pick.name && !pick.pos && !pick.team) {
                $log.debug('Make Draft Pick [' + pick.id + ']', $scope.draftCtx.currentPick);
                pick.name = $scope.draftCtx.currentPick.name;
                pick.pos = $scope.draftCtx.currentPick.pos;
                pick.team = $scope.draftCtx.currentPick.team;

                return DraftServices.updateDraftPick(pick)
                  .$promise
                  .then(function(response) {
                    resetCurrentPick();
                    return response;


                  });
                break;

              }

            }
          });
      }

    };

    $scope.editPick = function(pick){
      console.log('edit pick: ' + JSON.stringify(pick));
      $scope.showPickForm = true;
      $scope.ePick = pick;
    };

    $scope.postToRoster = function(slug, pick) {
      if (confirm('post to roster?')) {
        $log.debug('post to roster [' + slug + ']', pick);

        // add this player to a roster

        // get roster

        var thisRoster = RosterService.getRoster(slug)
        .then(function(response) {
          var isUnique = true;
          thisRoster = response;
          if (thisRoster.players) {
            thisRoster.players.map(function(player) {
              if (player.name === pick.name) {
                isUnique = false;
              }
            });

            if (isUnique) {
              var thePick = {
                name:pick.name,
                pos:pick.pos,
                team:pick.team,
                draftStatus:'protected'
              };
              thisRoster.players.push(thePick);
              RosterService.updateRoster(thisRoster)
                .$promise
                .then(function(response) {
                  $log.debug('Update Roster Success!');

                });

            }
          }

        });

        //cycle through players

        // if player doesn't exist (by name)
        // add player

        // save roster



      }
    };

    $scope.getDraftRowClass = function(pick) {
      var returnClass = 'DraftPickRow';

      if (pick && pick.round) {
        if (isOdd(pick.round)) {
          returnClass += '--odd';
        }
        else {
          returnClass += '--even';

        }

      }

      if (pick.id === $scope.draftCtx.currentPick.id) {
        returnClass += ' current-pick';
      }
      return returnClass;
    };

    //$scope.$watch('isLoadBoard', functiopostToRostern(newVal, oldVal) {
    //  loadBoard();
    //});
    $scope.updatePickPlayer = function(pick) {
      if (pick && pick.roster) {
        var _pick = pick;
        _pick.slug = pick.roster;
        Draftpick.upsert(pick)
        .$promise
        .then(function(response) {
          $log.debug('good pick update');
          RosterService.saveRosterPlayer(_pick)
            .then(function(response) {
              $log.debug('good roster update');
              $scope.refreshCurrentPick();
            });

        })
        .catch(function(error) {
          $log.warn('bad update pick', error);
        });

      }
    };


//    $scope.deletePick = function(pick){
//      delete pick._id;
//      console.log('test delete');
//      Draftpick.deleteById({"id":pick.id},
//        function(response){
//          console.log('good delete pick');
//          $scope.draftPicks = Draftpick.query({},
//            function(response){
//              //console.log('good get Draftpicks: ' + response);
//            },
//            function(respeonse){
//              console.log('bad get draftpics');
//            }
//          );
//        },
//        function(response){
//          console.log('bad delete');
//        }
//
//      );
//    };
    $scope.showPickForm = false;

    $scope.savePick = function(pick){
      console.log('save pick: ' + JSON.stringify(pick));

      pick.pickTime = Date.now();

      delete pick._id;
      Draftpick.upsert(pick,
        function(response){
          console.log('Update the pick: ' + JSON.stringify(response));
          //$scope.editMode = false;
          //alert('TOAST: success update pick');

          $scope.ePick = {};
          $scope.showPickForm = false;

        },
        function(response){
          console.log('bad update pick: ' + JSON.stringify(response));
        }
      );


    };

    $scope.saveDraftBoardPlayer = function() {
      $log.debug('save draft Board player: ' + JSON.stringify($scope.ePlayer));

      // get the roster
      return RosterService.getRoster($scope.ePlayer.slug)
        .then(function(roster) {
          roster.players.push($scope.ePlayer);
          return RosterService.updateRoster(roster)
            .$promise
                  .then(function(response) {
                    $log.debug('added player');
                    $scope.ePlayer = {status: 'drafted'};
                    return;
                  });
                });
      // add player to the players array
      // save the roster





     // $scope.ePlayer = {};
    };
    $scope.isDog = function(){
      if(localStorage.getItem('homeRoster')){
        if (localStorage.getItem('homeRoster') === 'dog'){
          return true;
        }
        return false;
      }
      return false;
    };

    function updateBoard(){
      console.log('test');
      $scope.draftPicks = Draftpick.query({},
        function(response){
          //console.log('good get Draftpicks: ' + response);
        },
        function(respeonse){
          console.log('bad get draftpics');
        }
      );
    }
  //  var timer = setInterval(updateBoard, 42000);




    function giverShit(data){
      console.log('ed ide:  ' + JSON.stringify(data));
    }

    //$scope.draftGridOptions = {
    //  data: 'draftPicks',
    //  enableCellSelection: true,
    //  enableRowSelection: false,
    //  enableCellEditOnFocus: true,
    //  ngGridEventEndCellEdit: giverShit,
    //  columnDefs: [
    //    {
    //      field:'pickNumber',
    //      displayName:'pk'
    //    },
    //    {
    //      field:'round',
    //      displayName:'rnd'
    //    },
    //    {
    //      field:'roster',
    //      displayName:'roster',
    //      enableCellEdit: true
    //    },
    //    {
    //      field:'player',
    //      displayName:'player',
    //      enableCellEdit: true
    //    },
    //    {
    //      field:'pos',
    //      displayName:'pos',
    //      enableCellEdit: true
    //    },
    //    {
    //      field:'team',
    //      displayName:'team',
    //      enableCellEdit: true
    //    }
    //  ]
    //
    //};
    init();

  }
]);

Draft.controller('GenListController',[
  '$scope',
  'Draftpick',
  function($scope, Draftpick){
    console.log('Generate Draft List');
    var roundIndex = 1;
    var pickIndex = 1;
    var rosterArray = ['mashers','stallions','bashers','rallycaps','rallycaps','bashers','stallions','mashers'];



    for (var i = 0;i < 12;i++){
      for (var j = 0;j < rosterArray.length;j++){
        if (j === 4){
          roundIndex++;
        }

        console.log('[' + roundIndex + '][' + pickIndex + ']' + rosterArray[j]);
//        var draftSlot = {
//
//        };
        var dpObj = {
          pickNumber: pickIndex,
          round: roundIndex,
          roster: rosterArray[j]
        };
        //Draftpick.create(dpObj,
        //  function(response){
        //    console.log('good add draft pick');
        //  },
        //  function(response){
        //    console.log('bad add draft pick');
        //  }
        //);
        pickIndex++;

        if (j === 7){
          roundIndex++;
        }
      }
    }

  }
]);
