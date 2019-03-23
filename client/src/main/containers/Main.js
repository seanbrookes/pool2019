import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import RostersMain, { DiamondViewContainer, RosterMain } from '../../rosters';
import DraftMain from '../../draft';
import AdminMain from '../../admin';
import ProtectedListContainer from '../../rosters/components/RosterListContainer';
import Home from './Home';
import MainNav from '../../main-nav/';
import { RankMain } from '../../positions/';

import { fetchLastWeekStats, fetchRosterTotals } from '../../stats/actions/statsActions';

import '../../images/logo.png';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.onFetchLastWeekStats();
    this.props.onFetchRosterTotals('bashers');
    this.props.onFetchRosterTotals('mashers');
    this.props.onFetchRosterTotals('rallycaps');
    this.props.onFetchRosterTotals('stallions');
  }

  render() {
    return (
      <HashRouter>
        <div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <a href="/">
              <img className="branding__logo" src="/dist/images/logo.png" />
            </a>
            <h1 className="page-title">Pool 2019</h1>
            <nav className="main-nav" style={{display: 'flex', alignItems: 'center'}}>
              <a href="#rosters">Rosters</a>
              <a href="#draft">Draft Board</a>
              <a href="#diamond">Diamond View</a>
            </nav>
            <div style={{marginLeft: '2rem'}}><span style={{fontWeight: 'lighter'}}>last update</span> {moment(this.props.lastUpdate).format('ddd MMM-Do hh:mm a')}</div>
          </div>
          <div className="layout">
            <div className="side-bar--container">
              <MainNav />
            </div>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/rosters/:slug" component={RostersMain} />
              <Route path="/rosters" component={RostersMain} />
              <Route path="/rank/:pos" component={RankMain} />
              <Route path="/diamond" component={DiamondViewContainer} />
              <Route path="/protected" component={ProtectedListContainer} />
              <Route path="/draft" component={DraftMain} />
              <Route path="/admin" component={AdminMain} />
            </Switch>
          </div>
        </div>
      </HashRouter>
    );
  }
}
const mapStateToProps = (state) => {
  let lastUpdate = 0;
  if (state.stats.totals && state.stats.totals.bashers && state.stats.totals.bashers.entities && state.stats.totals.bashers.entities[0]) {
    lastUpdate = state.stats.totals.bashers.entities[0].date;
  }
  return {
    lastUpdate: lastUpdate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRosterTotals: (slug) => dispatch(fetchRosterTotals(slug)),
    onFetchLastWeekStats: () => dispatch(fetchLastWeekStats()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

