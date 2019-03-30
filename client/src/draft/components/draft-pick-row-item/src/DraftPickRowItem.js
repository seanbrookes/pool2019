import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { join } from 'path';

class DraftPickRowItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pick: {},
    };

    this.postPickToRoster = this.postPickToRoster.bind(this);
  }

  componentWillMount() {
    if (this.props.pick) {
      this.setState({
        pick: this.props.pick
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.pick) {
      this.setState({
        pick: nextProps.pick
      });
    }
  }

  postPickToRoster() {
    console.log('|  post pick ', event.target.attributes['data-pickid'].value)
  }

  render() {
    const pick = this.state.pick;
    let rowClass = ['DraftPickRow'];
    if (this.props.isOdd) {
      rowClass.push('DraftPickRow--odd');
    }
    rowClass.push(this.props.roundClass);
    return (
      <tr className={rowClass.join(' ')}>
        <td className="DraftPickCell DraftPickCell__Round">
          <button data-pickid={pick.id} onClick={this.props.postPickToRoster}>
          {pick.round}
          </button>
          {/* {pick.round} */}
        </td>
        <td className="DraftPickCell DraftPickCell__PickNumber">
          <button
            className="SilentButton"
            value={pick.id}
            onClick={this.props.clearPick}
          >
            {pick.pickNumber}
          </button>
          {/* {pick.pickNumber} */}
        </td>
        <td className="DraftPickCell DraftPickCell__Roster">
          <select
            onChange={this.props.updatePick}
            value={pick.slug}
            data-property="slug"
            data-pickid={pick.id}
          >
            <option value="bashers">bashers</option>
            <option value="mashers">mashers</option>
            <option value="rallycaps">rallycaps</option>
            <option value="stallions">stallions</option>
          </select>
          {/* {pick.slug} */}
        </td>
        <td className="DraftPickCell DraftPickCell__Name">
          <input
            className="draft-name-input"
            type="text"
            onBlur={this.props.persistPickPlayer}
            onChange={this.props.updatePickName}
            value={pick.name}
            data-pickid={pick.id}
          />
          {/* {pick.name} */}
        </td>
        <td className="DraftPickCell DraftPickCell__Pos">
          <select
            data-pickid={pick.id}
            onChange={this.props.updatePick}
            className="select-pos pick-property-edit"
            value={pick.pos}
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
          {/* {pick.pos} */}
        </td>
        <td className="DraftPickCell DraftPickCell__Team">
          <select
            className="select-team pick-property-edit"
            onChange={this.props.updatePick}
            value={pick.team}
            data-pickid={pick.id}
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
          {/* {pick.team} */}
        </td>
        <td>
          {pick.pickTime ? moment(pick.pickTime).format('mm:ss') : ''}
        </td>
        <td>
          <button ng-click="editPick(pick)" ng-model="pick">edit</button>
          <button ng-click="deletePick(pick)" ng-model="pick">delete</button>
        </td>
      </tr>
    );
  }
}

DraftPickRowItem.propTypes = {
  pick: PropTypes.object,
  persistPickPlayer: PropTypes.func,
  updatePick: PropTypes.func,
  updatePickName: PropTypes.func,
};

export default DraftPickRowItem;
