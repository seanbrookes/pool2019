
window.TotalsList = React.createClass({displayName: "TotalsList",

  render: function() {

    var grandTotals = [];
    if (this.props.store.grandTotals) {
      grandTotals = this.props.store.grandTotals;
    }

    var urlPath = window.location.href;

    var rows = grandTotals.map(function(item) {
      var urlString = '#roster/' + item.roster;

      var activeClass = '';
      if (urlPath.indexOf(item.roster) > -1) {
        activeClass = 'active-nav';
      }
      activeClass = activeClass + ' ' + item.roster;
      return (
        React.createElement("tr", {className: activeClass, key: item.roster}, 
          React.createElement("td", null, 
            React.createElement("a", {href: urlString},  item.roster)
          ), 
          React.createElement("td", null, 
            React.createElement("span", {className: "total-value"},  item.grandTotal)
          ), 
          React.createElement("td", {className: "total-delta"}, 
            React.createElement("span", null,  item.grandTotalDelta)
          )
        )
      );
    });
    return (
      React.createElement("div", {className: "side-nav-container"}, 
        React.createElement("table", {className: "nav-totals"}, 
          React.createElement("tbody", null, 
          rows
          )
        )
      )
    );
  }
});
window.SidebarNav = React.createClass({displayName: "SidebarNav",

  render: function() {
    return (
      React.createElement("div", {className: "side-nav-bar"}, 
        React.createElement("grand-totals-summary-list", null), 
        React.createElement(PosNavList, null), 
        React.createElement("hr", null), 
        React.createElement("div", {className: "other-nav-container"}, 
          React.createElement("ul", null, 
            React.createElement("li", null, 
              React.createElement("a", {href: "http://www.cbssports.com/mlb/probable-pitchers", target: "_new"}, "probable")
            ), 
            React.createElement("li", null, 
              React.createElement("a", {href: "http://www.cbssports.com/mlb/scoreboard", target: "_new"}, "scores")
            ), 
            React.createElement("li", null, 
              React.createElement("a", {href: "http://www.rotoworld.com/playernews/mlb/baseball-player-news", target: "_new"}, "news")
            ), 
            React.createElement("li", null, 
              React.createElement("a", {href: "http://mlb.mlb.com/mediacenter/index.jsp?c_id=mlb", target: "_new"}, "MLB TV")
            )
          )
        )
      )

    );
  }
});
window.PosNavList = React.createClass(
  {displayName: "PosNavList",
    render: function() {

      var urlPath = window.location.href;
      var activeClass = 'pos-all';
      if (urlPath.indexOf('/all') > -1) {
        activeClass = activeClass + ' active-nav';
      }

      return (
        React.createElement("div", {className: "side-nav-container"}, 
          React.createElement("div", {className: "nav-rank-title"}, "Batters"), 
          React.createElement("ul", {className: "nav-batter-rank-list nav-rank-list"}, 
            React.createElement("li", {className: activeClass}, 
              React.createElement("a", {href: "#/rank/all"}, "All")
            ), 
            React.createElement("li", {className: "pos-C"}, 
              React.createElement("a", {href: "#/rank/C"}, "C")
            ), 
            React.createElement("li", {className: "pos-1B"}, 
              React.createElement("a", {href: "#/rank/1B"}, "1B")
            ), 
            React.createElement("li", {className: "pos-2B"}, 
              React.createElement("a", {href: "#/rank/2B"}, "2B")
            ), 
            React.createElement("li", {className: "pos-3B"}, 
              React.createElement("a", {href: "#/rank/3B"}, "3B")
            ), 
            React.createElement("li", {className: "pos-SS"}, 
              React.createElement("a", {href: "#/rank/SS"}, "SS")
            ), 
            React.createElement("li", {className: "pos-LF"}, 
              React.createElement("a", {href: "#/rank/LF"}, "LF")
            ), 
            React.createElement("li", {className: "pos-CF"}, 
              React.createElement("a", {href: "#/rank/CF"}, "CF")
            ), 
            React.createElement("li", {className: "pos-RF"}, 
              React.createElement("a", {href: "#/rank/RF"}, "RF")
            ), 
            React.createElement("li", {className: "pos-DH"}, 
              React.createElement("a", {href: "#/rank/DH"}, "DH")
            )
          ), 
          React.createElement("div", {className: "nav-rank-title"}, "Pitchers"), 
          React.createElement("ul", {className: "nav-pitcher-rank-list nav-rank-list"}, 
            React.createElement("li", {className: "pos-SP"}, 
              React.createElement("a", {href: "#/rank/SP"}, "SP")
            ), 
            React.createElement("li", {className: "pos-RP"}, 
              React.createElement("a", {href: "#/rank/RP"}, "RP")
            )
          )
        )
      );
    }
  }
);
