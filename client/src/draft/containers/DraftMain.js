import React, { Component } from 'react';

import DraftBoard from './DraftBoard';

class DraftMain extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {

  }

  render() {
    return (
      <div>
        <DraftBoard />
      </div>
    );
  }
}

export default DraftMain;
