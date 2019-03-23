import React from 'react';

import { isEven } from '../../common/common.utils';

import '../positions.scss';

const CloserRankRow = (props) => {

  const getClassName = (rank) => {
    if (isEven(rank)) {
      return 'rank-list--row stripe';
    }
    return 'rank-list--row';

  };

  return (
    <tr className={getClassName(props.rank)}>
      <td style={{textAlign: 'center', fontWeight: 'lighter'}}>{props.rank}</td>
      <td>
        <a href={`#rosters/${props.player.roster}`} style={{fontWeight: 'lighter'}}>{props.player.roster}</a>
      </td>
      <td style={{textAlign: 'center', fontWeight: 'lighter'}}>{props.player.pos}</td>
      <td className="player-name ng-binding">{props.player.name}</td>
      <td style={{textAlign: 'center'}}>{props.player.team}</td>
      <td className={(props.sortField === 'w') ? 'sort-on point-col' : 'point-col'}>{props.player.w}</td>
      <td className={(props.sortField === 'l') ? 'sort-on point-col' : 'point-col'}>{props.player.l}</td>
      <td className={(props.sortField === 'ip') ? 'sort-on point-col' : 'point-col'}>{props.player.ip}</td>
      <td className={(props.sortField === 'k') ? 'sort-on point-col' : 'point-col'}>{props.player.k}</td>
      <td className={(props.sortField === 'sv') ? 'sort-on point-col' : 'point-col'}>{props.player.sv}</td>
      <td className={(props.sortField === 'total') ? 'sort-on point-col' : 'point-col'}>{props.player.total}</td>
    </tr>
  )
};

export default CloserRankRow;





