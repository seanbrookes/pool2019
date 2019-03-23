import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchDailyPitcherStats, updateDailyPitcherStat } from '../../stats/actions/statsActions';

class PitcherStatsUpdate extends Component {
  constructor(props) {
    super(props);
    this.udpatePitcherStatRoster = this.udpatePitcherStatRoster.bind(this);
  }
  componentWillMount() {
    this.props.onLoadPitcherStats();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.pitcherStats) {
      const pitcherStatsObj = {};
      nextProps.pitcherStats.map((stat) => {
          pitcherStatsObj[stat.id] = stat;
      });
      this.setState({
        statObj: pitcherStatsObj,
      });

    }
  }
  udpatePitcherStatRoster(event) {
    const statId = event.target.attributes['data-id'].value;
    const targetStat = this.state.statObj[statId];
    targetStat.roster = event.target.value;

    console.log('updat this stat', targetStat);
    this.props.onUpdatePitcherStat(targetStat);

  }

  render() {
    let rowsEl = [];
    if (this.props.pitcherStats) {
      rowsEl = this.props.pitcherStats.map((stat) => {
        return (
          <tr key={stat.id}>
            <td>{stat.name}</td>
            <td>{stat.pos}</td>
            <td>{stat.team}</td>
            <td>
              <select
                value={stat.roster}
                data-id={stat.id}
                onChange={this.udpatePitcherStatRoster}
              >
                <option value="">---</option>
                <option value="bashers">bashers</option>
                <option value="mashers">mashers</option>
                <option value="rallycaps">rally caps</option>
                <option value="stallions">stallions</option>
              </select>
            </td>
          </tr>
        );
      });
    }
    return (
      <div>
        <div>pitcher stats update</div>
        <table>
          <tbody>
          {rowsEl}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pitcherStats: state.stats.dailyPitcherStats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadPitcherStats: () => dispatch(fetchDailyPitcherStats()),
    onUpdatePitcherStat: (stat) => dispatch(updateDailyPitcherStat(stat)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PitcherStatsUpdate);
