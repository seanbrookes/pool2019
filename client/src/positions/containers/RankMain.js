import React, { Component } from 'react';
import HitterRankView from '../components/HitterRankView';
import StarterRankView from '../components/StarterRankView';
import CloserRankView from '../components/CloserRankView';

class RankMain extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let viewEl = null;

    if (this.props.match && this.props.match.params.pos) {
      switch(this.props.match.params.pos)  {
        case 'SP':
          viewEl = (
            <StarterRankView pos={this.props.match.params.pos} />
          );
          break;
        case 'RP':
          viewEl = (
            <CloserRankView pos={this.props.match.params.pos} />
          );
          break;
        default:
          viewEl = (
            <HitterRankView pos={this.props.match.params.pos} />
          );
          break;
      }
    }
    //
    // let battersEl = (
    //   <HitterRankView pos={this.props.match.params.pos} />
    // );
    // let startersEl = (
    //   <StarterRankView pos={this.props.match.params.pos} />
    // );
    // let closerEl = (
    //   <CloserRankView pos={this.props.match.params.pos} />
    // );
    return (
      <div>
        {viewEl}
      </div>
    );
  }
}

export default RankMain;
