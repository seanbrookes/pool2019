import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { DraftPickRowItem, PickTimer } from '../components';
import { fetchDraftPicks, updateDraftPick, pollDraftPicks } from '../actions/draftActions';

import { updateRoster, fetchRosters } from '../../rosters/actions/rostersActions';

const DraftTable = styled.table`
  width: 100%;
  border: 1px solid #eeeeee;

  .DraftPickRow.odd-round {
    background-color: #efefef;
  }
  .DraftPickRow.even-round {
    background-color: #e1e1e1;
  }
  .DraftPickRow--odd.odd-round {
    background-color: #ffffff;
  }
  .DraftPickRow--odd.even-round {
    background-color: #cecece;
  }


`;

class DraftBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      draftPicks: []
    };

    this.clearPick = this.clearPick.bind(this);
    this.updatePick = this.updatePick.bind(this);
    this.updatePickName = this.updatePickName.bind(this);
    this.persistPickPlayer = this.persistPickPlayer.bind(this);
    this.startPolling = this.startPolling.bind(this);
    this.stopPolling = this.stopPolling.bind(this);
    this.setCurrentPick = this.setCurrentPick.bind(this);
    this.postPickToRoster = this.postPickToRoster.bind(this);
  }

  componentWillMount() {
    this.props.onFetchRosters();
    this.props.onFetchDraftPicks();
    if (this.props.draftPicks) {
      this.setState({
        draftPicks: this.props.draftPicks,
      }, () => {
        this.setCurrentPick();
      });
    }
  //  this.startPolling();
  //  this.props.onPollDraftPicks();
    // start the polling
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.draftPicks) {
      this.setState({
        draftPicks: nextProps.draftPicks,
      }, () => {
        this.setCurrentPick();
      });
    }
  }
  startPolling() {
    let intervalId  = setInterval(() => {
        setTimeout(() => {
          console.log('|   poll for darn sakes');
          this.props.onFetchDraftPicks();
        }, 3);
      },
      15000);
    this.setState({
      intervalId: intervalId
    });
  }
  stopPolling() {
    clearInterval(this.state.intervalId);
  }

  getPick(id) {

    const item = this.state.draftPicks.filter((pick) => {
      return pick.id === id;
    });
    return item[0];
  }
  clearPick(event) {
    const targetPick = this.getPick(event.target.value);
    targetPick.name = '';
    targetPick.pos = '';
    targetPick.team = '';
    targetPick.timestamp = '';
    targetPick.pickTime = '';
    if (confirm('clear pick?')) {
      this.props.onUpdateDraftPick(targetPick);
    }
    console.log('| clear pick called ', targetPick.name);
  }
  postPickToRoster(event) {
    const targetPick = this.getPick(event.target.attributes['data-pickid'].value);
    targetPick.draftStatus = 'drafted';

    /*
    *
     {
     "name": "Jose Abreu",
     "pos": "1B",
     "team": "CHA",
     "draftStatus": "protected",
     "status": "regular",
     "posType": "hitter",
     "mlbid": "547989"
     }



    * */

    let status = 'drafted';
    if (targetPick.name.indexOf('prospect') > 0) {
      status = 'prospect';
    }

    const postObj = {
      name: targetPick.name,
      pos: targetPick.pos,
      team: targetPick.team,
      pickNumber: targetPick.pickNumber,
      round: targetPick.round,
      draftStatus: status
    };

    // get the roster based on slug
    const targetRoster = this.props.rosters[targetPick.slug];

    if (targetRoster) {
      let doesPlayerExist = false;
      targetRoster.players.map((player) => {
        if (player.name === postObj.name) {
          doesPlayerExist = true;
        }
      });
      if (!doesPlayerExist) {
        targetRoster.players.push(postObj);

       this.props.onUpdateRoster(targetRoster);
       // this.props.onUpdateRoster();
        console.log('POST this player to roster', targetRoster);
      }
    }

    // iterate over the players to confirm if name exists

    // if not then add this object to list

    // persist roster




  }
  setCurrentPick() {
    let currentPick = {};
    let lastPick = {};
    // load the picks
    // iterate until there is no 'name'
    if (this.state.draftPicks) {
      const thePicks = this.state.draftPicks;
      let isMatchFound = false;
      thePicks.map((pick, index, collection) => {
        if (!pick.timestamp && !isMatchFound) {
          lastPick = collection[index - 1];
          currentPick = pick;
          isMatchFound = true;
        }
      });

   //   console.log('SET last picks');
      this.setState({
        currentPick,
        lastPick,
      });

    }
  }

  updatePick(event) {
    // data-property
    // data-pickid
    const pickId = event.target.attributes['data-pickid'].value;
    const property = event.target.attributes['data-property'].value;
    const value = event.target.value;
    // console.log('|  update pick item', event.target.value);
    // console.log('|  update pick pickId', pickId);
    // console.log('|  update pick property', property);

    const picks = this.state.draftPicks;

    let targetPick = {};
    picks.map((pick) => {
      if (pick.id === pickId) {
        pick[property] = value;
        targetPick = pick;
      }
    });

    this.setState({
      draftPicks: picks
    },
      () => {
      this.props.onUpdateDraftPick(targetPick);
      }
    );
  }
  updatePickName(event) {
    this.stopPolling();
    const value = event.target.value;
    const pickId = event.target.attributes['data-pickid'].value;

    const srcPick = this.getPick(pickId);

    const picks = this.state.draftPicks;

    picks.map((pick) => {
      if (pick.id === pickId) {
        pick.name = value;
      }
    });
    // console.log('| update pick name ', value);

    this.setState({
      draftPicks: picks
    });


  }
  persistPickPlayer(event) {
    // make sure to get the delta between last pick and this pick
    // save as pick time
    // console.log('| persistPickPlayer ', event.target.value);
    const pickId = event.target.attributes['data-pickid'].value;
    const picks = this.state.draftPicks;
    const targetPickItem = picks.filter((pick) => {
      return pick.id === pickId;
    });
    const targetPick = targetPickItem[0];
    if (!targetPick.timestamp) {
      targetPick.timestamp = new Date().getTime();
      targetPick.pickTime = this.state.lastPick ? (targetPick.timestamp - this.state.lastPick.timestamp) : 0;
    }
    this.props.onUpdateDraftPick(targetPick);
    this.startPolling();
  }

  render() {
    let draftPicksEl = [];

    const currentPick = this.state.currentPick;
    let currentPickEl = null;

    if (currentPick) {
      currentPickEl = (<h3>current pick: {currentPick.roster}</h3>);
    }



    let roundCountIndex = 0;
    let roundClass = 'even-round';
    const getRoundClass = (index) => {
      if (index === 0) {
        return roundClass;
      }
      roundCountIndex++;

      if (roundCountIndex === 4) {
        if (roundClass === 'odd-round') {
          roundClass = 'even-round';
        }
        else {
          roundClass = 'odd-round';
        }
        roundCountIndex = 0;
      }

      return roundClass;

    }
    const isOdd = (num) => { return num % 2;};
    if (this.props.draftPicks) {
      this.props.draftPicks.map((pick, index) => {
        const roundClass = getRoundClass(index);
        draftPicksEl.push(
          <DraftPickRowItem
            key={pick.id}
            isOdd={isOdd(index)}
            roundClass={roundClass}
            pick={pick}
            clearPick={(event) => this.clearPick(event)}
            postPickToRoster={(event) => this.postPickToRoster(event)}
            persistPickPlayer={(pick) => this.persistPickPlayer(pick)}
            updatePick={(event) => this.updatePick(event)}
            updatePickName={(event) => this.updatePickName(event)}
          />
        );
      });

    }

    let lastPickTime = 0;
    let pickTimerEl = null;
    if (this.state.lastPick && this.state.lastPick.timestamp) {

      lastPickTime = this.state.lastPick.timestamp;
     // pickTimerEl = (<PickTimer lastPickTime={lastPickTime} />);
    }
    return(
      <div className="main-draft-container">
        <div>draft board</div>
        <div>

          {currentPickEl}
          {pickTimerEl}

           <button onClick={this.startPolling}>start</button>           
           <button onClick={this.stopPolling}>stop</button>

        </div>
        <DraftTable className="draft-table">
          <thead>
          <tr>
            <th>
              rnd
            </th>
            <th>
              pk
            </th>
            <th>
              roster
            </th>
            <th>
              player
            </th>
            <th>
              pos
            </th>
            <th>
              team
            </th>
            <th>
            </th>
            <th>
            </th>
          </tr>
          </thead>
          <tbody>
          {draftPicksEl}
          </tbody>
        </DraftTable>
        <a href="https://hangouts.google.com/call/nluiVk6vNx981WoNmdGVAEEE" target="_blank">Draft Hangout</a>
      </div>
    );
  }

  componentWillUnmount() {
    this.stopPolling();
  }

}



DraftBoard.propTypes = {
  draftPicks: PropTypes.array,
};

const mapStateToProps = (state) => {
  let draftPicks = [];
  if (state.draft && state.draft.entities) {
    const targetObject = state.draft.entities;
    draftPicks = Object.keys(targetObject).map(function (key) { return targetObject[key]; });
  }
  let rosters = {};
  if (state.rosters && state.rosters.entities) {
    rosters = state.rosters.entities;
  }

  return {draftPicks, rosters};
};

const mapDispatchToProps = (dispatch) => {

  return {
    onPollDraftPicks: () => dispatch(
      pollDraftPicks()
    ),
    onFetchRosters: () => dispatch(fetchRosters()),
    onFetchDraftPicks: () => dispatch(
      fetchDraftPicks()
    ),
    onUpdateDraftPick: (pick) => dispatch(updateDraftPick(pick)),
    onUpdateRoster: (roster) => dispatch(updateRoster(roster)),
  };

};

export default connect(mapStateToProps, mapDispatchToProps)(DraftBoard);
