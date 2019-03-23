import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchMlbHitters,
  fetchPitchers
} from '../actions/adminActions';

import {
  updateRoster
} from '../../rosters/actions/rostersActions';

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

class MapMlbid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRoster: {},
      showAddPlayerForm: false,
      newPlayer: {},
    };

    this.loadRoster = this.loadRoster.bind(this);
    this.loadMlbHitters = this.loadMlbHitters.bind(this);
    this.loadMlbPitchers = this.loadMlbPitchers.bind(this);
    this.saveRoster = this.saveRoster.bind(this);
    this.clearCurrentId = this.clearCurrentId.bind(this);
    this.addPlayerToggle = this.addPlayerToggle.bind(this);
    this.updateNewPlayerProperty = this.updateNewPlayerProperty.bind(this);
    this.createPlayer = this.createPlayer.bind(this);

  }
  loadRoster(slug) {
    this.setState({
      currentRoster: this.props.rosters[slug]
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
  updateNewPlayerProperty(event) {
    const newPlayer = this.state.newPlayer;
    const property = event.target.attributes['data-property'].value;
    const value = event.target.value;
    newPlayer[property] = value;
    this.setState({
      newPlayer: newPlayer,
    });

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
  loadMlbHitters() {
    this.props.onFetchHitters();

  }
  loadMlbPitchers() {
    this.props.onFetchPitchers();
  }
  setCurrentId(id, name) {
    this.setState({
      currentId: id,
      currentName: name,
    });
  }
  clearCurrentId() {
    this.setState({
      currentId: null,
      currentName: null,
    });
  }

  mapPlayerToId(player) {
    if (this.state.currentId) {
      const roster = this.state.currentRoster;
      roster.players.map((item) => {
        if (item.name === player.name) {
          item.mlbid = this.state.currentId;
        }
      });
      this.saveRoster(roster);
      this.setState({
        currentId: null,
        currentName: null,
        currentRoster: roster,
      });
    }
  }


  render() {
    let rosterEl = null;
    let mlbEl = null;
    if (this.props.hitters && this.props.hitters.length > 0) {
      const hitterEl = this.props.hitters.map((hitter) => {
        return (
          <tr key={hitter.player_id}>
            <td>
              <button onClick={() => this.setCurrentId(hitter.mlbid, hitter.name_display_first_last)}>
                {hitter.name_display_first_last}
              </button>
            </td>
          </tr>
        );
      });
      mlbEl = (
        <table>
          <caption>MLB source hitters</caption>
          <tbody>
          {hitterEl}
          </tbody>
        </table>
      )
    }
    if (this.props.pitchers && this.props.pitchers.length > 0) {
      const pitcherEl = this.props.pitchers.map((pitcher) => {
        return (
          <tr key={pitcher.player_id}>
            <button onClick={() => this.setCurrentId(pitcher.mlbid, pitcher.name_display_first_last)}>
              {pitcher.name_display_first_last}
            </button>
          </tr>
        );
      });
      mlbEl = (
        <table>
          <caption>MLB source pitchers</caption>
          <tbody>
          {pitcherEl}
          </tbody>
        </table>
      )
    }
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

      const playersEl = players.map((player) => {
        let rowClassName = '';
        let nameCellEl = (
          <td>
            <button onClick={() => this.mapPlayerToId(player)}>
              {player.name}
            </button>
          </td>
        );
        if (player.mlbid) {
          rowClassName = 'attached';
          nameCellEl = (
            <td>
              {player.name}
            </td>
          );
        }
        return (
          <tr key={player.id}>
            {nameCellEl}
            <td>{player.pos}</td>
            <td>{player.team}</td>
            <td>{player.mlbid}</td>
          </tr>
        )
      });
      rosterEl = (
        <div>
          <h3>{roster.name}</h3>
          <button onClick={this.addPlayerToggle}>{addPlayerTriggerText}</button>
          {addPlayerForm}
          <table>
            <caption>players:</caption>
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
          <div>
            <button onClick={this.loadMlbHitters}>MLB hitters</button>
            <button onClick={this.loadMlbPitchers}>MLB pitchers</button>
          </div>
        </div>
        <button onClick={this.clearCurrentId}>{this.state.currentId} - {this.state.currentName}</button>
        <div className='layout'>
          <div style={{width: '20rem'}}>
            {rosterEl}
          </div>
          <div className='mlb-player-list'>
            {mlbEl}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let hitters = [];
  let pitchers = [];
  if (state.admin.entities && state.admin.entities.hitters) {
    hitters = state.admin.entities.hitters.sort(comparePlayerMLBName);
  }
  if (state.admin.entities && state.admin.entities.pitchers) {
    pitchers = state.admin.entities.pitchers.sort(comparePlayerMLBName);
  }
  return {
    rosters: state.rosters.entities ? state.rosters.entities : {},
    hitters,
    pitchers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchHitters: () => dispatch(fetchMlbHitters()),
    onFetchPitchers: () => dispatch(fetchPitchers()),
    onUpdateRoster: (roster) => dispatch(updateRoster(roster)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapMlbid);

