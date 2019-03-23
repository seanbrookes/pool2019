Draft.directive('bbpDraftBoard', [
  function() {
    return  {
      restrict: 'E',
      templateUrl: './scripts/modules/draft/templates/draft.board.html',
      controller: [
        '$scope',
        function($scope) {

        }
      ],
      link: function(scope, el, attrs) {
        var currentPick = $('#CurrentPickTitle');

        window.onscroll = function(e) {
          console.log('scroll y  ', window.scrollY);

          if (window.scrollY > 100) {
            currentPick.addClass("fix-top");
          } else {
            currentPick.removeClass("fix-top");
          }

        };
        //currentPick.addEventListener('scroll', function(e) {
        //
        //  if (this.scrollTop > 20) {
        //    wrap.addClass("fix-search");
        //  } else {
        //    wrap.removeClass("fix-search");
        //  }
        //
        //});


        //wrap.on("scroll", function(e) {
        //
        //  if (this.scrollTop > 20) {
        //    wrap.addClass("fix-search");
        //  } else {
        //    wrap.removeClass("fix-search");
        //  }
        //
        //});
      }
    }
  }
]);

Draft.directive('bbpDraftMain', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/draft/templates/draft.main.html'
    }
  }
]);
Draft.directive('bbpDraftUnprotectedList', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/draft/templates/unprotected-list.html',
      controller: [
        '$scope',
        'RosterService',
        'orderByFilter',
        function($scope, RosterService, orderByFilter) {
          $scope.unprotectedPlayers = [];
          $scope.sourcePlayers = [];

          $scope.sortAscending = {
            name: true,
            team: true,
            pos: true,
            status: true,
            roster: true
          };
          $scope.toggleSortOrder = function(fieldName) {
            if (fieldName) {
              $scope.sortAscending[fieldName] = !$scope.sortAscending[fieldName];
            }
          };
          $scope.sortByName = function() {
            $scope.sortAscending['name'] = !$scope.sortAscending['name'];
            $scope.unprotectedPlayers = orderByFilter($scope.unprotectedPlayers, 'name', $scope.sortAscending['name']);
          };
          $scope.sortByPos = function() {
            $scope.sortAscending['pos'] = !$scope.sortAscending['pos'];
            $scope.unprotectedPlayers = orderByFilter($scope.unprotectedPlayers, 'pos', $scope.sortAscending['pos']);
          };
          $scope.sortByTeam = function() {
            $scope.sortAscending['team'] = !$scope.sortAscending['team'];
            $scope.unprotectedPlayers = orderByFilter($scope.unprotectedPlayers, 'team', $scope.sortAscending['team']);
          };
          $scope.sortByRoster = function() {
            $scope.sortAscending['roster'] = !$scope.sortAscending['roster'];
            $scope.unprotectedPlayers = orderByFilter($scope.unprotectedPlayers, 'roster', $scope.sortAscending['roster']);
          };
          $scope.sortByStatus = function() {
            $scope.sortAscending['status'] = !$scope.sortAscending['status'];
            $scope.unprotectedPlayers = orderByFilter($scope.unprotectedPlayers, 'status', $scope.sortAscending['status']);
          };

          $scope.checkboxModel = {
            bashers: true,
            rallycaps: true,
            stallions: true,
            mashers: true
          };
          $scope.checkboxStatusModel = {
            unprotected: true,
            bubble: true,
            prospect: true
          };
          $scope.checkboxPosModel = {
            C: true,
            SS: true,
            LF: true,
            CF: true,
            RF: true,
            DH: true,
            SP: true,
            RP: true
          };
          $scope.checkboxPosModel['1B'] = true;
          $scope.checkboxPosModel['2B'] = true;
          $scope.checkboxPosModel['3B'] = true;

          RosterService.getAllRosters()
          .then(function(rosters) {

            rosters.map(function(roster) {
              var rosterName = roster.name;
              var rosterSlug = roster.slug;
              //var sortedRoster = $scope.protectedSort(roster);
              roster.players.map(function(player) {
                if (player.draftStatus !== 'protected') {
                  player.roster = rosterName;
                  player.slug = rosterSlug;
                  $scope.sourcePlayers.push(player);
                  $scope.unprotectedPlayers.push(player);
                }
              });
            });

            //$scope.rosters = rosters;
          });
        }
      ],
      link: function(scope, el, attrs) {

        scope.$watch('checkboxModel', function(newVal, oldVal) {
          if (scope.sourcePlayers && (scope.sourcePlayers.length > 0)) {
            scope.unprotectedPlayers = [];
            scope.sourcePlayers.map(function(player) {
              if (scope.checkboxModel[player.slug]) {
                scope.unprotectedPlayers.push(player);

              }
            });
          }

        }, true);
        scope.$watch('checkboxPosModel', function(newVal, oldVal) {
          if (scope.sourcePlayers && (scope.sourcePlayers.length > 0)) {
            scope.unprotectedPlayers = [];
            scope.sourcePlayers.map(function(player) {
              if (scope.checkboxPosModel[player.pos]) {
                scope.unprotectedPlayers.push(player);

              }
            });
          }

        }, true);
        scope.$watch('checkboxStatusModel', function(newVal, oldVal) {
          if (scope.sourcePlayers && (scope.sourcePlayers.length > 0)) {
            scope.unprotectedPlayers = [];
            scope.sourcePlayers.map(function(player) {
              if (scope.checkboxStatusModel[player.draftStatus]) {
                scope.unprotectedPlayers.push(player);

              }
            });
          }

        }, true);

        //scope.$watch('sortAscending', function(newVal, oldVal) {
        //  if (scope.unprotectedPlayers && (scope.unprotectedPlayers.length > 0)) {
        //
        //
        //
        //
        //    scope.unprotectedPlayers.sort(function(a, b) {
        //      return parseFloat(a.price) - parseFloat(b.price);
        //    });
        //    scope.unprotectedPlayers.map(function(player) {
        //
        //        scope.unprotectedPlayers.push(player);
        //
        //    });
        //  }
        //}, true);
      }
    }
  }
]);

Draft.directive('bbpDraftRoster', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/draft/templates/draft.roster.html'
    }
  }
]);
