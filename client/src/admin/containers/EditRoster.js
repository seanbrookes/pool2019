import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SilentButton } from '../../common/components';

import { updateRoster } from '../../rosters/actions/rostersActions';
import '../../rosters/rosters.scss';

import PositionSelect from '../../rosters/components/PositionSelect';
import ProtectedStatusSelect from '../../rosters/components/ProtectedStatusSelect';

export const getStatusValue = (status) => {
  if (status === 'protected') {
    return 0;
  }
  return 1;
};
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
};

export const sortRosterPlayers = (players) => {

  const sort = players.sort(function(a, b) {
    return getPosValue(a.pos) - getPosValue(b.pos);
  });

  return sort;
};


const comparePlayerName = (a,b) => {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
};
const comparePlayerMLBName = (a,b) => {
  if (a.name_display_first_last < b.name_display_first_last)
    return -1;
  if (a.name_display_first_last > b.name_display_first_last)
    return 1;
  return 0;
};

class EditRoster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRoster: {},
      showAddPlayerForm: false,
      newPlayer: {},
    };

    this.loadRoster = this.loadRoster.bind(this);
    this.saveRoster = this.saveRoster.bind(this);
    this.protectAll = this.protectAll.bind(this);
    this.addPlayerToggle = this.addPlayerToggle.bind(this);
    this.updateNewPlayerProperty = this.updateNewPlayerProperty.bind(this);
    this.createPlayer = this.createPlayer.bind(this);
    this.updateRosterPlayer = this.updateRosterPlayer.bind(this);
    this.triggerEditPlayerName = this.triggerEditPlayerName.bind(this);
    this.updateEditPlayerName = this.updateEditPlayerName.bind(this);
    this.savePlayerNameChange = this.savePlayerNameChange.bind(this);
    this.clearDraftInfo = this.clearDraftInfo.bind(this);
    this.clearDraftStatus = this.clearDraftStatus.bind(this);

  }
  loadRoster(slug) {
    this.setState({
      currentRoster: this.props.rosters[slug]
    });
  }
  protectAll() {
    const workingRoster = this.state.currentRoster;
    workingRoster.players.map((player) => {
      player.draftStatus = 'protected';
    });
    this.setState({
      currentRoster: workingRoster,
    }, () => {
      this.saveRoster();
    });
  }
  saveRoster() {
    const theRoster = this.state.currentRoster;

    this.props.onUpdateRoster(theRoster);
  }
  addPlayerToggle() {
    this.setState({
      showAddPlayerForm: !this.state.showAddPlayerForm,
    });
  }
  clearDraftStatus() {
    // console.log('| clear draft status');
    const workingRoster = this.state.currentRoster;
    workingRoster.players.map((player) => {
      player.pickNumber = 0;
      player.round = 0;
    });
    this.setState({
      currentRoster: workingRoster,
    }, () => {
      this.saveRoster();
    });
  }
  updateNewPlayerProperty(event) {
    const newPlayer = this.state.newPlayer;
    const property = event.target.attributes['data-property'].value;
    const value = event.target.value;
    newPlayer[property] = value;
    this.setState({
      newPlayer: newPlayer,
    });

  }
  triggerDeleteRosterPlayer(targetPlayer) {
    if (confirm('delete player?')) {
      const theRoster = this.state.currentRoster;

      const filteredPlayers = theRoster.players.filter((player) => {
        return (player.mlbid !== targetPlayer.mlbid);
      });

      theRoster.players = filteredPlayers;
      this.setState({
        currentRoster: theRoster,
        currentEditPlayer: {},
        currentEditPlayerIndex: null,
      }, () => {
        this.saveRoster();
      });
      // update roster
      // reload roster
    }

  }
  triggerEditPlayerName(player, index, event) {
    this.setState({
      currentEditPlayer: Object.assign({}, player),
      currentEditPlayerIndex: index,
    });
  }
  updateEditPlayerName(event) {
    const editPlayer = this.state.currentEditPlayer;
    editPlayer.name = event.target.value;
    this.setState({
      currentEditPlayer: editPlayer,
    });
  }
  savePlayerNameChange() {
    const thePlayer = this.state.currentEditPlayer;
    const roster = this.state.currentRoster;
    const editIndex = this.state.currentEditPlayerIndex;
    roster.players.map((player, index) => {
      if (index === editIndex) {
        player.name = thePlayer.name;
      }
    });

    this.setState({
      currentRoster: roster,
      currentEditPlayer: {},
      currentEditPlayerIndex: null,
    }, () => {
      this.saveRoster();
    });

  }
  clearDraftInfo(targetPlayer) {
    if (confirm('clear draft info?')) {
      const roster = this.state.currentRoster;
      roster.players.map((player) => {
        if (player.name === targetPlayer.name) {
          delete player.pickNumber;
          delete player.round;
        }
      });
      this.setState({
        currentRoster: roster,
      }, () => {
        this.saveRoster();
      });

    }
  }
  createPlayer() {
    // save the addPlayer object onto roster players
    const currentRoster = this.state.currentRoster;
    const newPlayer = this.state.newPlayer;
    // update roster
    let isUniquePlayerName = true;
    currentRoster.players.map((player) => {
      if (player.name === newPlayer.name) {
        isUniquePlayerName = false;
      }
    });

    // disabled={!(this.state.newPlayer.name && this.state.newPlayer.pos && this.state.newPlayer.team)}

    if (isUniquePlayerName) {
      currentRoster.players.push(newPlayer);

      this.setState({
        currentRoster: currentRoster,
        showAddPlayerForm: false,
        newPlayer: {},
      }, () => {
        this.saveRoster();
      });

    }
  }

  isEven(n) {
    return n % 2 == 0;
  }

  getRowClass(player, index) {
    let retVal = '';
    if (this.isEven(index)) {
      retVal = 'admin-roster-row stripe';
    }
    else {
      retVal = 'admin-roster-row';
    }

    return retVal;
  }

  updateRosterPlayer(targetPlayer, event) {
    const value = event.target.value;
    const property = event.target.attributes['data-property'].value;
    console.log('update player', value, property);

    const roster = this.state.currentRoster;

    roster.players.map((player) => {
      if (player.name && targetPlayer.name) {
        if (player.name === targetPlayer.name) {
          player[property] = value;
        }
      }
    });

    this.setState({
      currentRoster: roster
    }, () => {
      this.saveRoster();
    });


  }

  render() {
    let rosterEl = null;


    let addPlayerForm = null;
    let addPlayerTriggerText = 'Add Player';

    if (this.state.currentRoster && this.state.currentRoster.name) {
      const roster = this.state.currentRoster;
      const players = roster.players.sort(comparePlayerName);
      if (this.state.showAddPlayerForm) {
        addPlayerTriggerText = 'close';
        addPlayerForm = (
          <div>
            <div>
              <label>
                Name:
                <input
                  value={this.state.newPlayer.name}
                  onChange={this.updateNewPlayerProperty}
                  data-property="name"
                />
              </label>
            </div>
            <div>
              <label>
                Pos:
                <select
                  onChange={this.updateNewPlayerProperty}
                  className="select-pos pick-property-edit"
                  value={this.state.newPlayer.pos}
                  data-property="pos"
                >
                  <option value>-</option>
                  <option value="C">C</option>
                  <option value="1B">1B</option>
                  <option value="2B">2B</option>
                  <option value="3B">3B</option>
                  <option value="SS">SS</option>
                  <option value="LF">LF</option>
                  <option value="CF">CF</option>
                  <option value="RF">RF</option>
                  <option value="DH">DH</option>
                  <option value="SP">SP</option>
                  <option value="RP">RP</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Team:
                <select
                  className="select-team pick-property-edit"
                  onChange={this.updateNewPlayerProperty}
                  value={this.state.newPlayer.team}
                  data-property="team"
                >
                  <option value>--</option>
                  <option value="BAL">BAL</option>
                  <option value="BOS">BOS</option>
                  <option value="CHA">CHA</option>
                  <option value="CLE">CLE</option>
                  <option value="DET">DET</option>
                  <option value="HOU">HOU</option>
                  <option value="KC">KC</option>
                  <option value="LAA">LAA</option>
                  <option value="MIN">MIN</option>
                  <option value="NYY">NYY</option>
                  <option value="OAK">OAK</option>
                  <option value="SEA">SEA</option>
                  <option value="TB">TB</option>
                  <option value="TEX">TEX</option>
                  <option value="TOR">TOR</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Status:
                <select
                  value={this.state.newPlayer.status}
                  onChange={this.updateNewPlayerProperty}
                  data-property="draftStatus"
                >
                  <option value="drafted">drafted</option>
                  <option value="bubble">bubble</option>
                  <option value="prospect">prospect</option>
                  <option value="protected">protected</option>
                  <option value="roster">roster</option>
                  <option value="regular">regular</option>
                  <option value="unprotected">unprotected</option>
                </select>
              </label>
            </div>
            <div className="layout">
              <button
                onClick={this.createPlayer}
              >
                save
              </button>
            </div>
          </div>
        );
      }
      let nameClass = '';
      const playersEl = players.map((player, index) => {

        let playerNameEl = (
          <button onClick={(event) => this.triggerEditPlayerName(player, index, event)} className={nameClass}>
            {player.name}
          </button>
        );
        if (this.state.currentEditPlayer && (this.state.currentEditPlayerIndex || (this.state.currentEditPlayerIndex === 0))  && (this.state.currentEditPlayerIndex === index)) {
          playerNameEl = (
            <input
              type="text"
              onChange={(event) => this.updateEditPlayerName(event)}
              onBlur={this.savePlayerNameChange}
              className={nameClass}
              value={this.state.currentEditPlayer.name}
            />
          );
        }

        return (
          <tr key={index} className={this.getRowClass(player, index)} data-ui-type="row">
            <td>
              <SilentButton data-mlbid={player.mlbid}
                onClick={(event) => this.triggerDeleteRosterPlayer(player, event)}
              >
                x
              </SilentButton>
            </td>
            <td>
              {playerNameEl}
            </td>
            <td>
              <PositionSelect
                onChange={(event) => {this.updateRosterPlayer(player, event)}}
                position={player.pos}
                value={player.pos}
                data-property="pos"
              />
            </td>
            <td>
              <select
                className="select-team"
                onChange={(event) => this.updateRosterPlayer(player, event)}
                value={player.team}
                data-property="team"
              >
                <option value>--</option>
                <option value="BAL">BAL</option>
                <option value="BOS">BOS</option>
                <option value="CHA">CHA</option>
                <option value="CLE">CLE</option>
                <option value="DET">DET</option>
                <option value="HOU">HOU</option>
                <option value="KC">KC</option>
                <option value="LAA">LAA</option>
                <option value="MIN">MIN</option>
                <option value="NYY">NYY</option>
                <option value="OAK">OAK</option>
                <option value="SEA">SEA</option>
                <option value="TB">TB</option>
                <option value="TEX">TEX</option>
                <option value="TOR">TOR</option>
              </select>
            </td>
            <td>
              <ProtectedStatusSelect
                onChange={(event) => this.updateRosterPlayer(player, event)}
                value={player.draftStatus}
                data-property="draftStatus"
              />
            </td>
            <td>
              <select value={player.posType}
                      onChange={(event) => {this.updateRosterPlayer(player, event)}}
                      data-property="posType"
              >
                <option >---</option>
                <option value="hitter">hitter</option>
                <option value="pitcher">pitcher</option>
              </select>
            </td>
            <td>
              {player.mlbid}
            </td>
            <td>
              {player.status}
            </td>
            <td>
              <SilentButton onClick={() => this.clearDraftInfo(Object.assign({}, player))}>
              {player.pickNumber}
              </SilentButton>
            </td>
            <td>
              {player.round}
            </td>
          </tr>
        )
      });
      rosterEl = (
        <div>
          <h3>{roster.name}</h3>
          <button onClick={this.addPlayerToggle}>{addPlayerTriggerText}</button>
          {/* <button onClick={this.clearDraftStatus}>clear draft status</button> */}
          {/* <button onClick={this.protectAll}>set all protected</button> */}
          {addPlayerForm}
          <table className="admin-roster-table">
            <caption>players:</caption>
            <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Pos</th>
              <th>Team</th>
              <th>Draft Status</th>
              <th>Type</th>
              <th>MLBID</th>
              <th>Status</th>
              <th>Pick</th>
              <th>Round</th>
            </tr>
            </thead>
            <tbody>
              {playersEl}
            </tbody>
          </table>
        </div>
      );
    }


    return (
      <div>
        <div>EditRoster</div>
        <div className='layout'>
          <div>
            <button key='bashers' onClick={() => this.loadRoster('bashers')}>bashers</button>
            <button key='mashers' onClick={() => this.loadRoster('mashers')}>mashers</button>
            <button key='rallycaps' onClick={() => this.loadRoster('rallycaps')}>rally caps</button>
            <button key='stallions' onClick={() => this.loadRoster('stallions')}>stallions</button>
          </div>
        </div>
        <div className='layout'>
          {rosterEl}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    rosters: state.rosters.entities ? state.rosters.entities : {},
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateRoster: (roster) => dispatch(updateRoster(roster)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRoster);

