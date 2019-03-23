Common.directive('bbpCommonTotalsChart', [
  function() {
    return  {
      restrict: 'E',
      template: '<svg id="visualisation" height="500" width="1000"></svg>',
      controller: [
        '$scope',
        '$log',
        'Totals',
        function($scope, $log, Totals) {
          $scope.chartTotals = Totals.find({})
            .$promise
            .then(function (totalsCollection) {
              $log.debug('totalsCollection');

              var yScaleExtent = 0;

              function getHighestTotal(a, b, c, d) {
                var highValue = a;

                if (b > highValue) {
                  highValue = b;
                }
                if (c > highValue) {
                  highValue = c
                }
                if (d > highValue) {
                  highValue = d
                }
                $log.debug('high value', highValue);

                return highValue;
              }
              /*
               *
               * each roster:
               * - date
               * - grandTotal
               *
               * Date
               * Roster
               * grandTotal
               *
               * */
              $scope.chartTotals = {
                bashersTotals: [],
                mashersTotals: [],
                rallyCapsTotals: [],
                stallionsTotals: []
              };
              //  var parseDate = d3.time.format("%Y%m%d").parse;
              //  function getDate(d) {
              //    return new Date(d.jsonDate);
              //  }
              if (totalsCollection && totalsCollection.map && totalsCollection.length > 0) {
                totalsCollection.map(function (totalItem) {
                  switch (totalItem.roster) {
                    case 'bashers':
                      $scope.chartTotals.bashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'mashers':
                      $scope.chartTotals.mashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'rallycaps':
                      $scope.chartTotals.rallyCapsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'stallions':
                      $scope.chartTotals.stallionsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    default:

                  }
                });


                var highestTotal = getHighestTotal($scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].grandTotal, $scope.chartTotals.bashersTotals[$scope.chartTotals.bashersTotals.length - 1].grandTotal, $scope.chartTotals.rallyCapsTotals[$scope.chartTotals.rallyCapsTotals.length - 1].grandTotal, $scope.chartTotals.mashersTotals[$scope.chartTotals.mashersTotals.length - 1].grandTotal)

                var dateRange1 = $scope.chartTotals.stallionsTotals[0].date;
                var dateRange2 = $scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].date;
                // create and render the chart
                var vis = d3.select("#visualisation"),
                  WIDTH = 1000,
                  HEIGHT = 500,
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
                    .domain([0, highestTotal]),
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


                var gtLineGen = d3.svg.line()
                  .x(function (d) {
                    return xScale(d.date);
                  })
                  .y(function (d) {
                    return yScale(d.grandTotal);
                  })
                  .interpolate("basis");
                vis.append('svg:path')
                  .attr('d', gtLineGen($scope.chartTotals.mashersTotals))
                  .attr('stroke', 'green')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', gtLineGen($scope.chartTotals.bashersTotals))
                  .attr('stroke', 'blue')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', gtLineGen($scope.chartTotals.rallyCapsTotals))
                  .attr('stroke', 'red')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', gtLineGen($scope.chartTotals.stallionsTotals))
                  .attr('stroke', 'grey')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append("text")
                  .attr("x", (WIDTH / 2))
                  .attr("y", 30)
                  .attr("text-anchor", "middle")
                  .style("font-size", "16px")
                  .style("stroke", "#999999")
                  .style("stroke-width", "1px")
                  .style("text-decoration", "underline")
                  .text("Grand Totals Chart");

                var pl = vis.append('g')
                  .attr('class', 'legend');
                // BASHERS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 200)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'blue';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 285)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Bashers';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
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
                // RALLY CAPS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 260)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'red';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 225)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Rally Caps';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
                // STALLIONS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 290)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'grey';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 195)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Stallions';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });

              }
            });


        }
      ],
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Common.directive('bbpCommonPitchingTotalsChart', [
  function() {
    return  {
      restrict: 'E',
      template: '<svg id="HittersTotalChart" height="500" width="1000"></svg>',
      controller: [
        '$scope',
        '$log',
        'Totals',
        function($scope, $log, Totals) {
          $scope.chartTotals = Totals.find({})
            .$promise
            .then(function (totalsCollection) {
              $log.debug('totalsCollection');

              var yScaleExtent = 0;

              function getHighestTotal(a, b, c, d) {
                var highValue = a;

                if (b > highValue) {
                  highValue = b;
                }
                if (c > highValue) {
                  highValue = c
                }
                if (d > highValue) {
                  highValue = d
                }
                $log.debug('high value', highValue);

                return highValue;
              }
              /*
               *
               * each roster:
               * - date
               * - grandTotal
               *
               * Date
               * Roster
               * grandTotal
               *
               * */
              $scope.chartTotals = {
                bashersTotals: [],
                mashersTotals: [],
                rallyCapsTotals: [],
                stallionsTotals: []
              };
              //  var parseDate = d3.time.format("%Y%m%d").parse;
              //  function getDate(d) {
              //    return new Date(d.jsonDate);
              //  }
              if (totalsCollection && totalsCollection.map && totalsCollection.length > 0) {
                totalsCollection.map(function (totalItem) {
                  switch (totalItem.roster) {
                    case 'bashers':
                      $scope.chartTotals.bashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'mashers':
                      $scope.chartTotals.mashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'rallycaps':
                      $scope.chartTotals.rallyCapsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'stallions':
                      $scope.chartTotals.stallionsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    default:

                  }
                });


                var highestTotal = getHighestTotal($scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].grandTotal, $scope.chartTotals.bashersTotals[$scope.chartTotals.bashersTotals.length - 1].grandTotal, $scope.chartTotals.rallyCapsTotals[$scope.chartTotals.rallyCapsTotals.length - 1].grandTotal, $scope.chartTotals.mashersTotals[$scope.chartTotals.mashersTotals.length - 1].grandTotal)

                var dateRange1 = $scope.chartTotals.stallionsTotals[0].date;
                var dateRange2 = $scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].date;
                // create and render the chart
                var vis = d3.select("#HittersTotalChart"),
                  WIDTH = 1000,
                  HEIGHT = 500,
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
                    .domain([0, highestTotal]),
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
                vis.append("text")
                  .attr("x", (WIDTH / 2))
                  .attr("y", 30)
                  .attr("text-anchor", "middle")
                  .style("font-size", "16px")
                  .style("stroke", "#999999")
                  .style("stroke-width", "1px")
                  .style("text-decoration", "underline")
                  .text("Starter Totals Chart");

                var lineGen = d3.svg.line()
                  .x(function (d) {
                    return xScale(d.date);
                  })
                  .y(function (d) {
                    return yScale(d.starterTotal);
                  })
                  .interpolate("basis");
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.mashersTotals))
                  .attr('stroke', 'green')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.bashersTotals))
                  .attr('stroke', 'blue')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.rallyCapsTotals))
                  .attr('stroke', 'red')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.stallionsTotals))
                  .attr('stroke', 'grey')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');


                var pl = vis.append('g')
                  .attr('class', 'legend');
                // BASHERS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 200)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'blue';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 285)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Bashers';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
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
                // RALLY CAPS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 260)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'red';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 225)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Rally Caps';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
                // STALLIONS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 290)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'grey';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 195)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Stallions';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });

              }
            });


        }
      ],
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Common.directive('bbpCommonHittingTotalsChart', [
  function() {
    return  {
      restrict: 'E',
      template: '<svg id="StartersTotalChart" height="500" width="1000"></svg>',
      controller: [
        '$scope',
        '$log',
        'Totals',
        function($scope, $log, Totals) {
          $scope.chartTotals = Totals.find({})
            .$promise
            .then(function (totalsCollection) {
              $log.debug('StartersTotalChart');

              var yScaleExtent = 0;

              function getHighestTotal(a, b, c, d) {
                var highValue = a;

                if (b > highValue) {
                  highValue = b;
                }
                if (c > highValue) {
                  highValue = c
                }
                if (d > highValue) {
                  highValue = d
                }
                $log.debug('high value', highValue);

                return highValue;
              }
              /*
               *
               * each roster:
               * - date
               * - grandTotal
               *
               * Date
               * Roster
               * grandTotal
               *
               * */
              $scope.chartTotals = {
                bashersTotals: [],
                mashersTotals: [],
                rallyCapsTotals: [],
                stallionsTotals: []
              };
              //  var parseDate = d3.time.format("%Y%m%d").parse;
              //  function getDate(d) {
              //    return new Date(d.jsonDate);
              //  }
              if (totalsCollection && totalsCollection.map && totalsCollection.length > 0) {
                totalsCollection.map(function (totalItem) {
                  switch (totalItem.roster) {
                    case 'bashers':
                      $scope.chartTotals.bashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'mashers':
                      $scope.chartTotals.mashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'rallycaps':
                      $scope.chartTotals.rallyCapsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'stallions':
                      $scope.chartTotals.stallionsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    default:

                  }
                });


                var highestTotal = getHighestTotal($scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].grandTotal, $scope.chartTotals.bashersTotals[$scope.chartTotals.bashersTotals.length - 1].grandTotal, $scope.chartTotals.rallyCapsTotals[$scope.chartTotals.rallyCapsTotals.length - 1].grandTotal, $scope.chartTotals.mashersTotals[$scope.chartTotals.mashersTotals.length - 1].grandTotal)

                var dateRange1 = $scope.chartTotals.stallionsTotals[0].date;
                var dateRange2 = $scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].date;
                // create and render the chart
                var vis = d3.select("#StartersTotalChart"),
                  WIDTH = 1000,
                  HEIGHT = 500,
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
                    .domain([0, highestTotal]),
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
                    return yScale(d.batterTotal);
                  })
                  .interpolate("basis");
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.mashersTotals))
                  .attr('stroke', 'green')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.bashersTotals))
                  .attr('stroke', 'blue')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.rallyCapsTotals))
                  .attr('stroke', 'red')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.stallionsTotals))
                  .attr('stroke', 'grey')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append("text")
                  .attr("x", (WIDTH / 2))
                  .attr("y", 30)
                  .attr("text-anchor", "middle")
                  .style("font-size", "16px")
                  .style("stroke", "#999999")
                  .style("stroke-width", "1px")
                  .style("text-decoration", "underline")
                  .text("Hitting Totals Chart");

                var pl = vis.append('g')
                  .attr('class', 'legend');
                // BASHERS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 200)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'blue';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 285)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Bashers';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
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
                // RALLY CAPS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 260)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'red';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 225)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Rally Caps';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
                // STALLIONS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 290)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'grey';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 195)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Stallions';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });

              }
            });


        }
      ],
      link: function(scope, el, attrs) {

      }
    }
  }
]);
Common.directive('bbpCommonCloserTotalsChart', [
  function() {
    return  {
      restrict: 'E',
      template: '<svg id="ClosersTotalChart" height="500" width="1000"></svg>',
      controller: [
        '$scope',
        '$log',
        'Totals',
        function($scope, $log, Totals) {
          $scope.chartTotals = Totals.find({})
            .$promise
            .then(function (totalsCollection) {
              $log.debug('ClosersTotalChart');

              var yScaleExtent = 0;

              function getHighestTotal(a, b, c, d) {
                var highValue = a;

                if (b > highValue) {
                  highValue = b;
                }
                if (c > highValue) {
                  highValue = c
                }
                if (d > highValue) {
                  highValue = d
                }
                $log.debug('high value', highValue);

                return highValue;
              }
              /*
               *
               * each roster:
               * - date
               * - grandTotal
               *
               * Date
               * Roster
               * grandTotal
               *
               * */
              $scope.chartTotals = {
                bashersTotals: [],
                mashersTotals: [],
                rallyCapsTotals: [],
                stallionsTotals: []
              };
              //  var parseDate = d3.time.format("%Y%m%d").parse;
              //  function getDate(d) {
              //    return new Date(d.jsonDate);
              //  }
              if (totalsCollection && totalsCollection.map && totalsCollection.length > 0) {
                totalsCollection.map(function (totalItem) {
                  switch (totalItem.roster) {
                    case 'bashers':
                      $scope.chartTotals.bashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'mashers':
                      $scope.chartTotals.mashersTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'rallycaps':
                      $scope.chartTotals.rallyCapsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    case 'stallions':
                      $scope.chartTotals.stallionsTotals.push({
                        date: new Date(totalItem.date),
                        grandTotal: totalItem.grandTotal,
                        starterTotal: totalItem.starterTotal,
                        closerTotal: totalItem.closerTotal,
                        batterTotal: totalItem.batterTotal
                      });

                      break;

                    default:

                  }
                });


                var highestTotal = getHighestTotal($scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].grandTotal, $scope.chartTotals.bashersTotals[$scope.chartTotals.bashersTotals.length - 1].grandTotal, $scope.chartTotals.rallyCapsTotals[$scope.chartTotals.rallyCapsTotals.length - 1].grandTotal, $scope.chartTotals.mashersTotals[$scope.chartTotals.mashersTotals.length - 1].grandTotal)

                var dateRange1 = $scope.chartTotals.stallionsTotals[0].date;
                var dateRange2 = $scope.chartTotals.stallionsTotals[$scope.chartTotals.stallionsTotals.length - 1].date;
                // create and render the chart
                var vis = d3.select("#ClosersTotalChart"),
                  WIDTH = 1000,
                  HEIGHT = 500,
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
                    .domain([0, highestTotal]),
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
                    return yScale(d.closerTotal);
                  })
                  .interpolate("basis");
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.mashersTotals))
                  .attr('stroke', 'green')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.bashersTotals))
                  .attr('stroke', 'blue')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.rallyCapsTotals))
                  .attr('stroke', 'red')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append('svg:path')
                  .attr('d', lineGen($scope.chartTotals.stallionsTotals))
                  .attr('stroke', 'grey')
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');
                vis.append("text")
                  .attr("x", (WIDTH / 2))
                  .attr("y", 30)
                  .attr("text-anchor", "middle")
                  .style("font-size", "16px")
                  .style("stroke", "#999999")
                  .style("stroke-width", "1px")
                  .style("text-decoration", "underline")
                  .text("Closers Totals Chart");

                var pl = vis.append('g')
                  .attr('class', 'legend');
                // BASHERS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 200)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'blue';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 285)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Bashers';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
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
                // RALLY CAPS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 260)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'red';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 225)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Rally Caps';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });
                // STALLIONS
                pl.append('rect')
                  .attr('x', WIDTH - 200)
                  .attr('y', 290)
                  .attr('width', 20)
                  .attr('height', 20)
                  .style('fill', function (d) {
                    return 'grey';
                  });
                pl.append('text')
                  .attr('x', WIDTH - 170)
                  .attr('y', HEIGHT - 195)
                  .attr('width', 200)
                  .attr('height', 20)
                  .text(function (d) {
                    return 'Stallions';
                  })
                  .style('fill', function (d) {
                    return 'orange';
                  });

              }
            });


        }
      ],
      link: function(scope, el, attrs) {

      }
    }
  }
]);

