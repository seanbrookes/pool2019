import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import CloserRankRow from './CloserRankRow';

import {
  compareTotals,
  compareWins,
  compareLosses,
  compareKs,
  compareInnings,
  compareSaves,
} from '../../stats/stats.utils';
import '../positions.scss';

class CloserRankView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      workingSet: [],
      sortField: 'total',
    };

    this.sortSet = this.sortSet.bind(this);
  }
  getFilterMethod(sortField) {
    let retVal = compareTotals;
    switch(sortField) {
      case 'w':
        retVal = compareWins;
        break;

      case 'l':
        retVal = compareLosses;
        break;

      case 'k':
        retVal = compareKs;
        break;

      case 'ip':
        retVal = compareInnings;
        break;

      case 'sv':
        retVal = compareSaves;
        break;

      case 'total':
        retVal = compareTotals;
        break;

      default:
        retVal = compareTotals;


    }
    this.setState({
      sortField: sortField,
    });
    return retVal;

  }
  sortSet(sortProperty) {
    //const sortProperty = event.target.value;

    let srcWorkingSet  = [].concat(this.state.workingSet);

    let returnSet = srcWorkingSet.sort(this.getFilterMethod(sortProperty));

    this.setState({
      workingSet: returnSet,
    });

  }
  componentWillMount() {
    if (this.props.pitchers) {
      const filter = this.props.pos;
      const uniquePlayers = [];
      console.log('|   position rank', filter);

      // filter all the players who match the filter
      if (filter && filter !== 'all') {
        const filteredPitchers = this.props.pitchers.filter((pitcher) => {
          return (pitcher.pos === filter);
        });
        filteredPitchers.map((player) => {
          if (!player.total) {
            player.total = 0;
          }
        });

        // sort by total
        filteredPitchers.sort(compareTotals);
        // remove dupe names

        filteredPitchers.map((pitcher) => {
          const isUniqueFiler = uniquePlayers.filter((player) => {
            return (player.name === pitcher.name);
          });
          if (!isUniqueFiler[0]) {
            uniquePlayers.push(pitcher);
          }
        });

      }

      this.setState({
        workingSet: uniquePlayers,
      });

      // that is your working set
      // allow sorting on all fields

    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.pitchers) {
      const filter = nextProps.pos;
      const uniquePlayers = [];
      console.log('|   position rank', filter);

      // filter all the players who match the filter
      if (filter && filter !== 'all') {
        const filteredPitchers = nextProps.pitchers.filter((pitcher) => {
          return (pitcher.pos === filter);
        });
        filteredPitchers.map((player) => {
          if (!player.total) {
            player.total = 0;
          }
        });

        // sort by total
        filteredPitchers.sort(compareTotals);
        // remove dupe names

        filteredPitchers.map((pitcher) => {
          const isUniqueFiler = uniquePlayers.filter((player) => {
            return (player.name === pitcher.name);
          });
          if (!isUniqueFiler[0]) {
            uniquePlayers.push(pitcher);
          }
        });

      }

      this.setState({
        workingSet: uniquePlayers,
      });

      // that is your working set
      // allow sorting on all fields

    }
  }
  render() {
    let rowsEl = [];
    if (this.state.workingSet) {
      rowsEl = this.state.workingSet.map((player, index) => {
        return (<CloserRankRow
          key={player.name}
          player={player}
          sortField={this.state.sortField}
          rank={(index + 1)} />)
      });
    }
    return (
      <div className="main-content-container">
        <h2 className="pos-rank--title">RP ranks</h2>
        <table className="rank-table" id="StarterTable">
          <caption>Closers</caption>
          <thead>
          <tr>
            <th />
            <th>
              roster
            </th>
            <th>
              pos
            </th>
            <th>
              name
            </th>
            <th>
              team
            </th>
            <th>
              <button onClick={() => this.sortSet('w')}>
                w
              </button>
            </th>
            <th>
              <button onClick={() => this.sortSet('l')}>
                l
              </button>
            </th>
            <th>
              <button onClick={() => this.sortSet('ip')}>
                ip
              </button>
            </th>
            <th>
              <button onClick={() => this.sortSet('k')}>
                k
              </button>
            </th>
            <th>
              <button onClick={() => this.sortSet('sv')}>
              saves
              </button>
            </th>
            <th>
              <button onClick={() => this.sortSet('total')}>
              total
              </button>
            </th>
          </tr>
          </thead>
          <tbody>
          {rowsEl}
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={8} />
            <td><div className="roster-pos-total ng-binding" id="RosterStarterTotal" /></td>
          </tr>
          </tfoot>
        </table>


      </div>
    );
  }


};

CloserRankView.propTypes = {
};

const mapStateToProps = (state) => {
  return {
    pitchers: state.stats.pitchers.lastWeek.entities,
  }
};

export default connect(mapStateToProps, null)(CloserRankView);

