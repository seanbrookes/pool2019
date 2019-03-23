import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PositionList from './PositionList';

class DiamondView extends Component {

  render() {
    const roster = this.props.roster;
    let contentEl = null;
    let thePlayers = [];
    if (roster && roster.players) {
      thePlayers = roster.players;
      if (this.props.isPreDraft) {
        thePlayers = roster.players.filter((player) => {
          return ((player.draftStatus === 'protected') || (player.draftStatus === 'drafted') || (player.draftStatus === 'prospect'));
        })
      }
      contentEl = (
        <div className="RosterDiamondContainer">
          <h2 className="RosterDiamondTitle">{roster.name}</h2>
          <div className="LeftFieldContainer PositionContainer">
            <PositionList pos="LF" players={thePlayers} />
          </div>
          <div className="CenterFieldContainer PositionContainer">
            <PositionList pos="CF" players={thePlayers} />
          </div>
          <div className="RightFieldContainer PositionContainer">
            <PositionList pos="RF" players={thePlayers} />
          </div>
          <div className="ThreeBContainer PositionContainer">
            <PositionList pos="3B" players={thePlayers} />
          </div>
          <div className="SSContainer PositionContainer">
            <PositionList pos="SS" players={thePlayers} />
          </div>
          <div className="TwoBContainer PositionContainer">
            <PositionList pos="2B" players={thePlayers} />
          </div>
          <div className="OneBContainer PositionContainer">
            <PositionList pos="1B" players={thePlayers} />
          </div>
          <div className="StarterContainer PositionContainer">
            <PositionList pos="SP" players={thePlayers} />
          </div>
          <div className="CatcherContainer PositionContainer">
            <PositionList pos="C" players={thePlayers} />
          </div>
          <div className="DHContainer PositionContainer">
            <PositionList pos="DH" players={thePlayers} />
          </div>
          <div className="RelieverContainer PositionContainer">
            <PositionList pos="RP" players={thePlayers} />
          </div>
        </div>
      );
    }


    return (<div>{contentEl}</div>);
  }

}

DiamondView.propTypes = {
  slug: PropTypes.string,
  isPreDraft: PropTypes.bool,
};

const mapStateToProps = (state, theProps) => {
  let roster = {name: '', players: []};
  if (state.rosters && state.rosters.entities) {
    roster = state.rosters.entities[theProps.slug];
  }

  return {
    roster,
  };
};

export default connect(mapStateToProps, null)(DiamondView);

