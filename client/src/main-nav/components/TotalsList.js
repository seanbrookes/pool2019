import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const compareTotals = (a, b) => {
  return parseFloat(b.total) - parseFloat(a.total);
};

class TotalsList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      rosters: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.totals) {
      const xyz = nextProps.totals;
      const stateObj = Object.assign({}, this.state);
      if (nextProps.totals.bashers) {
        stateObj['bashers'] = nextProps.totals.bashers.entities;
      }
      if (nextProps.totals.mashers) {
        stateObj['mashers'] = nextProps.totals.mashers.entities;
      }
      if (nextProps.totals.rallycaps) {
        stateObj['rallycaps'] = nextProps.totals.rallycaps.entities;
      }
      if (nextProps.totals.stallions) {
        stateObj['stallions'] = nextProps.totals.stallions.entities;
      }

      this.setState({
        rosters: stateObj
      });
    }
  }
  componentWillMount() {
    if (this.props.totals) {
      const xyz = this.props.totals;
    }
  }

  render() {
    const sortArray = [];
    if (this.state.rosters.bashers && this.state.rosters.mashers && this.state.rosters.rallycaps && this.state.rosters.stallions) {
      // get the first grand total from each
      let bashersDelta = 0;
      let mashersDelta = 0;
      let rallycapsDelta = 0;
      let stallionsDelta = 0;
      if (this.state.rosters.bashers && this.state.rosters.bashers.length > 0) {
        bashersDelta = (this.state.rosters.bashers[0].grandTotal - this.state.rosters.bashers[1].grandTotal);
      }
      if (this.state.rosters.mashers && this.state.rosters.mashers.length > 0) {
        mashersDelta = (this.state.rosters.mashers[0].grandTotal - this.state.rosters.mashers[1].grandTotal);
      }
      if (this.state.rosters.rallycaps && this.state.rosters.rallycapslength > 0) {
        rallycapsDelta = (this.state.rosters.rallycaps[0].grandTotal - this.state.rosters.rallycaps[1].grandTotal);
      }
      if (this.state.rosters.stallions && this.state.rosters.stallions.length > 0) {
        stallionsDelta = (this.state.rosters.stallions[0].grandTotal - this.state.rosters.stallions[1].grandTotal);
      }
      // sort the totals
      // get the first and second from each and subtract and get the delta
      let bashersGrandTotal = 0;
      let mashersGrandTotal = 0;
      let rallycapsGrandTotal = 0;
      let stallionsGrandTotal = 0;
      if (this.state.rosters.bashers && this.state.rosters.bashers.length > 0) {
        bashersGrandTotal = this.state.rosters.bashers[0].grandTotal;
      }
      if (this.state.rosters.mashers && this.state.rosters.mashers.length > 0) {
        mashersGrandTotal = this.state.rosters.mashers[0].grandTotal;
      }
      if (this.state.rosters.rallycaps && this.state.rosters.rallycapslength > 0) {
        rallycapsGrandTotal = this.state.rosters.rallycaps[0].grandTotal;
      }
      if (this.state.rosters.stallions && this.state.rosters.stallions.length > 0) {
        stallionsGrandTotal = this.state.rosters.stallions[0].grandTotal;
      }
      sortArray.push({
        roster: 'Bashers',
        slug: 'bashers',
        total: bashersGrandTotal,
        delta: bashersDelta
      });
      sortArray.push({
        roster: 'Mashers',
        slug: 'mashers',
        total: mashersGrandTotal,
        delta: mashersDelta
      });
      sortArray.push({
        roster: 'Rally Caps',
        slug: 'rallycaps',
        total: rallycapsGrandTotal,
        delta: rallycapsDelta
      });
      sortArray.push({
        roster: 'Stallions',
        slug: 'stallions',
        total: stallionsGrandTotal,
        delta: stallionsDelta
      });

      sortArray.sort(compareTotals);
    }



    let urlPath = this.props.matchPath;

    let rows = sortArray.map(function(item) {
      let urlString = '#rosters/' + item.slug;

      let activeClass = '';
      if (urlPath.indexOf(item.slug) > -1) {
        activeClass = 'active-nav';
      }
      activeClass = activeClass + ' ' + item.roster;
      return (
        <tr className={activeClass} key={item.roster}>
          <td className="total-name">
            <a href={urlString} style={{whiteSpace: 'nowrap'}}>{ item.roster }</a>
          </td>
          <td className="total-value">
            <span >{ item.total }</span>
          </td>
          <td className="total-delta">
            <span>({ item.delta })</span>
          </td>
        </tr>
      );
    });
    return (
      <div className="side-nav-container">
        <table className="nav-totals">
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

TotalsList.propTypes = {
  grandTotals: PropTypes.array,
  totals: PropTypes.object,
};

TotalsList.defaultProps = {
  grandTotals: [
    {
      roster: 'bashers',
      grandTotal: 0,
      grandTotalDelta: 0
    },
    {
      roster: 'mashers',
      grandTotal: 0,
      grandTotalDelta: 0
    },
    {
      roster: 'rallycaps',
      grandTotal: 0,
      grandTotalDelta: 0
    },
    {
      roster: 'stallions',
      grandTotal: 0,
      grandTotalDelta: 0
    },
  ]
};

const mapStateToProps = (state) => {

  const fuckYou = state.stats.totals;
  return {
    totals: Object.assign({}, fuckYou),
  };
};

export default connect(mapStateToProps, null)(TotalsList);

