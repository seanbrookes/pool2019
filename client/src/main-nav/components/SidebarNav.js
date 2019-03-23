import React, { Component } from 'react';

class SidebarNav extends Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (

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

    );
  }
}

export default SidebarNav;
