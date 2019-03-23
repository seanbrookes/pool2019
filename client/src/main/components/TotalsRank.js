import React, { Component } from 'react';
import { connect } from 'react-redux';

const compareTotals = (a, b) => {
  return parseFloat(b.total) - parseFloat(a.total);
};

class TotalsRank extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let totalsEl = null;
    let hittersEl = null;
    let startersEl = null;
    let closersEl = null;

    if ((this.props.rosters.bashers && this.props.rosters.bashers.entities[0])
      && (this.props.rosters.mashers && this.props.rosters.mashers.entities[0])
      && (this.props.rosters.stallions && this.props.rosters.stallions.entities[0])
      && (this.props.rosters.rallycaps && this.props.rosters.rallycaps.entities[0])
    ){
      const totalsData = {
        bashers: {
          total: this.props.rosters.bashers.entities[0].grandTotal,
          hitters: this.props.rosters.bashers.entities[0].batterTotal,
          starters: this.props.rosters.bashers.entities[0].starterTotal,
          closers: this.props.rosters.bashers.entities[0].closerTotal,
        },
        mashers: {
          total: this.props.rosters.mashers.entities[0].grandTotal,
          hitters: this.props.rosters.mashers.entities[0].batterTotal,
          starters: this.props.rosters.mashers.entities[0].starterTotal,
          closers: this.props.rosters.mashers.entities[0].closerTotal,
        },
        rallycaps: {
          total: this.props.rosters.rallycaps.entities[0].grandTotal,
          hitters: this.props.rosters.rallycaps.entities[0].batterTotal,
          starters: this.props.rosters.rallycaps.entities[0].starterTotal,
          closers: this.props.rosters.rallycaps.entities[0].closerTotal,
        },
        stallions: {
          total: this.props.rosters.stallions.entities[0].grandTotal,
          hitters: this.props.rosters.stallions.entities[0].batterTotal,
          starters: this.props.rosters.stallions.entities[0].starterTotal,
          closers: this.props.rosters.stallions.entities[0].closerTotal,
        },
      };

      let totalsCollection = [
        {
          roster: 'bashers',
          total: totalsData.bashers.total
        },
        {
          roster: 'mashers',
          total: totalsData.mashers.total
        },
        {
          roster: 'rallycaps',
          total: totalsData.rallycaps.total
        },
        {
          roster: 'stallions',
          total: totalsData.stallions.total
        }
      ];
      let hittersCollection = [
        {
          roster: 'bashers',
          total: totalsData.bashers.hitters
        },
        {
          roster: 'mashers',
          total: totalsData.mashers.hitters
        },
        {
          roster: 'rallycaps',
          total: totalsData.rallycaps.hitters
        },
        {
          roster: 'stallions',
          total: totalsData.stallions.hitters
        }
      ];
      let closersCollection = [
        {
          roster: 'bashers',
          total: totalsData.bashers.closers
        },
        {
          roster: 'mashers',
          total: totalsData.mashers.closers
        },
        {
          roster: 'rallycaps',
          total: totalsData.rallycaps.closers
        },
        {
          roster: 'stallions',
          total: totalsData.stallions.closers
        }
      ];
      let startersCollection = [
        {
          roster: 'bashers',
          total: totalsData.bashers.starters
        },
        {
          roster: 'mashers',
          total: totalsData.mashers.starters
        },
        {
          roster: 'rallycaps',
          total: totalsData.rallycaps.starters
        },
        {
          roster: 'stallions',
          total: totalsData.stallions.starters
        }
      ];

      totalsCollection = totalsCollection.sort(compareTotals);
      hittersCollection = hittersCollection.sort(compareTotals);
      closersCollection = closersCollection.sort(compareTotals);
      startersCollection = startersCollection.sort(compareTotals);

      totalsEl = totalsCollection.map((item, index) => {
        return (
          <tr key={index}>
            <td>
              <a style={{fontWeight: 'lighter'}} href={`#rosters/${item.roster}`}>{item.roster}</a>
            </td>
            <td className="total-col">{item.total}</td>
          </tr>
        )
      });
      hittersEl = hittersCollection.map((item, index) => {
        return (
          <tr key={index}>
            <td>
              <a style={{fontWeight: 'lighter'}} href={`#rosters/${item.roster}`}>{item.roster}</a>
            </td>
            <td className="total-col">{item.total}</td>
          </tr>
        )
      });
      startersEl = startersCollection.map((item, index) => {
        return (
          <tr key={index}>
            <td>
              <a style={{fontWeight: 'lighter'}} href={`#rosters/${item.roster}`}>{item.roster}</a>
            </td>
            <td className="total-col">{item.total}</td>
          </tr>
        )
      });
      closersEl = closersCollection.map((item, index) => {
        return (
          <tr key={index}>
            <td>
              <a style={{fontWeight: 'lighter'}} href={`#rosters/${item.roster}`}>{item.roster}</a>
            </td>
            <td className="total-col">{item.total}</td>
          </tr>
        )
      });
    }





    return (
      <div>
        <div className="layout">
          <table className="totals-summary--table">
            <caption>Totals</caption>
            <tbody>
            {totalsEl}
            </tbody>
          </table>
          <table className="totals-summary--table">
            <caption>Hitters</caption>
            <tbody>
            {hittersEl}
            </tbody>
          </table>
          <table className="totals-summary--table">
            <caption>Starters</caption>
            <tbody>
            {startersEl}
            </tbody>
          </table>
          <table className="totals-summary--table">
            <caption>Closers</caption>
            <tbody>
            {closersEl}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  let rosters = {
    bashers: [],
    mashers: [],
    rallycaps: [],
    stallions: []
  };


  return {
    rosters: {
      bashers: state.stats.totals.bashers,
      mashers: state.stats.totals.mashers,
      rallycaps: state.stats.totals.rallycaps,
      stallions: state.stats.totals.stallions,
    }
  };
};

export default connect(mapStateToProps, null)(TotalsRank);