Common.directive('grandTotalsSummaryList', [
  'Totals',
  function(Totals){
    return{
      restrict: 'E',
      replace: true,
      controller:[
        '$scope',
        '$filter',
        function($scope, $filter){
          var filter = {
            'filter[order]':'date DESC'
          };

          var initTotals = Totals.find(filter);
          initTotals
            .$promise
            .then(function (result) {
              var beginArray = result.filter(function(item) {
                if (item.roster) {
                  return item;
                }
              });
              var returnArray = [];

              var totalsComparitorObj = {
                bashers:{
                  latest:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  },
                  previous:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  }
                },
                mashers:{
                  latest:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  },
                  previous:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  }
                },
                rallycaps:{
                  latest:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  },
                  previous:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  }
                },
                stallions:{
                  latest:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  },
                  previous:{
                    grandTotal:0,
                    hitterTotal:0,
                    starterTotal:0,
                    closerTotal:0
                  }
                }

              };
              var latestDate;
              var previousDate;
              var rosterChecklist = [];
              for (var i = 0;i  <  beginArray.length;i++){
                var currTotalRecord = beginArray[i];
                if (!latestDate){
                  latestDate = beginArray[0].date;
                  previousDate = moment(latestDate).subtract('days',1).format('YYYY-MM-DD');
                  console.log('dates: ' + latestDate + ':' + moment(previousDate).format('YYYY-MM-DD'));
                }
                var bBashersDeltaCalculated = false;
                var bBashersTotalCalculated = false;
                var bMashersDeltaCalculated = false;
                var bMashersTotalCalculated = false;
                var bRallycapsDeltaCalculated = false;
                var bRallycapsTotalCalculated = false;
                var bStallionsDeltaCalculated = false;
                var bStallionsTotalCalculated = false;

                switch(currTotalRecord.roster){

                  case 'bashers':
                    if (currTotalRecord.date === latestDate){
                      if (!totalsComparitorObj.bashers.latest.date) {
                        bBashersTotalCalculated = true;

                        totalsComparitorObj.bashers.latest.date = currTotalRecord.date;
                        totalsComparitorObj.bashers.latest.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.bashers.latest.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.bashers.latest.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.bashers.latest.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    if (!bBashersDeltaCalculated && (currTotalRecord.date !== latestDate)){
                      if (!totalsComparitorObj.bashers.previous.date){
                        bBashersDeltaCalculated = true;
                        totalsComparitorObj.bashers.previous.date = currTotalRecord.date;
                        totalsComparitorObj.bashers.previous.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.bashers.previous.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.bashers.previous.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.bashers.previous.closerTotal = currTotalRecord.closerTotal;


                      }
                    }
                    break;
                  case 'mashers':
                    if (currTotalRecord.date === latestDate){
                      if (!totalsComparitorObj.mashers.latest.date){
                        bMashersTotalCalculated = true;
                        totalsComparitorObj.mashers.latest.date = currTotalRecord.date;
                        totalsComparitorObj.mashers.latest.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.mashers.latest.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.mashers.latest.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.mashers.latest.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    if (!bMashersDeltaCalculated && (currTotalRecord.date !== latestDate)){
                      if (!totalsComparitorObj.mashers.previous.date){
                        bMashersDeltaCalculated = true;
                        totalsComparitorObj.mashers.previous.date = currTotalRecord.date;
                        totalsComparitorObj.mashers.previous.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.mashers.previous.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.mashers.previous.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.mashers.previous.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    break;
                  case 'rallycaps':
                    if (currTotalRecord.date === latestDate){
                      if (!totalsComparitorObj.rallycaps.latest.date){
                        bRallycapsTotalCalculated = true;
                        totalsComparitorObj.rallycaps.latest.date = currTotalRecord.date;
                        totalsComparitorObj.rallycaps.latest.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.rallycaps.latest.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.rallycaps.latest.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.rallycaps.latest.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    if (!bRallycapsDeltaCalculated && (currTotalRecord.date !== latestDate)){
                      if (!totalsComparitorObj.rallycaps.previous.date){
                        bRallycapsDeltaCalculated = true;
                        totalsComparitorObj.rallycaps.previous.date = currTotalRecord.date;
                        totalsComparitorObj.rallycaps.previous.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.rallycaps.previous.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.rallycaps.previous.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.rallycaps.previous.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    break;
                  case 'stallions':
                    if (currTotalRecord.date === latestDate){
                      if (!totalsComparitorObj.stallions.latest.date){
                        bStallionsTotalCalculated = true;
                        totalsComparitorObj.stallions.latest.date = currTotalRecord.date;
                        totalsComparitorObj.stallions.latest.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.stallions.latest.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.stallions.latest.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.stallions.latest.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    if (!bStallionsDeltaCalculated && (currTotalRecord.date !== latestDate)){
                      if (!totalsComparitorObj.stallions.previous.date){
                        bStallionsDeltaCalculated = true;
                        totalsComparitorObj.stallions.previous.date = currTotalRecord.date;
                        totalsComparitorObj.stallions.previous.grandTotal = currTotalRecord.grandTotal;
                        totalsComparitorObj.stallions.previous.hitterTotal = currTotalRecord.hitterTotal;
                        totalsComparitorObj.stallions.previous.starterTotal = currTotalRecord.starterTotal;
                        totalsComparitorObj.stallions.previous.closerTotal = currTotalRecord.closerTotal;
                      }
                    }
                    break;
                  default:
                    break;



                }
//
//                currTotalRecord.grandTotalDelta = getGrandTotalDelta(currTotalRecord.roster,totalsComparitorObj);
//
//                returnArray.push(currTotalRecord);

              }
              for (var k = 0;k  <  beginArray.length;k++){
                currTotalRecord = beginArray[k];


                currTotalRecord.grandTotalDelta = parseFloat(getGrandTotalDelta(currTotalRecord.roster,totalsComparitorObj)).toFixed(2);

                returnArray.push(currTotalRecord);

              }


              //orderBy:['-grandTotal'] | unique:'roster'
              //$filter('orderBy')(returnArray, '-grandTotal', {unique: 'roster'});
              returnArray = $filter('orderBy')(returnArray, 'grandTotal', {unique: 'roster'});
              $scope.grandTotals = $filter('unique')(returnArray, 'roster');

            }
          );
          var getGrandTotalDelta = function(roster, compObj){
            if (roster) {
              if (compObj[roster].previous.grandTotal !== 0){
                return (compObj[roster].latest.grandTotal - compObj[roster].previous.grandTotal);
              }

            }
          }
        }
      ],
      link: function(scope, el, attrs) {
        scope.$watch('grandTotals', function(newVal, oldVal) {
          if (scope.grandTotals) {
            ReactDOM.render(React.createElement(TotalsList, {store:scope}), el[0]);
          }
        }, true);
      }
    }
  }
]);
Common.directive('bbpAppHeader', [

  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/common/templates/app.header.html',
      replace: true,
      controller: [
        '$scope',
        '$stateParams',
        'Statupdate',
        function($scope, $stateParams, Statupdate) {
          $scope.headerCtx = {};
          $scope.headerCtx.currentRoster = $stateParams.slug;

          $scope.headerCtx.lastUpdate = Statupdate.find({})
            .$promise
            .then(function(response) {
              //$scope.headerCtx.lastUpdate = response[0].timestamp;
              var maxVal = $scope.headerCtx.lastUpdate = Math.max.apply(Math, response.map(function(o){return o.timestamp;}));


              var theDate = moment.unix(maxVal);

              //moment.unix(maxVal).format("MM/DD/YYYY");

             // $scope.headerCtx.lastUpdate = theDate.tz("America/Vancouver").format('ll HH:mm:ss Z');
             // $scope.headerCtx.lastUpdate = moment.unix(maxVal).format('ll HH:mm:ss Z');
              var tryThisDate = new Date(maxVal);
              // .format("dddd, MMMM Do YYYY, h:mm:ss a")
              $scope.headerCtx.lastUpdate = moment(tryThisDate).format('dddd, MMMM Do YYYY, h:mm:ss a');

              //console.log('timestamps', response);
            })
            .catch(function(error) {
              console.log('bad get statupdate', error);
            });


      }],
      link: function(scope, el, attrs) {


        scope.$watch('bbpCtx.currentRoster', function(newRoster, oldRoster) {
          scope.headerCtx.currentRoster = newRoster;
        }, true);
      }
    }
  }
]);
Common.directive('commonSidebarNav', [
  function() {
    return {
      restrict: 'E',
      templateUrl: './scripts/modules/common/templates/sidebar.nav.html',
      replace: true,
      controller: [function(){}]
    }
  }
]);
Common.directive('posRankNavList', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      controller: [function(){}],
      link: function(scope, el, attrs) {
        ReactDOM.render(React.createElement(PosNavList, {store:scope}), el[0]);
      }
    }
  }
]);
Common.directive('generalTotalsSummaryList', [
  'Totals',
  function(Totals){
    return{
      restrict: 'E',
      templateUrl: './scripts/modules/common/templates/general.totals.html',
      controller:[
        '$scope',
        function($scope){
          var filter = {};

          $scope.rosters = Totals.find(filter);
          $scope.rosters.$promise.
            then(function (result) {
              $scope.rosters = result;

            }
          );


        }
      ]
    }
  }
]);



/**
 * sl-common-enter
 *
 * calls a scope method on click event
 *
 * <input ng-enter="method()" />
 *
 *
 * */
Common.directive('slCommonEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.slCommonEnter);
        });

        event.preventDefault();
      }
    });
  };
});
 /**
 * sl-common-select-on-click
 *
 * generic attribute directive to autoselect the contents of an input
 * by single clicking the content
 *
 * */
Common.directive('slCommonSelectOnClick', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('click', function () {
        this.select();
      });
    }
  };
});
Common.directive('slCommonLoadingIndicator', [
  function() {
    return {
      template: '<span us-spinner="{{props}}"></span>',
      controller: function($scope, $attrs){
        $scope.size = $attrs.size || 'large';

        switch($scope.size){
          case 'small':
            $scope.props = '{radius:6, width:2, length: 4, color:\'#999\'}';
            break;
          case 'large':
          default:
            $scope.props = '{radius:30, width:8, length: 24, color:\'#7DBD33\'}';
            break;
        }
      }
    }
  }
]);
