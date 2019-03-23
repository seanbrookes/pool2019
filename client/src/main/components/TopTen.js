import React, { Component } from 'react';
import { connect } from 'react-redux';

import { sortCombinedTotals } from '../../stats/stats.utils';
import { isEven } from '../../common/common.utils';
const compareTotals = (a, b) => {
  return parseFloat(b.total) - parseFloat(a.total);
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value.name) === index;
};

const getTopTenRowClass = (index) => {
  let retVal = 'top-ten--row';
  if (index < 10) {
    if (isEven(index)) {
      retVal = 'top-ten--row stripe';
    }
  }
  else {
    retVal = 'non-top-ten--row';
    if (isEven(index)) {
      retVal = 'non-top-ten--row stripe';
    }

  }


  return retVal;
};

class TopTen extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let fullCollection = [];

    if (this.props.hitters && this.props.hitters.length > 0) {
      if (this.props.pitchers && this.props.pitchers.length > 0) {
        fullCollection = sortCombinedTotals(this.props.hitters, this.props.pitchers);
      }
    }

    let rankedListEl = fullCollection.map((player, index) => {
      return (
        <tr key={player.id} className={getTopTenRowClass(index)}>
          <td style={{textAlign: 'center', fontWeight: 'lighter'}}>{(index + 1)}</td>
          <td>
            <a style={{fontWeight: 'lighter'}} href={`#rank/${player.pos}`}>{player.pos}</a>
          </td>
          <td>
            <a style={{fontWeight: 'lighter'}} href={`#rosters/${player.roster}`}>{player.roster}</a>
          </td>
          <td>{player.name}</td>
          <td>{player.total}</td>
        </tr>
      );
    });
    return (
      <div>
        <div>&nbsp;</div>
        <table className="top-ten--table">
          <caption>Top ten</caption>
          <tbody>
            {rankedListEl}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    hitters: state.stats.hitters.lastWeek.entities,
    pitchers: state.stats.pitchers.lastWeek.entities,
  };
};

export default connect(mapStateToProps, null)(TopTen);
