import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import HitterRankRow from './HitterRankRow';
import '../positions.scss';

import {
  compareTotals,
  compareHits,
  compareRuns,
  compareRBI,
  compareHR,
  compareSteals,
} from '../../stats/stats.utils';

// const compareTotals = (a, b) => {
//   return parseFloat(b.total) - parseFloat(a.total);
// };

class HitterRankView extends Component {
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
      case 'r':
        retVal = compareRuns;
        break;

      case 'h':
        retVal = compareHits;
        break;

      case 'hr':
        retVal = compareHR;
        break;

      case 'rbi':
        retVal = compareRBI;
        break;

      case 'sb':
        retVal = compareSteals;
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
    if (this.props.hitters) {
      const filter = this.props.pos;
      let uniquePlayers = [];

      let filteredHitters = this.props.hitters;
      // filter all the players who match the filter
      if (filter && filter !== 'all') {
        filteredHitters = this.props.hitters.filter((hitter) => {
          return (hitter.pos === filter);
        });
      }
      filteredHitters.map((player) => {
        if (!player.total) {
          player.total = 0;
        }
      });

      // sort by total
      filteredHitters.sort(compareTotals);
      // remove dupe names

      filteredHitters.map((hitter) => {
        const isUniqueFiler = uniquePlayers.filter((player) => {
          return (player.name === hitter.name);
        });
        if (!isUniqueFiler[0]) {
          uniquePlayers.push(hitter);
        }
      });



      this.setState({
        workingSet: uniquePlayers,
      });

      // that is your working set
      // allow sorting on all fields

    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.hitters) {
      const filter = nextProps.pos;
      const uniquePlayers = [];
      console.log('|   position rank', filter);
      let filteredHitters = nextProps.hitters;
      // filter all the players who match the filter
      if (filter && filter !== 'all') {
        filteredHitters = nextProps.hitters.filter((hitter) => {
          return (hitter.pos === filter);
        });
      }
      filteredHitters.map((player) => {
        if (!player.total) {
          player.total = 0;
        }
      });

      // sort by total
      filteredHitters.sort(compareTotals);
      // remove dupe names

      filteredHitters.map((hitter) => {
        const isUniqueFiler = uniquePlayers.filter((player) => {
          return (player.name === hitter.name);
        });
        if (!isUniqueFiler[0]) {
          uniquePlayers.push(hitter);
        }
      });



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
        return (<HitterRankRow
          key={player.name}
          player={player}
          rank={(index + 1)}
          sortField={this.state.sortField}
        />)
      })
    }


    return (
      <div className="main-content-container">
        <h2 className="pos-rank--title">{this.props.pos} ranks</h2>
        <table className="rank-table" id="HitterTable" ng-show="showBatters">
          <caption>Batters</caption>
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
              {(this.state.sortField !== 'r') ?
              (<button onClick={() => this.sortSet('r')}>
              runs
              </button>) : 'runs'}
            </th>
            <th>
              {(this.state.sortField !== 'h') ?
                (<button onClick={() => this.sortSet('h')}>
                  hits
                </button>) : 'hits'}
            </th>
            <th>
              {(this.state.sortField !== 'hr') ?
                (<button onClick={() => this.sortSet('hr')}>
                  hr
                </button>) : 'hr'}
            </th>
            <th>
              {(this.state.sortField !== 'rbi') ?
                (<button onClick={() => this.sortSet('rbi')}>
                  rbi
                </button>) : 'rbi'}
            </th>
            <th>
              {(this.state.sortField !== 'sb') ?
                (<button onClick={() => this.sortSet('sb')}>
                  sb
                </button>) : 'sb'}
            </th>
            <th>
              {(this.state.sortField !== 'total') ?
                (<button onClick={() => this.sortSet('total')}>
                  total
                </button>) : 'total'}
            </th>
          </tr>
          </thead>
          <tbody>
          {rowsEl}
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={9} />
            <td><div className="roster-pos-total ng-binding" id="RosterBatterTotal" /></td>
          </tr>
          </tfoot>
        </table>


      </div>
    );
  }


};

HitterRankView.propTypes = {
};

const mapStateToProps = (state) => {
  return {
    hitters: state.stats.hitters.lastWeek.entities,
  }
};

export default connect(mapStateToProps, null)(HitterRankView);
