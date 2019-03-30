import React, { Component } from 'react';
import RosterListView from './RosterListView';
import RosterProtectionList from './RosterProtectionList';

class RosterListContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render() {

    // return (
    //   <div style={{display:'flex'}}>
    //     <RosterListView slug={'bashers'} />
    //     <RosterListView slug={'mashers'} />
    //     <RosterListView slug={'rallycaps'} />
    //     <RosterListView slug={'stallions'} />
    //   </div>
    // )
    return (
      <div style={{display:'flex', flexWrap: 'wrap'}}>
        <RosterProtectionList slug={'bashers'} />
        <RosterProtectionList slug={'mashers'} />
        <RosterProtectionList slug={'rallycaps'} />
        <RosterProtectionList slug={'stallions'} />
      </div>
    );
  }
}

export default RosterListContainer;
