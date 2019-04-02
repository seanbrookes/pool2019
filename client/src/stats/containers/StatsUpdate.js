import React, { Component } from 'react';

import {
  totalAndSortBatters,
  totalAndSortStarters,
  totalAndSortClosers,
  sortCombinedTotals,
  filterLatest
} from '../stats.utils';

const createNewTotalsRecord = (totalsObj) => {
  const options = {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify(totalsObj),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };
  console.log('|  CREATE THE NEW TOTAL RECORD', totalsObj);
  fetch('api/totals', options)
    .then((response) => {
      console.log('|  FETCH TOTAL RECORD');
      return response.json();
    })
    .then((data) => {
      console.log('|  CREATE THE NEW TOTAL RECORD', totalsObj);
      return data;
    })
    .catch((error) => {
      console.log('| Bad create totals record');
    });
};
const createNewRankSnapshot = (rankList) => {
  const options = {
    method: 'POST',
    cache: 'no-cache',
    body: JSON.stringify(rankList),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  };
  //console.log('|  CREATE THE NEW TOTAL RECORD', totalsObj);
  fetch('api/rankSnapshots', options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('|  CREATE THE NEW rank RECORD', rankList);
      return data;
    })
    .catch((error) => {
      console.log('| Bad create rank record');
    });
};



const fetchLatestTotals = async (slug) => {
  return new Promise((resolve, reject) => {
    const query = `/api/totals?filter[order]=grandTotal+DESC&filter[where][roster]=${slug}`;
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
          resolve(response);
        }
      );
  });
};

const fetchALHitters = async (slug) => {
  return new Promise(function (resolve, reject) {
    const hitterQuery = `/api/dailybatterstats?filter[order]=lastUpdate+DESC&filter[where][roster]=${slug}`;
    fetch(hitterQuery)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
          resolve(response);
        }
      );
  });
};
const fetchALPitchers = async (slug) => {
  return new Promise(function (resolve, reject) {
    const pitcherQuery = `/api/dailypitcherstats?filter[order]=lastUpdate+DESC&filter[where][roster]=${slug}`;
    fetch(pitcherQuery)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
          resolve(response);
        }
      );
  });
};



async function runTheStats(slug) {
  const hitterStats = await fetchALHitters(slug);
  const pitcherStats = await fetchALPitchers(slug);
  const latestTotals = await fetchLatestTotals(slug);


  const currentPitchers = filterLatest(pitcherStats);
  const currentHitters = filterLatest(hitterStats);

  let fullCollection = [];

  if (currentHitters && currentHitters.length > 0) {
    if (currentPitchers && currentPitchers.length > 0) {
      fullCollection = sortCombinedTotals(currentHitters, currentPitchers);
    }
  }



  const startersArray = currentPitchers.filter((pitcher) => {
    return pitcher.pos === 'SP';
  });
  const closersArray = currentPitchers.filter((pitcher) => {
    return pitcher.pos === 'RP';
  });



 // console.log('|  holy hell it worked', hitterStats);
  // - pull up the latest stats for the roster
  // - total up the totals
  const batterTotal = totalAndSortBatters(currentHitters).subTotal;
  const starterTotal = totalAndSortStarters(startersArray).subTotal;
  const closerTotal = totalAndSortClosers(closersArray).subTotal;

  const newGrandTotal = batterTotal + starterTotal + closerTotal;
  // - pull up the latest total records (api/totals)

  // latestTotals.map((latest) => {
  //   console.log('|   LATEST TOTAL: ', latest);
  // });
  let grandTotal = 0;
  if (latestTotals && latestTotals[0] && latestTotals[0].grandTotal) {
    grandTotal = latestTotals[0].grandTotal;
  }

  const latestGrandTotal = grandTotal;
  // - compare the current grandTotal with the latest record from totals
  // - if the new number is higher then create a new totals record    // - pull up the latest total records (api/totals)

  // if (slug === 'bashers') {
  //   console.log('|   bashers TOTAL: ', newGrandTotal);
  // }


  if (newGrandTotal > latestGrandTotal) {


    const newTotalsRecord = {
      date: new Date().getTime(),
      roster: slug,
      grandTotal: newGrandTotal,
      batterTotal: batterTotal,
      starterTotal: starterTotal,
      closerTotal: closerTotal
    };


    const newRankRecord = {
      timestamp: new Date().getTime(),
      list: fullCollection
    };
    createNewRankSnapshot(newRankRecord);
    return createNewTotalsRecord(newTotalsRecord);
  }
  else {
    console.log('|  DO NOT CREATE THE NEW TOTAL RECORD', newGrandTotal);
  }

  // - compare the current grandTotal with the latest record from totals
  // - if the new number is higher then create a new totals record
}
const runTheTotals = (stats) => {
  // pull out the current totals
  // iterate over the rosters
  const rosterKeys = ['bashers', 'mashers', 'rallycaps', 'stallions'];
  rosterKeys.map((slug) => {
    // total up current stats
    // const hitters = stats.hitters.rosters[key];

    runTheStats(slug);

  });

};


class StatsUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdated: false,
    };

    this.updateStats = this.updateStats.bind(this);
  }
  componentWillMount() {

  }

  updateStats() {
    const that = this;

    const query = `/api/statupdates/updatestats`;
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        that.setState({
            isUpdated: true,
          }, () => {
            runTheTotals();
          });
        }
      )
      .catch((error) => {
        console.log('| error updateing stats: ', error);
      });



      // we have the latest raw stats and individual totals
      // - dailybatterstats
      // - dailypitcherstats


      // iterate over the rosters
      // -  for each roster
      // - pull up the latest stats for the roster
      // - total up the totals
      // - pull up the latest total records (api/totals)
      // - compare the current grandTotal with the latest record from totals
      // - if the new number is higher then create a new totals record




  }

  render() {
    return (
      <div>
        {this.state.isUpdated ? 'Stats updated!' : (<button onClick={this.updateStats}>Upudate Stats</button>)}
      </div>
    );
  }

}

export default StatsUpdate;
