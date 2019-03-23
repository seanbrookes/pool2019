
window.TotalsList = React.createClass({

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
        <tr className={activeClass} key={item.roster}>
          <td>
            <a href={urlString}>{ item.roster }</a>
          </td>
          <td>
            <span className="total-value">{ item.grandTotal }</span>
          </td>
          <td className="total-delta">
            <span>{ item.grandTotalDelta }</span>
          </td>
        </tr>
      );
    });
    return (
      <div className="side-nav-container">
        <table className="nav-totals">
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    );
  }
});
window.SidebarNav = React.createClass({

  render: function() {
    return (
      <div className="side-nav-bar">
        <grand-totals-summary-list></grand-totals-summary-list>
        <PosNavList />
        <hr />
        <div className="other-nav-container">
          <ul>
            <li>
              <a href="http://www.cbssports.com/mlb/probable-pitchers" target="_new">probable</a>
            </li>
            <li>
              <a href="http://www.cbssports.com/mlb/scoreboard" target="_new">scores</a>
            </li>
            <li>
              <a href="http://www.rotoworld.com/playernews/mlb/baseball-player-news" target="_new">news</a>
            </li>
            <li>
              <a href="http://mlb.mlb.com/mediacenter/index.jsp?c_id=mlb" target="_new">MLB TV</a>
            </li>
          </ul>
        </div>
      </div>

    );
  }
});
window.PosNavList = React.createClass(
  {
    render: function() {

      var urlPath = window.location.href;
      var activeClass = 'pos-all';
      if (urlPath.indexOf('/all') > -1) {
        activeClass = activeClass + ' active-nav';
      }

      return (
        <div className="side-nav-container">
          <div className="nav-rank-title">Batters</div>
          <ul className="nav-batter-rank-list nav-rank-list">
            <li className={activeClass}>
              <a href="#/rank/all">All</a>
            </li>
            <li className="pos-C">
              <a href="#/rank/C">C</a>
            </li>
            <li className="pos-1B">
              <a href="#/rank/1B">1B</a>
            </li>
            <li className="pos-2B">
              <a href="#/rank/2B">2B</a>
            </li>
            <li className="pos-3B">
              <a href="#/rank/3B">3B</a>
            </li>
            <li className="pos-SS">
              <a href="#/rank/SS">SS</a>
            </li>
            <li className="pos-LF">
              <a href="#/rank/LF">LF</a>
            </li>
            <li className="pos-CF">
              <a href="#/rank/CF">CF</a>
            </li>
            <li className="pos-RF">
              <a href="#/rank/RF">RF</a>
            </li>
            <li className="pos-DH">
              <a href="#/rank/DH">DH</a>
            </li>
          </ul>
          <div className="nav-rank-title">Pitchers</div>
          <ul className="nav-pitcher-rank-list nav-rank-list">
            <li className="pos-SP">
              <a href="#/rank/SP">SP</a>
            </li>
            <li className="pos-RP">
              <a href="#/rank/RP">RP</a>
            </li>
          </ul>
        </div>
      );
    }
  }
);
