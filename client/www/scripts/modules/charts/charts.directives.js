Charts.directive('bbpPlayerTotalsChart',[
  function() {
   return {
     restrict: 'E',
     controller: 'ChartsMainController',
     templateUrl: './scripts/modules/charts/templates/charts.player.totals.chart.html',
     link: function(scope, el, attrs) {
       scope.$watch('currentPlayerHistory', function(playerHistory, prevPlayerHistory) {
         if (playerHistory && playerHistory.length > 0) {
           var dateRange1 = $scope.chartTotals.stallionsTotals[0].date;
           var dateRange2 = $scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].date;
           // create and render the chart
           var vis = d3.select("#visualisation"),
             WIDTH = 600,
             HEIGHT = 400,
             MARGINS = {
               top: 20,
               right: 20,
               bottom: 20,
               left: 50
             },
             xScale = d3.time.scale()
               .range([MARGINS.left, WIDTH - MARGINS.right])
               .domain([dateRange1, dateRange2]),
             yScale = d3.scale.linear()
               .range([HEIGHT - MARGINS.top, MARGINS.bottom])
               .domain([0, $scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].grandTotal]),
             xAxis = d3.svg.axis()
               .scale(xScale),
             yAxis = d3.svg.axis()
               .scale(yScale)
               .orient("left");

           vis.append("svg:g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
             .call(xAxis);
           vis.append("svg:g")
             .attr("class", "y axis")
             .attr("transform", "translate(" + (MARGINS.left) + ",0)")
             .style({'stroke': '#444444', 'fill': 'none', 'stroke-width': '1px'})
             .call(yAxis);


           var lineGen = d3.svg.line()
             .x(function (d) {
               return xScale(d.date);
             })
             .y(function (d) {
               return yScale(d.grandTotal);
             })
             .interpolate("basis");
           vis.append('svg:path')
             .attr('d', lineGen($scope.chartTotals.mashersTotals))
             .attr('stroke', 'green')
             .attr('stroke-width', 2)
             .attr('fill', 'none');



           var pl = vis.append('g')
             .attr('class', 'legend');

           // MASHERS
           pl.append('rect')
             .attr('x', WIDTH - 200)
             .attr('y', 230)
             .attr('width', 20)
             .attr('height', 20)
             .style('fill', function (d) {
               return 'green';
             });
           pl.append('text')
             .attr('x', WIDTH - 170)
             .attr('y', HEIGHT - 255)
             .attr('width', 200)
             .attr('height', 20)
             .text(function (d) {
               return 'Mashers';
             })
             .style('fill', function (d) {
               return 'orange';
             });


         }

       }, true);
     }
   }
  }]
);
Charts.directive('bbpPlayerHistoryList',
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/charts/templates/charts.player.list.html',
      controller: [
        'RosterService',
        'StatsServices',
        '$scope',
        '$log',
        '$timeout',
        function(RosterService, StatsServices, $scope, $log, $timeout) {



          function loadRosterPlayers() {
            RosterService.getAllRosters()
            .then(function(response) {
              response.map(function(roster) {
                roster.players.map(function(player) {
                  player.roster = roster.slug;
                  if (player.mlbid) {
                    $scope.allPlayers.push(player);
                  }
                })
              })
            });
          }

          $scope.getPlayerHistory = function(player) {
            if (player.mlbid) {
              var filter = {
                filter: { where: { mlbid: player.mlbid } }
              };
              if ((player.pos === 'SP') || (player.pos === 'RP')) {

                $scope.currentPlayerHistory = StatsServices.getPitcherHistory(player.mlbid)
                  .then(function(response) {
                    $log.debug('pitcher history', response);
                    $timeout(function() {
                      $scope.player = reponse;
                      $scope.currentPlayerHistory = response;
                    }, 50);
                    //$scope.currentPlayerHistory = response;
                    //return response;
                  });
              }
              else {
                $scope.currentPlayerHistory = StatsServices.getBatterHistory(filter)
                  .then(function(response) {
                    $log.debug('batter history', response);
                    $timeout(function() {
                      $scope.currentPlayerHistory = response;
                    }, 50);

                    //return response;
                  });
              }
            }
          };





          (function init() {
            loadRosterPlayers();
          })();

        }
      ]
    }

  }
);
