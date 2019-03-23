import React, { Component } from 'react';
import RosterProtectionList from './RosterProtectionList';
import { fetchRosters } from '../actions/rostersActions';
import { connect } from 'react-redux';

class ProtectedListContainer extends Component {
  constructor(props) {
    super(props);
  }


  componentWillMount() {
    this.props.onFetchRosters();
  }

  render() {

    return (
      <div style={{display:'flex'}}>
        <RosterProtectionList slug={'bashers'} />
        <RosterProtectionList slug={'mashers'} />
        <RosterProtectionList slug={'rallycaps'} />
        <RosterProtectionList slug={'stallions'} />
      </div>
    )
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRosters: () => dispatch(fetchRosters())
  }
};

export default connect(null, mapDispatchToProps)(ProtectedListContainer);

// export default ProtectedListContainer;
