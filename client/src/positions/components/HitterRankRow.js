import React from 'react';
import { isEven } from '../../common/common.utils';
import '../positions.scss';
const HitterRankRow = (props) => {
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
        <a href={`#rosters/${props.player.roster}`}  style={{fontWeight: 'lighter'}}>{props.player.roster}</a>
      </td>
      <td style={{textAlign: 'center', fontWeight: 'lighter'}}>{props.player.pos}</td>
      <td className="player-name ng-binding">{props.player.name}</td>
      <td style={{textAlign: 'center'}}>{props.player.team}</td>
      <td className={(props.sortField === 'r') ? 'sort-on point-col' : 'point-col'}>{props.player.r}</td>
      <td className={(props.sortField === 'h') ? 'sort-on point-col' : 'point-col'}>{props.player.h}</td>
      <td className={(props.sortField === 'hr') ? 'sort-on point-col' : 'point-col'}>{props.player.hr}</td>
      <td className={(props.sortField === 'rbi') ? 'sort-on point-col' : 'point-col'}>{props.player.rbi}</td>
      <td className={(props.sortField === 'sb') ? 'sort-on point-col' : 'point-col'}>{props.player.sb}</td>
      <td className={(props.sortField === 'total') ? 'sort-on row-total' : 'row-total'}>{props.player.total}</td>
    </tr>
  )
};

export default HitterRankRow;
