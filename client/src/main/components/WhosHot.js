import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  compareTotals,
  compareHits,
  compareRuns,
  compareRBI,
  compareHR,
  compareSteals,
} from '../../stats/stats.utils';

import { isEven } from '../../common/common.utils';

class WhosHot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let runsEl = null;
    let hitsEl = null;
    let hrEl = null;
    let rbiEl = null;
    let sbEl = null;
    let svEl = null;



    if (this.props.hitters) {
      const batterBlob = {};
      let masterHitterCollection = [];
      let statsCollection = [];
      let scoreStats = {
        hitter: {},
        r: [],
        h: [],
        hr: [],
        rbi: []
      };
      let hotStatData = {};

      const addHitterToHisCollection = (hitter) => {
        let isUnique = true;
        masterHitterCollection.map(function(hitterCollection) {
          if (hitter.mlbid === hitterCollection[0].mlbid) {
            hitterCollection.push(hitter);
            isUnique = false;
          }
        });
        if (isUnique) {
          const newArray = [hitter];
          masterHitterCollection.push(newArray);
        }
      };


      this.props.hitters.map(function(hitter) {
        if (!batterBlob[hitter.mlbid]) {
          batterBlob[hitter.mlbid] = [];
        }
        batterBlob[hitter.mlbid].push(hitter);
        addHitterToHisCollection(hitter);
      });


      masterHitterCollection.map(function(hitterCollection) {
        const runs = hitterCollection[hitterCollection.length - 1].r - hitterCollection[0].r;
        const hits = hitterCollection[hitterCollection.length - 1].h - hitterCollection[0].h;
        const hr = hitterCollection[hitterCollection.length - 1].hr - hitterCollection[0].hr;
        const rbi = hitterCollection[hitterCollection.length - 1].rbi - hitterCollection[0].rbi;
        const scoreStats = {
          hitter: hitterCollection[0],
          r: runs,
          h: hits,
          hr: hr,
          rbi: rbi
        };
        statsCollection.push(scoreStats);
      });


      const runsCollection = [].concat(statsCollection);
      const hitsCollection = [].concat(statsCollection);
      const hrCollection = [].concat(statsCollection);
      const rbiCollection = [].concat(statsCollection);

      hotStatData.rankedRuns = runsCollection.sort(compareRuns);
      hotStatData.rankedHits = hitsCollection.sort(compareHits);
      hotStatData.rankedHomeRuns = hrCollection.sort(compareHR);
      hotStatData.rankedRBI = rbiCollection.sort(compareRBI);


      if (hotStatData.rankedRuns.length > 10) {
        const triggerValue = hotStatData.rankedRuns[9].r;
        hotStatData.rankedRuns = hotStatData.rankedRuns.filter((item) => {
          return (item.r >= triggerValue);
        });
      }
      if (hotStatData.rankedHits.length > 10) {
        const triggerHValue = hotStatData.rankedHits[9].h;
        hotStatData.rankedHits = hotStatData.rankedHits.filter((item) => {
          return (item.h >= triggerHValue);
        });
      }
      if (hotStatData.rankedRBI.length > 10) {
        const triggerRBIValue = hotStatData.rankedRBI[9].rbi;
        hotStatData.rankedRBI = hotStatData.rankedRBI.filter((item) => {
          return (item.rbi >= triggerRBIValue);
        });
      }
      if (hotStatData.rankedHomeRuns.length > 10) {
        const triggerHRValue = hotStatData.rankedHomeRuns[9].hr;
        hotStatData.rankedHomeRuns = hotStatData.rankedHomeRuns.filter((item) => {
          return (item.hr >= triggerHRValue);
        });
      }


     // let theHotPackage = sortHotStats(this.props.hitters);

      // const runsCollection = sortStat(this.props.hitters, 'runs');
      const getRowClass = (index) => {
        if (isEven(index)) {
          return 'stripe';
        }
        else {
          return 'normal';
        }

      };

      runsEl = hotStatData.rankedRuns.map((player, index) => {

        return (
          <tr key={index} className={getRowClass(index)}>
            <td>
              {player.hitter.name}
              </td>
            <td>{player.r}</td>
          </tr>
        );
      });
      hitsEl = hotStatData.rankedHits.map((player, index) => {
        return (
          <tr key={index} className={getRowClass(index)}>
            <td>{player.hitter.name}</td><td>{player.h}</td>
          </tr>
        );
      });
      hrEl = hotStatData.rankedHomeRuns.map((player, index) => {
        return (
          <tr key={index} className={getRowClass(index)}>
            <td>
              {player.hitter.name}</td><td> {player.hr}</td>
          </tr>
        );
      });
      rbiEl = hotStatData.rankedRBI.map((player, index) => {
        return (
          <tr key={index} className={getRowClass(index)}>
            <td>
              {player.hitter.name}</td><td> {player.rbi}</td>
          </tr>
        );
      });
    }



    return (
      <div>
        <div>Whos hot last 4 days</div>
        <div className="layout whos-hot--container" >
          <table>
            <caption>
              Runs
            </caption>
            <tbody>
            {runsEl}
            </tbody>
          </table>
          <table>
            <caption>
              Hits
            </caption>
            <tbody>
            {hitsEl}
            </tbody>
          </table>
          <table>
            <caption>
              HR
            </caption>
            <tbody>
            {hrEl}
            </tbody>
          </table>
          <table>
            <caption>
              RBI
            </caption>
            <tbody>
            {rbiEl}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let lastWeekHitters = [];
  if (state.stats.hitters.lastWeek.entities.length > 0) {
    lastWeekHitters = state.stats.hitters.lastWeek.entities;
  }
  return {
    hitters: lastWeekHitters,
  }
};

export default connect(mapStateToProps, null)(WhosHot);
