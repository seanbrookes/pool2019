import React, { Component } from 'react';

import PosNavList from '../components/PosNavList';
import SidebarNav from '../components/SidebarNav';
import TotalsList from '../components/TotalsList';

class MainNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const urlPath = window.location.href;
    return (
      <div>
        <TotalsList matchPath={urlPath} />
        {/*<div className="side-nav-container">*/}
          {/*<ul className="nav-batter-rank-list nav-rank-list">*/}
            {/*<li>*/}
              {/*<a href="#/rank/all">Totals</a>*/}
            {/*</li>*/}
            {/*<li>*/}
              {/*<a href="#/rank/C">Whos Hot</a>*/}
            {/*</li>*/}
            {/*<li>*/}
              {/*<a href="#/rank/1B">Top 10</a>*/}
            {/*</li>*/}
          {/*</ul>*/}
        {/*</div>*/}
        <PosNavList matchPath={urlPath} />
        <SidebarNav />
      </div>
    );
  }
}

export default MainNav;
