Stats.directive('bbpStatsUpdateView', [
  '$scope',
  '$log',
  function($log, $scope) {
    return {
      restrict: 'E',
      templateUrl: './scripts/module/stats/templates/stats.update.html'
    }

  }
]);
Stats.directive('bbpStatsUpdateFrames', [
  '$log',
  '$timeout',
  '$interval',
  'Statupdate',
  function($log, $timeout, $interval, Statupdate) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/stats/templates/stats.update.frames.html',
      controller: [
        '$scope',
        function($scope) {
          console.log('TESTS');
          $scope.rostsersCollection = [
            'http://bbpool2017.herokuapp.com/#/roster/bashers',
            'http://bbpool2017.herokuapp.com/#/roster/mashers',
            'http://bbpool2017.herokuapp.com/#/roster/rallycaps',
            'http://bbpool2017.herokuapp.com/#/roster/stallions'
          ];
          $scope.updateMessage = '';
        }
      ],
      link: function(scope, el, attrs) {

        var domHost = document.getElementById('mount-point');

        function updateFrame(link) {
          console.log('ROSTER: ', link);

          // var domHost = document.getElementById('mount-point');

          var iframe = document.createElement('iframe');
          iframe.style.visibility = 'hidden';
          iframe.src = link;
          domHost.appendChild(iframe);
        }

        function doTheUpdate() {
          scope.rostsersCollection.map(function(link) {
            $timeout(function() {
              updateFrame(link);
            }, 2000);
          });

        }

        function goForIt() {
          scope.updateMessage = 'updating';
          Statupdate.updatestats({},
            function(response){
              console.log('good stats update: ' + JSON.stringify(response));
              $timeout(function() {
                doTheUpdate();
                $timeout(function() {
                  doTheUpdate();

                  scope.updateMessage = 'stats should be updated';
                },2000);
              },2000);
            },
            function(response){
              console.log('bad stats update: ' + JSON.stringify(response));
            }
          );
        }



        goForIt();


      }
    }

  }
]);
Stats.directive('bbpStatsTopTen', [
  function() {
    return {
      restrict: 'E',
      controller: [
        'Dailybatterstat',
        'Dailypitcherstat',
        '$scope',
        function(Dailybatterstat, Dailypitcherstat, $scope) {
          $scope.topTenList = [];

          var masterHitterCollection = [];
          var masterPitcherCollection = [];
          var statsCollection = [];

          var uniqueObj = {};

          var rankedTotals = function(collection, stat) {
            return collection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
              return b[stat] - a[stat]
            });
          };


          var ONE_WEEK = 4 * 24 * 60 * 60 * 1000;  // Month in milliseconds
          var filter = {
            where: {
              lastUpdate: {gt: Date.now() - ONE_WEEK}
            }
          };


          var batterBlob = {};
          var hotStatData = {};

          function addHitterToHisCollection(hitter) {
            var isUnique = true;
            masterHitterCollection.map(function(hitterCollection) {
              if (hitter.mlbid === hitterCollection[0].mlbid) {
                hitterCollection.push(hitter);
                isUnique = false;
              }
            });
            if (isUnique) {
              var newArray = [hitter];
              masterHitterCollection.push(newArray);
            }
          }

          var weeklyBatterStats = [];
          var weeklyPitcherStats = [];
          var masterStatList = [];

          function rankTheTopTen() {
            console.log('Rank Them');
            weeklyBatterStats.forEach(function(player) {
              masterStatList.push({
                mlbid: player.mlbid,
                name: player.name,
                team: player.team,
                pos: player.pos,
                roster: player.roster,
                total: player.total
              })
            });
            weeklyPitcherStats.forEach(function(player) {
              masterStatList.push({
                mlbid: player.mlbid,
                name: player.name,
                team: player.team,
                pos: player.pos,
                roster: player.roster,
                total: player.total
              })
            });


            // rank by total

            var x = rankedTotals(masterStatList, 'total');
            var totalList = [];

            x.forEach(function(player) {
              if (!uniqueObj[player.mlbid]) {
                uniqueObj[player.mlbid] = player;
                totalList.push(player);

              }
            });




            $scope.topTenList = totalList;



          }

          Dailybatterstat.find({filter: filter})
            .$promise
            .then(function(response) {
              weeklyBatterStats = response;
              Dailypitcherstat.find({filter: filter})
                .$promise
                .then(function(response) {
                  weeklyPitcherStats = response;


                  rankTheTopTen();

                })
                .catch(function(error) {
                  console.log('get pitcher batter stats error: ', error);
                });


            })
            .catch(function(error) {
              console.log('get daily batter stats error: ', error);
            });

        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('topTenList', function(newVal, oldVal) {

          // if (newVal && newVal.length > 0) {
          ReactDOM.render(React.createElement(TopTenList, {store:scope}), el[0]);
          //  }

          //    React.render(React.createElement(HitterBigData, {scope:scope}), el[0]);
        });
      }
    }
  }
]);
Stats.directive('bbpStatsBigData', [
  function() {
    return {
      restrict: 'E',
      controller: [
        'Dailybatterstat',
        '$scope',
        function(Dailybatterstat, $scope) {
          $scope.batterData = [];

          var masterHitterCollection = [];
          var statsCollection = [];
          var scoreStats = {
            hitter: {},
            r: [],
            h: [],
            hr: [],
            rbi: []
          };


          var ONE_WEEK = 4 * 24 * 60 * 60 * 1000;  // Month in milliseconds
          var filter = {
            where: {
              lastUpdate: {gt: Date.now() - ONE_WEEK}
            }
          };
          var batterBlob = {};
          var hotStatData = {};

          function addHitterToHisCollection(hitter) {
            var isUnique = true;
            masterHitterCollection.map(function(hitterCollection) {
              if (hitter.mlbid === hitterCollection[0].mlbid) {
                hitterCollection.push(hitter);
                isUnique = false;
              }
            });
            if (isUnique) {
              var newArray = [hitter];
              masterHitterCollection.push(newArray);
            }
          }

          Dailybatterstat.find({filter: filter})
            .$promise
            .then(function(response) {
              var weeklyBatterStats = response;

              weeklyBatterStats.map(function(hitter) {
                if (!batterBlob[hitter.mlbid]) {
                  batterBlob[hitter.mlbid] = [];
                }
                batterBlob[hitter.mlbid].push(hitter);
                addHitterToHisCollection(hitter);
              });

              masterHitterCollection.map(function(hitterCollection) {
                var runs = hitterCollection[hitterCollection.length - 1].r - hitterCollection[0].r;
                var hits = hitterCollection[hitterCollection.length - 1].h - hitterCollection[0].h;
                var hr = hitterCollection[hitterCollection.length - 1].hr - hitterCollection[0].hr;
                var rbi = hitterCollection[hitterCollection.length - 1].rbi - hitterCollection[0].rbi;
                var scoreStats = {
                  hitter: hitterCollection[0],
                  r: runs,
                  h: hits,
                  hr: hr,
                  rbi: rbi
                };
                statsCollection.push(scoreStats);
              });



              // sort the stats collection into ranked list (r, h, hr, rbi)
              hotStatData.rankedRuns = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
                return b.r - a.r
              });
              hotStatData.rankedHits = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
                return b.h - a.h
              });
              hotStatData.rankedHomeRuns = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
                return b.hr - a.hr
              });
              hotStatData.rankedRBI = statsCollection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
                return b.rbi - a.rbi
              });

              $scope.batterData = hotStatData;

            })
            .catch(function(error) {
              console.log('get daily batter stats error: ', error);
            });

        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('batterData', function(newVal, oldVal) {

         // if (newVal && newVal.length > 0) {
            ReactDOM.render(React.createElement(HitterBigData, {store:scope}), el[0]);
        //  }

      //    React.render(React.createElement(HitterBigData, {scope:scope}), el[0]);
        });
      }
    }
  }
]);
Stats.directive('bbpStatsHitterHistory', [
  '$timeout',
  '$log',
  '$filter',
  function($timeout, $log, $filter) {
    return {
      restrict: 'E',
      controller: [
        '$scope',
        '$log',
        'StatsServices',
        function($scope, $log, StatsServices) {
          $scope.hitterHistory = [];
          $scope.currentHistory = [];
          $scope.updatedHitterHistory = [];
          $scope.currentPlayerHistory = [];
          $scope.highestTotal = 0;
          $scope.getAllHittersHistory = function(isAll) {



            $scope.sortDir = {};
            $scope.sortDir['name'] = true;
            $scope.sortDir['r'] = true;
            $scope.sortDir['h'] = true;
            $scope.sortDir['hr'] = true;
            $scope.sortDir['rbi'] = true;
            $scope.sortDir['sb'] = true;
            $scope.sortDir['total'] = true;
            $scope.sortDir['aggregate'] = true;
            $scope.sortDir['lastUpdate'] = true;
            $scope.isReverse = function(colName) {
              return $scope.sortDir[colName] = !$scope.sortDir[colName];
            };
            $scope.sortEntities = function(colName) {
              $scope.updatedHitterHistory = $filter('orderBy')($scope.updatedHitterHistory, colName, $scope.isReverse(colName));
            };


            var filter = {};
            if (!isAll) {
              var d = new Date();
              d.setDate(d.getDate()-4);
              //{"where": {"lastUpdate": {"gt": 1459955268314}}}
              filter = {
                filter: { where: { lastUpdate: { gt : d.getTime()} } }
              };
            }
            $scope.getPlayerHistory = function(player) {
              if (player && player.mlbid) {
                var filter = {
                  filter: { where: { mlbid: player.mlbid } }
                };
                var playerHistory = StatsServices.getBatterHistory(filter)
                  .then(function(response) {
                    $log.debug('batter history', response);
                    $timeout(function() {
                      $scope.currentPlayerHistory = response;
                    }, 50);

                    //return response;
                  });

                //$log.debug('Player History', playerHistory);
                //returnArray.map(function(playerUpdate) {
                //  if (playerUpdate.name === player.name) {
                //    playerUpdate.history = playerHistory;
                //  }
                //
                //});

              }
            //  $scope.updatedHitterHistory = returnArray;
            };

            $scope.hitterHistory = StatsServices.getBatterHistory(filter)
              .then(function(response) {
                $log.debug('hitter history', response);



                response.map(function(update) {
                  update.total = parseFloat(update.total);
                  update.r = parseFloat(update.r);
                  update.h = parseFloat(update.h);
                  update.hr = parseFloat(update.hr);
                  update.rbi = parseFloat(update.rbi);
                  update.sb = parseFloat(update.sb);
                  if (parseFloat(update.total) > parseFloat($scope.highestTotal)) {
                    $scope.highestTotal = update.total;
                  }

                  update.lastUpdate = moment(update.lastUpdate).format('mm-dd'); // d.timestamp is from the data
                });

                response = $filter('orderBy')(response, 'total', true);
                $scope.hitterHistory = response;


                $scope.updatedHitterHistory = StatsServices.calculateDeltaPoints(response);

               // $scope.updatedHitterHistory = $filter('orderBy')(xresponse, 'deltaTotal', true);

                //return response;
              });

          };
        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('updatedHitterHistory', function(history, previousHistory) {
          //React.render(HitterHistory, {scope:scope}, el[0]);
          if (history && history.map && history.length > 0) {
            $timeout(function() {
              React.render(React.createElement(HitterHistory, {scope:scope}), el[0]);

            }, 50);

          }

        }, true);

        scope.$watch('currentPlayerHistory', function(history, previousHistory) {
          //React.render(HitterHistory, {scope:scope}, el[0]);
          if (history && history.map && history.length > 0) {
            $timeout(function() {
              history = $filter('orderBy')(history, 'lastUpdate', true);
              var dateRange2 = history[0].lastUpdate;
              var dateRange1 = history[history.length - 1].lastUpdate;
              var total1 = 1;
              var total2 = scope.highestTotal;

              scope.domain = {x: [dateRange1, dateRange2], y: [total1, total2]};
              $log.debug('Player History', history);
              React.render(React.createElement(HitterChart, {scope:scope}), document.getElementById(history[0].mlbid));
              //document.getElementById('formDiv')
            }, 50);

          }

        }, true);

      }
    }
  }
]);
Stats.directive('bbpStatsRList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/stats/templates/stats.roster.list.html'
    }

  }
]);
Stats.directive('bbpMlbHittersStatsList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/stats/templates/hitter.list.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Stats.directive('bbpMlbPitchersStatsList', [
  '$log',
  function($log) {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/stats/templates/pitcher.list.html',
      link: function(scope, el, attrs) {

      }
    }
  }
]);
