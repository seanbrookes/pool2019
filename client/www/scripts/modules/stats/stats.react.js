/** @jsx React.DOM */
var d3Chart = {};

d3Chart.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', 600)
    .attr('height', 400);

  svg.append('g')
    .attr('class', 'd3-points');

  this.update(el, state);
};

d3Chart.update = function(el, state) {
  // Re-compute the scales, and render the data points
  var scales = this._scales(el, state.domain);
  this._drawPoints(el, scales, state.data);
};

d3Chart.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};
d3Chart._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;


  var x = d3.time.scale()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);


  return {x: x, y: y};
};
d3Chart._drawPoints = function(el, scales, data) {
  var vis = d3.select(el).selectAll('.d3-points');

  var xAxis = d3.svg.axis()
    .tickFormat(d3.time.format("%m-%d"))
    .ticks(5)
    .scale(scales.x);
  var yAxis = d3.svg.axis()
      .scale(scales.y)
      .orient("left");

  vis.append("svg:g")
    .attr("class", "x axis")
    .call(xAxis);
  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(50,0)")
    .style({'stroke': '#444444', 'fill': 'none', 'stroke-width': '1px'})
    .call(yAxis);


  var lineGen = d3.svg.line()
    .x(function (d) {
      return scales.x(d.lastUpdate);
    })
    .y(function (d) {
      return scales.y(d.total);
    })
    .interpolate("basis");
  vis.append('svg:path')
    .attr('d', lineGen(data))
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

};
window.TopTenList = (TopTenList = React).createClass({

  render() {


    const data = this.props.store.topTenList;

    var list = [];
    if (data && data.length > 0) {
      for (var i = 0; i < 10; i++) {
        var player = data[i];
        list.push(
          React.createElement("tr", {key: player.mlbid}, 
            React.createElement("td", null, (i + 1)), 
            React.createElement("td", null, player.roster), 
            React.createElement("td", {className: "hotstatname-col"}, player.name), 
            React.createElement("td", null, player.pos), 
            React.createElement("td", null, player.team), 
            React.createElement("td", {className: "hotstat-col"}, player.total)
          )
        );
      }

    }


    return(
      React.createElement("div", {className: "hotlist hotlist--container"}, 
        React.createElement("table", {className: "hotlist--table"}, 
          React.createElement("caption", null, "Top 10"), 
          React.createElement("tbody", null, 
          list
          )
        )
      )
    );
  }
});
window.HitterBigData = (HitterBigData = React).createClass({

  render() {

    const data = this.props.store.batterData;

    //if (data.map) {
    //  data.map(function(batterCollection) {
    //    console.log('batter collection: ', batterCollection);
    //  });
    //}

    var rankedStats = function(collection, stat) {
      return collection.sort(function(a,b){ //Array now becomes [41, 25, 8, 7]
        return b[stat] - a[stat]
      });
    };

    var isThresholdMet = function(value, stat) {
      var returnValue = false;
      switch (stat) {
        case 'r':
          if (parseInt(value) > 2) {
            return true;
          }
          break;
        case 'h': {
          if (parseInt(value) > 3) {
            return true;
          }
          break;
        }
        case 'hr': {
          if (parseInt(value) > 0) {
            return true;
          }
          break;
        }
        case 'rbi': {
          if (parseInt(value) > 1) {
            return true;
          }
          break;
        }

        default: {}


      }

      return returnValue;
    };

    var getHotBody = function(collection, stat) {
      if (!collection || collection.length < 1) {
        return (React.createElement("tbody", null));
      }

      var rankedCollection = rankedStats(collection, stat);
      var rows = rankedCollection.map(function(item, index) {
        var isEnough = isThresholdMet(item[stat], stat);
        if (isEnough) {

          return (
            React.createElement("tr", {key: item.hitter.name}, 
              React.createElement("td", null, item.hitter.roster), 
              React.createElement("td", {className: "hotstatname-col"}, item.hitter.name), 
              React.createElement("td", null, item.hitter.pos), 
              React.createElement("td", null, item.hitter.team), 
              React.createElement("td", {className: "hotstat-col"}, item[stat])
            )
          )

        }
      });
      return (
        React.createElement("tbody", null, 
        rows
        )
      );


    };

    function getTableCaption(stat) {
      switch(stat) {
        case 'r':
          return 'runs';
          break;
        case 'h':
          return 'hits';
          break;
        case 'hr':
          return 'home runs';
          break;
        case 'rbi':
          return 'rbi';
          break;

        default:

      }
    }

    function getHotList(data, stat) {

      var collection = [];
      switch(stat) {
        case 'r':
          collection = data.rankedRuns;
          break;

        case 'h':
          collection = data.rankedHits;

          break;

        case 'hr':
          collection = data.rankedHomeRuns;

          break;

        case 'rbi':
          collection = data.rankedRBI;

          break;

        default:
      }

      /*
      *
      *             <thead>
       <tr>
       <th>rostser</th>
       <th>name</th>
       <th>pos</th>
       <th>team</th>
       <th className="hotstat-col">{stat}</th>
       </tr>
       </thead>
      *
      * */



      return (
        React.createElement("div", {className: "hotlist hotlist--container"}, 
          React.createElement("table", {className: "hotlist--table"}, 
            React.createElement("caption", null, getTableCaption(stat)), 
            getHotBody(collection, stat)
          )
        )

      );
    }

    var hotHitterList = getHotList(data, 'h');
    var hotRunsList = getHotList(data, 'r');
    var hotHRList = getHotList(data, 'hr');
    var hotRBIList = getHotList(data, 'rbi');


    return (
      React.createElement("div", null, 
        React.createElement("h2", {className: "whos-hot"}, "Who's hot (last 4 days)"), 
        React.createElement("div", {className: "Layout"}, 
          hotRunsList, 
          hotHitterList, 
          hotHRList, 
          hotRBIList


        )
      )
    );
  }



});

