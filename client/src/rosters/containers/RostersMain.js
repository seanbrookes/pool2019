import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchRosters } from '../actions/rostersActions';
import RosterListContainer from '../components/RosterListContainer';
import RosterMain from './RosterMain';

class RostersMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlug: '',
    }
  }

  componentWillMount() {
    this.props.onFetchRosters();
    if (this.props.match.params.slug) {
      this.setState({
        currentSlug: this.props.match.params.slug,
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.slug) {
      this.setState({
        currentSlug: nextProps.match.params.slug,
      })
    }
  }

  render() {
    let contentEl = null;
    if (this.state.currentSlug && this.state.currentSlug.length > 0) {
      contentEl = (<RosterMain slug={this.state.currentSlug} />);
    }
    else {
      contentEl = (<RosterListContainer />);
    }
    return (

      <div>
        {contentEl}
      </div>
    );
  }
}

RostersMain.propTypes = {
  onFetchRosters: PropTypes.func,
  slug: PropTypes.string,
  match: PropTypes.object,
};

export const mapStateToProps = (state, theProps) => {
  return {};
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onFetchRosters: () => dispatch(fetchRosters())
  }
};


export default connect(null, mapDispatchToProps)(RostersMain);
