import React, { Component } from 'react';

class PosNavList extends Component{
  constructor(props) {
    super(props);

    this.amIActive = this.amIActive.bind(this);
  }

  amIActive(path) {
    if (this.props.matchPath.indexOf(path) > -1) {
      return true;
    }
    return false;
  }
  render() {

      let urlPath = this.props.matchPath;
      let activeClass = 'pos-all';
      if (urlPath.indexOf('/all') > -1) {
        activeClass = activeClass + ' active-nav';
      }

      return (
        <div className="side-nav-container">
          <div className="nav-rank-title">Batters</div>
          <ul className="nav-batter-rank-list nav-rank-list">
            <li className={this.amIActive('/rank/all') ? 'active-nav' : ''}>
              <a href="#/rank/all">All</a>
            </li>
            <li className={this.amIActive('/rank/C') ? 'active-nav' : ''}>
              <a href="#/rank/C">C</a>
            </li>
            <li className={this.amIActive('/rank/1B') ? 'active-nav' : ''}>
              <a href="#/rank/1B">1B</a>
            </li>
            <li className={this.amIActive('/rank/2B') ? 'active-nav' : ''}>
              <a href="#/rank/2B">2B</a>
            </li>
            <li className={this.amIActive('/rank/3B') ? 'active-nav' : ''}>
              <a href="#/rank/3B">3B</a>
            </li>
            <li className={this.amIActive('/rank/SS') ? 'active-nav' : ''}>
              <a href="#/rank/SS">SS</a>
            </li>
            <li className={this.amIActive('/rank/LF') ? 'active-nav' : ''}>
              <a href="#/rank/LF">LF</a>
            </li>
            <li className={this.amIActive('/rank/CF') ? 'active-nav' : ''}>
              <a href="#/rank/CF">CF</a>
            </li>
            <li className={this.amIActive('/rank/RF') ? 'active-nav' : ''}>
              <a href="#/rank/RF">RF</a>
            </li>
            <li className={this.amIActive('/rank/DH') ? 'active-nav' : ''}>
              <a href="#/rank/DH">DH</a>
            </li>
          </ul>
          <div className="nav-rank-title">Pitchers</div>
          <ul className="nav-pitcher-rank-list nav-rank-list">
            <li className={this.amIActive('/rank/SP') ? 'active-nav' : ''}>
              <a href="#/rank/SP">SP</a>
            </li>
            <li className={this.amIActive('/rank/RP') ? 'active-nav' : ''}>
              <a href="#/rank/RP">RP</a>
            </li>
          </ul>
        </div>
      );
    }
  }

export default PosNavList;
