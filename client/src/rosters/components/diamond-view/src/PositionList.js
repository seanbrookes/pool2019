import React from 'react';
import PropTypes from 'prop-types';

const PositionList = (props) => {
  const getDiamondPlayerClass = function(player) {
    if (player.draftStatus === 'protected') {
      return 'draft-protected';
    }
    return '';
  };
  const listEl = [];
  props.players.map((player) => {

//    let nameClass = '';

    // let displayEl = (<div></div>);
    // if (player.pickNumber && (player.status !== 'protected')) {
    //   displayEl = (
    //     <div>p:({player.pickNumber}) r:({player.round})</div>
    //   );
    // }
    if (player.name.indexOf('prospect') > -1) {
      player.name = player.name.replace('(prospect', '(p)');
    }
    if (player.name.indexOf('propsect') > -1) {
      player.name = player.name.replace('(propsect', '(p)');
    }






    if (player.pos === props.pos) {
      let draftEl = null;
      if (player.draftStatus === 'drafted' || (player.draftStatus === 'prospect')) {
        draftEl = (
          <div style={{display:'flex', flexWrap: 'nowrap'}}>
            {player.name}
            <div> - ({player.pickNumber})</div>
          </div>
        )
      }
      else {
        draftEl = (
          <div>{player.name}</div>
        );
      }
      listEl.push(
        <li key={player.name} className={getDiamondPlayerClass(player)}>
          {draftEl}
        </li>
      )
    }
  });

  return (
    <ul>
      {listEl}
    </ul>
  );
};

PositionList.propTypes = {
  player: PropTypes.object,
  pos: PropTypes.string,
};

export default PositionList;
