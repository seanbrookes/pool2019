Roster.controller('RosterMainController',[
  '$scope',
  'RosterService',
  'Roster',
  'Dailybatterstat',
  'Dailypitcherstat',
  'Totals',
  'StatsServices',
  '$stateParams',
  '$timeout',
  function($scope, RosterService, Roster, Dailybatterstat, Dailypitcherstat, Totals, StatsServices, $stateParams, $timeout){
    console.log('Roster Main Controller');

    $scope.currentRosterName = $stateParams.slug;
    $scope.bbpCtx.currentRoster = $stateParams.slug;
    $scope.bbpCtx.currentPosFilter = '';



    var authUser = localStorage.getItem('homeRoster');
    $scope.canEdit = false;
    $scope.batterTotal = 0;
    $scope.starterTotal = 0;
    $scope.closerTotal = 0;

    //$scope.player = {
    //  draftStatus:'roster',
    //  status:'regular',
    //  posType:'hitter'
    //};
    $scope.player = {};

//    var filter = {
//      'filter[where][roster]':$scope.currentRosterName,
//      'filter[order]':'lastUpdate DESC',
//      'filter[limit]':1
//    };
    var filter = {
      'filter[where][roster]':$scope.currentRosterName,
      'filter[order]':'mlbid',
      'filter[order]':'lastUpdate DESC'
    };
    // $scope.currentRoster = Roster.query(filter);

    $scope.positionSort = function(roster) {
      var cArray = [];
      var oneBArray = [];
      var twoBArray = [];
      var threeBArray = [];
      var ssArray = [];
      var lfArray = [];
      var cfArray = [];
      var rfArray = [];
      var dhArray = [];
      var spArray = [];
      var rpArray = [];
      roster.players.map(function(player) {

        switch(player.pos) {

          case 'C':
            if (cArray.length === 0){
              player.class = 'counting';
            }
            cArray.push(player);
            break;
          case '1B':
            if (oneBArray.length === 0){
              player.class = 'counting';
            }
            oneBArray.push(player);
            break;
          case '2B':
            if (twoBArray.length === 0){
              player.class = 'counting';
            }
            twoBArray.push(player);
            break;
          case '3B':
            if (threeBArray.length === 0){
              player.class = 'counting';
            }
            threeBArray.push(player);
            break;
          case 'SS':
            if (ssArray.length === 0){
              player.class = 'counting';
            }
            ssArray.push(player);
            break;
          case 'LF':
            if (lfArray.length === 0){
              player.class = 'counting';
            }
            lfArray.push(player);
            break;
          case 'CF':
            if (cfArray.length === 0){
              player.class = 'counting';
            }
            cfArray.push(player);
            break;
          case 'RF':
            if (rfArray.length === 0){
              player.class = 'counting';
            }
            rfArray.push(player);
            break;
          case 'DH':
            if (dhArray.length === 0){
              player.class = 'counting';
            }
            dhArray.push(player);
            break;
          case 'SP':
            spArray.push(player);
            break;
          case 'RP':
            rpArray.push(player);
            break;

          default:

        }



      });



      // merge the arrays
      var positionArray = cArray.concat(oneBArray)
        .concat(twoBArray)
        .concat(threeBArray)
        .concat(ssArray)
        .concat(lfArray)
        .concat(cfArray)
        .concat(rfArray)
        .concat(dhArray);

      return positionArray;

    };

    function filterLatest(internalResult) {
      var filteredOut = new Array();
      var uniqueMLBIDArray = [];

      var refMonth = new Date(internalResult[0].date).getMonth();
      var refDay = new Date(internalResult[0].date).getDate();

      for (var i = 0;i < internalResult.length;i++){
        var tPlayer = internalResult[i];

        var playerMonth = new Date(tPlayer.date).getMonth();
        // day of the month
        var playerDate = new Date(tPlayer.date).getDate();
        var currMonth = new Date().getMonth();
        // day of the month
        var currDate = new Date().getDate();


        if (playerMonth === refMonth && playerDate === refDay) {
          if (uniqueMLBIDArray.indexOf(tPlayer.mlbid) === -1){
            uniqueMLBIDArray.push(tPlayer.mlbid);
            filteredOut.push(tPlayer);
          }
        }



        //if (parseInt(playerMonth) >= parseInt(currMonth)) {
        //  if (parseInt(playerDate) >= parseInt(currDate)) {
        //    if (uniqueMLBIDArray.indexOf(tPlayer.mlbid) === -1){
        //      uniqueMLBIDArray.push(tPlayer.mlbid);
        //      filteredOut.push(tPlayer);
        //    }
        //  }
        //}
      }
      return filteredOut;
    }


    /*
     *
     * Batters
     *
     * */
    $scope.currentRawBatters = Dailybatterstat.query(filter);
    $scope.currentRawBatters
      .$promise
      .then(function (result) {

        $scope.currentBatters = filterLatest(result);
        var batterSubtotal = totalAndSortBatters($scope.currentBatters);
        $scope.batters = batterSubtotal.batters;
        $scope.batterTotal = batterSubtotal.subTotal;

      })
      .then(function(response){
        /*
         *
         *
         * Starters
         *
         * */
        $scope.currentPitchers = Dailypitcherstat.query(filter);
        $scope.currentPitchers
          .$promise
          .then(function (result) {
            var currentPitchers = filterLatest(result);
            var startersArray = [];
            var closersArray = [];

            angular.forEach(currentPitchers, function(value, key){
                value.total = parseFloat(value.total);
                if (value.pos === 'SP'){
                  startersArray.push(value);
                }
                else if (value.pos === 'RP') {
                  closersArray.push(value);
                }
                else{
                  console.log(' pitcher with no pos: ' + JSON.stringify(value));
                }
              }
            );
            $scope.starters = totalAndSortStarters(startersArray).starters;
            $scope.closers = totalAndSortClosers(closersArray).closers;
            // return ({starters:originalArray,subTotal:startersSubTotal});
            $scope.starterTotal = totalAndSortStarters(startersArray).subTotal;
            $scope.closerTotal = totalAndSortClosers(closersArray).subTotal;

            totalErUp();


          });
      });


    function compareTotals(a,b) {

      if (parseFloat(a.total) > parseFloat(b.total)){
        return -1;
      }
      if (parseFloat(a.total) < parseFloat(b.total)){
        return 1;
      }
      return 0;
    }
    var totalAndSortBatters = function(rawBatters){
      var battersSubTotal = 0;
      var catchersArray = [];
      var firstBArray = [];
      var twoBArray = [];
      var threeBArray = [];
      var ssArray = [];
      var lfArray = [];
      var cfArray = [];
      var rfArray = [];
      var dhArray = [];

      var returnArray = [];

      for (var i = 0;i < rawBatters.length;i++){
        var player = rawBatters[i];

        // add total property
        //player = totalBatterScore(player);
        switch(player.pos){

          case 'C':
            catchersArray.push(player);
            break;
          case '1B':
            firstBArray.push(player);

            break;

          case '2B':
            twoBArray.push(player);

            break;
          case '3B':
            threeBArray.push(player);

            break;
          case 'SS':
            ssArray.push(player);

            break;
          case 'LF':
            lfArray.push(player);

            break;
          case 'CF':
            cfArray.push(player);

            break;
          case 'RF':
            rfArray.push(player);

            break;

          case 'DH':
            dhArray.push(player);

            break;
          default:

        }

      }

      // set augmented properties
      // total
      // sort
      // establish counting property
      if (catchersArray.length > 0){
        catchersArray.sort(compareTotals);
        catchersArray[0].counting = true;
        battersSubTotal += parseFloat(catchersArray[0].total);
      }
      if (firstBArray.length > 0){
        firstBArray.sort(compareTotals);
        firstBArray[0].counting = true;
        battersSubTotal += parseFloat(firstBArray[0].total);
      }
      if (twoBArray.length > 0){
        twoBArray.sort(compareTotals);
        twoBArray[0].counting = true;
        battersSubTotal += parseFloat(twoBArray[0].total);
      }
      if (threeBArray.length > 0){
        threeBArray.sort(compareTotals);
        threeBArray[0].counting = true;
        battersSubTotal += parseFloat(threeBArray[0].total);
      }
      if (ssArray.length > 0){
        ssArray.sort(compareTotals);
        ssArray[0].counting = true;
        battersSubTotal += parseFloat(ssArray[0].total);
      }
      if (lfArray.length > 0){
        lfArray.sort(compareTotals);
        lfArray[0].counting = true;
        battersSubTotal += parseFloat(lfArray[0].total);
      }
      if (cfArray.length > 0){
        cfArray.sort(compareTotals);
        cfArray[0].counting = true;
        battersSubTotal += parseFloat(cfArray[0].total);
      }
      if (rfArray.length > 0){
        rfArray.sort(compareTotals);
        rfArray[0].counting = true;
        battersSubTotal += parseFloat(rfArray[0].total);
      }
      if (dhArray.length > 0){
        dhArray.sort(compareTotals);
        dhArray[0].counting = true;
        battersSubTotal += parseFloat(dhArray[0].total);
      }
      /*
       *
       * Merge all the arrays
       *
       * */
      //returnArray = $.merge(returnArray,catchersArray);
      //returnArray = $.merge(returnArray,firstBArray);
      //returnArray = $.merge(returnArray,twoBArray);
      //returnArray = $.merge(returnArray,threeBArray);
      //returnArray = $.merge(returnArray,ssArray);
      //returnArray = $.merge(returnArray,lfArray);
      //returnArray = $.merge(returnArray,cfArray);
      //returnArray = $.merge(returnArray,rfArray);
      //returnArray = $.merge(returnArray,dhArray);

      var positionArray = catchersArray
        .concat(firstBArray)
        .concat(twoBArray)
        .concat(threeBArray)
        .concat(ssArray)
        .concat(lfArray)
        .concat(cfArray)
        .concat(rfArray)
        .concat(dhArray);

      return ({batters:positionArray,subTotal:battersSubTotal});
      //return positionSort()
    };


    /*
     *
     * Starters Total
     *
     * */
    var totalAndSortStarters = function(originalArray){
      var startersSubTotal = 0;
//      for (var i = 0;i < originalArray.length;i++){
//        originalArray[i].total = ((originalArray[i].wins * 15) - (originalArray[i].losses * 4) + (originalArray[i].k / 2))
//      }
      originalArray.sort(compareTotals);
      if (originalArray[0]){
        originalArray[0].counting = true;
        startersSubTotal += parseFloat(originalArray[0].total);
      }
      if (originalArray[1]){
        originalArray[1].counting = true;
        startersSubTotal += parseFloat(originalArray[1].total);
      }
      if (originalArray[2]){
        originalArray[2].counting = true;
        startersSubTotal += parseFloat(originalArray[2].total);
      }
      if (originalArray[3]){
        originalArray[3].counting = true;
        startersSubTotal += parseFloat(originalArray[3].total);
      }

      return ({starters:originalArray,subTotal:startersSubTotal});
    };
    /*
     *
     * Closers Total
     *
     * */
    var totalAndSortClosers = function(originalArray){
      var closersSubTotal = 0;

      originalArray.sort(compareTotals);
      if (originalArray[0]){
        originalArray[0].counting = true;
        closersSubTotal += parseFloat(originalArray[0].total);
      }
      if (originalArray[1]){
        originalArray[1].counting = true;
        closersSubTotal += parseFloat(originalArray[1].total);
      }

      return ({closers:originalArray,subTotal:closersSubTotal});
    };


    var totalErUp = function(){
      var x = moment().format('YYYY-MM-DD');
      $scope.grandTotal =( $scope.batterTotal + $scope.starterTotal + $scope.closerTotal );
      var newTotalsRecord = {
        date:moment().format('YYYY-MM-DD'),
        roster:$scope.currentRosterName,
        grandTotal:$scope.grandTotal,
        batterTotal:$scope.batterTotal,
        starterTotal:$scope.starterTotal,
        closerTotal:$scope.closerTotal
      };


      StatsServices.processRosterTotals(newTotalsRecord);

     // Totals.create(newTotalsRecord);
      // record the totals
      // date stamp
      // roster
      //

    }


  }
]);
Roster.controller('RosterProtectedController', [
  '$scope',
  '$log',
  'RosterService',
  function($scope, $log, RosterService) {
    $log.debug('Roster Protected Controller');

    $scope.currentProtectedRoster = 'bashers';

    $scope.rosters = RosterService.getAllRosters()
      .then(function(rosters) {
        var rosters = [];

        $scope.rosters = rosters;
      });
    function refreshProtectedRosters() {
      $scope.protectedRrosters = RosterService.getAllRosters()
        .then(function(rosters) {
          $scope.protectedRrosters = [];
          rosters.map(function(roster) {
            var sortedRoster = $scope.protectedSort(roster);
            $scope.protectedRrosters.push(sortedRoster);
          });

          //$scope.rosters = rosters;
        });
    }
    $scope.protectedRrosters = RosterService.getAllRosters()
      .then(function(rosters) {
        $scope.protectedRrosters = [];
        rosters.map(function(roster) {
          var sortedRoster = $scope.protectedSort(roster);
          $scope.protectedRrosters.push(sortedRoster);
        });

        //$scope.rosters = rosters;
      });

    $scope.getPlayerRowClass = function(index) {
      if (index < 11) {
        return 'protected-row';
      }
      return;
    };

    $scope.protectedSort = function(roster) {
      var retArray = [];
      var protectedArray = [];
      var unprotectedArray = [];
      if (roster && roster.players) {
        roster.players.map(function(player) {
          if (player.status === 'protected') {
            protectedArray.push(player);
          }
          else {
            unprotectedArray.push(player);
          }

        });


        // merge the arrays
        roster.players = protectedArray.concat(unprotectedArray);
      }



      return roster;

    };

    $scope.upateProtectedStatus = function() {
      var self = this;
      $log.debug('what is this: ' + self.player.status);
      RosterService.updateRoster(self.$parent.roster)
        .$promise
        .then(function(response) {
          refreshProtectedRosters();
        });

    }
  }
]);
Roster.controller('RosterDraftViewController', [
  '$scope',
  '$log',
  '$interval',
  'RosterService',
  '$http',
  function($scope, $log, $interval, RosterService, $http) {
    $scope.rosterDraftCtx = {};

    function getDraftSort(roster) {
      var retVal = [];

      var protectedList = [];
      var bubbleList = [];
      var prospectList = [];
      var unprotectedList = [];

      roster.players.map(function(player) {
        switch(player.draftStatus) {
          case 'protected':
            protectedList.push(player);
            break;
          case 'roster':
            protectedList.push(player);
            break;
          case 'bubble':
            bubbleList.push(player);
            break;
          case 'prospect':
            prospectList.push(player);
            break;
          case 'unprotected':
            unprotectedList.push(player);
            break;
          default:
            unprotectedList.push(player);
        }
      });

      $scope.clearUnprotectedPlayers = function() {
        if (confirm('clear the players?')) {
          var scrubbedPlayers = [];

          //bashers
          scrubbedPlayers = [];
          $scope.rosterDraftCtx.bashersRoster.players.map(function(player) {
            if (player.draftStatus === 'protected') {
              scrubbedPlayers.push(player);
            }
            if (player.draftStatus === 'prospect') {
              scrubbedPlayers.push(player);
            }
          });
          $scope.rosterDraftCtx.bashersRoster.players = scrubbedPlayers;
          $scope.saveRoster($scope.rosterDraftCtx.bashersRoster);

          //mashers
          scrubbedPlayers = [];
          $scope.rosterDraftCtx.mashersRoster.players.map(function(player) {
            if (player.draftStatus === 'protected') {
              scrubbedPlayers.push(player);
            }
            if (player.draftStatus === 'prospect') {
              scrubbedPlayers.push(player);
            }
          });
          $scope.rosterDraftCtx.mashersRoster.players = scrubbedPlayers;
          $scope.saveRoster($scope.rosterDraftCtx.mashersRoster);

          //rallycaps
          scrubbedPlayers = [];
          $scope.rosterDraftCtx.rallycapsRoster.players.map(function(player) {
            if (player.draftStatus === 'protected') {
              scrubbedPlayers.push(player);
            }
            if (player.draftStatus === 'prospect') {
              scrubbedPlayers.push(player);
            }
          });
          $scope.rosterDraftCtx.rallycapsRoster.players = scrubbedPlayers;
          $scope.saveRoster($scope.rosterDraftCtx.rallycapsRoster);

          //stallions
          scrubbedPlayers = [];
          $scope.rosterDraftCtx.stallionsRoster.players.map(function(player) {
            if (player.draftStatus === 'protected') {
              scrubbedPlayers.push(player);
            }
            if (player.draftStatus === 'prospect') {
              scrubbedPlayers.push(player);
            }
          });
          $scope.rosterDraftCtx.stallionsRoster.players = scrubbedPlayers;
          $scope.saveRoster($scope.rosterDraftCtx.stallionsRoster);

        }
      };

      protectedList = protectedList.concat(bubbleList);
      protectedList = protectedList.concat(prospectList);
      protectedList = protectedList.concat(unprotectedList);

      roster.players = protectedList;
      return roster;


    }




    $scope.rosterDraftCtx.bashersRoster = RosterService.getRoster('bashers')
      .then(function(roster) {
        $scope.rosterDraftCtx.bashersRoster = getDraftSort(roster);
      });
    $scope.rosterDraftCtx.masherssRoster = RosterService.getRoster('mashers')
      .then(function(roster) {
        $scope.rosterDraftCtx.mashersRoster = getDraftSort(roster);
      });
    $scope.rosterDraftCtx.rallycapsRoster = RosterService.getRoster('rallycaps')
      .then(function(roster) {
        $scope.rosterDraftCtx.rallycapsRoster = getDraftSort(roster);
      });
    $scope.rosterDraftCtx.stallionsRoster = RosterService.getRoster('stallions')
      .then(function(roster) {
        $scope.rosterDraftCtx.stallionsRoster = getDraftSort(roster);
      });

    $scope.loadBashers = function() {
      return $scope.rosterDraftCtx.bashersRoster = RosterService.getRoster('bashers')
        .then(function(roster) {
          return $scope.rosterDraftCtx.bashersRoster = getDraftSort(roster);
        });
    };
    $scope.loadMashers = function() {
      return $scope.rosterDraftCtx.masherssRoster = RosterService.getRoster('mashers')
        .then(function(roster) {
          return $scope.rosterDraftCtx.mashersRoster = getDraftSort(roster);
        });


    };
    $scope.loadRallycaps = function() {
      return $scope.rosterDraftCtx.rallycapsRoster = RosterService.getRoster('rallycaps')
        .then(function(roster) {
          return $scope.rosterDraftCtx.rallycapsRoster = getDraftSort(roster);
        });


    };
    $scope.loadStallions = function() {
      return $scope.rosterDraftCtx.stallionsRoster = RosterService.getRoster('stallions')
        .then(function(roster) {
          return $scope.rosterDraftCtx.stallionsRoster = getDraftSort(roster);
        });


    };

    $scope.saveRoster = function(roster) {
      if (roster.name && roster.players) {
        RosterService.updateRoster(roster)
          .$promise
          .then(function(response) {
            switch (roster.slug) {
              case 'bashers' :
                $scope.loadBashers();
                break;
              case 'mashers' :
                $scope.loadMashers();
                break;
              case 'mashers' :
                $scope.loadMashers();
                break;
              case 'rallycaps' :
                $scope.loadRallycaps();
                break;
              default :
                break;
            }
          });
      }
    };



    $scope.init = function() {
      $scope.loadBashers();
      $scope.loadMashers();
      $scope.loadRallycaps();
      $scope.loadStallions();
      /**
       *
       * code used to initialize db from previous years roster backup file
       *
       * */
      //$http({
      //  method: 'GET',
      //  url: '/dbbackup/rosters.json'})
      //  .then(function(response) {
      //    $log.debug('yahoo', response);
      //    var allPlayers = [];
      //    response.data.map(function(roster) {
            //RosterService.addRoster(roster)
            //  .then(function(response) {
            //    $log.debug('good job');
            //  })
            //  .catch(function(error) {
            //    $log.warn('bad save roster', error);
            //  });
            //var playerArray = roster.players.map(function(player) {
            //  player.draftStatus = 'protected';
            //  player.slug = roster.slug;
              //RosterService.saveRosterPlayer(player)
              //  .then(function(response) {
              //    $log.debug('good job');
              //  })
              //  .catch(function(error) {
              //    $log.warn('bad save rosterplayer', error);
              //  });
            //});
            //allPlayers.concat(playerArray);
            //console.log('inner', allPlayers);

        //  });
        //  console.log('outer', allPlayers);
        //}).catch(function(error) {
        //  $log.warn('bad get roster file', error);
        //});

    };
    //$scope.initBak = function() {
    //
    //  $interval(function() {
    //    $scope.loadBashers();
    //  }, (1000 * 700));
    //  $interval(function() {
    //    $scope.loadMashers();
    //  },  (1000 * 200));
    //  $interval(function() {
    //    $scope.loadRallycaps();
    //  },  (1000 * 230));
    //  $interval(function() {
    //    $scope.loadStallions();
    //  },  (1000 * 309));
    //};

    $scope.init();
  }
]);
