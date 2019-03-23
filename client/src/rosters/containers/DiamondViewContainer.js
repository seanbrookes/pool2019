import React, { Component } from 'react';
import { connect } from 'react-redux';
import DiamondView from '../components/diamond-view';
import { fetchRosters } from '../actions/rostersActions';

class DiamondViewContainer extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.onFetchRosters();
  }

  render() {
    return (
      <div>
        <DiamondView slug={'bashers'} isPreDraft={true} />
        <DiamondView slug={'mashers'} isPreDraft={true} />
        <DiamondView slug={'rallycaps'} isPreDraft={true} />
        <DiamondView slug={'stallions'} isPreDraft={true} />
      </div>
    );
  }
}
export const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRosters: () => dispatch(fetchRosters())
  }
};


export default connect(null, mapDispatchToProps)(DiamondViewContainer);

