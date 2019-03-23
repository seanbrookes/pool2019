import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchRosterHittersStats, fetchRosterPitchersStats, fetchRosterTotals, createRosterTotals } from '../../stats/actions/statsActions';


import {
  filterLatest,
  totalAndSortBatters,
  totalAndSortStarters,
  totalAndSortClosers
} from '../../stats/stats.utils';





class RosterMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      batterTotal: 0,
      starterTotal: 0,
      closerTotal: 0,
      grandTotal: 0,
      batters: [],
      starters: [],
      closers: [],
    };

    this.runTheTotals = this.runTheTotals.bind(this);
  }


  componentWillMount() {
    this.props.onFetchRosterHittersStats(this.props.slug);
    this.props.onFetchRosterPitchersStats(this.props.slug);

    if (this.props.roster) {
      this.setState({
        rosterStats: this.props.rosterStats,
        currentRoster: this.props.roster,
      }, () => {
        this.runTheTotals();
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.slug && (this.props.slug !== nextProps.slug)) {
      this.props.onFetchRosterHittersStats(nextProps.slug);
      this.props.onFetchRosterPitchersStats(nextProps.slug);
    }
    if (nextProps.roster) {
      this.setState({
        rosterStats: nextProps.rosterStats,
        currentRoster: nextProps.roster,
      }, () => {
        this.runTheTotals();
      });
    }

  }


  runTheTotals() {
    const srcTotal = this.state.grandTotal;

    const currentPitchers = filterLatest(this.props.rosterPitchingStats);
    const currentHitters = filterLatest(this.props.rosterHittingStats);


    const startersArray = currentPitchers.filter((pitcher) => {
      return pitcher.pos === 'SP';
    });
    const closersArray = currentPitchers.filter((pitcher) => {
      return pitcher.pos === 'RP';
    });
    const starters = totalAndSortStarters(startersArray).starters;
    const closers = totalAndSortClosers(closersArray).closers;
    const batters = totalAndSortBatters(currentHitters).batters;

    const batterTotal = totalAndSortBatters(currentHitters).subTotal;
    const starterTotal = totalAndSortStarters(startersArray).subTotal;
    const closerTotal = totalAndSortClosers(closersArray).subTotal;

    const grandTotal = batterTotal + starterTotal + closerTotal;

    this.setState({
      batters,
      starters,
      closers,
      batterTotal,
      starterTotal,
      closerTotal,
      grandTotal,
    });



  }

  render() {
    let rosterEl = null;
    let roster = {};
    if (this.props.roster) {
      roster = this.props.roster;
    }


    let battersEl = [];
    let startersEl = null;
    let closersEl = null;
    if (roster) {
      let refPos = 'Z';
      let posIndex = 0;
      this.state.batters.map((batter, index) => {
        let rowClass = 'counting';
        if (batter.pos !== refPos) {
          rowClass = 'counting';
        }
        else {
          rowClass = 'not-counting';
        }

        battersEl.push(
          <tr key={batter.name} className={rowClass}>
            <td className="pos-col" style={{textAlign: 'center'}}><a href={`#rank/${batter.pos}`}>{batter.pos}</a></td>
            <td className="name-col">{batter.name}</td>
            <td className="team-col" style={{textAlign: 'center'}}>{batter.team}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{batter.r}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{batter.h}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{batter.hr}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{batter.rbi}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{batter.sb}</td>
            <td className="total-col">{batter.total}</td>
          </tr>
        );
        refPos = batter.pos;
      });
      startersEl = this.state.starters.map((player, index) => {
        let rowClass = 'counting';
        if (index < 4) {
          rowClass = 'counting';
        }
        else {
          rowClass = 'not-counting';
        }
        return (
          <tr key={player.name} className={rowClass}>
            <td className="pos-col" style={{textAlign: 'center'}}><a href={`#rank/${player.pos}`}>{player.pos}</a></td>
            <td className="name-col">{player.name}</td>
            <td className="team-col" style={{textAlign: 'center'}}>{player.team}</td>
            <td className="points-col">&nbsp;</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.w}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.l}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.ip}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.k}</td>
            <td className="total-col">{player.total}</td>
          </tr>
        )
      });
      closersEl = this.state.closers.map((player, index) => {
        let rowClass = 'counting';
        if (index < 2) {
          rowClass = 'counting';
        }
        else {
          rowClass = 'not-counting';
        }
        return (
          <tr key={player.name} className={rowClass}>
            <td className="pos-col" style={{textAlign: 'center'}}><a href={`#rank/${player.pos}`}>{player.pos}</a></td>
            <td className="name-col">{player.name}</td>
            <td className="team-col" style={{textAlign: 'center'}}>{player.team}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.w}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.l}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.ip}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.k}</td>
            <td className="points-col" style={{textAlign: 'center'}}>{player.sv}</td>
            <td className="total-col">{player.total}</td>
          </tr>
        )
      });



      rosterEl = (
        <div className="main-content-container">
          <h2 className="roster-view--title">{roster.name}</h2>
          <div className="roster-total-summary-list-container">
            <div className="roster-total-summary-list layout">
              <div className="summary-total-container">total: <span>{ this.state.grandTotal }</span></div>
              <div className="summary-total-container">batters: <span>{ this.state.batterTotal }</span></div>
              <div className="summary-total-container">starters: <span>{ this.state.starterTotal }</span></div>
              <div className="summary-total-container">closers: <span>{ this.state.closerTotal }</span></div>
            </div>
          </div>
          <table className="roster-table roster-hitters-table" id="HitterTable">
            <caption>Batters</caption>
            <thead>
            <tr>
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
                runs
              </th>
              <th>
                hits
              </th>
              <th>
                hr
              </th>
              <th>
                rbi
              </th>
              <th>
                sb
              </th>
              <th>
                total
              </th>
            </tr>
            </thead>
            <tbody >
              {battersEl}
            </tbody>
            <tfoot>
            <tr>
              <td colSpan="8" />
              <td><div className="roster-pos-total" id="RosterBatterTotal">{ this.state.batterTotal }</div></td>
            </tr>
            </tfoot>
          </table>
          <table className="roster-table roster-starters-table" id="StarterTable">
            <caption>Starters</caption>
            <thead>
            <tr>
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
              </th>
              <th>
                w
              </th>
              <th>
                l
              </th>
              <th>
                ip
              </th>
              <th>
                k
              </th>
              <th>
                total
              </th>
            </tr>
            </thead>
            <tbody >
            {startersEl}
            </tbody>
            <tfoot>
            <tr>
              <td colSpan="8" />
              <td><div className="roster-pos-total" id="RosterStarterTotal">{ this.state.starterTotal }</div></td>
            </tr>
            </tfoot>
          </table>
          <table className="roster-table roster-closers-table" id="CloserTable">
            <caption>Closers</caption>
            <thead>
            <tr>
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
                w
              </th>
              <th>
                l
              </th>
              <th>
                ip
              </th>
              <th>
                k
              </th>
              <th>
                sv
              </th>
              <th>
                total
              </th>
            </tr>
            </thead>
            <tbody >
            {closersEl}
            </tbody>
            <tfoot>
            <tr>
              <td colSpan="8" />
              <td><div className="roster-pos-total" id="RosterCloserTotal">{ this.state.closerTotal }</div></td>
            </tr>
            </tfoot>
          </table>
        </div>
      );
    }
    return (
      <div>
        {rosterEl}
      </div>
    );
  }
}

