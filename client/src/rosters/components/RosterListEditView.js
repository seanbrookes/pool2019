import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateRoster } from '../actions/rostersActions';

import '../rosters.scss';

import PositionSelect from '../components/PositionSelect';
import ProtectedStatusSelect from '../components/ProtectedStatusSelect';

export const getStatusValue = (status) => {
  if (status === 'protected') {
    return 0;
  }
  return 1;
}
export const getPosValue = (pos) => {

  switch(pos) {

    case 'C':
      return 1;
    case '1B':
      return 2;
    case '2B':
      return 3;
    case '3B':
      return 4;
    case 'SS':
      return 5;
    case 'LF':
      return 6;
    case 'CF':
      return 7;
    case 'RF':
      return 8;
    case 'DH':
      return 9;
    case 'SP':
      return 10;
    case 'RP':
      return 11;
    default:
      return 0;
  }
}

export const sortRosterPlayers = (players) => {



  const sort = players.sort(function(a, b) {
    return getPosValue(a.pos) - getPosValue(b.pos);
  });

  return sort;

  // const protectedCollection = players.filter((player) => {
  //   return player.draftStatus === 'protected';
  // });
  // const protectedSort = protectedCollection.sort(function(a, b) {
  //   return getPosValue(a.pos) - getPosValue(b.pos);
  // });
  //
  //
  // const notProtectedCollection = players.filter((player) => {
  //   return player.draftStatus !== 'protected';
  // });
  // const notProtectedSort = notProtectedCollection.sort(function(a, b) {
  //   return getPosValue(a.pos) - getPosValue(b.pos);
  // });

  // return players.sort(function(a, b) {
  //   return getPosValue(a.pos) - getPosValue(b.pos);
  // });


  // return protectedSort.concat(notProtectedSort);












};

class RosterListEditView extends Component {
  constructor(props) {
    super(props);

    this.updatePosition = this.updatePosition.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.getRowClass = this.getRowClass.bind(this);
    this.updatePositionType = this.updatePositionType.bind(this);

  }



  updatePosition(event, name) {

    const freshRoster = Object.assign({}, this.props.roster);
    freshRoster.players.map((player) => {
      if (player.name === name) {
        player.pos = event.target.value;
      }
    });

    this.props.onUpdateRoster(freshRoster);


  }
  updatePositionType(event, name) {

    const freshRoster = Object.assign({}, this.props.roster);
    freshRoster.players.map((player) => {
      if (player.name === name) {
        player.pos = event.target.value;
      }
    });

    this.props.onUpdateRoster(freshRoster);


  }

  updateProtectedStatus(event, name) {
    const freshRoster = Object.assign({}, this.props.roster);
    freshRoster.players.map((player) => {
      if (player.name === name) {
        player.draftStatus = event.target.value;
      }
    });

    this.props.onUpdateRoster(freshRoster);
  }

  isEven(n) {
    return n % 2 == 0;
  }

  getRowClass(player, index) {
    let retVal = '';
    if (this.isEven(index)) {
      retVal = 'unprotected-row stripe';
    }
    else {
      retVal = 'unprotected-row';
    }
    // if (index < 12) {
    //   if (this.isEven(index)) {
    //     retVal = 'protected-row stripe';
    //   }
    //   else {
    //     retVal = 'protected-row';
    //   }
    // }
    // else {
    //   if (player.draftStatus === 'protected') {
    //     if (this.isEven(index)) {
    //       retVal = 'protected-warning-row stripe';
    //     }
    //     else {
    //       retVal = 'protected-warning-row';
    //     }
    //   }
    //   else {
    //     if (this.isEven(index)) {
    //       retVal = 'unprotected-row stripe';
    //     }
    //     else {
    //       retVal = 'unprotected-row';
    //     }
    //   }
    //
    // }
    return retVal;
  }

  render() {


    const playerCollection = [];

    if (this.props.roster && this.props.roster.players) {
      this.props.roster.players.map((player, index) => {
        let nameClass = '';

        let draftDisplayEl = (<td></td>);
        if (player.pickNumber && (player.status !== 'protected')) {
          draftDisplayEl = (
            <td>
              <div>pick: {player.pickNumber}</div>
              <div>round: {player.round}</div>
            </td>
          );
          if (player.draftStatus === 'drafted') {
            nameClass = 'drafted';
          }
          if (player.draftStatus === 'prospect') {
            nameClass = 'prospect';
          }
        }
        if (player.name.indexOf('prospect') > -1) {
          player.name = player.name.replace('(prospect)', '(p)');
        }
        if (player.name.indexOf('propsect') > -1) {
          player.name = player.name.replace('(propsect)', '(p)');
        }
        playerCollection.push(
          (
            <tr key={index} className={this.getRowClass(player, index)} data-ui-type="row">
              <td>
                <button className="SilentButton" onClick={() => {}}>{(index + 1)}</button>
              </td>
              <td>
                <div className={nameClass}>
                  {player.name}
                </div>
                <div style={{display:'flex', fontSize: '12px'}}>
                  <div>team:</div>
                  <div>{player.team}</div>
                </div>
              </td>
              <td>
                <PositionSelect
                  onChange={(event) => {this.updatePosition(event, player.name)}}
                  position={player.pos}
                  mlbid={player.mlbid}
                />
              </td>
              <td>
                <ProtectedStatusSelect
                  onChange={(event) => {this.updateProtectedStatus(event, player.name)}}
                  status={player.draftStatus}
                  mlbid={player.mlbid} />
              </td>
              <td>
                <select value={player.posType} onChange={(event) => {this.updatePositionType(event, player.name)}} >
                  <option value="hitter">hitter</option>
                  <option value="pitcher">pitcher</option>
                </select>
              </td>
              {draftDisplayEl}
            </tr>
          )
        )
      });
    }


    return (
      <table className="PreDraftRosterTable">
        <caption className="ng-binding">{this.props.roster.name}</caption>
        <tbody>

        {playerCollection}

        </tbody>
      </table>
    );
  }


}

RosterListEditView.propTypes = {
  slug: PropTypes.string,
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateRoster: (roster) => dispatch(updateRoster(roster)),
  }
};

export const mapStateToProps = (state, theProps) => {
  let theRoster = {};
  if (state.rosters && state.rosters.entities) {
    theRoster = Object.assign({}, state.rosters.entities[theProps.slug]);
    theRoster.players = sortRosterPlayers(theRoster.players);
  }

  return {
    roster: theRoster
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RosterListEditView);