window.HitterChart = (HitterChart = React).createClass({



  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.scope.currentPlayerHistory,
      domain: this.props.scope.domain
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      React.createElement("div", {className: "Chart"})
    );
  }












  //render:function() {
  //  var component = this;
  //
  //  var items = [];
  //  if (component.props.scope.currentPlayerHistory && component.props.scope.currentPlayerHistory) {
  //    component.props.scope.currentPlayerHistory.map(function(update) {
  //      items.push(<div>{update.total}</div>);
  //    });
  //  }
  //
  //  return (<div>{items}</div>);
  //}
});
window.HitterHistory = (HitterHistory = React).createClass({
  getInitialState: function() {
    return {
      titleSearchValue:''
    }
  },
  componentWillReceiveProps: function(nextProps) {
    var component = this;
    if (!nextProps.scope.titleSearchValue) {
      component.setState({titleSearchValue:nextProps.scope.titleSearchValue});

    }
  },
  editEntity: function(entity) {
    var component = this;
    if (entity) {
      var scope = component.props.scope;
      scope.$apply(function() {
        scope.editEntity(entity);
      });
    }
  },
  deleteEntity: function(entity) {
    var component = this;
    if (entity) {
      var scope = component.props.scope;
      scope.$apply(function() {
        scope.deleteEntity(entity);
      });
    }
  },
  sortIt: function(colName) {
    if (colName) {
      var component = this;
      var scope = component.props.scope;
      scope.$apply(function() {
        scope.sortEntities(colName);
      });
    }
  },
  editTags: function(instance) {
    var component = this;
    if (instance) {
      var scope = component.props.scope;
      scope.$apply(function() {
        scope.editTags(instance);
      });
    }
  },
  addToTwitterList: function(instance) {
    var component = this;
    if (instance) {
      if (confirm('add to twitter list?')) {
        var scope = component.props.scope;
        scope.$apply(function() {
          scope.addToTwitterList(instance);
        });

      }
    }
  },
  editNotes: function(instance) {
    var component = this;
    if (instance) {
      var scope = component.props.scope;
      scope.$apply(function() {
        scope.editNotes(instance);
      });
    }
  },
  getPlayerHistory: function(player) {
    var component = this;
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.getPlayerHistory(player);
    });
  },
  toggleTypeFilter: function() {
    var component = this;
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.toggleEntityTypeFilter();
    });
  },
  clearTitleSearch: function(comp) {
    var component = this;
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.clearTitleSearchInput();
    });
  },
  updateTitleSearchValue: function(event) {
    var component = this;
    component.setState({titleSearchValue: event.target.value});
    var scope = component.props.scope;
    scope.$apply(function() {
      scope.updateTitleSearchValue(component.state.titleSearchValue);
    });
  },
  render: function () {
    var component = this;
    var scope = component.props.scope;

    var entityRowItems = [];
    if (scope.updatedHitterHistory && scope.updatedHitterHistory.map) {
      var index = 0;
      entityRowItems = scope.updatedHitterHistory.map(function(entity) {

        index++;
        return (
          React.createElement("tr", null, 
          React.createElement("td", {className: "PrimaryCol"}, 
            React.createElement("button", {onClick: component.getPlayerHistory.bind(component, entity)}, 
              index, ") ", entity.name
            ), 
            React.createElement("div", {className: "PlayerChartContainer", id: entity.mlbid})
          ), 
          React.createElement("td", null, 
            entity.roster
          ), 
          React.createElement("td", null, 
            entity.r
          ), 
          React.createElement("td", null, 
            entity.h
          ), 
          React.createElement("td", null, 
            entity.hr
          ), 
          React.createElement("td", null, 
            entity.rbi
          ), 
          React.createElement("td", null, 
            entity.sb
          ), 
          React.createElement("td", null, 
            entity.total
          ), 
          React.createElement("td", null, 
            entity.deltaTotal
          ), 
          React.createElement("td", null, 
            moment(entity.lastUpdate).format("MMM-DD-YY")
          ), 
          React.createElement("td", {className: "delete-col"}, 
            React.createElement("button", {className: "CommandButton", onClick: component.deleteEntity.bind(component, entity)}, 
              React.createElement("span", {className: "glyphicon glyphicon-remove-circle"})
            )
          )
        )
        );
      });
    }


    return (
      React.createElement("div", {className: "post-summary-list-container"}, 

        React.createElement("span", null, "count", entityRowItems.length), 
        React.createElement("table", {className: "table table-striped"}, 
          React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'name'), className: "CommandButton"}, "Name")
            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'roster'), className: "CommandButton"}, "Roster")

            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'r'), className: "CommandButton"}, "Runs")
            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'h'), className: "CommandButton"}, "Hits")

            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'hr'), className: "CommandButton"}, "HR")

            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'rbi'), className: "CommandButton"}, "RBI")
            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'sb'), className: "CommandButton"}, "SB")
            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'total'), className: "CommandButton"}, "Total")
            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'deltaTotal'), className: "CommandButton"}, "Delta")
            ), 
            React.createElement("th", null, 
              React.createElement("button", {onClick: component.sortIt.bind(component, 'lastUpdate'), className: "CommandButton"}, "Last Update")
            ), 
            React.createElement("th", null)
          )
          ), 
          React.createElement("tbody", null, 
          entityRowItems
          )
        )

      )
    );
  }
});