RosterMain.propTypes = {
  slug: PropTypes.string,
  roster: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRosterHittersStats: (slug) => dispatch(fetchRosterHittersStats(slug)),
    onFetchRosterPitchersStats: (slug) => dispatch(fetchRosterPitchersStats(slug)),
  };
};

const mapStateToProps = (state, theProps) => {
  let roster = {};
  let latestHittingStats = [];
  let latestPitchingStats = [];
  let totals = [];
  // get the latests stats and filter them
  //       roster = filterLatest(result);
  if (theProps.slug) {
    if (state.rosters && state.rosters.entities && state.rosters.entities[theProps.slug]) {
      roster = state.rosters.entities[theProps.slug];
    }
    if (state.stats.hitters.rosters && state.stats.hitters.rosters[theProps.slug] && state.stats.hitters.rosters[theProps.slug].entities) {
      latestHittingStats = state.stats.hitters.rosters[theProps.slug].entities;
    }
    if (state.stats.pitchers.rosters && state.stats.pitchers.rosters[theProps.slug] && state.stats.pitchers.rosters[theProps.slug].entities) {
      latestPitchingStats = state.stats.pitchers.rosters[theProps.slug].entities;
    }
  }
  return {
    roster,
    rosterHittingStats: latestHittingStats,
    rosterPitchingStats: latestPitchingStats,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RosterMain);
