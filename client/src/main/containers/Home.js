import React, { Component } from 'react';
import TopTen from '../components/TopTen';
import WhosHot from '../components/WhosHot';
import TotalsRank from '../components/TotalsRank';

import '../home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-content-container">
        <TotalsRank />
        <div className="layout">
          <TopTen />
          <WhosHot />
        </div>
      </div>
    );
  }
}

export default Home;
