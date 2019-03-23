import React, { Component } from 'react';
import { connect } from 'react-redux';
import StatsUpdateButton from '../../stats/containers/StatsUpdate';
import PropTypes from 'prop-types';

class StatsUpdate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>StatsUpdate</div>
        <StatsUpdateButton />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StatsUpdate);

