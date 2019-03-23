import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatsUpdate from '../../stats/containers/StatsUpdate';
import { fetchRosters } from '../../rosters/actions/rostersActions';
import { fetchLastWeekStats } from '../../stats/actions/statsActions';
import PitcherStatsUpdate from '../components/PitcherStatsUpdate';

import EditRoster from './EditRoster';
import MapMlbid from './MapMlbid';

import '../admin.scss';

class AdminMain extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.onFetchRosters();
    this.props.onFetchLastWeekStats();
  }

  render() {
    return (
      <div className="layout">
        <div>
          <div><a href="#admin/editrosters">edit roster players</a></div>
          <div><a href="#admin/mapmlbid">map players to mlbid</a></div>
          <div><a href="#admin/statsupdate">update stats</a></div>
          {/*<div><a href="#admin/pitcherstatsupdate">update pitcher stats</a></div>*/}
        </div>
        <div>
          <div>admin main</div>
          <Switch>
            <Route path="/admin/editrosters" component={EditRoster} />
            <Route path="/admin/mapmlbid" component={MapMlbid} />
            <Route path="/admin/statsupdate" component={StatsUpdate} />
            <Route path="/admin/pitcherstatsupdate" component={PitcherStatsUpdate} />
          </Switch>

        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRosters: () => dispatch(fetchRosters()),
    onFetchLastWeekStats: () => dispatch(fetchLastWeekStats()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminMain);

